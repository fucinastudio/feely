"use client";
import React, { useState } from "react";
import * as z from "zod";

import {
  Button,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Form,
  Input,
  Label,
} from "@fucina/ui";
import { useCheckWorkspaceExistance } from "@/app/api/controllers/workspaceController";
import { checkoutWithStripeNewWorkspace } from "@/utils/stripe/server";
import { useWorkspace } from "@/context/workspaceContext";
import { getStripe } from "@/utils/stripe/client";
import { useGetPrices } from "@/app/api/controllers/priceController";

interface NewWorkspaceTriggerProps {
  children: React.ReactNode;
}

const NewWorkspaceTrigger = ({ children }: NewWorkspaceTriggerProps) => {
  return <DialogTrigger asChild>{children}</DialogTrigger>;
};

const NewWorkspaceContent = () => {
  const { org } = useWorkspace();
  const {
    mutateAsync: checkWorkspaceExistanceAsync,
    isLoading: isLoadingCheckWorkspaceExistance,
  } = useCheckWorkspaceExistance();

  const [error, setError] = useState<string | null>(null);

  const [value, setValue] = useState<string>("");

  const { data: prices } = useGetPrices();

  const handleConfirm = async (value: string) => {
    //Check if the values if correct
    if (value.length < 2) {
      setError("Workspace name must be at least 2 characters.");
      return;
    }
    if (!/^[a-zA-Z0-9-_]+$/.test(value)) {
      setError(
        "Invalid input: only alphanumeric characters, hyphens, and underscores are allowed."
      );
      return;
    }
    const checkSimilar = await checkWorkspaceExistanceAsync(value);
    if (checkSimilar.data.exists) {
      setError("This workspace name is already taken.");
      return;
    }
    //TODO: change this if we change how we select the price to pay. For now we are picking the one that is month and not free
    const price = prices?.data.prices.find(
      (price) => price.interval === "month" && (price.unit_amount ?? 0) > 0
    );
    if (!price) {
      setError("Error finding the price to pay.");
      return;
    }
    //If everything is correct, create the workspace
    const { errorRedirect, sessionId } = await checkoutWithStripeNewWorkspace(
      price,
      value,
      `${org}/`
    );
    if (errorRedirect) {
      console.log("Error redirect", errorRedirect);
      // setPriceIdLoading(undefined);
      // return router.push(errorRedirect);
    }

    if (!sessionId) {
      console.log("Error sessionId", sessionId);
      return;
      // setPriceIdLoading(undefined);
      // return router.push(
      //   getErrorRedirect(
      //     currentPath,
      //     'An unknown error occurred.',
      //     'Please try again later or contact a system administrator.'
      //   )
      // );
    }

    const stripe = await getStripe();
    stripe?.redirectToCheckout({ sessionId });
  };

  return (
    <DialogContent className="max-w-96">
      <DialogHeader>
        <DialogTitle>Create a new workspace</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col items-start gap-2 pt-6 pb-8">
        <Label htmlFor="workspace" className="text-right">
          Workspace name
        </Label>

        <Input
          id="workspace"
          placeholder="your-workspace"
          className="col-span-3"
          value={value}
          onChange={(e) => {
            setError(null);
            setValue(e.target.value);
          }}
        />
        {error && <p className="text-error text-sm">{error}</p>}
        <p className="text-description text-sm">
          Continuing will start a monthly PRO plan subscription.
        </p>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="secondary">Cancel</Button>
        </DialogClose>
        <Button
          onClick={() => handleConfirm(value)}
          isLoading={isLoadingCheckWorkspaceExistance}
        >
          Confirm
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export { NewWorkspaceTrigger, NewWorkspaceContent };
