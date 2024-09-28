import React from 'react';
import { LoaderCircle } from 'lucide-react';

export default function Loading() {
  return (
    <LoaderCircle className="relative z-50 animate-spin stroke-brand-600" />
  );
}
