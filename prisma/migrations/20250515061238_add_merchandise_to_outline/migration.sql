-- AlterTable
ALTER TABLE "Outline" ADD COLUMN     "merchandiseId" TEXT;

-- CreateIndex
CREATE INDEX "Outline_merchandiseId_idx" ON "Outline"("merchandiseId");

-- AddForeignKey
ALTER TABLE "Outline" ADD CONSTRAINT "Outline_merchandiseId_fkey" FOREIGN KEY ("merchandiseId") REFERENCES "Merchandise"("id") ON DELETE SET NULL ON UPDATE CASCADE;
