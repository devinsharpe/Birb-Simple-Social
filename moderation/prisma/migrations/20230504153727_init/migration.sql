-- CreateEnum
CREATE TYPE "ResultType" AS ENUM ('COMMENT', 'FORM', 'POST');

-- CreateEnum
CREATE TYPE "ProbabilityLabel" AS ENUM ('indentity_attack', 'insult', 'obscene', 'severe_toxicity', 'sexual_explicit', 'threat', 'toxicity');

-- CreateEnum
CREATE TYPE "QueueStatus" AS ENUM ('PENDING', 'CANCELLED', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "Result" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "type" "ResultType" NOT NULL DEFAULT 'FORM',
    "threshold" INTEGER NOT NULL,
    "hasMatch" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Probability" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "match" BOOLEAN NOT NULL,
    "confidence" DECIMAL(65,30) NOT NULL,
    "resultId" TEXT NOT NULL,

    CONSTRAINT "Probability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QueueItem" (
    "id" TEXT NOT NULL,
    "type" "ResultType" NOT NULL,
    "text" TEXT NOT NULL,
    "status" "QueueStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QueueItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Probability" ADD CONSTRAINT "Probability_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "Result"("id") ON DELETE CASCADE ON UPDATE CASCADE;
