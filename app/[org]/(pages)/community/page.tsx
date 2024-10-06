'use client';

import React, { useState } from 'react';
import { LoaderCircle } from 'lucide-react';

import {
  Separator,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@fucina/ui';
import { useGetUsersForWorkspace } from '@/app/api/controllers/userController';
import { PeriodType, Periods } from '@/types/enum/period';
import { UserTypeWithPoints } from '@/types/user';
import { useWorkspace } from '@/context/workspaceContext';
import UserCard from '@/app/[org]/(pages)/community/components/user';

const Community = () => {
  const { org, workspace } = useWorkspace();

  const [period, setPeriod] = useState<PeriodType>('Last week');
  const { data: usersInWorkspace, isLoading: isLoadingUsersInWorkspace } =
    useGetUsersForWorkspace(
      {
        current_org: org,
        period: period,
        workspaceId: workspace?.id ?? '',
      },
      workspace?.workspaceSettings?.showCommunity && !!org && !!workspace?.id
    );

  if (!workspace?.workspaceSettings?.showCommunity) {
    return (
      <div className="flex justify-center items-center w-full h-56">
        <LoaderCircle className="animate-spin stroke-icon-brand" />
      </div>
    );
  }
  return (
    <>
      <div className="flex justify-end w-full">
        <Select
          value={period}
          onValueChange={(value: PeriodType) => setPeriod(value)}
        >
          <SelectTrigger id="period" className="w-36">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent position="popper" align="end">
            {Periods.map((period) => (
              <SelectItem key={period} value={period}>
                {period}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col space-y-1 border-default bg-background p-1 border rounded-lg w-full">
        {isLoadingUsersInWorkspace ? (
          <div className="flex justify-center items-center w-full min-h-56">
            <LoaderCircle className="animate-spin stroke-brand-600" />
          </div>
        ) : (
          usersInWorkspace?.data.usersInWorkspace?.map((user, index) => {
            const isLastItem =
              index ===
              (usersInWorkspace?.data?.usersInWorkspace?.length ?? 0) - 1;
            return (
              <>
                <UserCard
                  id={user.id}
                  index={index + 1}
                  name={user.name ?? undefined}
                  points={user.points}
                  image_url={user.image_url ?? undefined}
                  correctedPoints={getCorrectPointsForPeriod(user, period)}
                />
                {!isLastItem && <Separator />}
              </>
            );
          })
        )}
      </div>
    </>
  );
};

export default Community;

const getCorrectPointsForPeriod = (
  user: UserTypeWithPoints,
  period: PeriodType
) => {
  if (period === 'Last week') {
    return user.pointsInWeek;
  } else if (period === 'Last month') {
    return user.pointsInMonth;
  } else if (period === 'Last quarter') {
    return user.pointsInQuarter;
  } else if (period === 'Last year') {
    return user.pointsInYear;
  }
  return 0;
};
