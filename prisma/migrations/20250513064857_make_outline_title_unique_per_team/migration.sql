/*
  Warnings:

  - A unique constraint covering the columns `[title,teamId]` on the table `Outline` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,teamId]` on the table `StyleProfile` will be added. If there are existing duplicate values, this will fail.
  - Made the column `teamId` on table `Outline` required. This step will fail if there are existing NULL values in that column.
  - Made the column `teamId` on table `StyleProfile` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Outline" DROP CONSTRAINT "Outline_teamId_fkey";

-- DropForeignKey
ALTER TABLE "StyleProfile" DROP CONSTRAINT "StyleProfile_teamId_fkey";

-- DropIndex
DROP INDEX "StyleProfile_name_key";

-- AlterTable
ALTER TABLE "Outline" ALTER COLUMN "teamId" SET NOT NULL;

-- AlterTable
ALTER TABLE "StyleProfile" ALTER COLUMN "teamId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Outline_title_teamId_key" ON "Outline"("title", "teamId");

-- CreateIndex
CREATE UNIQUE INDEX "StyleProfile_name_teamId_key" ON "StyleProfile"("name", "teamId");

-- AddForeignKey
ALTER TABLE "StyleProfile" ADD CONSTRAINT "StyleProfile_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Outline" ADD CONSTRAINT "Outline_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
