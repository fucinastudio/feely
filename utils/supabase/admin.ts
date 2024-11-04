import {
  createPaymentWorkspace,
  createWorkspace,
} from "@/app/api/apiServerActions/workspaceApiServerActions";
import prisma from "@/prisma/client";
import { stripe } from "@/utils/stripe/config";
import { toDateTime } from "@/utils/utils";
import { Prisma } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

// Change to control trial period length
const TRIAL_PERIOD_DAYS = 0;

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin privileges and overwrites RLS policies!
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

const upsertProductRecord = async (product: Stripe.Product) => {
  const productData: Prisma.productGetPayload<{}> = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description ?? "",
    image: product.images?.[0] ?? null,
    metadata: product.metadata,
  };
  try {
    const _res = await prisma.product.upsert({
      where: { id: product.id },
      create: { ...productData, metadata: "" },
      update: { ...productData, metadata: "" },
    });
    console.log(`Product inserted/updated: ${product.id}`);
  } catch (upsertError: any) {
    throw new Error(`Product insert/update failed: ${upsertError.message}`);
  }
};

const upsertPriceRecord = async (
  price: Stripe.Price,
  retryCount = 0,
  maxRetries = 3
) => {
  const priceData: Prisma.priceGetPayload<{}> = {
    id: price.id,
    product_id: typeof price.product === "string" ? price.product : "",
    active: price.active,
    currency: price.currency,
    type: price.type,
    unit_amount: price.unit_amount ?? null,
    interval: price.recurring?.interval ?? null,
    interval_count: price.recurring?.interval_count ?? null,
    trial_period_days: price.recurring?.trial_period_days ?? TRIAL_PERIOD_DAYS,
    // metadata: price.metadata ?? Prisma.NullableJsonNullValueInput,
    metadata: {},
    description: "",
  };
  try {
    const _res = await prisma.price.upsert({
      where: { id: price.id },
      //TODO: fix metadata, for now not able to find the correct type
      create: { ...priceData, metadata: "" },
      update: { ...priceData, metadata: "" },
    });
    console.log(`Price inserted/updated: ${price.id}`);
  } catch (upsertError: any) {
    if (upsertError?.message.includes("foreign key constraint")) {
      if (retryCount < maxRetries) {
        console.log(
          `Retry attempt ${retryCount + 1} for price ID: ${price.id}`
        );
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await upsertPriceRecord(price, retryCount + 1, maxRetries);
      } else {
        throw new Error(
          `Price insert/update failed after ${maxRetries} retries: ${upsertError.message}`
        );
      }
    } else if (upsertError) {
      throw new Error(`Price insert/update failed: ${upsertError.message}`);
    }
  }
};

const deleteProductRecord = async (product: Stripe.Product) => {
  try {
    const _res = await prisma.product.delete({
      where: { id: product.id },
    });

    console.log(`Product deleted: ${product.id}`);
  } catch (deletionError: any) {
    throw new Error(`Product deletion failed: ${deletionError.message}`);
  }
};

const deletePriceRecord = async (price: Stripe.Price) => {
  try {
    const _res = await prisma.price.delete({
      where: { id: price.id },
    });

    console.log(`Price deleted: ${price.id}`);
  } catch (deletionError: any) {
    throw new Error(`Price deletion failed: ${deletionError.message}`);
  }
};

const upsertCustomerToSupabase = async (uuid: string, customerId: string) => {
  try {
    const { stripe_customer_id } = await prisma.customer.upsert({
      where: { workspace_id: uuid },
      create: { workspace_id: uuid, stripe_customer_id: customerId },
      update: { stripe_customer_id: customerId },
    });
    return stripe_customer_id;
  } catch (upsertError: any) {
    throw new Error(
      `Supabase customer record creation failed: ${upsertError.message}`
    );
  }
};

const createCustomerInStripe = async (uuid: string, email: string) => {
  const customerData = { metadata: { supabaseUUID: uuid }, email: email };
  const newCustomer = await stripe.customers.create(customerData);
  if (!newCustomer) throw new Error("Stripe customer creation failed.");

  return newCustomer.id;
};

