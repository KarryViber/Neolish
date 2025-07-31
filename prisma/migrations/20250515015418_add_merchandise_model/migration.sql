/*
  Warnings:

  - Made the column `teamId` on table `ImageGenerationJob` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ImageGenerationJob" DROP CONSTRAINT "ImageGenerationJob_teamId_fkey";

-- AlterTable
ALTER TABLE "ImageGenerationJob" ALTER COLUMN "teamId" SET NOT NULL;

-- CreateTable
CREATE TABLE "Merchandise" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "summary" TEXT,
    "source" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "tags" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "teamId" TEXT NOT NULL,

    CONSTRAINT "Merchandise_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Merchandise_name_teamId_key" ON "Merchandise"("name", "teamId");

-- AddForeignKey
ALTER TABLE "ImageGenerationJob" ADD CONSTRAINT "ImageGenerationJob_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Merchandise" ADD CONSTRAINT "Merchandise_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
