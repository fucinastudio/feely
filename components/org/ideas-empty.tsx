import React from 'react';
import { Inbox } from 'lucide-react';

interface IdeasEmptyProps {
  title: string;
  description: string;
  button: React.ReactNode;
}

export default function IdeasEmpty({
  title,
  description,
  button,
}: IdeasEmptyProps) {
  return (
    <div className="flex flex-col justify-center items-center gap-4 px-10 py-20 w-full text-description">
      <Inbox className="size-9 stroke-icon" />
      <div className="flex flex-col gap-1.5 w-full">
        <h3 className="font-semibold text-center text-lg text">{title}</h3>
        <p className="mx-auto max-w-80 text-center">{description}</p>
      </div>
      {button}
    </div>
  );
}
