-- CreateEnum
CREATE TYPE "ResultType" AS ENUM ('COMMENT', 'FORM', 'POST');

-- AlterTable
ALTER TABLE "Result" ADD COLUMN     "type" "ResultType" NOT NULL DEFAULT 'FORM';
