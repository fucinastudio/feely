import { Prisma } from "@prisma/client";

export type ITopicSelectionObject = {
  select: {
    id: true;
    name: true;
  };
};

export type TopicType = Prisma.topicGetPayload<ITopicSelectionObject>;
