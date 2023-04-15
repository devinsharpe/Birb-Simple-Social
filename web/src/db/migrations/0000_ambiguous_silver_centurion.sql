-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migraitons
/*
CREATE TABLE `Account` (
	`id` varchar(191) PRIMARY KEY NOT NULL,
	`userId` varchar(191) NOT NULL,
	`type` varchar(191) NOT NULL,
	`provider` varchar(191) NOT NULL,
	`providerAccountId` varchar(191) NOT NULL,
	`refresh_token` text,
	`access_token` text,
	`expires_at` int,
	`token_type` varchar(191),
	`scope` varchar(191),
	`id_token` text,
	`session_state` varchar(191)
);

CREATE TABLE `Comment` (
	`id` varchar(191) PRIMARY KEY NOT NULL,
	`postId` varchar(191) NOT NULL,
	`profileId` varchar(191) NOT NULL,
	`text` varchar(191) NOT NULL,
	`reviewStatus` enum('PROCESSING','APPROVED','APPEALED','REJECTED_AUTO','REJECTED_MANUAL') NOT NULL DEFAULT 'PROCESSING',
	`visibility` enum('ACTIVE','ARCHIVED') NOT NULL DEFAULT 'ACTIVE',
	`likeCount` int NOT NULL DEFAULT 0,
	`commentId` varchar(191),
	`autoReviewedAt` datetime(3),
	`manualReviewedAt` datetime(3),
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL
);

CREATE TABLE `CommentLike` (
	`id` varchar(191) PRIMARY KEY NOT NULL,
	`commentId` varchar(191) NOT NULL,
	`profileId` varchar(191) NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL
);

CREATE TABLE `Post` (
	`id` varchar(191) PRIMARY KEY NOT NULL,
	`text` varchar(300) NOT NULL,
	`location` varchar(32) NOT NULL,
	`reviewStatus` enum('PROCESSING','APPROVED','APPEALED','REJECTED_AUTO','REJECTED_MANUAL') NOT NULL DEFAULT 'PROCESSING',
	`visibility` enum('ACTIVE','ARCHIVED') NOT NULL DEFAULT 'ACTIVE',
	`likeCount` int NOT NULL DEFAULT 0,
	`commentCount` int NOT NULL DEFAULT 0,
	`reactionCount` int NOT NULL DEFAULT 0,
	`updateCount` int NOT NULL DEFAULT 0,
	`type` enum('IMAGE','TEXT') NOT NULL DEFAULT 'TEXT',
	`profileId` varchar(191) NOT NULL,
	`autoReviewedAt` datetime(3),
	`manualReviewedAt` datetime(3),
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL
);

CREATE TABLE `PostMention` (
	`id` varchar(191) PRIMARY KEY NOT NULL,
	`postId` varchar(191) NOT NULL,
	`profileId` varchar(191) NOT NULL
);

CREATE TABLE `PostReaction` (
	`id` varchar(191) PRIMARY KEY NOT NULL,
	`reaction` enum('DOWNCAST','FIRE','HEART','HEART_EYES','JOY','PINCHED_FINGERS','SKULL','SMILE','THUMBS_UP','WEEPING') NOT NULL,
	`image` varchar(191) NOT NULL,
	`postId` varchar(191) NOT NULL,
	`profileId` varchar(191) NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3))
);

CREATE TABLE `Profile` (
	`id` varchar(191) PRIMARY KEY NOT NULL,
	`name` varchar(191) NOT NULL,
	`handle` varchar(191) NOT NULL,
	`normalizedHandle` varchar(191) NOT NULL,
	`biography` varchar(191),
	`location` varchar(191),
	`website` varchar(191),
	`avatarUrl` varchar(191) DEFAULT 'https://source.unsplash.com/random/600×600/?cat',
	`headerUrl` varchar(191) DEFAULT 'https://source.unsplash.com/random/1920×1080/?cat',
	`birthdate` varchar(191),
	`followerCount` int NOT NULL DEFAULT 0,
	`followingCount` int NOT NULL DEFAULT 0,
	`postCount` int NOT NULL DEFAULT 0,
	`canChangeHandle` tinyint NOT NULL DEFAULT 1
);

CREATE TABLE `ProfileReaction` (
	`id` varchar(191) PRIMARY KEY NOT NULL,
	`reaction` enum('DOWNCAST','FIRE','HEART','HEART_EYES','JOY','PINCHED_FINGERS','SKULL','SMILE','THUMBS_UP','WEEPING') NOT NULL,
	`image` varchar(191) NOT NULL,
	`status` enum('ACTIVE','ARCHIVED') NOT NULL DEFAULT 'ACTIVE',
	`profileId` varchar(191) NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3))
);

CREATE TABLE `ProfileRelationship` (
	`id` varchar(191) PRIMARY KEY NOT NULL,
	`type` enum('FOLLOW','BLOCK') NOT NULL DEFAULT 'FOLLOW',
	`followerId` varchar(191) NOT NULL,
	`followingId` varchar(191) NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`requestedAt` datetime(3) NOT NULL
);

CREATE TABLE `ProfileSettings` (
	`id` varchar(191) PRIMARY KEY NOT NULL,
	`reaction` enum('DOWNCAST','FIRE','HEART','HEART_EYES','JOY','PINCHED_FINGERS','SKULL','SMILE','THUMBS_UP','WEEPING') NOT NULL DEFAULT 'SMILE',
	`catMode` tinyint NOT NULL DEFAULT 0,
	`theme` enum('AUTO','LIGHT','DARK') NOT NULL DEFAULT 'AUTO',
	`relativeTimestamps` tinyint NOT NULL DEFAULT 1
);

CREATE TABLE `RelationshipRequest` (
	`id` varchar(191) PRIMARY KEY NOT NULL,
	`status` enum('PENDING','ACCEPTED','CANCELLED','DENIED','REMOVED','FORCE_REMOVED') NOT NULL DEFAULT 'PENDING',
	`followerId` varchar(191) NOT NULL,
	`followingId` varchar(191) NOT NULL,
	`createdAt` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`updatedAt` datetime(3) NOT NULL
);

CREATE TABLE `Session` (
	`id` varchar(191) PRIMARY KEY NOT NULL,
	`sessionToken` varchar(191) NOT NULL,
	`userId` varchar(191) NOT NULL,
	`expires` datetime(3) NOT NULL
);

CREATE TABLE `User` (
	`id` varchar(191) PRIMARY KEY NOT NULL,
	`name` varchar(191),
	`email` varchar(191),
	`emailVerified` datetime(3),
	`image` varchar(191)
);

CREATE TABLE `VerificationToken` (
	`identifier` varchar(191) NOT NULL,
	`token` varchar(191) PRIMARY KEY NOT NULL,
	`expires` datetime(3) NOT NULL
);

CREATE TABLE `_prisma_migrations` (
	`id` varchar(36) PRIMARY KEY NOT NULL,
	`checksum` varchar(64) NOT NULL,
	`finished_at` datetime(3),
	`migration_name` varchar(255) NOT NULL,
	`logs` text,
	`rolled_back_at` datetime(3),
	`started_at` datetime(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP(3)),
	`applied_steps_count` int unsigned NOT NULL DEFAULT 0
);

CREATE UNIQUE INDEX `Account_provider_providerAccountId_key` ON `Account` (`provider`,`providerAccountId`);
CREATE INDEX `Account_userId_idx` ON `Account` (`userId`);
CREATE INDEX `Comment_commentId_idx` ON `Comment` (`commentId`);
CREATE INDEX `Comment_postId_idx` ON `Comment` (`postId`);
CREATE INDEX `Comment_profileId_idx` ON `Comment` (`profileId`);
CREATE INDEX `CommentLike_commentId_idx` ON `CommentLike` (`commentId`);
CREATE INDEX `CommentLike_profileId_idx` ON `CommentLike` (`profileId`);
CREATE INDEX `Post_profileId_idx` ON `Post` (`profileId`);
CREATE INDEX `PostMention_postId_idx` ON `PostMention` (`postId`);
CREATE INDEX `PostMention_profileId_idx` ON `PostMention` (`profileId`);
CREATE INDEX `PostReaction_postId_idx` ON `PostReaction` (`postId`);
CREATE INDEX `PostReaction_profileId_idx` ON `PostReaction` (`profileId`);
CREATE INDEX `Profile_id_idx` ON `Profile` (`id`);
CREATE INDEX `Profile_name_handle_idx` ON `Profile` (`name`,`handle`);
CREATE UNIQUE INDEX `Profile_normalizedHandle_key` ON `Profile` (`normalizedHandle`);
CREATE INDEX `ProfileReaction_profileId_idx` ON `ProfileReaction` (`profileId`);
CREATE INDEX `ProfileRelationship_followerId_idx` ON `ProfileRelationship` (`followerId`);
CREATE INDEX `ProfileRelationship_followingId_idx` ON `ProfileRelationship` (`followingId`);
CREATE INDEX `RelationshipRequest_followerId_idx` ON `RelationshipRequest` (`followerId`);
CREATE INDEX `RelationshipRequest_followingId_idx` ON `RelationshipRequest` (`followingId`);
CREATE UNIQUE INDEX `Session_sessionToken_key` ON `Session` (`sessionToken`);
CREATE INDEX `Session_userId_idx` ON `Session` (`userId`);
CREATE UNIQUE INDEX `User_email_key` ON `User` (`email`);
CREATE UNIQUE INDEX `VerificationToken_identifier_token_key` ON `VerificationToken` (`identifier`,`token`);
CREATE UNIQUE INDEX `VerificationToken_token_key` ON `VerificationToken` (`token`);
*/