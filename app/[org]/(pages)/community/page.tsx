'use client';

import React, { useState } from 'react';

import {
  Separator,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@fucina/ui';
import Loading from '@/app/(auth)/loading';
import { useGetUsersForWorkspace } from '@/app/api/controllers/userController';
import { PeriodType, Periods } from '@/types/enum/period';
import { UserTypeWithPoints } from '@/types/user';
import { useWorkspace } from '@/context/workspaceContext';

const Community = () => {
  const { org, workspace } = useWorkspace();

  const [period, setPeriod] = useState<PeriodType>('Week');
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
    return <div className="flex justify-center items-center">Not found</div>;
  }
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-start items-center w-full">
        <h2 className="text-heading-section">Community</h2>
      </div>
      <Separator />
      <div className="flex justify-end w-full">
        <Select
          value={period}
          onValueChange={(value: PeriodType) => setPeriod(value)}
        >
          <SelectTrigger id="period" className="w-fit">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent position="popper">
            {Periods.map((period) => (
              <SelectItem key={period} value={period}>
                {period}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col space-y-6">
        {isLoadingUsersInWorkspace ? (
          <Loading />
        ) : (
          usersInWorkspace?.data.usersInWorkspace?.map((user, index) => {
            return (
              <div key={user.id} className="flex items-center space-x-4">
                {index}
                <img
                  src={user.image_url ?? undefined}
                  alt={user.name ?? undefined}
                  className="rounded-full size-12"
                />
                <div>
                  <h3 className="text-heading-section">{user.name}</h3>
                  <p className="text-body">{user.points}</p>
                </div>
                <p>{getCorrectPointsForPeriod(user, period)}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Community;

const getCorrectPointsForPeriod = (
  user: UserTypeWithPoints,
  period: PeriodType
) => {
  if (period === 'Week') {
    return user.pointsInWeek;
  } else if (period === 'Month') {
    return user.pointsInMonth;
  } else if (period === 'Quarter') {
    return user.pointsInQuarter;
  } else if (period === 'Year') {
    return user.pointsInYear;
  }
  return 0;
};
