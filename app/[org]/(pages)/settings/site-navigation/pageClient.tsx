'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle } from 'lucide-react';

import { Button, Switch, Form, FormField } from '@fucina/ui';
import { useWorkspace } from '@/context/workspaceContext';
import Loading from '@/app/[org]/(pages)/account/settings/loading';
import { usePatchWorkspaceSettings } from '@/app/api/controllers/workspaceSettingsController';

function SiteNavigation() {
  const { workspace, isLoadingWorkspace } = useWorkspace();

  //Zod form for the 3 switches with 3 booleans
  const FormSchema = z.object({
    showIdeas: z.boolean(),
    showRoadmap: z.boolean(),
    showCommunity: z.boolean(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      showIdeas: workspace?.workspaceSettings?.showIdeas ?? false,
      showRoadmap: workspace?.workspaceSettings?.showRoadmap ?? false,
      showCommunity: workspace?.workspaceSettings?.showCommunity ?? false,
    },
  });

  useEffect(() => {
    if (!workspace) return;
    form.reset({
      showIdeas: workspace.workspaceSettings?.showIdeas ?? false,
      showRoadmap: workspace.workspaceSettings?.showRoadmap ?? false,
      showCommunity: workspace.workspaceSettings?.showCommunity ?? false,
    });
  }, [workspace]);

  const { mutateAsync: patchWorkspaceSettingsAsync, isLoading } =
    usePatchWorkspaceSettings();

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!workspace) return;
    try {
      await patchWorkspaceSettingsAsync({
        showCommunity: data.showCommunity,
        showIdeas: data.showIdeas,
        showRoadmap: data.showRoadmap,
        workspaceName: workspace.name,
      });
      window.location.reload();
    } catch (e) {}
  };
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="border-default bg-card border rounded-lg w-full">
        <div className="p-6 border-b border-b-default">
          <h2 className="text-heading-subsection">Navigation</h2>
          <p className="text-description text-md">
            Manage your website navigation.
          </p>
        </div>
        {isLoadingWorkspace ? (
          <Loading />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex flex-col gap-4 p-6 w-full">
                <FormField
                  control={form.control}
                  name="showIdeas"
                  render={({ field }) => (
                    <div className="flex justify-between items-center w-full">
                      <p className="text-md-medium">Ideas</p>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="showRoadmap"
                  render={({ field }) => (
                    <div className="flex justify-between items-center w-full">
                      <p className="text-md-medium">Roadmap</p>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="showCommunity"
                  render={({ field }) => (
                    <div className="flex justify-between items-center w-full">
                      <p className="text-md-medium">Community</p>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </div>
                  )}
                />
              </div>

              <div className="flex justify-end items-center border-default px-6 py-4 border-t w-full">
                {isLoading ? (
                  <LoaderCircle className="animate-spin stroke-icon" />
                ) : (
                  <Button variant="primary">Save</Button>
                )}
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}

export default SiteNavigation;
