import React from 'react';

import { LoaderCircle } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex justify-center items-center size-full">
      <LoaderCircle className="animate-spin stroke-icon" />
    </div>
  );
}
