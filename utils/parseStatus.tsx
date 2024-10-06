import {
  HelpCircle,
  CircleDashed,
  Loader2,
  Archive,
  CheckCircle,
} from 'lucide-react';

import { Tag } from '@fucina/ui';
import { cn } from '@fucina/utils';

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

export const StatusTagIdea = ({
  status,
  className,
}: {
  status: string;
  className?: string;
}) => {
  const { tagColor, tagIcon } = getStatusProps(status);
  return (
    <Tag
      variant={tagColor}
      className={cn('px-1 sm:px-1.5 sm:!pr-2', className)}
    >
      {tagIcon}
      <span className="sm:flex hidden">{status}</span>
    </Tag>
  );
};

export const StatusTagColumn = ({
  status,
  className,
}: {
  status: string;
  className?: string;
}) => {
  const { tagColor, tagIcon } = getStatusProps(status);
  return (
    <Tag
      variant={tagColor}
      className={cn('text-md !pl-0.5 !pr-1.5 [&>svg]:size-4', className)}
    >
      {tagIcon}
      <span>{status}</span>
    </Tag>
  );
};
