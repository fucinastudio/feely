'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@fucina/ui';
import NewIdeaForm from '@/app/[org]/(pages)/ideas/new_idea/new_idea_form';

const NewIdeaPage = () => {
  const router = useRouter();
  const pathName = usePathname();
  const handleClose = () => {
    router.push(pathName?.split('/new_idea')[0] ?? '/');
  };
  return (
    <div>
      <Sheet
        open={true}
        onOpenChange={(open: boolean) => {
          if (!open) {
            handleClose();
          }
        }}
      >
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Tell us your idea</SheetTitle>
          </SheetHeader>
          <NewIdeaForm />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default NewIdeaPage;
