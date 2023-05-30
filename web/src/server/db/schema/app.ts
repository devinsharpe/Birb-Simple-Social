import type { AnyPgColumn } from "drizzle-orm/pg-core";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import {
  PostReviewStatus,
  PostReviewStatusValues,
  PostType,
  PostTypeValues,
  Reaction,
  ReactionValues,
  RelationshipType,
  RelationshipTypeValues,
  RequestStatus,
  RequestStatusValues,
  Theme,
  ThemeValues,
  Visibility,
  VisibilityValues,
} from "./enums";
import { relations } from "drizzle-orm";

const createdAtCol = timestamp("createdAt", { mode: "date" }).defaultNow();
const updatedAtCol = timestamp("updatedAt", { mode: "date" }).defaultNow();

const reactionEnum = pgEnum("reaction", ReactionValues);
const relationshipEnum = pgEnum("relationshipType", RelationshipTypeValues);
const reviewStatusEnum = pgEnum("reviewStatus", PostReviewStatusValues);
const requestStatusEnum = pgEnum("status", RequestStatusValues);
const postTypeEnum = pgEnum("postType", PostTypeValues);
const themeEnum = pgEnum("theme", ThemeValues);
const visibilityEnum = pgEnum("visibility", VisibilityValues);

const idConfig = {
  length: 25,
};

export const comments = pgTable("comments", {
  id: varchar("id", idConfig).primaryKey().notNull(),
  postId: varchar("postId", idConfig)
    .references(() => posts.id)
    .notNull(),
  profileId: varchar("profileId", idConfig)
    .references(() => profiles.id)
    .notNull(),
  text: varchar("text", { length: 191 }).notNull(),
  reviewStatus: reviewStatusEnum("reviewStatus")
    .default(PostReviewStatus.Processing)
    .notNull(),
  visibility: visibilityEnum("visibility").default(Visibility.Active).notNull(),
  likeCount: integer("likeCount").default(0).notNull(),
  commentId: varchar("commentId", idConfig).references(
    (): AnyPgColumn => comments.id
  ),
  autoReviewedAt: timestamp("autoReviewedAt", { mode: "date" }),
  manualReviewedAt: timestamp("manualReviewedAt", { mode: "date" }),
  createdAt: createdAtCol,
  updatedAt: updatedAtCol,
});

export const commentsRelations = relations(comments, ({ many, one }) => ({
  children: many(comments),
  likes: many(commentLikes),
  postedBy: one(profiles, {
    fields: [comments.profileId],
    references: [profiles.id],
  }),
}));

export const commentLikes = pgTable("commentLikes", {
  id: varchar("id", idConfig).primaryKey().notNull(),
  commentId: varchar("commentId", idConfig)
    .references(() => comments.id)
    .notNull(),
  profileId: varchar("profileId", idConfig)
    .references(() => profiles.id)
    .notNull(),
  createdAt: createdAtCol,
  updatedAt: updatedAtCol,
});

export const commentLikesRelations = relations(commentLikes, ({ one }) => ({}));

export const posts = pgTable("posts", {
  id: varchar("id", idConfig).primaryKey().notNull(),
  type: postTypeEnum("type").default(PostType.Text).notNull(),
  text: varchar("text", { length: 300 }).notNull(),
  image: varchar("image", { length: 191 }).default("").notNull(),
  alt: varchar("alt", { length: 500 }).default("").notNull(),
  location: varchar("location", idConfig).notNull(),
  reviewStatus: reviewStatusEnum("reviewStatus")
    .default(PostReviewStatus.Processing)
    .notNull(),
  visibility: visibilityEnum("visibility").default(Visibility.Active).notNull(),
  likeCount: integer("likeCount").default(0).notNull(),
  commentCount: integer("commentCount").default(0).notNull(),
  reactionCount: integer("reactionCount").default(0).notNull(),
  updateCount: integer("updateCount").default(0).notNull(),
  profileId: varchar("profileId", idConfig)
    .references(() => profiles.id)
    .notNull(),
  autoReviewedAt: timestamp("autoReviewedAt", { mode: "date" }),
  manualReviewedAt: timestamp("manualReviewedAt", { mode: "date" }),
  createdAt: createdAtCol,
  updatedAt: updatedAtCol,
});

