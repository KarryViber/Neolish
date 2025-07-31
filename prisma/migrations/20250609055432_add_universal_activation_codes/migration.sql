-- AlterTable
ALTER TABLE "ActivationCode" ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'TEAM',
ALTER COLUMN "teamId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT;
