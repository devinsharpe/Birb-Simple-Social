/*
  Warnings:

  - Added the required column `resultId` to the `Probability` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Probability" ADD COLUMN     "resultId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Probability" ADD CONSTRAINT "Probability_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "Result"("id") ON DELETE CASCADE ON UPDATE CASCADE;
