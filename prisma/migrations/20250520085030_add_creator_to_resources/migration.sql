/*
  Warnings:

  - Added the required column `userId` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Audience` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `ImageGenerationJob` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Merchandise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Outline` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `StyleProfile` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Team_ownerId_idx";

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Audience" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ImageGenerationJob" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Merchandise" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Outline" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "StyleProfile" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Article_userId_idx" ON "Article"("userId");

-- CreateIndex
CREATE INDEX "Audience_userId_idx" ON "Audience"("userId");

-- CreateIndex
CREATE INDEX "ImageGenerationJob_userId_idx" ON "ImageGenerationJob"("userId");

-- CreateIndex
CREATE INDEX "Merchandise_userId_idx" ON "Merchandise"("userId");

-- CreateIndex
CREATE INDEX "Outline_userId_idx" ON "Outline"("userId");

-- CreateIndex
CREATE INDEX "StyleProfile_userId_idx" ON "StyleProfile"("userId");

-- AddForeignKey
ALTER TABLE "StyleProfile" ADD CONSTRAINT "StyleProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Audience" ADD CONSTRAINT "Audience_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Outline" ADD CONSTRAINT "Outline_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageGenerationJob" ADD CONSTRAINT "ImageGenerationJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Merchandise" ADD CONSTRAINT "Merchandise_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
