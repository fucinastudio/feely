'use client';

import React from 'react';
import Link from 'next/link';
import { Dot } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@fucina/ui';
import { cn, focusRing } from '@fucina/utils';
import useOpenUserTab from '@/utils/useOpenUserTab';

interface IProps {
  id: string;
  index: number;
  name?: string;
  points: number;
  image_url?: string;
  correctedPoints: number;
}

const UserCard = ({
  id,
  index,
  name,
  points,
  image_url,
  correctedPoints,
}: IProps) => {
  const userPageLink = useOpenUserTab({ userId: id });
  return (
    <Link
      key={id}
      className={cn(
        'flex gap-2 items-center hover:bg-item-active active:bg-item-selected py-3 pr-3 pl-2 rounded-md w-full cursor-pointer',
        focusRing
      )}
      href={userPageLink}
    >
      <div className="flex justify-center items-center w-8 sm:w-10 h-8">
        <span className="text-center text-description text-heading-body">
          {index}
        </span>
      </div>
      <Avatar size="xl" className="sm:flex hidden mt-1">
        <AvatarImage src={image_url ?? undefined} alt={name ?? undefined} />
        <AvatarFallback>{name ? name[0] : undefined}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col pr-4 pl-0 sm:pl-1 w-full">
        <h1 className="flex line-clamp-1 pr-2 font-semibold text-md">{name}</h1>
        <div className="flex justify-start items-center gap-0 text-description text-sm">
          <p>🪬 {points} karmas</p>
          <Dot />
          <p>🏅 7 badges</p>
        </div>
      </div>
      <div className="flex justify-center items-center w-10 h-8">
        <span className="font-medium text-left text-md">
          {correctedPoints} 🪬
        </span>
      </div>
    </Link>
  );
};

export default UserCard;
