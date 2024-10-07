import React from 'react';
import Link from 'next/link';

import { Button } from '@fucina/ui';

export default function BrandBadge() {
  return (
    <Button
      asChild
      className="bottom-4 left-4 fixed bg-inverse shadow-md px-2 py-[5px] rounded max-w-60 font-brand font-medium text-inverse text-lg leading-5 select-none"
    >
      <Link href="https://feely.so" target="_blank">
        💜 Made with Feely
      </Link>
    </Button>
  );
}
