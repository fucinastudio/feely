'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { useCheckWorkspaceExistance } from '@/app/api/controllers/workspaceController';
import {
  Button,
  Input,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@fucina/ui';

const WorkspaceInputField = () => {
  const { mutateAsync: checkWorkspaceExistanceAsync } =
    useCheckWorkspaceExistance();

  const FormSchema = z.object({
    workspaceName: z
      .string()
      .min(2, {
        message: 'The name of the workspace must be at least 2 characters.',
      })
      .regex(/^[a-zA-Z0-9-_]+$/, {
        message:
          'Invalid input: only alphanumeric characters, hyphens, and underscores are allowed.',
      })
      .refine(async (value) => {
        if (!value) return;
        const checkSimilar = await checkWorkspaceExistanceAsync(value);
        console.log('Chec', checkSimilar);
        return !checkSimilar.data.exists;
      }, 'This workspace name is already taken.'),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      workspaceName: '',
    },
  });

  const router = useRouter();

  const handleSubmit = async ({
    workspaceName,
  }: z.infer<typeof FormSchema>) => {
    router.push(`/create_account?workspace=${workspaceName}`);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex sm:flex-row flex-col items-center sm:items-start gap-4 sm:gap-3 w-full sm:w-[384px]"
      >
        <FormField
          control={form.control}
          name="workspaceName"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  placeholder="Your workspace name"
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full sm:w-fit">
          Continue
        </Button>
      </form>
    </Form>
  );
};

export default WorkspaceInputField;
