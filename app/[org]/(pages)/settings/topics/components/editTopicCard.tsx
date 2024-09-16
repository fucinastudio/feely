'use client';

import React, { FormEvent, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle, PenSquare, Trash2 } from 'lucide-react';

import {
  Button,
  Input,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  toast,
} from '@fucina/ui';
import {
  useDeleteTopic,
  usePatchTopic,
} from '@/app/api/controllers/topicController';
import { TopicType } from '@/types/topic';
import { useWorkspace } from '@/context/workspaceContext';

interface IProps {
  topic: TopicType;
}

const EditTopicCard = ({ topic }: IProps) => {
  const { workspace } = useWorkspace();
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const formRef = useRef<HTMLFormElement>(null);

  const handleEdit = () => {
    setIsEditing(true);
    //Wait for the inputRef to be initialized and focus it
    let t = setInterval(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        clearInterval(t);
      }
    }, 300);
  };

  const handleBlur = async (e: any) => {
    const newValue: string = e.target.value;
    if (newValue !== topic.name) {
      if (formRef.current) {
        formRef.current.requestSubmit();
      }
    }

    setIsEditing(false);
  };

  const FormSchema = z.object({
    topicName: z.string().min(2, {
      message: 'The name of the topic should contain at least 2 letters',
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      topicName: topic.name,
    },
  });

  const { mutateAsync: patchTopicAsync, isLoading: isLoadingPatchTopic } =
    usePatchTopic();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!workspace) return;
    form.handleSubmit(async () => {
      try {
        await patchTopicAsync({
          topicId: topic.id,
          workspaceId: workspace.id,
          topicName: form.getValues().topicName,
        });
      } catch (error) {
        console.error(error);
      }
    })(event);
  };

  const { mutateAsync: deleteTopicAsync, isLoading: isLoadingDeleteTopic } =
    useDeleteTopic();

  const handleDelete = async () => {
    if (!workspace) return;
    try {
      const response = await deleteTopicAsync({
        workspaceId: workspace.id,
        topicId: topic.id,
      });
      if (!response.data.isSuccess) {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 px-4 py-3">
      <Form {...form}>
        <form onSubmit={onSubmit} ref={formRef}>
          {isEditing ? (
            <FormField
              control={form.control}
              name="topicName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      defaultValue={topic.name}
                      ref={inputRef}
                      onBlur={handleBlur}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          ) : (
            <p className="">{topic.name}</p>
          )}
        </form>
      </Form>
      <div className="flex items-center gap-1">
        {isLoadingPatchTopic || isLoadingDeleteTopic ? (
          <LoaderCircle className="stroke-icon w-[36px] animate-spin" />
        ) : (
          <>
            <Button variant="text" icon onClick={handleEdit}>
              <PenSquare />
            </Button>

            <Button variant="text" icon onClick={handleDelete}>
              <Trash2 />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default EditTopicCard;