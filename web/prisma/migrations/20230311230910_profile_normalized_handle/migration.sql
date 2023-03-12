/*
  Warnings:

  - A unique constraint covering the columns `[normalizedHandle]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `normalizedHandle` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Profile_handle_key";

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "normalizedHandle" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Profile_normalizedHandle_key" ON "Profile"("normalizedHandle");
