import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Separator,
  ToggleGroup,
  ToggleGroupItem,
} from '@fucina/ui';

interface UpgradePlanProps {
  children: React.ReactNode;
}

const UpgradePlan = ({ children }: UpgradePlanProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Do more with Feely</DialogTitle>
          <DialogDescription>
            Upgrade to access advanced features designed for growing teams.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-start gap-3 pt-4">
          <ToggleGroup defaultValue="month" type="single" className="w-full">
            <ToggleGroupItem
              value="month"
              aria-label="Pay monthly"
              className="w-full"
            >
              Pay monthly
            </ToggleGroupItem>
            <ToggleGroupItem
              value="year"
              aria-label="Pay yearly"
              className="w-full"
            >
              Pay yearly
            </ToggleGroupItem>
          </ToggleGroup>
          <div className="flex flex-col gap-4 border-default p-5 border rounded w-full">
            <div className="flex justify-between items-center gap-2">
              <p className="text-brand text-heading-body uppercase">Pro plan</p>
              <div className="flex items-end gap-0.5">
                <p className="text-heading-section">25€</p>
                <span className="pb-0.5 text-description text-sm">
                  /per month
                </span>
              </div>
            </div>
            <Separator />
            <div className="flex flex-col items-start gap-3 p-1">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-brand size-5" />
                <span>Remove Feely branding</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-brand size-5" />
                <span>Collaboration</span>
              </div>
              <div className="flex items-center gap-2 text-description">
                <Clock className="size-5" />
                <span>More Pro features coming soon...</span>
              </div>
            </div>
            <Separator />
            <Button className="w-full">Upgrade to Pro</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradePlan;
