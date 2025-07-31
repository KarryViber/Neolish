-- CreateTable
CREATE TABLE "ImageGenerationJob" (
    "id" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "placeholderTag" TEXT NOT NULL,
    "articleId" TEXT,
    "status" TEXT NOT NULL,
    "difyWorkflowId" TEXT,
    "imageUrl" TEXT,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImageGenerationJob_pkey" PRIMARY KEY ("id")
);
