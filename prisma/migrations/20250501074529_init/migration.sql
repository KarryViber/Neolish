-- CreateTable
CREATE TABLE "StyleProfile" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "authorInfo" JSONB,
    "styleFeatures" JSONB,
    "sampleText" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StyleProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Audience" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Audience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Outline" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "keyPoints" TEXT[],
    "outlineText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "styleProfileId" TEXT,

    CONSTRAINT "Outline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutlineAudience" (
    "outlineId" TEXT NOT NULL,
    "audienceId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OutlineAudience_pkey" PRIMARY KEY ("outlineId","audienceId")
);

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "structuredContent" JSONB,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "writingPurpose" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "outlineId" TEXT NOT NULL,
    "styleProfileId" TEXT NOT NULL,
    "targetAudienceIds" TEXT[],

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StyleProfile_name_key" ON "StyleProfile"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Audience_name_key" ON "Audience"("name");

-- AddForeignKey
ALTER TABLE "Outline" ADD CONSTRAINT "Outline_styleProfileId_fkey" FOREIGN KEY ("styleProfileId") REFERENCES "StyleProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutlineAudience" ADD CONSTRAINT "OutlineAudience_outlineId_fkey" FOREIGN KEY ("outlineId") REFERENCES "Outline"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OutlineAudience" ADD CONSTRAINT "OutlineAudience_audienceId_fkey" FOREIGN KEY ("audienceId") REFERENCES "Audience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_outlineId_fkey" FOREIGN KEY ("outlineId") REFERENCES "Outline"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_styleProfileId_fkey" FOREIGN KEY ("styleProfileId") REFERENCES "StyleProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
