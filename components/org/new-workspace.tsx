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

interface NewWorkspaceTriggerProps {
  children: React.ReactNode;
}

const NewWorkspaceTrigger = ({ children }: NewWorkspaceTriggerProps) => {
  return <DialogTrigger asChild>{children}</DialogTrigger>;
};

const NewWorkspaceContent = () => {
  const {
    mutateAsync: checkWorkspaceExistanceAsync,
    isLoading: isLoadingCheckWorkspaceExistance,
  } = useCheckWorkspaceExistance();
  const FormSchema = z.object({
    workspaceName: z
      .string()
      .min(2, {
        message: "Workspace name must be at least 2 characters.",
      })
      .regex(/^[a-zA-Z0-9-_]+$/, {
        message:
          "Invalid input: only alphanumeric characters, hyphens, and underscores are allowed.",
      })
      .refine(async (value) => {
        if (!value) return true;
        const checkSimilar = await checkWorkspaceExistanceAsync(value);
        return !checkSimilar.data.exists;
      }, "This workspace name is already taken."),
  });

  const [error, setError] = useState<string | null>(null);

  const [value, setValue] = useState<string>("");

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
    //If everything is correct, create the workspace
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
