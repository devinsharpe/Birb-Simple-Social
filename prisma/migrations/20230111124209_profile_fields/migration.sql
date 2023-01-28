/*
  Warnings:

  - The required column `id` was added to the `Profile` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- CreateEnum
CREATE TYPE "ProfileStatus" AS ENUM ('public', 'private');

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "status" "ProfileStatus" NOT NULL DEFAULT 'public',
ADD CONSTRAINT "Profile_pkey" PRIMARY KEY ("id");
