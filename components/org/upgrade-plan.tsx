import React, { useMemo } from 'react';
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
import { getStripe } from '@/utils/stripe/client';
import { useGetPrices } from '@/app/api/controllers/priceController';
import { Prisma } from '@prisma/client';
import { useWorkspace } from '@/context/workspaceContext';
import { checkoutWithStripe } from '@/utils/stripe/server';
import { getPrice } from '@/utils/utils';

interface UpgradeCardProps {
  price: Prisma.priceGetPayload<{}>;
  payment: string;
}

const UpgradeCard = ({ price, payment }: UpgradeCardProps) => {
  const { workspace, org } = useWorkspace();

  const handleClick = async () => {
    if (!workspace) {
      return;
    }
    const { errorRedirect, sessionId } = await checkoutWithStripe(
      price,
      workspace?.id,
      `${org}/`
    );
    if (errorRedirect) {
      console.log('Error redirect', errorRedirect);
      // setPriceIdLoading(undefined);
      // return router.push(errorRedirect);
    }

    if (!sessionId) {
      console.log('Error sessionId', sessionId);
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
  const isYearly = price.interval === 'year';
  const amountToShow = price.unit_amount
    ? getPrice(price.unit_amount, isYearly)
    : 'NaN';
  return (
    <Card className="flex flex-col gap-5 p-6 w-full">
      <div className="flex flex-col gap-1">
        <p className="text-heading-body">Pro plan</p>
        <div className="flex items-end gap-1">
          <p className="text-heading-section">{amountToShow}€</p>
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
      <Button className="w-full" onClick={() => handleClick()}>
        Upgrade to Pro
      </Button>
    </Card>
  );
};

interface UpgradePlanProps {
  children: React.ReactNode;
  disabled?: boolean;
  asChild: boolean;
}

const UpgradePlan = ({ children, disabled, asChild }: UpgradePlanProps) => {
  const { data: pricesFromDb } = useGetPrices();

  const prices = useMemo(() => {
    if (!pricesFromDb) {
      return [];
    }
    return pricesFromDb.data.prices;
  }, [pricesFromDb]);

  return (
    <Dialog open={disabled ? false : undefined}>
      <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
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
          {prices
            .filter((price) => price.interval && price.unit_amount)
            .map((price) => {
              const isMonthly = price.interval === 'month';
              return (
                <SegmentedContent
                  value={price.interval!}
                  className="px-0"
                  key={price.id}
                >
                  <UpgradeCard
                    price={price}
                    payment={
                      isMonthly ? 'per month' : 'per month, billed yearly'
                    }
                  />
                </SegmentedContent>
                // <Button onClick={() => handleClick(price)} key={price.id}>
                //   {price.product.name} {((price.unit_amount ?? 0) / 100).toFixed(2)}{" "}
                //   {price.currency}/{price.interval}
                // </Button>
              );
            })}
        </Segmented>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradePlan;
