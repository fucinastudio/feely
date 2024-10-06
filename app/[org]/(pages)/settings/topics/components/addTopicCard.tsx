'use client';

import React, { useState } from 'react';

import { Button, Input } from '@fucina/ui';
import { useCreateTopic } from '@/app/api/controllers/topicController';
import { useWorkspace } from '@/context/workspaceContext';

const AddTopicCard = () => {
  const [topicName, setTopicName] = useState('');
  const { workspace } = useWorkspace();

  const { mutateAsync: createTopicAsync, isLoading } = useCreateTopic();

  const handleSubmit = async () => {
    // Add topic
    if (!topicName || !workspace) return;
    try {
      await createTopicAsync({
        topicName,
        workspaceId: workspace.id,
      });
    } catch (e) {
      console.log('Error', e);
    } finally {
      setTopicName('');
    }
  };
  return (
    <div className="flex sm:flex-row flex-col items-center gap-3 sm:gap-2 w-full">
      <Input
        placeholder="Topic name"
        className="w-full"
        value={topicName}
        onChange={(ev) => setTopicName(ev.target.value)}
      />
      <Button
        variant="primary"
        disabled={!topicName}
        isLoading={isLoading}
        loadingText="Wait a sec..."
        onClick={handleSubmit}
        className="w-full sm:w-fit"
      >
        Add topic
      </Button>
    </div>
  );
};

export default AddTopicCard;
