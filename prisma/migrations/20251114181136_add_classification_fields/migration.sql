-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "classificationEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "classificationResults" JSONB,
ADD COLUMN     "purpose" TEXT,
ADD COLUMN     "sourceType" TEXT,
ADD COLUMN     "tags" JSONB;
