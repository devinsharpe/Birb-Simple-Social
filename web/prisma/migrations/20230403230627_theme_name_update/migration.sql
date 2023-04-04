/*
  Warnings:

  - The `theme` column on the `ProfileSettings` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('AUTO', 'LIGHT', 'DARK');

-- AlterTable
ALTER TABLE "ProfileSettings" DROP COLUMN "theme",
ADD COLUMN     "theme" "Theme" NOT NULL DEFAULT 'AUTO';

-- DropEnum
DROP TYPE "THEME";
