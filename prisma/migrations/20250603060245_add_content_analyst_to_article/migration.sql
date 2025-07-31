/*
  Warnings:

  - You are about to drop the column `completedAt` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `lastPolledAt` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `pollAttempts` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `submittedToDifyAt` on the `Article` table. All the data in the column will be lost.
  - You are about to drop the column `workflowRunId` on the `Article` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Article_status_lastPolledAt_idx";

-- DropIndex
DROP INDEX "Article_workflowRunId_idx";

-- AlterTable
ALTER TABLE "Article" DROP COLUMN "completedAt",
DROP COLUMN "lastPolledAt",
DROP COLUMN "pollAttempts",
DROP COLUMN "submittedToDifyAt",
DROP COLUMN "workflowRunId",
ADD COLUMN     "contentAnalyst" TEXT;
