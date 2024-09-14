'use client';

import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import {
  Button,
  Separator,
  Input,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@fucina/ui';

const FormSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().min(2, {
    message: 'Email must be at least 2 characters.',
  }),
});

function SettingsProfile() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="border-default bg-card border rounded-lg w-full">
        <div className="p-6 border-b border-b-default">
          <h2 className="text-heading-subsection">Profile</h2>
          <p className="text-description text-md">Manage your feely profile.</p>
        </div>
        <div className="flex flex-col gap-6 p-6 w-full">
          <div className="flex justify-start items-center gap-4">
            <Avatar className="text-heading-subsection size-20">
              <AvatarImage></AvatarImage>
              <AvatarFallback>D</AvatarFallback>
            </Avatar>
            <Button variant="text">Upload</Button>
          </div>
          <Separator />
          <Form {...form}>
            <form className="flex flex-col gap-6 w-96">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Michael Scott" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="michael.scott@mail.com" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <div className="flex justify-end items-center border-default px-6 py-4 border-t w-full">
          <Button variant="primary">Save</Button>
        </div>
      </div>
      <div className="border-danger bg-card border rounded-lg w-full overflow-hidden">
        <div className="p-6 border-b border-b-danger">
          <h2 className="text-heading-subsection">Delete Account</h2>
          <p className="text-description text-md">
            Permanently remove your account and all of its contents from the
            feely platform. This action is not reversible, so please continue
            with caution.
          </p>
        </div>
        <div className="flex justify-end items-center bg-danger-subtlest px-6 py-4 w-full">
          <Button variant="danger">Delete account</Button>
        </div>
      </div>
    </div>
  );
}

export default SettingsProfile;
