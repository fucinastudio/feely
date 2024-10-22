'use client';

import React, { useCallback, useState } from 'react';
import { AlertTriangle, Ellipsis } from 'lucide-react';

import {
  Button,
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
  Alert,
  toast,
  Select,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@fucina/ui';
import { useWorkspace } from '@/context/workspaceContext';
import { useAuth } from '@/context/authContext';
import {
  useAddWorkspaceAdmins,
  useDeleteWorkspaceAdmin,
  useGetWorkspaceAdmins,
} from '@/app/api/controllers/workspaceController';
import Loading from '@/app/loading';
import {
  DeleteDialog,
  DeleteDialogContent,
  DeleteDialogTrigger,
} from '@/components/org/delete-dialog';

const Members = () => {
  const { workspace } = useWorkspace();

  const { isOwner } = useAuth();
  const { data: workspaceAdmins, isLoading: isLoadingWorkspaceAdmins } =
    useGetWorkspaceAdmins(
      {
        workspaceId: workspace?.id!,
      },
      !!workspace?.id
    );

  const { mutate: deleteWorkspaceAdmin } = useDeleteWorkspaceAdmin();

  const handleDeleteWorkspaceAdmin = useCallback(
    (userId: string) => {
      if (!workspace) return;
      deleteWorkspaceAdmin({
        workspaceId: workspace.id,
        userId,
      });
    },
    [deleteWorkspaceAdmin, workspace]
  );

  const [emails, setEmails] = useState<string[]>(['']);

  const handleAddMoreEmail = useCallback(() => {
    setEmails((prev) => [...prev, '']);
  }, []);

  const {
    mutateAsync: addWorkspaceAdminsAsync,
    isLoading: isLoadingAddWorkspaceAdmins,
  } = useAddWorkspaceAdmins();

  const handleInvite = async (emails: string[]) => {
    const emailsToSend = emails.filter(
      (email) => email !== '' && email !== null
    );
    if (emailsToSend.length === 0 || !workspace) return;
    const res = await addWorkspaceAdminsAsync({
      emails: emailsToSend,
      workspaceId: workspace.id,
    });
    if (res.data.isSuccess) {
      setEmails(['']);
      toast(`${res.data.count} users invited`);
    }
  };

  return (
    <div className="flex flex-col gap-5 md:gap-6 w-full">
      <div className="border-default bg-card border rounded-lg w-full">
        <div className="flex flex-col gap-1 p-5 md:p-6 border-b border-b-default">
          <h2 className="text-heading-subsection">Members</h2>
          <p className="text-description text-md">
            Manage team members and invitations
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log('Pedro');
          }}
        >
          <div className="flex flex-col gap-4 p-5 md:p-6 w-full">
            {emails.map((email, index) => (
              <div
                className="flex sm:flex-row flex-col gap-4 border-default pb-5 sm:pb-0 border-b sm:border-b-0 w-full"
                key={index}
              >
                <div className="flex flex-col gap-3 w-full" key="key">
                  <Label>Email Address</Label>
                  <Input
                    placeholder="Email..."
                    value={email}
                    onChange={(ev) => {
                      setEmails((prev) =>
                        prev.map((prevEmail, ind) =>
                          index === ind ? ev.target.value : prevEmail
                        )
                      );
                    }}
                  />
                </div>
                <div className="flex flex-col gap-3 w-full" key="key">
                  <Label>Role</Label>
                  <Select disabled>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Admin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="owner">Owner</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}

            {/*<FormField
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
                />*/}
            <div className="flex justify-between items-center gap-2 pt-2 w-full">
              <Button
                variant="secondary"
                disabled={!isOwner}
                onClick={handleAddMoreEmail}
              >
                Add more
              </Button>
              <Button
                disabled={!isOwner}
                onClick={() => handleInvite(emails)}
                isLoading={isLoadingAddWorkspaceAdmins}
                loadingText="Wait a sec..."
              >
                Invite
              </Button>
            </div>
            <Alert variant="warning" title="Attention!">
              Only users that has already logged in this website can be invited.
            </Alert>
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
                {isLoadingWorkspaceAdmins ? (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Loading />
                    </TableCell>
                  </TableRow>
                ) : (
                  workspaceAdmins?.data.admins?.map((admin) => (
                    <TableRow key={admin.id}>
                      <TableCell className="font-medium">
                        {admin.name ?? '-'}
                      </TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>
                        {admin.id === workspace?.ownerId ? 'Owner' : 'Admin'}
                      </TableCell>
                      <TableCell>
                        <DeleteDialog>
                          <DropdownMenu>
                            <DropdownMenuTrigger>
                              <Button variant="text" icon>
                                <Ellipsis />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40">
                              <DeleteDialogTrigger>
                                <DropdownMenuItem
                                  disabled={
                                    !isOwner || admin.id === workspace?.ownerId
                                  }
                                >
                                  Delete user
                                </DropdownMenuItem>
                              </DeleteDialogTrigger>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <DeleteDialogContent
                            title="Are you absolutely sure?"
                            description="This action cannot be undone. This will permanently delete the admin and remove all data from our servers."
                            onClick={() => handleDeleteWorkspaceAdmin(admin.id)}
                          />
                        </DeleteDialog>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Members;
