/*
  Warnings:

  - Added the required column `image` to the `PostReaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PostReaction" ADD COLUMN     "image" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ProfileReaction" (
    "id" TEXT NOT NULL,
    "reaction" "Reaction" NOT NULL,
    "image" TEXT NOT NULL,
    "status" "Visibility" NOT NULL DEFAULT 'ACTIVE',
    "profileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProfileReaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProfileReaction" ADD CONSTRAINT "ProfileReaction_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
