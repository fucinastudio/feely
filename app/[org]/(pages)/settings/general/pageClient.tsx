"use client";

import React, { FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Button,
  Input,
  Separator,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Switch,
  Label,
} from "@fucina/ui";
import { useWorkspace } from "@/context/workspaceContext";
import Loading from "@/app/loading";
import AvatarPicker from "@/app/[org]/(pages)/settings/general/components/avatarPicker";
import {
  useCheckWorkspaceExistance,
  usePatchWorkspace,
} from "@/app/api/controllers/workspaceController";
import { useOptimistic } from "@/utils/useOptimistic";
import { usePatchWorkspaceSettings } from "@/app/api/controllers/workspaceSettingsController";
import UpgradePlan from "@/components/org/upgrade-plan";

function General() {
  const {
    mutateAsync: checkWorkspaceExistanceAsync,
    isLoading: isLoadingCheckWorkspaceExistance,
  } = useCheckWorkspaceExistance();

  const FormSchema = z.object({
    workspaceId: z.string(),
    companyName: z.string().min(2, {
      message: "Company name must be at least 2 characters.",
    }),
    companyUrl: z
      .string()
      .min(2, {
        message: "Company url must be at least 2 characters.",
      })
      .regex(/^[a-zA-Z0-9-_]+$/, {
        message:
          "Invalid input: only alphanumeric characters, hyphens, and underscores are allowed.",
      })
      .refine(async (value) => {
        if (!value || value === org) return true;
        const checkSimilar = await checkWorkspaceExistanceAsync(value);
        return !checkSimilar.data.exists;
      }, "This workspace name is already taken."),
    logoLink: z.string().optional(),
  });

  const { org, workspace, isLoadingWorkspace, isProWorkspace } = useWorkspace();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      workspaceId: workspace?.id,
      companyName: workspace?.externalName,
      companyUrl: workspace?.name,
      logoLink: workspace?.logoUrl ?? undefined,
    },
  });
  useEffect(() => {
    form.reset({
      workspaceId: workspace?.id,
      companyName: workspace?.externalName,
      companyUrl: workspace?.name,
      logoLink: workspace?.logoUrl ?? undefined,
    });
  }, [workspace]);

  const router = useRouter();

  const { mutateAsync: patchWorkspaceAsync, isLoading } = usePatchWorkspace();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    form.handleSubmit(async () => {
      try {
        const formData = new FormData(event.target as any);
        const workspaceId = formData.get("workspaceId");
        const workspaceExternalName = formData.get("companyName");
        const workspaceName = formData.get("companyUrl");
        const logoLink = formData.get("logoLink");
        const response = await patchWorkspaceAsync({
          workspaceId: workspaceId as string,
          ...(workspaceExternalName
            ? { workspaceExternalName: workspaceExternalName as string }
            : {}),
          ...(workspaceName ? { workspaceName: workspaceName as string } : {}),
          ...(logoLink ? { logoLink: logoLink as string } : {}),
        });
        if (response) {
          if (response.data.org === org) {
            window.location.reload();
          } else {
            router.replace(`/${response.data.org}/settings/general`);
          }
        }
      } catch (error) {
        console.error(error);
      }
    })(event);
  };

  const { mutateAsync: patchWorkspaceSettingsAsync } =
    usePatchWorkspaceSettings();

  // const [optimisticShowBranding, handleChangeOptimisticShowBranding] =
  //   useOptimistic({
  //     mainState: workspace?.workspaceSettings?.showBranding,
  //     callOnChange: (state: boolean | undefined) => {
  //       if (!workspace) return;
  //       patchWorkspaceSettingsAsync({
  //         workspaceName: workspace?.name,
  //         showBranding: state,
  //       });
  //     },
  //   });
  const [optimisticAllowNewIdea, handleChangeOptimisticAllowNewIdea] =
    useOptimistic({
      mainState: workspace?.workspaceSettings?.allowNewIdeas,
      callOnChange: (state: boolean | undefined) => {
        if (!workspace) return;
        patchWorkspaceSettingsAsync({
          workspaceName: workspace?.name,
          allowNewIdeas: state,
        });
      },
    });

  return (
    <div className="flex flex-col gap-5 md:gap-6 w-full">
      <div className="border-default bg-card border rounded-lg w-full">
        <div className="flex flex-col gap-1 p-5 md:p-6 border-b border-b-default">
          <h2 className="text-heading-subsection">General</h2>
          <p className="text-description text-md">
            Manage your company settings.
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={onSubmit}>
            {isLoadingWorkspace ? (
              <Loading className="min-h-[60vh] size-full" />
            ) : (
              <div className="flex flex-col gap-5 md:gap-6 p-5 md:p-6 w-full">
                <AvatarPicker />
                <Separator />
                <div className="flex flex-col gap-5 md:gap-6 w-full md:w-96">
                  {/*Fake field to pass the workspaceId */}
                  <FormField
                    control={form.control}
                    name="workspaceId"
                    render={({ field }) => (
                      <FormItem className="hidden w-full">
                        <FormLabel>Workspace Id</FormLabel>
                        <FormControl>
                          <Input placeholder="Dunder Mifflin" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Company name</FormLabel>
                        <FormControl>
                          <Input placeholder="Dunder Mifflin" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="companyUrl"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Company url</FormLabel>
                        <FormControl>
                          <Input placeholder="dunder-mifflin" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="logoLink"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Logo link</FormLabel>
                        <FormControl>
                          <Input placeholder="https://" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Separator />
                  <div className="flex justify-between items-center w-full">
                    <Label>Allow creation of new ideas</Label>
                    <Switch
                      checked={optimisticAllowNewIdea}
                      onCheckedChange={handleChangeOptimisticAllowNewIdea}
                    />
                  </div>
                  {/* 
                  Commented for the moment while we implement legal stuff
                  <div className="flex justify-between items-center w-full">
                    <Label>Show feely branding</Label>
                    {isProWorkspace ? (
                      <Switch
                        checked={optimisticShowBranding}
                        onCheckedChange={handleChangeOptimisticShowBranding}
                      />
                    ) : (
                      <UpgradePlan asChild={false}>
                        <Switch checked={true} disabled />
                      </UpgradePlan>
                    )}
                  </div> */}
                </div>
              </div>
            )}
            <div className="flex justify-end items-center border-default px-5 md:px-6 py-4 border-t w-full">
              <Button
                isLoading={isLoading || isLoadingCheckWorkspaceExistance}
                loadingText="Wait a sec..."
                variant="primary"
                type="submit"
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/*To be implemented */}
      {/*
      <div className="border-danger-subtlest bg-card border rounded-lg w-full overflow-hidden">
        <div className="flex flex-col gap-1 p-5 md:p-6 border-b border-b-danger-subtlest">
          <h2 className="text-heading-subsection">Delete Workspace</h2>
          <p className="text-description text-md">
            Permanently remove your account and all of its contents from the
            feely platform. This action is not reversible, so please continue
            with caution.
          </p>
        </div>
        <div className="flex justify-end items-center bg-danger-subtlest px-5 md:px-6 py-4 w-full">
          <DeleteDialog>
            <DeleteDialogTrigger>
              <Button variant="danger">Delete workspace</Button>
            </DeleteDialogTrigger>
            <DeleteDialogContent
              title="Are you absolutely sure?"
              description="This action cannot be undone. This will permanently delete the workspace and remove all data from our servers."
              onClick={() => console.log('Pedro')}
            />
          </DeleteDialog>
        </div>
      </div>
      */}
    </div>
  );
}

export default General;
