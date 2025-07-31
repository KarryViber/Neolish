/*
  Warnings:

  - A unique constraint covering the columns `[title,teamId]` on the table `Article` will be added. If there are existing duplicate values, this will fail.
  - Made the column `teamId` on table `Article` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_teamId_fkey";

-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "teamId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Article_title_teamId_key" ON "Article"("title", "teamId");

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
