-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_ideaId_fkey";

-- DropForeignKey
ALTER TABLE "comment" DROP CONSTRAINT "comment_parentId_fkey";

-- DropForeignKey
ALTER TABLE "votedComment" DROP CONSTRAINT "votedComment_commentId_fkey";

-- DropForeignKey
ALTER TABLE "votedIdea" DROP CONSTRAINT "votedIdea_ideaId_fkey";

-- AddForeignKey
ALTER TABLE "votedIdea" ADD CONSTRAINT "votedIdea_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "votedComment" ADD CONSTRAINT "votedComment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
