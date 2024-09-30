'use client';

import React from 'react';
import { Dot } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@fucina/ui';
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
  return (
    <div
      key={id}
      className="flex items-center gap-2 hover:bg-item-hover active:bg-item-selected py-3 pr-3 pl-2 rounded-md w-full cursor-pointer"
    >
      <div className="flex justify-center items-center w-8 sm:w-10 h-8">
        <span className="text-center text-description text-heading-body">
          {index}
        </span>
      </div>
      <Avatar size="xl" className="sm:flex border-default hidden mt-1 border">
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
    </div>
  );
};

export default UserCard;
