-- CreateTable
CREATE TABLE "workspaceAdmin" (
    "userId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,

    CONSTRAINT "workspaceAdmin_pkey" PRIMARY KEY ("userId","workspaceId")
);

-- AddForeignKey
ALTER TABLE "workspaceAdmin" ADD CONSTRAINT "workspaceAdmin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workspaceAdmin" ADD CONSTRAINT "workspaceAdmin_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
