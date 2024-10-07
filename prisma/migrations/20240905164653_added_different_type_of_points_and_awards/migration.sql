-- CreateEnum
CREATE TYPE "AwardType" AS ENUM ('WEEK', 'MONTH', 'QUARTER', 'YEAR');

-- AlterTable
ALTER TABLE "userInWorkspace" ADD COLUMN     "pointsInMonth" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "pointsInQuarter" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "pointsInWeek" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "pointsInYear" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "userInWorkspaceAwards" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "awardType" "AwardType" NOT NULL,
    "awardedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "userInWorkspaceAwards_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "userInWorkspaceAwards" ADD CONSTRAINT "userInWorkspaceAwards_userId_workspaceId_fkey" FOREIGN KEY ("userId", "workspaceId") REFERENCES "userInWorkspace"("userId", "workspaceId") ON DELETE RESTRICT ON UPDATE CASCADE;
