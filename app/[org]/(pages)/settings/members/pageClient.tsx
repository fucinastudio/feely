'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import {
  Button,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectGroupLabel,
  SelectTrigger,
  SelectValue,
  Form,
  FormField,
  Label,
  Input,
} from '@fucina/ui';
import MemberTable from '@/components/org/member-table';

const Members = () => {
  const FormSchema = z.object({
    form: z.string(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  return (
    <div className="flex flex-col gap-5 md:gap-6 w-full">
      <div className="border-default bg-card border rounded-lg w-full">
        <div className="flex flex-col gap-1 p-5 md:p-6 border-b border-b-default">
          <h2 className="text-heading-subsection">Members</h2>
          <p className="text-description text-md">
            Manage team members and invitations
          </p>
        </div>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log('Pedro');
            }}
            className="space-y-8"
          >
            <div className="flex flex-col gap-8 sm:gap-6 px-4 md:px-6 py-10 md:py-6 w-full">
              <div className="flex sm:flex-row flex-col gap-4 border-default pb-8 sm:pb-0 border-b sm:border-b-0 w-full">
                <FormField
                  control={form.control}
                  name="form"
                  render={({ field }) => (
                    <div className="flex flex-col gap-3 w-full" key="key">
                      <Label>Email Address</Label>
                      <Input placeholder="pedro@mail.com" />
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="form"
                  render={({ field }) => (
                    <div className="flex flex-col gap-3 w-full" key="key">
                      <Label>Roles</Label>
                      <Select value="admin">
                        <SelectTrigger disabled className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectGroupLabel>Roles</SelectGroupLabel>
                            <SelectItem
                              key="owner"
                              value="owner"
                              className="h-9"
                            >
                              Owner
                            </SelectItem>
                            <SelectItem
                              key="admin"
                              value="admin"
                              className="h-9"
                            >
                              Admin
                            </SelectItem>
                            <SelectItem
                              key="member"
                              value="member"
                              className="h-9"
                            >
                              Member
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
              </div>
              <div className="flex sm:flex-row flex-col gap-4 border-default pb-8 sm:pb-0 border-b sm:border-b-0 w-full">
                <FormField
                  control={form.control}
                  name="form"
                  render={({ field }) => (
                    <div className="flex flex-col gap-3 w-full" key="key">
                      <Label>Email Address</Label>
                      <Input placeholder="pedro@mail.com" />
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="form"
                  render={({ field }) => (
                    <div className="flex flex-col gap-3 w-full" key="key">
                      <Label>Roles</Label>
                      <Select value="admin">
                        <SelectTrigger disabled className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectGroupLabel>Roles</SelectGroupLabel>
                            <SelectItem
                              key="owner"
                              value="owner"
                              className="h-9"
                            >
                              Owner
                            </SelectItem>
                            <SelectItem
                              key="admin"
                              value="admin"
                              className="h-9"
                            >
                              Admin
                            </SelectItem>
                            <SelectItem
                              key="member"
                              value="member"
                              className="h-9"
                            >
                              Member
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
              </div>
              <div className="flex justify-between items-center gap-2 sm:pt-4 w-full">
                <Button variant="secondary">Add more</Button>
                <Button>Invite</Button>
              </div>
            </div>
          </form>
        </Form>
        <div className="flex justify-start items-center border-default p-5 md:p-6 border-t w-full overflow-auto">
          <MemberTable />
        </div>
      </div>
    </div>
  );
};

export default Members;
