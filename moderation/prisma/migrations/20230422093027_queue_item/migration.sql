-- CreateTable
CREATE TABLE `QueueItem` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('COMMENT', 'FORM', 'POST') NOT NULL,
    `text` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'CANCELLED', 'COMPLETED', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Probability_resultId_idx` ON `Probability`(`resultId`);
