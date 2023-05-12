/*
  Warnings:

  - Made the column `avatarUrl` on table `Profile` required. This step will fail if there are existing NULL values in that column.
  - Made the column `headerUrl` on table `Profile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Profile` MODIFY `avatarUrl` VARCHAR(191) NOT NULL DEFAULT 'https://source.unsplash.com/random/600×600/?cat',
    MODIFY `headerUrl` VARCHAR(191) NOT NULL DEFAULT 'https://source.unsplash.com/random/1920×1080/?cat';
