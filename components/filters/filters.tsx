'use client';

import { useState } from 'react';

import { IIdeasOrdering } from '@/types/DTO/getIdeasByWorkspaceNameDTO';
import { StatusType } from '@/types/status';
import { TopicType } from '@/types/topic';
import useDebounce from '@/utils/useDebounce';

interface IProps {
  topics: TopicType[];
  statuses: StatusType[];
}

const useMainPageFilters = ({ topics, statuses }: IProps) => {
  const {
    mainState: mainSearchTitle,
    slaveState: searchTitleFastRefreshing,
    setSlaveState: setDebounced,
  } = useDebounce(1000);

  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  const [selectedOrder, setSelectedOrder] = useState<IIdeasOrdering>('latest');

  return {
    filterObjectAttributes: {
      topics: topics,
      statuses: statuses,
      setDebounced: setDebounced,
      selectedTopics: selectedTopics,
      setSelectedTopics: setSelectedTopics,
      selectedStatuses: selectedStatuses,
      setSelectedStatuses: setSelectedStatuses,
      selectedOrder: selectedOrder,
      setSelectedOrder: setSelectedOrder,
      searchTitleFastRefreshing: searchTitleFastRefreshing,
    },
    selectedTopics,
    selectedStatuses,
    mainSearchTitle,
    selectedOrder,
  };
};

export default useMainPageFilters;
