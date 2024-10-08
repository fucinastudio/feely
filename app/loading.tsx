import React from 'react';
import { LoaderCircle } from 'lucide-react';

import { cn } from '@fucina/utils';

interface LoadingProps {
  className?: string;
}

export default function Loading({ className }: LoadingProps) {
  return (
    <div className={cn('flex justify-center min-h-60 items-center', className)}>
      <LoaderCircle className="animate-spin stroke-icon-brand" />
    </div>
  );
}
