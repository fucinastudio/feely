'use client';

import React, { FormEvent, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { PenSquare, Trash2, Save } from 'lucide-react';

import {
  Button,
  Input,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  toast,
  Tooltip,
} from '@fucina/ui';
import {
  useDeleteTopic,
  usePatchTopic,
} from '@/app/api/controllers/topicController';
import { TopicType } from '@/types/topic';
import { useWorkspace } from '@/context/workspaceContext';
import Loading from '@/app/loading';

interface IProps {
  topic: TopicType;
}

const EditTopicCard = ({ topic }: IProps) => {
  const { workspace } = useWorkspace();
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const formRef = useRef<HTMLFormElement>(null);

  const handleSave = () => {
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
    setIsEditing(false);
  };

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
    <div className="flex justify-between items-center gap-2 px-4 py-3">
      <Form {...form}>
        <form onSubmit={onSubmit} ref={formRef} className="w-full">
          {isEditing ? (
            <FormField
              control={form.control}
              name="topicName"
              render={({ field }) => (
                <FormItem className="space-y-0 w-full">
                  <FormLabel className="hidden">Name</FormLabel>
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
            <div className="flex justify-start items-center h-9">
              <p className="w-full">{topic.name}</p>
            </div>
          )}
        </form>
      </Form>
      <div className="flex items-center gap-1">
        {isLoadingPatchTopic || isLoadingDeleteTopic ? (
          <Loading className="size-9" />
        ) : isEditing ? (
          <Tooltip content="Save changes">
            <Button variant="text" icon onClick={handleSave}>
              <Save />
            </Button>
          </Tooltip>
        ) : (
          <>
            <Tooltip content="Edit topic">
              <Button variant="text" icon onClick={handleEdit}>
                <PenSquare />
              </Button>
            </Tooltip>
            <Tooltip content="Delete topic">
              <Button variant="text" icon onClick={handleDelete}>
                <Trash2 />
              </Button>
            </Tooltip>
          </>
        )}
      </div>
    </div>
  );
};

export default EditTopicCard;