const createOrRetrieveCustomer = async ({
  email,
  uuid,
}: {
  email: string;
  uuid: string;
}) => {
  let existingSupabaseCustomer: Prisma.customerGetPayload<{}> | null = null;
  // Check if the customer already exists in Supabase
  try {
    existingSupabaseCustomer = await prisma.customer.findUnique({
      where: { workspace_id: uuid },
    });
  } catch (error: any) {
    throw new Error(`Supabase customer lookup failed: ${error.message}`);
  }

  // Retrieve the Stripe customer ID using the Supabase customer ID
  let stripeCustomerId: string | undefined;
  if (existingSupabaseCustomer?.stripe_customer_id) {
    const existingStripeCustomer = await stripe.customers.retrieve(
      existingSupabaseCustomer.stripe_customer_id
    );
    stripeCustomerId = existingStripeCustomer.id;
  }
  // else {
  //   // If Stripe ID is missing from Supabase, try to retrieve Stripe customer ID by email
  //   const stripeCustomers = await stripe.customers.list({ email: email });
  //   stripeCustomerId =
  //     stripeCustomers.data.length > 0 ? stripeCustomers.data[0].id : undefined;
  // }

  // If still no stripeCustomerId, create a new customer in Stripe
  const stripeIdToInsert = stripeCustomerId
    ? stripeCustomerId
    : await createCustomerInStripe(uuid, email);
  if (!stripeIdToInsert) throw new Error("Stripe customer creation failed.");

  if (existingSupabaseCustomer && stripeCustomerId) {
    // If Supabase has a record but doesn't match Stripe, update Supabase record
    if (existingSupabaseCustomer.stripe_customer_id !== stripeCustomerId) {
      try {
        const _res = await prisma.customer.update({
          where: { workspace_id: uuid },
          data: { stripe_customer_id: stripeCustomerId },
        });
        console.warn(
          `Supabase customer record mismatched Stripe ID. Supabase record updated.`
        );
      } catch (updateError: any) {
        throw new Error(
          `Supabase customer record update failed: ${updateError.message}`
        );
      }
    }
    // If Supabase has a record and matches Stripe, return Stripe customer ID
    return stripeCustomerId;
  } else {
    console.warn(
      `Supabase customer record was missing. A new record was created.`
    );

    // If Supabase has no record, create a new record and return Stripe customer ID
    const upsertedStripeCustomer = await upsertCustomerToSupabase(
      uuid,
      stripeIdToInsert
    );
    if (!upsertedStripeCustomer)
      throw new Error("Supabase customer record creation failed.");

    return upsertedStripeCustomer;
  }
};

const createCustomerForNewWorkspace = async ({
  email,
  workspaceName,
}: {
  email: string;
  workspaceName: string;
}): Promise<string> => {
  // Create a new candidate workspace
  const candidateWorkspace = await prisma.candidateWorkspace.create({
    data: {
      name: workspaceName,
      created_at: new Date(),
    },
  });
  if (!candidateWorkspace) {
    throw new Error("Workspace creation failed.");
  }
  // Create a new customer in Stripe
  const stripeIdToInsert = await createCustomerInStripe(
    candidateWorkspace.id,
    email
  );
  if (!stripeIdToInsert) throw new Error("Stripe customer creation failed.");

  return stripeIdToInsert;
};

/**
 * Copies the billing details from the payment method to the customer object.
 */
//TODO: understand if we want to keep this
const copyBillingDetailsToCustomer = async (
  uuid: string,
  payment_method: Stripe.PaymentMethod
) => {
  //Todo: check this assertion
  const customer = payment_method.customer as string;
  const { name, phone, address } = payment_method.billing_details;
  if (!name || !phone || !address) return;
  //@ts-ignore
  await stripe.customers.update(customer, { name, phone, address });
  const { error: updateError } = await supabaseAdmin
    .from("users")
    .update({
      billing_address: { ...address },
      payment_method: { ...payment_method[payment_method.type] },
    })
    .eq("id", uuid);
  if (updateError)
    throw new Error(`Customer update failed: ${updateError.message}`);
};

