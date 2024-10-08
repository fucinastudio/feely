import React from 'react';
import { HeartHandshake } from 'lucide-react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@fucina/ui';

interface HoverCardUserProps {
  trigger: React.ReactNode;
  imageSrc: string | undefined;
  imageAlt: string | undefined;
  imageFallback: string | undefined;
  author: string | null;
}

export default function HoverCardUser({
  trigger,
  imageSrc,
  imageAlt,
  imageFallback,
  author,
}: HoverCardUserProps) {
  return (
    <HoverCard>
      <HoverCardTrigger className="sm:flex hidden">{trigger}</HoverCardTrigger>
      <HoverCardContent className="w-fit">
        <div className="flex items-center gap-2">
          <Avatar size="xl">
            <AvatarImage src={imageSrc} alt={imageAlt} />
            <AvatarFallback className="capitalize">
              {imageFallback}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0.5">
            <p className="font-semibold text-md text">{author}</p>
            <div className="flex justify-start items-center gap-1 text-description text-sm">
              <HeartHandshake className="size-[14px]" />
              <p>7 Karmas</p>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
