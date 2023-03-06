/*
  Warnings:

  - You are about to drop the column `photoAvailable` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `textAvailable` on the `Profile` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PostReviewStatus" AS ENUM ('PROCESSING', 'APPROVED', 'APPEALED', 'REJECTED_AUTO', 'REJECTED_MANUAL');

-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('IMAGE', 'TEXT');

-- CreateEnum
CREATE TYPE "Reaction" AS ENUM ('DOWNCAST', 'FIRE', 'HEART_EYES', 'JOY', 'PINCHED_FINGERS', 'SMILE', 'THUMBS_UP');

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "photoAvailable",
DROP COLUMN "textAvailable";

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "text" VARCHAR(300) NOT NULL,
    "location" VARCHAR(32) NOT NULL,
    "reviewStatus" "PostReviewStatus" NOT NULL DEFAULT 'PROCESSING',
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "commentCount" INTEGER NOT NULL DEFAULT 0,
    "updateCount" INTEGER NOT NULL DEFAULT 0,
    "type" "PostType" NOT NULL DEFAULT 'TEXT',
    "profileId" TEXT NOT NULL,
    "autoReviewedAt" TIMESTAMP(3),
    "manualReviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostMention" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,

    CONSTRAINT "PostMention_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostReaction" (
    "id" TEXT NOT NULL,
    "reaction" "Reaction" NOT NULL,
    "postId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PostReaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostMention" ADD CONSTRAINT "PostMention_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostMention" ADD CONSTRAINT "PostMention_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostReaction" ADD CONSTRAINT "PostReaction_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostReaction" ADD CONSTRAINT "PostReaction_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
