"use client";

import React, { useMemo } from "react";
import Link from "next/link";

import { Button, Card, Separator } from "@fucina/ui";
import { useGetIdeasByWorkspaceName } from "@/app/api/controllers/ideaController";
import IdeaCard from "@/app/[org]/(pages)/ideas/components/idea";
import { useWorkspace } from "@/context/workspaceContext";
import Loading from "@/app/loading";
import useMainPageFilters from "@/components/filters/filters";
import FiltersComponentObject from "@/components/filters/filtersComponent";
import IdeasEmpty from "@/components/org/ideas-empty";
import { checkoutWithStripe, createStripePortal } from "@/utils/stripe/server";
import { Prisma } from "@prisma/client";
import { getStripe } from "@/utils/stripe/client";
import { useGetPrices } from "@/app/api/controllers/priceController";

const Ideas = () => {
  const { org, workspace, statuses, topics, isProWorkspace } = useWorkspace();

  const {
    filterObjectAttributes,
    mainSearchTitle,
    selectedStatuses,
    selectedTopics,
    selectedOrder,
  } = useMainPageFilters({
    statuses: statuses ?? [],
    topics: topics ?? [],
  });

  const { data: ideas, isLoading: isLoadingIdeas } = useGetIdeasByWorkspaceName(
    {
      workspaceName: org,
      title: mainSearchTitle,
      topicId: selectedTopics.length === 0 ? undefined : selectedTopics,
      statusId: selectedStatuses.length === 0 ? undefined : selectedStatuses,
      orderBy: selectedOrder,
    }
  );

  const { data: pricesFromDb } = useGetPrices();

  const prices = useMemo(() => {
    if (!pricesFromDb) {
      return [];
    }
    return pricesFromDb.data.prices;
  }, [pricesFromDb]);

  const handleClick = async (price: Prisma.priceGetPayload<{}>) => {
    if (!workspace) {
      return;
    }
    const { errorRedirect, sessionId } = await checkoutWithStripe(
      price,
      workspace?.id,
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
  const handleClickCustomerPortal = async () => {
    if (!workspace) return;
    try {
      const url = await createStripePortal(
        workspace?.id,
        window.location.pathname
      );
      window.open(url, "_blank");
    } catch (error) {
      console.log("Error", error);
    }
  };

  if (!workspace?.workspaceSettings?.showIdeas) {
    return <Loading className="w-full min-h-[60vh]" />;
  }
  return (
    <>
      {/*Filters */}
      <FiltersComponentObject {...filterObjectAttributes} />
      {isProWorkspace ? (
        <>
          <Button onClick={handleClickCustomerPortal}>Customer portal</Button>
        </>
      ) : (
        prices.map((price) => (
          <Button onClick={() => handleClick(price)} key={price.id}>
            {price.product.name} {((price.unit_amount ?? 0) / 100).toFixed(2)}{" "}
            {price.currency}/{price.interval}
          </Button>
        ))
      )}
      <Card className="flex flex-col space-y-1 border-default bg-background p-1 border rounded-lg w-full">
        {!statuses || !topics || isLoadingIdeas ? (
          <Loading className="min-h-[60vh] size-full" />
        ) : ideas?.data.ideas.length === 0 ? (
          <IdeasEmpty
            title="No ideas found"
            description="Be brave. Leave the first one."
            button={
              <Button variant="secondary" className="mt-3" asChild>
                <Link href={`/${org}/ideas/new_idea`}>New idea</Link>
              </Button>
            }
          />
        ) : (
          ideas?.data.ideas.map((idea, index) => {
            const isLastItem = index === ideas.data.ideas.length - 1;
            return (
              <>
                <IdeaCard idea={idea} org={org} key={idea.id} />
                {!isLastItem && <Separator />}
              </>
            );
          })
        )}
      </Card>
    </>
  );
};

export default Ideas;