const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction = false
) => {
  let customerData: Prisma.customerGetPayload<{}> | null = null;
  let uuid: string | null = null;
  // Get customer's UUID from mapping table.
  try {
    customerData = await prisma.customer.findFirst({
      where: { stripe_customer_id: customerId },
    });
    if (customerData) {
      uuid = customerData.workspace_id;
    } else {
      //If no already existing customer, look if a candidate workspace exists
      const stripeCustomer = await stripe.customers.retrieve(customerId);
      if (!stripeCustomer || stripeCustomer.deleted) {
        throw new Error(
          `No customer found for subscription ID: ${subscriptionId}`
        );
      }
      const candidateWorkspace = await prisma.candidateWorkspace.findFirst({
        where: { id: stripeCustomer.metadata.supabaseUUID },
      });
      if (
        candidateWorkspace &&
        stripeCustomer &&
        !stripeCustomer.deleted &&
        stripeCustomer.email
      ) {
        uuid = candidateWorkspace.id;
        //Create the new workspace
        const newWorkspace = await createPaymentWorkspace(
          candidateWorkspace.name,
          stripeCustomer.email
        );
        if (!newWorkspace.isSuccess) {
          throw new Error("Workspace creation failed.");
        }
        uuid = newWorkspace.id!;
      }
    }
  } catch (noCustomerError: any) {
    throw new Error(`No customer found for subscription ID: ${subscriptionId}`);
  }
  if (!uuid) {
    console.log("No UUID", customerId);
    throw new Error(`No customer found for subscription ID: ${subscriptionId}`);
  }
  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["default_payment_method"],
  });
  // Upsert the latest status of the subscription object.
  const subscriptionData: Prisma.subscriptionGetPayload<{}> = {
    id: subscription.id,
    workspace_id: uuid,
    metadata: subscription.metadata,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
    //TODO check quantity on subscription
    // @ts-ignore
    quantity: subscription.quantity,
    cancel_at_period_end: subscription.cancel_at_period_end,
    cancel_at: subscription.cancel_at
      ? toDateTime(subscription.cancel_at)
      : null,
    canceled_at: subscription.canceled_at
      ? toDateTime(subscription.canceled_at)
      : null,
    current_period_start: toDateTime(subscription.current_period_start),
    current_period_end: toDateTime(subscription.current_period_end),
    created: toDateTime(subscription.created),
    ended_at: subscription.ended_at ? toDateTime(subscription.ended_at) : null,
    trial_start: subscription.trial_start
      ? toDateTime(subscription.trial_start)
      : null,
    trial_end: subscription.trial_end
      ? toDateTime(subscription.trial_end)
      : null,
  };

  try {
    const _res = await prisma.subscription.upsert({
      where: { id: subscription.id },
      create: { ...subscriptionData, metadata: "" },
      update: { ...subscriptionData, metadata: "" },
    });
    console.log(
      `Inserted/updated subscription [${subscription.id}] for user [${uuid}]`
    );
  } catch (upsertError: any) {
    throw new Error(
      `Subscription insert/update failed: ${upsertError.message}`
    );
  }

  // For a new subscription copy the billing details to the customer object.
  // NOTE: This is a costly operation and should happen at the very end.
  // if (createAction && subscription.default_payment_method && uuid)
  //   //@ts-ignore
  //   await copyBillingDetailsToCustomer(
  //     uuid,
  //     subscription.default_payment_method as Stripe.PaymentMethod
  //   );
};

export {
  upsertProductRecord,
  upsertPriceRecord,
  deleteProductRecord,
  deletePriceRecord,
  createOrRetrieveCustomer,
  manageSubscriptionStatusChange,
  createCustomerForNewWorkspace,
};
