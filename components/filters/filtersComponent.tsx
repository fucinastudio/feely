'use client';

import React from 'react';

import {
  IIdeasOrdering,
  IdeasOrderingOptions,
  getIdeasOrderingName,
} from '@/types/DTO/getIdeasByWorkspaceNameDTO';
import { StatusType } from '@/types/status';
import { TopicType } from '@/types/topic';
import {
  Button,
  Input,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  Select,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from '@fucina/ui';

const FiltersComponentObject = ({
  topics,
  statuses,
  searchTitleFastRefreshing,
  setDebounced,
  selectedTopics,
  setSelectedTopics,
  selectedStatuses,
  setSelectedStatuses,
  selectedOrder,
  setSelectedOrder,
}: {
  topics: TopicType[];
  statuses: StatusType[];
  searchTitleFastRefreshing: string;
  setDebounced: (value: string) => void;
  selectedTopics: string[];
  setSelectedTopics: React.Dispatch<React.SetStateAction<string[]>>;
  selectedStatuses: string[];
  setSelectedStatuses: React.Dispatch<React.SetStateAction<string[]>>;
  selectedOrder: IIdeasOrdering;
  setSelectedOrder: (value: IIdeasOrdering) => void;
}) => {
  return (
    <div className="flex justify-between items-center space-x-20">
      <Input
        value={searchTitleFastRefreshing}
        onChange={(ev) => setDebounced(ev.target.value)}
        placeholder="Search ideas..."
        className="max-w-96"
      />
      <div className="flex justify-center items-center space-x-1.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">
              Filters{' '}
              {selectedTopics.length + selectedStatuses.length > 0
                ? `(${selectedTopics.length + selectedStatuses.length})`
                : ''}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Topics</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {topics.map((topic) => (
              <DropdownMenuCheckboxItem
                checked={selectedTopics.includes(topic.id)}
                key={topic.id}
                onClick={(ev) => {
                  ev.stopPropagation();
                  ev.preventDefault();
                  setSelectedTopics((prev) =>
                    prev.includes(topic.id)
                      ? prev.filter((id) => id !== topic.id)
                      : [...prev, topic.id]
                  );
                }}
              >
                {topic.name}
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuLabel>Statuses</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {statuses.map((status) => (
              <DropdownMenuCheckboxItem
                checked={selectedStatuses.includes(status.id)}
                key={status.id}
                onClick={(ev) => {
                  ev.stopPropagation();
                  ev.preventDefault();
                  setSelectedStatuses((prev) =>
                    prev.includes(status.id)
                      ? prev.filter((id) => id !== status.id)
                      : [...prev, status.id]
                  );
                }}
              >
                {status.name}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Select
          value={selectedOrder}
          onValueChange={(ev) => setSelectedOrder(ev as IIdeasOrdering)}
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectGroupLabel>Sort by</SelectGroupLabel>
              {IdeasOrderingOptions.map((order) => (
                <SelectItem key={order} value={order}>
                  {getIdeasOrderingName(order)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default FiltersComponentObject;
