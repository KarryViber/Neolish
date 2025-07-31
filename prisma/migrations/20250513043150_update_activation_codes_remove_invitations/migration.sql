/*
  Warnings:

  - You are about to drop the `Invitation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `email` to the `ActivationCode` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamId` to the `ActivationCode` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Invitation" DROP CONSTRAINT "Invitation_invitedByUserId_fkey";

-- DropForeignKey
ALTER TABLE "Invitation" DROP CONSTRAINT "Invitation_teamId_fkey";

-- AlterTable
ALTER TABLE "ActivationCode" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "isUsed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "teamId" TEXT NOT NULL,
ADD COLUMN     "usedAt" TIMESTAMP(3);

-- DropTable
DROP TABLE "Invitation";

-- DropEnum
DROP TYPE "InvitationStatus";

-- CreateIndex
CREATE INDEX "ActivationCode_teamId_idx" ON "ActivationCode"("teamId");

-- CreateIndex
CREATE INDEX "ActivationCode_email_idx" ON "ActivationCode"("email");

-- CreateIndex
CREATE INDEX "ActivationCode_isUsed_idx" ON "ActivationCode"("isUsed");

-- AddForeignKey
ALTER TABLE "ActivationCode" ADD CONSTRAINT "ActivationCode_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
