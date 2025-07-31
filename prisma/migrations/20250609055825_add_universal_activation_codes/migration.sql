/*
  Warnings:

  - You are about to drop the column `type` on the `ActivationCode` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ActivationCode" DROP COLUMN "type",
ADD COLUMN     "isUniversal" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "ActivationCode_isUniversal_idx" ON "ActivationCode"("isUniversal");
