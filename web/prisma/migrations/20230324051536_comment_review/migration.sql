-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "autoReviewedAt" TIMESTAMP(3),
ADD COLUMN     "manualReviewedAt" TIMESTAMP(3),
ADD COLUMN     "reviewStatus" "PostReviewStatus" NOT NULL DEFAULT 'PROCESSING';
