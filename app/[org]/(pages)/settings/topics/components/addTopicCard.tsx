'use client';

import React, { useState } from 'react';
import { LoaderCircle } from 'lucide-react';

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
    <div className="flex items-center gap-4 w-full">
      <Input
        placeholder="Topic name"
        className="w-full"
        value={topicName}
        onChange={(ev) => setTopicName(ev.target.value)}
      />
      {isLoading ? (
        <LoaderCircle className="w-[36px] animate-spin stroke-icon" />
      ) : (
        <Button variant="primary" disabled={!topicName} onClick={handleSubmit}>
          Add topic
        </Button>
      )}
    </div>
  );
};

export default AddTopicCard;
