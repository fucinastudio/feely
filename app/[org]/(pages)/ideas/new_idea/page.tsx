'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { Sheet, SheetContent, Separator } from '@fucina/ui';
import NewIdeaForm from '@/app/[org]/(pages)/ideas/new_idea/new_idea_form';

const NewIdeaPage = () => {
  const router = useRouter();
  const pathName = usePathname();
  const handleClose = () => {
    router.push(pathName.split('/new_idea')[0]);
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
        <SheetContent className="flex flex-col space-y-4 p-10 min-w-[476px]">
          <div className="flex flex-col space-y-1">
            <h2 className="text-heading-body">Tell us your idea</h2>
            <p className="text-description text-md">
              Lorem ipsum dolor sit amet cum condipiscitur
            </p>
          </div>
          <Separator />
          <NewIdeaForm />
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default NewIdeaPage;
