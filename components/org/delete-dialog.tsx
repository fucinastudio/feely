import React from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@fucina/ui';

export const DeleteDialog = ({ children }: { children: React.ReactNode }) => {
  return <AlertDialog>{children}</AlertDialog>;
};

export const DeleteDialogTrigger = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>;
};

interface DeleteDialogContentProps {
  title: string;
  description: string;
  onClick: () => void;
}

export const DeleteDialogContent = ({
  title,
  description,
  onClick,
}: DeleteDialogContentProps) => {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={onClick}>Confirm</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};
