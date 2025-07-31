/*
  Warnings:

  - You are about to drop the column `keyPoints` on the `Outline` table. All the data in the column will be lost.
  - You are about to drop the column `outlineText` on the `Outline` table. All the data in the column will be lost.
  - Added the required column `content` to the `Outline` table without a default value. This is not possible if the table is not empty.
  - Made the column `styleProfileId` on table `Outline` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Outline" DROP CONSTRAINT "Outline_styleProfileId_fkey";

-- AlterTable
ALTER TABLE "Outline" DROP COLUMN "keyPoints",
DROP COLUMN "outlineText",
ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "userKeyPoints" TEXT,
ALTER COLUMN "styleProfileId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Outline" ADD CONSTRAINT "Outline_styleProfileId_fkey" FOREIGN KEY ("styleProfileId") REFERENCES "StyleProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
