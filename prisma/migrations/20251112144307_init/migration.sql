-- CreateEnum
CREATE TYPE "ScraperType" AS ENUM ('WEBSITE', 'FACEBOOK_POST', 'FACEBOOK_GROUP', 'FACEBOOK_COMMENT', 'RAG_BROWSER');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'New Scraping Session',
    "type" "ScraperType" NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'PENDING',
    "parameters" JSONB NOT NULL,
    "results" JSONB,
    "resultCount" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);
