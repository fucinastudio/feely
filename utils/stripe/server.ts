"use server";

import Stripe from "stripe";
import { stripe } from "@/utils/stripe/config";
import { createClient } from "@/utils/supabase/server";
import {
  calculateTrialEndUnixTimestamp,
  getErrorRedirect,
  getUrl,
} from "@/utils/utils";
import {
  createCustomerForNewWorkspace,
  createOrRetrieveCustomer,
} from "@/utils/supabase/admin";
import { Prisma } from "@prisma/client";
import prisma from "@/prisma/client";

type CheckoutResponse = {
  errorRedirect?: string;
  sessionId?: string;
};

export async function checkoutWithStripe(
  price: Prisma.priceGetPayload<{}>,
  workspaceId: string,
  redirectPath: string = "/redirect_to_workspace"
): Promise<CheckoutResponse> {
  try {
    // Get the user from Supabase auth
    const supabase = createClient();
    const {
      error,
      data: { user },
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error(error);
      throw new Error("Could not get user session.");
    }

    let workspace;
    //Check if user is owner of the workspace
    try {
      workspace = await prisma.workspace.findFirst({
        where: {
          id: workspaceId,
          ownerId: user.id,
        },
      });
    } catch (err) {
      console.error(err);
      throw new Error("You are not the owner of the workspace.");
    }
    if (!workspace) {
      throw new Error("You are not the owner of the workspace.");
    }
    // Retrieve or create the customer in Stripe
    let customer: string;
    try {
      customer = await createOrRetrieveCustomer({
        uuid: workspaceId,
        email: user?.email || "",
      });
    } catch (err) {
      console.error(err);
      throw new Error("Unable to access customer record.");
    }

    let params: Stripe.Checkout.SessionCreateParams = {
      allow_promotion_codes: true,
      billing_address_collection: "required",
      customer,
      customer_update: {
        address: "auto",
      },
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      cancel_url: getUrl(),
      success_url: getUrl(redirectPath),
    };

    console.log(
      "Trial end:",
      calculateTrialEndUnixTimestamp(price.trial_period_days)
    );
    if (price.type === "recurring") {
      params = {
        ...params,
        mode: "subscription",
        subscription_data: {
          trial_end: calculateTrialEndUnixTimestamp(price.trial_period_days),
        },
      };
    }

    // Create a checkout session in Stripe
    let session;
    try {
      session = await stripe.checkout.sessions.create(params);
    } catch (err) {
      console.error(err);
      throw new Error("Unable to create checkout session.");
    }

    // Instead of returning a Response, just return the data or error.
    if (session) {
      return { sessionId: session.id };
    } else {
      throw new Error("Unable to create checkout session.");
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        errorRedirect: error.message,
      };
    } else {
      return {
        errorRedirect: "An unknown error occurred.",
      };
    }
  }
}

export async function checkoutWithStripeNewWorkspace(
  price: Prisma.priceGetPayload<{}>,
  workspaceName: string,
  redirectPath: string = "/redirect_to_workspace"
): Promise<CheckoutResponse> {
  try {
    // Get the user from Supabase auth
    const supabase = createClient();
    const {
      error,
      data: { user },
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.error(error);
      throw new Error("Could not get user session.");
    }

    // Retrieve or create the customer in Stripe
    let customer: string;
    try {
      // customer = await createOrRetrieveCustomer({
      //   uuid: workspaceId,
      //   email: user?.email || "",
      // });
      customer = await createCustomerForNewWorkspace({
        workspaceName: workspaceName,
        email: user?.email || "",
      });
    } catch (err) {
      console.error(err);
      throw new Error("Unable to access customer record.");
    }

    let params: Stripe.Checkout.SessionCreateParams = {
      allow_promotion_codes: true,
      billing_address_collection: "required",
      customer,
      customer_update: {
        address: "auto",
      },
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      cancel_url: getUrl(),
      success_url: getUrl(redirectPath),
    };

    console.log(
      "Trial end:",
      calculateTrialEndUnixTimestamp(price.trial_period_days)
    );
    if (price.type === "recurring") {
      params = {
        ...params,
        mode: "subscription",
        subscription_data: {
          trial_end: calculateTrialEndUnixTimestamp(price.trial_period_days),
        },
      };
    }

    // Create a checkout session in Stripe
    let session;
    try {
      session = await stripe.checkout.sessions.create(params);
    } catch (err) {
      console.error(err);
      throw new Error("Unable to create checkout session.");
    }

    // Instead of returning a Response, just return the data or error.
    if (session) {
      return { sessionId: session.id };
    } else {
      throw new Error("Unable to create checkout session.");
    }
  } catch (error) {
    if (error instanceof Error) {
      return {
        errorRedirect: error.message,
      };
    } else {
      return {
        errorRedirect: "An unknown error occurred.",
      };
    }
  }
}

export async function createStripePortal(
  workspaceId: string,
  currentPath: string
) {
  try {
    const supabase = createClient();
    const {
      error,
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      if (error) {
        console.error(error);
      }
      throw new Error("Could not get user session.");
    }

    let workspace;
    try {
      workspace = await prisma.workspace.findFirst({
        where: {
          id: workspaceId,
          ownerId: user.id,
        },
      });
    } catch (err) {
      console.error(err);
      throw new Error("You are not the owner of the workspace.");
    }
    if (!workspace) {
      throw new Error("You are not the owner of the workspace.");
    }

    let customer;
    try {
      customer = await createOrRetrieveCustomer({
        uuid: workspaceId,
        email: user.email || "",
      });
    } catch (err) {
      console.error(err);
      throw new Error("Unable to access customer record.");
    }

    if (!customer) {
      throw new Error("Could not get customer.");
    }

    try {
      const { url } = await stripe.billingPortal.sessions.create({
        customer,
        return_url: getUrl(currentPath),
      });
      if (!url) {
        throw new Error("Could not create billing portal");
      }
      return url;
    } catch (err) {
      console.error(err);
      throw new Error("Could not create billing portal");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
    } else {
    }
    throw error;
  }
}
