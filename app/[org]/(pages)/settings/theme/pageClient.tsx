'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

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
} from '@fucina/ui';
import { cn } from '@fucina/utils';
import {
  changePrimaryColor,
  changeNeutralColor,
  PrimaryColorOptions,
  PrimaryColorType,
  NeutralColorType,
  NeutralColorOptions,
  mapPrimary,
  mapNeutral,
} from '@/utils/themes';
import { useWorkspace } from '@/context/workspaceContext';
import Loading from '@/app/loading';
import { usePatchWorkspaceSettings } from '@/app/api/controllers/workspaceSettingsController';

const Theme = () => {
  const { workspace, isLoadingWorkspace } = useWorkspace();

  //Zod form for the 3 switches with 3 booleans
  const FormSchema = z.object({
    primaryColor: z.enum(PrimaryColorOptions),
    neutralColor: z.enum(NeutralColorOptions),
    fontFamily: z.string(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      primaryColor: (workspace?.workspaceSettings?.primaryColor ??
        'blue') as PrimaryColorType,
      neutralColor: (workspace?.workspaceSettings?.neutralColor ??
        'zinc') as NeutralColorType,
      fontFamily: workspace?.workspaceSettings?.fontFamily ?? 'geist',
    },
  });

  useEffect(() => {
    if (!workspace) return;
    form.reset({
      primaryColor: (workspace?.workspaceSettings?.primaryColor ??
        'blue') as PrimaryColorType,
      neutralColor: (workspace?.workspaceSettings?.neutralColor ??
        'zinc') as NeutralColorType,
      fontFamily: workspace?.workspaceSettings?.fontFamily ?? 'geist',
    });
  }, [workspace]);

  const { mutateAsync: patchWorkspaceSettingsAsync, isLoading } =
    usePatchWorkspaceSettings();

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!workspace) return;
    try {
      await patchWorkspaceSettingsAsync({
        primaryColor: data.primaryColor,
        neutralColor: data.neutralColor,
        fontFamily: data.fontFamily,
        workspaceName: workspace.name,
      });
      window.location.reload();
    } catch (e) {
      console.log('Error', e);
    }
  };

  const handlePrimaryColorChange = (value: PrimaryColorType) => {
    changePrimaryColor(value);
  };

  const handleNeutralColorChange = (value: NeutralColorType) => {
    changeNeutralColor(value);
  };

  return (
    <div className="flex flex-col gap-5 md:gap-6 w-full">
      <div className="border-default bg-card border rounded-lg w-full">
        <div className="flex flex-col gap-1 p-5 md:p-6 border-b border-b-default">
          <h2 className="text-heading-subsection">Theme</h2>
          <p className="text-description text-md">
            Customize the interface appearance for your customers.
          </p>
        </div>
        {isLoadingWorkspace ? (
          <Loading className="min-h-[60vh] size-full" />
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex flex-col gap-5 md:gap-6 p-5 md:p-6 w-full">
                <FormField
                  control={form.control}
                  name="primaryColor"
                  render={({ field }) => (
                    <div className="flex flex-col gap-3" key={field.value}>
                      <Label>Primary Color</Label>
                      <Select
                        value={field.value}
                        onValueChange={(value: PrimaryColorType) => {
                          handlePrimaryColorChange(value);
                          field.onChange(value);
                        }}
                      >
                        <SelectTrigger className="w-full md:w-96">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectGroupLabel>Primary Color</SelectGroupLabel>
                            {PrimaryColorOptions.map((primaryColor) => {
                              return (
                                <SelectItem
                                  key={primaryColor}
                                  value={primaryColor}
                                  className="h-9"
                                >
                                  <div className="flex items-center gap-1.5">
                                    <div
                                      className={cn(
                                        `size-4 rounded-full`,
                                        mapPrimary(primaryColor)
                                      )}
                                    />
                                    {primaryColor[0].toUpperCase() +
                                      primaryColor.slice(1)}
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="neutralColor"
                  render={({ field }) => (
                    <div className="flex flex-col gap-3" key={field.value}>
                      <Label>Neutral Color</Label>
                      <Select
                        value={field.value}
                        onValueChange={(value: NeutralColorType) => {
                          handleNeutralColorChange(value);
                          field.onChange(value);
                        }}
                      >
                        <SelectTrigger className="w-full md:w-96">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectGroupLabel>Neutral Color</SelectGroupLabel>
                            {NeutralColorOptions.map((neutralColor) => {
                              return (
                                <SelectItem
                                  key={neutralColor}
                                  value={neutralColor}
                                  className="h-9"
                                >
                                  <div className="flex items-center gap-1.5">
                                    <div
                                      className={cn(
                                        `size-4 rounded-full`,
                                        mapNeutral(neutralColor)
                                      )}
                                    />
                                    {neutralColor[0].toUpperCase() +
                                      neutralColor.slice(1)}
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fontFamily"
                  render={({ field }) => (
                    <div className="flex flex-col gap-3" key={field.value}>
                      <Label>Font family</Label>
                      <Select
                        value={field.value}
                        onValueChange={(value: string) => {
                          field.onChange(value);
                        }}
                      >
                        <SelectTrigger className="w-full md:w-96">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectGroupLabel>Font family</SelectGroupLabel>
                            <SelectItem value="geist" className="h-9">
                              Geist
                            </SelectItem>
                            <SelectItem value="inter" className="h-9">
                              Inter
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
              </div>
              <div className="flex justify-end items-center border-default px-5 md:px-6 py-4 border-t w-full">
                <Button
                  isLoading={isLoading}
                  loadingText="Wait a sec..."
                  variant="primary"
                  type="submit"
                >
                  Save
                </Button>
              </div>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
};

export default Theme;
