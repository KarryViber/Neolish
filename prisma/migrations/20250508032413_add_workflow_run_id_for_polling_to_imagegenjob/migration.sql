-- AlterTable
ALTER TABLE "ImageGenerationJob" ADD COLUMN     "workflowRunIdForPolling" TEXT;

-- AddForeignKey
ALTER TABLE "ImageGenerationJob" ADD CONSTRAINT "ImageGenerationJob_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
