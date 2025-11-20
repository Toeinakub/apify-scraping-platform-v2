-- AlterEnum
ALTER TYPE "SessionStatus" ADD VALUE 'PARTIAL_SUCCESS';

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "apifyRunId" TEXT,
ADD COLUMN     "errorDetails" JSONB,
ADD COLUMN     "errorType" TEXT;
