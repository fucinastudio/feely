"use client";

import React, { FormEvent, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
} from "@fucina/ui";
import AvatarPickerProfile from "@/app/[org]/(pages)/account/settings/profile/components/avatarPickerProfile";
import { useAuth } from "@/context/authContext";
import { usePatchUser } from "@/app/api/controllers/userController";
import { LoaderCircle } from "lucide-react";
import Loading from "@/app/(auth)/loading";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  // email: z.string().min(2, {
  //   message: "Email must be at least 2 characters.",
  // }),
});

function SettingsProfile() {
  const { user, isLoading: isLoadingUser } = useAuth();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: user?.name ?? "",
      // email: "",
    },
  });

  useEffect(() => {
    form.reset({
      name: user?.name ?? "",
    });
  }, [user]);

  const { mutateAsync: patchUserAsync, isLoading: isLoadingPatchUser } =
    usePatchUser();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    form.handleSubmit(async () => {
      try {
        if (!user?.id) return;
        const response = await patchUserAsync({
          id: user.id,
          name: form.getValues("name"),
        });
      } catch (error) {
        console.error(error);
      }
    })(event);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="border-default bg-card border rounded-lg w-full">
        <div className="p-6 border-b border-b-default">
          <h2 className="text-heading-subsection">Profile</h2>
          <p className="text-description text-md">Manage your feely profile.</p>
        </div>
        <Form {...form}>
          <form onSubmit={handleSubmit}>
            {isLoadingUser ? (
              <Loading />
            ) : (
              <div className="flex flex-col gap-6 p-6 w-full">
                <AvatarPickerProfile />
                <Separator />
                <div className="flex flex-col gap-6 w-96">
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
                </div>
                {/* <FormField
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
              /> */}
                {isLoadingPatchUser ? (
                  <LoaderCircle className="animate-spin stroke-icon" />
                ) : (
                  <div className="flex justify-end items-center border-default px-6 py-4 border-t w-full">
                    <Button variant="primary" type="submit">
                      Save
                    </Button>
                  </div>
                )}
              </div>
            )}
          </form>
        </Form>
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
