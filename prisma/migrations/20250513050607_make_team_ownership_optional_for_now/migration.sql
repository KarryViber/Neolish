-- AlterTable
ALTER TABLE "Audience" ADD COLUMN     "teamId" TEXT;

-- AlterTable
ALTER TABLE "Outline" ADD COLUMN     "teamId" TEXT;

-- AlterTable
ALTER TABLE "StyleProfile" ADD COLUMN     "teamId" TEXT;

-- CreateIndex
CREATE INDEX "Audience_teamId_idx" ON "Audience"("teamId");

-- CreateIndex
CREATE INDEX "Outline_teamId_idx" ON "Outline"("teamId");

-- CreateIndex
CREATE INDEX "StyleProfile_teamId_idx" ON "StyleProfile"("teamId");

-- AddForeignKey
ALTER TABLE "StyleProfile" ADD CONSTRAINT "StyleProfile_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Audience" ADD CONSTRAINT "Audience_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Outline" ADD CONSTRAINT "Outline_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;
