/*
  Warnings:

  - You are about to drop the column `usedAt` on the `ActivationCode` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ActivationCode_email_idx";

-- DropIndex
DROP INDEX "ActivationCode_isUsed_idx";

-- DropIndex
DROP INDEX "ActivationCode_teamId_idx";

-- AlterTable
ALTER TABLE "ActivationCode" DROP COLUMN "usedAt";

-- CreateIndex
CREATE INDEX "ActivationCode_teamId_email_idx" ON "ActivationCode"("teamId", "email");
