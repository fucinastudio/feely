"use client";

import React, { useCallback, useState } from "react";
import { AlertTriangle, Ellipsis } from "lucide-react";

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
  Alert,
  toast,
} from "@fucina/ui";
import { useWorkspace } from "@/context/workspaceContext";
import { useAuth } from "@/context/authContext";
import {
  useAddWorkspaceAdmins,
  useDeleteWorkspaceAdmin,
  useGetWorkspaceAdmins,
} from "@/app/api/controllers/workspaceController";

const Members = () => {
  const { workspace } = useWorkspace();

  const { isOwner } = useAuth();
  const { data: workspaceAdmins } = useGetWorkspaceAdmins(
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

  const [emails, setEmails] = useState<string[]>([""]);

  const handleAddMoreEmail = useCallback(() => {
    setEmails((prev) => [...prev, ""]);
  }, []);

  const {
    mutateAsync: addWorkspaceAdminsAsync,
    isLoading: isLoadingAddWorkspaceAdmins,
  } = useAddWorkspaceAdmins();

  const handleInvite = async (emails: string[]) => {
    const emailsToSend = emails.filter(
      (email) => email !== "" && email !== null
    );
    if (emailsToSend.length === 0 || !workspace) return;
    const res = await addWorkspaceAdminsAsync({
      emails: emailsToSend,
      workspaceId: workspace.id,
    });
    if (res.data.isSuccess) {
      setEmails([""]);
      toast.success(`${res.data.count} users invited`);
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
            console.log("Pedro");
          }}
          className="space-y-8"
        >
          <div className="flex flex-col gap-4 p-5 md:p-6 w-full">
            <Label>Email Address</Label>

            {emails.map((email, index) => (
              <div className="flex flex-row gap-4 w-full" key={index}>
                <div className="flex flex-col gap-3 w-full" key="key">
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
            <div className="flex justify-between items-center gap-2 pt-4 w-full">
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
              >
                Invite
              </Button>
            </div>
            <Alert variant="warning" title="Notice">
              Only users that has already logged in this website can be invited
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
                {workspaceAdmins?.data.admins?.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell className="font-medium">
                      {admin.name ?? "-"}
                    </TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>
                      {admin.id === workspace?.ownerId ? "Owner" : "Admin"}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant="text" icon>
                            <Ellipsis />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem
                            disabled={
                              !isOwner || admin.id === workspace?.ownerId
                            }
                            onClick={() => handleDeleteWorkspaceAdmin(admin.id)}
                          >
                            Delete user
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Members;
