-- CreateTable
CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` TEXT NULL,
    `access_token` TEXT NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` TEXT NULL,
    `session_state` VARCHAR(191) NULL,

    INDEX `Account_userId_idx`(`userId`),
    UNIQUE INDEX `Account_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Profile` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `handle` VARCHAR(191) NOT NULL,
    `normalizedHandle` VARCHAR(191) NOT NULL,
    `biography` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,
    `website` VARCHAR(191) NULL,
    `avatarUrl` VARCHAR(191) NULL DEFAULT 'https://source.unsplash.com/random/600×600/?cat',
    `headerUrl` VARCHAR(191) NULL DEFAULT 'https://source.unsplash.com/random/1920×1080/?cat',
    `birthdate` VARCHAR(191) NULL,
    `followerCount` INTEGER NOT NULL DEFAULT 0,
    `followingCount` INTEGER NOT NULL DEFAULT 0,
    `postCount` INTEGER NOT NULL DEFAULT 0,
    `canChangeHandle` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `Profile_normalizedHandle_key`(`normalizedHandle`),
    INDEX `Profile_id_idx`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RelationshipRequest` (
    `id` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'ACCEPTED', 'CANCELLED', 'DENIED', 'REMOVED', 'FORCE_REMOVED') NOT NULL DEFAULT 'PENDING',
    `followerId` VARCHAR(191) NOT NULL,
    `followingId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `RelationshipRequest_followerId_idx`(`followerId`),
    INDEX `RelationshipRequest_followingId_idx`(`followingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProfileRelationship` (
    `id` VARCHAR(191) NOT NULL,
    `type` ENUM('FOLLOW', 'BLOCK') NOT NULL DEFAULT 'FOLLOW',
    `followerId` VARCHAR(191) NOT NULL,
    `followingId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `requestedAt` DATETIME(3) NOT NULL,

    INDEX `ProfileRelationship_followerId_idx`(`followerId`),
    INDEX `ProfileRelationship_followingId_idx`(`followingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProfileSettings` (
    `id` VARCHAR(191) NOT NULL,
    `reaction` ENUM('DOWNCAST', 'FIRE', 'HEART', 'HEART_EYES', 'JOY', 'PINCHED_FINGERS', 'SKULL', 'SMILE', 'THUMBS_UP', 'WEEPING') NOT NULL DEFAULT 'SMILE',
    `catMode` BOOLEAN NOT NULL DEFAULT false,
    `theme` ENUM('AUTO', 'LIGHT', 'DARK') NOT NULL DEFAULT 'AUTO',
    `relativeTimestamps` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Post` (
    `id` VARCHAR(191) NOT NULL,
    `text` VARCHAR(300) NOT NULL,
    `location` VARCHAR(32) NOT NULL,
    `reviewStatus` ENUM('PROCESSING', 'APPROVED', 'APPEALED', 'REJECTED_AUTO', 'REJECTED_MANUAL') NOT NULL DEFAULT 'PROCESSING',
    `visibility` ENUM('ACTIVE', 'ARCHIVED') NOT NULL DEFAULT 'ACTIVE',
    `likeCount` INTEGER NOT NULL DEFAULT 0,
    `commentCount` INTEGER NOT NULL DEFAULT 0,
    `reactionCount` INTEGER NOT NULL DEFAULT 0,
    `updateCount` INTEGER NOT NULL DEFAULT 0,
    `type` ENUM('IMAGE', 'TEXT') NOT NULL DEFAULT 'TEXT',
    `profileId` VARCHAR(191) NOT NULL,
    `autoReviewedAt` DATETIME(3) NULL,
    `manualReviewedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Post_profileId_idx`(`profileId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PostMention` (
    `id` VARCHAR(191) NOT NULL,
    `postId` VARCHAR(191) NOT NULL,
    `profileId` VARCHAR(191) NOT NULL,

    INDEX `PostMention_postId_idx`(`postId`),
    INDEX `PostMention_profileId_idx`(`profileId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comment` (
    `id` VARCHAR(191) NOT NULL,
    `postId` VARCHAR(191) NOT NULL,
    `profileId` VARCHAR(191) NOT NULL,
    `text` VARCHAR(191) NOT NULL,
    `reviewStatus` ENUM('PROCESSING', 'APPROVED', 'APPEALED', 'REJECTED_AUTO', 'REJECTED_MANUAL') NOT NULL DEFAULT 'PROCESSING',
    `visibility` ENUM('ACTIVE', 'ARCHIVED') NOT NULL DEFAULT 'ACTIVE',
    `likeCount` INTEGER NOT NULL DEFAULT 0,
    `commentId` VARCHAR(191) NULL,
    `autoReviewedAt` DATETIME(3) NULL,
    `manualReviewedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `Comment_commentId_idx`(`commentId`),
    INDEX `Comment_postId_idx`(`postId`),
    INDEX `Comment_profileId_idx`(`profileId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CommentLike` (
    `id` VARCHAR(191) NOT NULL,
    `commentId` VARCHAR(191) NOT NULL,
    `profileId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `CommentLike_commentId_idx`(`commentId`),
    INDEX `CommentLike_profileId_idx`(`profileId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PostReaction` (
    `id` VARCHAR(191) NOT NULL,
    `reaction` ENUM('DOWNCAST', 'FIRE', 'HEART', 'HEART_EYES', 'JOY', 'PINCHED_FINGERS', 'SKULL', 'SMILE', 'THUMBS_UP', 'WEEPING') NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `postId` VARCHAR(191) NOT NULL,
    `profileId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `PostReaction_postId_idx`(`postId`),
    INDEX `PostReaction_profileId_idx`(`profileId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProfileReaction` (
    `id` VARCHAR(191) NOT NULL,
    `reaction` ENUM('DOWNCAST', 'FIRE', 'HEART', 'HEART_EYES', 'JOY', 'PINCHED_FINGERS', 'SKULL', 'SMILE', 'THUMBS_UP', 'WEEPING') NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'ARCHIVED') NOT NULL DEFAULT 'ACTIVE',
    `profileId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ProfileReaction_profileId_idx`(`profileId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Session_sessionToken_key`(`sessionToken`),
    INDEX `Session_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `emailVerified` DATETIME(3) NULL,
    `image` VARCHAR(191) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VerificationToken` (
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `VerificationToken_token_key`(`token`),
    UNIQUE INDEX `VerificationToken_identifier_token_key`(`identifier`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
