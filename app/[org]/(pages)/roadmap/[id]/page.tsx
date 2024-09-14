import React from 'react';

import IdeaPage, { IPropsIdeaPage } from '@/app/[org]/(pages)/ideas/[id]/page';

const RoadmapIdea = ({ params }: IPropsIdeaPage) => {
  const { id, org } = params;
  return (
    <IdeaPage
      params={{
        id: id,
        org: org,
      }}
    />
  );
};

export default RoadmapIdea;
