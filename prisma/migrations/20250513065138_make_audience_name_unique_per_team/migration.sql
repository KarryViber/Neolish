/*
  Warnings:

  - A unique constraint covering the columns `[name,teamId]` on the table `Audience` will be added. If there are existing duplicate values, this will fail.
  - Made the column `teamId` on table `Audience` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Audience" DROP CONSTRAINT "Audience_teamId_fkey";

-- DropIndex
DROP INDEX "Audience_name_key";

-- AlterTable
ALTER TABLE "Audience" ALTER COLUMN "teamId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Audience_name_teamId_key" ON "Audience"("name", "teamId");

-- AddForeignKey
ALTER TABLE "Audience" ADD CONSTRAINT "Audience_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
