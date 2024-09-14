import React from 'react';
import { LoaderCircle } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <LoaderCircle className="animate-spin stroke-icon" />
    </div>
  );
}
