-- CreateEnum
CREATE TYPE "THEME" AS ENUM ('AUTO', 'LIGHT', 'DARK');

-- CreateTable
CREATE TABLE "ProfileSettings" (
    "id" TEXT NOT NULL,
    "reaction" "Reaction" NOT NULL DEFAULT 'SMILE',
    "catMode" BOOLEAN NOT NULL DEFAULT false,
    "theme" "THEME" NOT NULL DEFAULT 'AUTO',
    "relativeTimestamps" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "ProfileSettings_pkey" PRIMARY KEY ("id")
);
