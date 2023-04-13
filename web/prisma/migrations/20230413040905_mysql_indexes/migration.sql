-- DropForeignKey
ALTER TABLE `Account` DROP FOREIGN KEY `Account_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_commentId_fkey`;

-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_postId_fkey`;

-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_profileId_fkey`;

-- DropForeignKey
ALTER TABLE `CommentLike` DROP FOREIGN KEY `CommentLike_commentId_fkey`;

-- DropForeignKey
ALTER TABLE `CommentLike` DROP FOREIGN KEY `CommentLike_profileId_fkey`;

-- DropForeignKey
ALTER TABLE `Post` DROP FOREIGN KEY `Post_profileId_fkey`;

-- DropForeignKey
ALTER TABLE `PostMention` DROP FOREIGN KEY `PostMention_postId_fkey`;

-- DropForeignKey
ALTER TABLE `PostMention` DROP FOREIGN KEY `PostMention_profileId_fkey`;

-- DropForeignKey
ALTER TABLE `PostReaction` DROP FOREIGN KEY `PostReaction_postId_fkey`;

-- DropForeignKey
ALTER TABLE `PostReaction` DROP FOREIGN KEY `PostReaction_profileId_fkey`;

-- DropForeignKey
ALTER TABLE `Profile` DROP FOREIGN KEY `Profile_id_fkey`;

-- DropForeignKey
ALTER TABLE `ProfileReaction` DROP FOREIGN KEY `ProfileReaction_profileId_fkey`;

-- DropForeignKey
ALTER TABLE `ProfileRelationship` DROP FOREIGN KEY `ProfileRelationship_followerId_fkey`;

-- DropForeignKey
ALTER TABLE `ProfileRelationship` DROP FOREIGN KEY `ProfileRelationship_followingId_fkey`;

-- DropForeignKey
ALTER TABLE `RelationshipRequest` DROP FOREIGN KEY `RelationshipRequest_followerId_fkey`;

-- DropForeignKey
ALTER TABLE `RelationshipRequest` DROP FOREIGN KEY `RelationshipRequest_followingId_fkey`;

-- DropForeignKey
ALTER TABLE `Session` DROP FOREIGN KEY `Session_userId_fkey`;

-- CreateIndex
CREATE INDEX `Profile_id_idx` ON `Profile`(`id`);

-- RenameIndex
ALTER TABLE `Account` RENAME INDEX `Account_userId_fkey` TO `Account_userId_idx`;

-- RenameIndex
ALTER TABLE `Comment` RENAME INDEX `Comment_commentId_fkey` TO `Comment_commentId_idx`;

-- RenameIndex
ALTER TABLE `Comment` RENAME INDEX `Comment_postId_fkey` TO `Comment_postId_idx`;

-- RenameIndex
ALTER TABLE `Comment` RENAME INDEX `Comment_profileId_fkey` TO `Comment_profileId_idx`;

-- RenameIndex
ALTER TABLE `CommentLike` RENAME INDEX `CommentLike_commentId_fkey` TO `CommentLike_commentId_idx`;

-- RenameIndex
ALTER TABLE `CommentLike` RENAME INDEX `CommentLike_profileId_fkey` TO `CommentLike_profileId_idx`;

-- RenameIndex
ALTER TABLE `Post` RENAME INDEX `Post_profileId_fkey` TO `Post_profileId_idx`;

-- RenameIndex
ALTER TABLE `PostMention` RENAME INDEX `PostMention_postId_fkey` TO `PostMention_postId_idx`;

-- RenameIndex
ALTER TABLE `PostMention` RENAME INDEX `PostMention_profileId_fkey` TO `PostMention_profileId_idx`;

-- RenameIndex
ALTER TABLE `PostReaction` RENAME INDEX `PostReaction_postId_fkey` TO `PostReaction_postId_idx`;

-- RenameIndex
ALTER TABLE `PostReaction` RENAME INDEX `PostReaction_profileId_fkey` TO `PostReaction_profileId_idx`;

-- RenameIndex
ALTER TABLE `ProfileReaction` RENAME INDEX `ProfileReaction_profileId_fkey` TO `ProfileReaction_profileId_idx`;

-- RenameIndex
ALTER TABLE `ProfileRelationship` RENAME INDEX `ProfileRelationship_followerId_fkey` TO `ProfileRelationship_followerId_idx`;

-- RenameIndex
ALTER TABLE `ProfileRelationship` RENAME INDEX `ProfileRelationship_followingId_fkey` TO `ProfileRelationship_followingId_idx`;

-- RenameIndex
ALTER TABLE `RelationshipRequest` RENAME INDEX `RelationshipRequest_followerId_fkey` TO `RelationshipRequest_followerId_idx`;

-- RenameIndex
ALTER TABLE `RelationshipRequest` RENAME INDEX `RelationshipRequest_followingId_fkey` TO `RelationshipRequest_followingId_idx`;

-- RenameIndex
ALTER TABLE `Session` RENAME INDEX `Session_userId_fkey` TO `Session_userId_idx`;
