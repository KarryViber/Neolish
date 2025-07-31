/*
  Warnings:

  - You are about to drop the column `difyWorkflowId` on the `ImageGenerationJob` table. All the data in the column will be lost.
  - You are about to drop the column `taskIdForPolling` on the `ImageGenerationJob` table. All the data in the column will be lost.
  - You are about to drop the column `workflowRunIdForPolling` on the `ImageGenerationJob` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ImageGenerationJob" DROP COLUMN "difyWorkflowId",
DROP COLUMN "taskIdForPolling",
DROP COLUMN "workflowRunIdForPolling",
ADD COLUMN     "difyTaskId" TEXT,
ADD COLUMN     "difyWorkflowRunId" TEXT,
ADD COLUMN     "imageBase64" TEXT,
ADD COLUMN     "originalDifyImageUrl" TEXT;
