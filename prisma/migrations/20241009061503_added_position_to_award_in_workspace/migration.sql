/*
  Warnings:

  - Added the required column `position` to the `userInWorkspaceAwards` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "userInWorkspaceAwards" ADD COLUMN     "position" INTEGER NOT NULL;
