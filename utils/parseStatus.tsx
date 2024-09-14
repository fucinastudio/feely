import {
  HelpCircle,
  CircleDashed,
  Loader2,
  Archive,
  CheckCircle,
} from 'lucide-react';

import { Tag } from '@fucina/ui';

export type TagColor = 'amber' | 'purple' | 'blue' | 'red' | 'emerald';

export const getStatusProps = (
  statusName: string | null
): { tagColor: TagColor; tagIcon: JSX.Element } => {
  switch (statusName) {
    case 'In review':
      return { tagColor: 'amber', tagIcon: <HelpCircle /> };
    case 'Planned':
      return { tagColor: 'purple', tagIcon: <CircleDashed /> };
    case 'In progress':
      return { tagColor: 'blue', tagIcon: <Loader2 /> };
    case 'Archived':
      return { tagColor: 'red', tagIcon: <Archive /> };
    case 'Completed':
      return { tagColor: 'emerald', tagIcon: <CheckCircle /> };
    default:
      return { tagColor: 'blue', tagIcon: <Loader2 /> }; // Default for unknown status
  }
};

export const StatusTag = ({
  status,
  className,
}: {
  status: string;
  className?: string;
}) => {
  const { tagColor, tagIcon } = getStatusProps(status);
  return (
    <Tag variant={tagColor} className={className}>
      {tagIcon}
      {status}
    </Tag>
  );
};
