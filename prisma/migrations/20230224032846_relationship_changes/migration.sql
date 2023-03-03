/*
  Warnings:

  - You are about to drop the column `isPending` on the `ProfileRelationship` table. All the data in the column will be lost.
  - You are about to drop the column `profileId` on the `ProfileRelationship` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ProfileRelationship` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[followerId,followingId]` on the table `ProfileRelationship` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `followerId` to the `ProfileRelationship` table without a default value. This is not possible if the table is not empty.
  - Added the required column `followingId` to the `ProfileRelationship` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requestedAt` to the `ProfileRelationship` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'CANCELLED', 'DENIED');

-- CreateEnum
CREATE TYPE "RelationshipType" AS ENUM ('FOLLOW', 'BLOCK');

-- DropForeignKey
ALTER TABLE "ProfileRelationship" DROP CONSTRAINT "ProfileRelationship_profileId_fkey";

-- DropForeignKey
ALTER TABLE "ProfileRelationship" DROP CONSTRAINT "ProfileRelationship_userId_fkey";

-- DropIndex
DROP INDEX "ProfileRelationship_userId_profileId_key";

-- AlterTable
ALTER TABLE "ProfileRelationship" DROP COLUMN "isPending",
DROP COLUMN "profileId",
DROP COLUMN "userId",
ADD COLUMN     "followerId" TEXT NOT NULL,
ADD COLUMN     "followingId" TEXT NOT NULL,
ADD COLUMN     "requestedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "type" "RelationshipType" NOT NULL DEFAULT 'FOLLOW';

-- CreateTable
CREATE TABLE "RelationshipRequest" (
    "id" TEXT NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "followerId" TEXT NOT NULL,
    "followingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RelationshipRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfileRelationship_followerId_followingId_key" ON "ProfileRelationship"("followerId", "followingId");

-- AddForeignKey
ALTER TABLE "RelationshipRequest" ADD CONSTRAINT "RelationshipRequest_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelationshipRequest" ADD CONSTRAINT "RelationshipRequest_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileRelationship" ADD CONSTRAINT "ProfileRelationship_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileRelationship" ADD CONSTRAINT "ProfileRelationship_followingId_fkey" FOREIGN KEY ("followingId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