export const postMentions = pgTable("postMentions", {
  id: varchar("id", idConfig).primaryKey().notNull(),
  postId: varchar("postId", idConfig)
    .references(() => posts.id)
    .notNull(),
  profileId: varchar("profileId", idConfig)
    .references(() => profiles.id)
    .notNull(),
});

export const postReactions = pgTable("postReactions", {
  id: varchar("id", idConfig).primaryKey().notNull(),
  reaction: reactionEnum("reaction").notNull(),
  image: varchar("image", { length: 191 }).notNull(),
  postId: varchar("postId", idConfig)
    .references(() => posts.id)
    .notNull(),
  profileId: varchar("profileId", idConfig)
    .references(() => profiles.id)
    .notNull(),
  createdAt: createdAtCol,
});

export const profiles = pgTable("profiles", {
  id: varchar("id", idConfig).primaryKey().notNull(),
  name: varchar("name", { length: 191 }).notNull(),
  handle: varchar("handle", { length: 191 }).notNull(),
  normalizedHandle: varchar("normalizedHandle", { length: 191 }).notNull(),
  biography: varchar("biography", { length: 191 }),
  location: varchar("location", { length: 191 }),
  website: varchar("website", { length: 191 }),
  avatarUrl: varchar("avatarUrl", { length: 191 })
    .default("https://source.unsplash.com/random/600×600/?cat")
    .notNull(),
  headerUrl: varchar("headerUrl", { length: 191 })
    .default("https://source.unsplash.com/random/1920×1080/?cat")
    .notNull(),
  birthdate: varchar("birthdate", { length: 191 }),
  followerCount: integer("followerCount").default(0).notNull(),
  followingCount: integer("followingCount").default(0).notNull(),
  postCount: integer("postCount").default(0).notNull(),
  canChangeHandle: boolean("canChangeHandle").default(true).notNull(),
});

export const profileReactions = pgTable("profileReactions", {
  id: varchar("id", idConfig).primaryKey().notNull(),
  reaction: reactionEnum("reaction").notNull(),
  image: varchar("image", { length: 191 }).notNull(),
  status: visibilityEnum("status").default(Visibility.Active).notNull(),
  profileId: varchar("profileId", idConfig)
    .references(() => profiles.id)
    .notNull(),
  createdAt: createdAtCol,
});

export const profileRelationships = pgTable("profileRelationships", {
  id: varchar("id", idConfig).primaryKey().notNull(),
  type: relationshipEnum("type").default(RelationshipType.Follow).notNull(),
  followerId: varchar("followerId", idConfig)
    .references(() => profiles.id)
    .notNull(),
  followingId: varchar("followingId", idConfig)
    .references(() => profiles.id)
    .notNull(),
  createdAt: createdAtCol,
  requestedAt: timestamp("requestedAt", { mode: "date" }).notNull(),
});

export const profileSettings = pgTable("profileSettings", {
  id: varchar("id", idConfig).primaryKey().notNull(),
  reaction: reactionEnum("reaction").default(Reaction.Smile).notNull(),
  catMode: boolean("catMode").default(false).notNull(),
  theme: themeEnum("theme").default(Theme.Auto).notNull(),
  relativeTimestamps: boolean("relativeTimestamps").default(true).notNull(),
});

export const relationshipRequests = pgTable("relationshipRequests", {
  id: varchar("id", idConfig).primaryKey().notNull(),
  status: requestStatusEnum("status").default(RequestStatus.Pending).notNull(),
  followerId: varchar("followerId", idConfig)
    .references(() => profiles.id)
    .notNull(),
  followingId: varchar("followingId", idConfig)
    .references(() => profiles.id)
    .notNull(),
  createdAt: createdAtCol,
  updatedAt: updatedAtCol,
});

const appSchema = {
  comments,
  commentLikes,
  posts,
  postMentions,
  postReactions,
  profiles,
  profileReactions,
  profileRelationships,
  profileSettings,
  relationshipRequests,
};

export default appSchema;
