'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Button,
  Input,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@fucina/ui';
import { useCreateIdea } from '@/app/api/controllers/ideaController';
import { useWorkspace } from '@/context/workspaceContext';

const NewIdeaForm = () => {
  const { org, topics } = useWorkspace();
  const FormSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    topic: z.string(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      description: '',
      topic: undefined,
    },
  });

  const router = useRouter();

  const { mutateAsync: createIdea, isLoading: isLoadingCreateIdea } =
    useCreateIdea();
  const handleSubmit = async ({
    title,
    description,
    topic,
  }: z.infer<typeof FormSchema>) => {
    const res = await createIdea({
      description: description,
      org: org,
      title: title,
      topicId: topic,
    });
    if (res) {
      router.push(`/${org}/ideas`);
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <Label>Title</Label>
              <FormControl>
                <Input
                  placeholder="One sentences that summarizes your idea"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <Label>Description</Label>
              <FormControl>
                <Textarea placeholder="Why your idea is helpful?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <Label>Topic</Label>
              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chose one topic" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {topics?.map((topic) => {
                    return (
                      <SelectItem key={topic.id} value={topic.id}>
                        {topic.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4 w-full">
          <Button type="submit" disabled={isLoadingCreateIdea}>
            Submit idea
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NewIdeaForm;
