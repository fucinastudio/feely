import React from 'react';
import { Palette, Users, Clock } from 'lucide-react';

import {
  Badge,
  Button,
  Card,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Segmented,
  SegmentedContent,
  SegmentedList,
  SegmentedTrigger,
  Separator,
} from '@fucina/ui';

interface UpgradeCardProps {
  price: number;
  payment: string;
}

const UpgradeCard = ({ price, payment }: UpgradeCardProps) => {
  return (
    <Card className="flex flex-col gap-5 p-6 w-full">
      <div className="flex flex-col gap-1">
        <p className="text-heading-body">Pro plan</p>
        <div className="flex items-end gap-1">
          <p className="text-heading-section">{price}€</p>
          <span className="pb-1 text-description text-sm">/{payment}</span>
        </div>
      </div>
      <Separator />
      <div className="flex flex-col items-start gap-2">
        <div className="flex flex-row justify-center items-center gap-2 p-1">
          <div className="flex justify-center items-center bg-brand-subtlest border border-brand-subtlest rounded min-w-9 size-9">
            <Palette className="text-brand size-5" />
          </div>
          <div className="grid">
            <p className="font-semibold">Remove Feely branding.</p>
            <span className="text-description text-sm">
              Hide all branding and make your feedbacks truly your own.
            </span>
          </div>
        </div>
        <div className="flex flex-row justify-center items-center gap-2 p-1">
          <div className="flex justify-center items-center bg-brand-subtlest border border-brand-subtlest rounded min-w-9 size-9">
            <Users className="text-brand size-5" />
          </div>
          <div className="grid">
            <p className="font-semibold">Collaboration.</p>
            <span className="text-description text-sm">
              Invite unlimited team members to shared workspaces.
            </span>
          </div>
        </div>
        <div className="flex flex-row justify-center items-center gap-2 p-1">
          <div className="flex justify-center items-center bg-chart-neutral-subtlest border border-brand-chart-neutral-subtlest rounded min-w-9 size-9">
            <Clock className="text-description size-5" />
          </div>
          <div className="grid">
            <p className="font-semibold">Coming soon...</p>
            <span className="text-description text-sm">
              More Pro features coming soon.
            </span>
          </div>
        </div>
      </div>
      <Separator />
      <Button className="w-full">Upgrade to Pro</Button>
    </Card>
  );
};

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
        <Separator className="my-5" />
        <Segmented defaultValue="year" className="w-full">
          <SegmentedList>
            <SegmentedTrigger value="month" className="w-full">
              Pay montly
            </SegmentedTrigger>
            <SegmentedTrigger value="year" className="w-full">
              Pay yearly <Badge variant="brand">Save 20%</Badge>
            </SegmentedTrigger>
          </SegmentedList>
          <SegmentedContent value="month" className="px-0">
            <UpgradeCard price={25} payment="per month" />
          </SegmentedContent>
          <SegmentedContent value="year" className="px-0">
            <UpgradeCard price={20} payment="per month, billed yearly" />
          </SegmentedContent>
        </Segmented>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradePlan;
