-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "lastPolledAt" TIMESTAMP(3),
ADD COLUMN     "pollAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "submittedToDifyAt" TIMESTAMP(3),
ADD COLUMN     "workflowRunId" TEXT;

-- CreateIndex
CREATE INDEX "Article_workflowRunId_idx" ON "Article"("workflowRunId");

-- CreateIndex
CREATE INDEX "Article_status_lastPolledAt_idx" ON "Article"("status", "lastPolledAt");
