export const Endpoints = {
  comment: {
    main: "api/comment",
    vote: "api/comment/vote",
    reply: "api/comment/reply",
  },
  idea: {
    main: "api/idea",
    vote: "api/idea/vote",
    createIdea: "api/idea/createIdea",
    workspace: {
      main: "api/idea/workspace",
      user: "api/idea/workspace/user",
    },
  },
  price: {
    main: "api/price",
  },
  status: {
    main: "api/status",
  },
  topic: {
    main: "api/topic",
  },
  user: {
    main: "api/user",
    byId: "api/user/byId",
    workspace: "api/user/workspace",
  },
  workspace: {
    checkExistance: "api/workspace/checkExistance",
    createWorkspace: "api/workspace/createWorkspace",
    uploadImage: "api/workspace/image",
    main: "api/workspace",
    admin: "api/workspace/admin",
    user: "api/workspace/user",
  },
  workspaceSettings: {
    main: "api/workspaceSettings",
  },
};
