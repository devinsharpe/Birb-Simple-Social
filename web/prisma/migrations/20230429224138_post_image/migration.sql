-- AlterTable
ALTER TABLE `Post` ADD COLUMN `alt` VARCHAR(128) NOT NULL DEFAULT '',
    ADD COLUMN `image` VARCHAR(191) NOT NULL DEFAULT '';
