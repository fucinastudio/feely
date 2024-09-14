export const IdeasOrderingOptions = ["latest", "oldest", "most_voted", "least_voted"] as const;

export type IIdeasOrdering = (typeof IdeasOrderingOptions)[number];

export const getIdeasOrderingName = (ordering: IIdeasOrdering) => {
  switch (ordering) {
    case "latest":
      return "Latest";
    case "oldest":
      return "Oldest";
    case "most_voted":
      return "Most voted";
    case "least_voted":
      return "Least voted";
  }
};

export interface IGetIdeasByWorkspaceName {
  workspaceName: string;
  title?: string;
  statusId?: string[];
  topicId?: string[];
  orderBy?: IIdeasOrdering;
}
