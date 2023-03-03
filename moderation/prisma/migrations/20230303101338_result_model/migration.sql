-- CreateEnum
CREATE TYPE "ProbabilityLabel" AS ENUM ('indentity_attack', 'insult', 'obscene', 'severe_toxicity', 'sexual_explicit', 'threat', 'toxicity');

-- CreateTable
CREATE TABLE "Result" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "threshold" INTEGER NOT NULL,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Probability" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "match" BOOLEAN NOT NULL,
    "confidence" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "Probability_pkey" PRIMARY KEY ("id")
);
