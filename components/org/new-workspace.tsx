import React from 'react';

import {
  Button,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
} from '@fucina/ui';

interface NewWorkspaceTriggerProps {
  children: React.ReactNode;
}

const NewWorkspaceTrigger = ({ children }: NewWorkspaceTriggerProps) => {
  return <DialogTrigger asChild>{children}</DialogTrigger>;
};

const NewWorkspaceContent = () => {
  return (
    <DialogContent className="max-w-96">
      <DialogHeader>
        <DialogTitle>Create a new workspace</DialogTitle>
        <DialogDescription>
          Continue to start collaborating on PRO
        </DialogDescription>
      </DialogHeader>
      <div className="flex flex-col items-start gap-2 pt-6 pb-8">
        <Label htmlFor="workspace" className="text-right">
          Workspace name
        </Label>
        <Input
          id="workspace"
          placeholder="your-workspace"
          className="col-span-3"
        />
        <p className="text-description text-sm">
          Continuing will start a monthly PRO plan subscription.
        </p>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="secondary">Cancel</Button>
        </DialogClose>
        <Button type="submit">Confirm</Button>
      </DialogFooter>
    </DialogContent>
  );
};

export { NewWorkspaceTrigger, NewWorkspaceContent };
