'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Ellipsis } from 'lucide-react';

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
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@fucina/ui';

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
            <div className="flex flex-col gap-4 p-5 md:p-6 w-full">
              <div className="flex flex-row gap-4 w-full">
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
              <div className="flex flex-row gap-4 w-full">
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
              <div className="flex justify-between items-center gap-2 pt-4 w-full">
                <Button variant="secondary">Add more</Button>
                <Button>Invite</Button>
              </div>
            </div>
            <div className="flex justify-end items-center border-default p-5 md:p-6 border-t w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Mail</TableHead>
                    <TableHead className="w-40">Role</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow key="key">
                    <TableCell className="font-medium">
                      Federico Kratter Thaler
                    </TableCell>
                    <TableCell>kkratterf@gmail.com</TableCell>
                    <TableCell>Owner</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant="text" icon>
                            <Ellipsis />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem>Delete user</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                  <TableRow key="key">
                    <TableCell className="font-medium">-</TableCell>
                    <TableCell>r.cornacchiari@gmail.com</TableCell>
                    <TableCell>Admin</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant="text" icon>
                            <Ellipsis />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem>Delete user</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Members;
