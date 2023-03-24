-- CreateEnum
CREATE TYPE "Visibility" AS ENUM ('ACTIVE', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "visibility" "Visibility" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "visibility" "Visibility" NOT NULL DEFAULT 'ACTIVE';
