/*
  Warnings:

  - Added the required column `updatedAt` to the `RelationshipRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "RequestStatus" ADD VALUE 'ACCEPTED';

-- AlterTable
ALTER TABLE "RelationshipRequest" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
