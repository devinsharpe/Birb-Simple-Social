import { DEFAULT_AVATAR_URL, DEFAULT_HEADER_URL } from "./constants";
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
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import type { AnyPgColumn } from "drizzle-orm/pg-core";
import type { InferModel } from "drizzle-orm";
import { relations } from "drizzle-orm";
import { tsvector } from "../utils/vector";

const createdAtCol = timestamp("createdAt", {
  mode: "string",
  withTimezone: true,
})
  .defaultNow()
  .notNull();
const updatedAtCol = timestamp("updatedAt", {
  mode: "string",
  withTimezone: true,
})
  .defaultNow()
  .notNull();

const reactionEnum = pgEnum("reaction", ReactionValues);
const relationshipEnum = pgEnum("relationshipType", RelationshipTypeValues);
const reviewStatusEnum = pgEnum("reviewStatus", PostReviewStatusValues);
const requestStatusEnum = pgEnum("status", RequestStatusValues);
const postTypeEnum = pgEnum("postType", PostTypeValues);
const themeEnum = pgEnum("theme", ThemeValues);
const visibilityEnum = pgEnum("visibility", VisibilityValues);

export const enumSchema = {
  reaction: reactionEnum,
  relationship: relationshipEnum,
  reviewStatus: reviewStatusEnum,
  requestStatus: requestStatusEnum,
  postType: postTypeEnum,
  theme: themeEnum,
  visibility: visibilityEnum,
};

const idConfig = {
  length: 25,
};

// Comments
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
  autoReviewedAt: timestamp("autoReviewedAt", {
    mode: "string",
    withTimezone: true,
  }),
  manualReviewedAt: timestamp("manualReviewedAt", {
    mode: "string",
    withTimezone: true,
  }),
  createdAt: createdAtCol,
  updatedAt: updatedAtCol,
});
export const commentsRelations = relations(comments, ({ many, one }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  // children: many(comments),
  // parent: one(comments, {
  //   fields: [comments.commentId],
  //   references: [comments.id],
  // }),
  likes: many(commentLikes),
  postedBy: one(profiles, {
    fields: [comments.profileId],
    references: [profiles.id],
  }),
}));
export type Comment = InferModel<typeof comments, "select">;
export type NewComment = InferModel<typeof comments, "insert">;

// Comment Likes
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
export const commentLikesRelations = relations(commentLikes, ({ one }) => ({
  parents: one(comments, {
    fields: [commentLikes.commentId],
    references: [comments.id],
  }),
  likedBy: one(profiles, {
    fields: [commentLikes.profileId],
    references: [profiles.id],
  }),
}));
export type CommentLike = InferModel<typeof commentLikes, "select">;
export type NewCommentLike = InferModel<typeof commentLikes, "insert">;

// Posts
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
  autoReviewedAt: timestamp("autoReviewedAt", {
    mode: "string",
    withTimezone: true,
  }),
  manualReviewedAt: timestamp("manualReviewedAt", {
    mode: "string",
    withTimezone: true,
  }),
  createdAt: createdAtCol,
  updatedAt: updatedAtCol,
});
export const postsRelations = relations(posts, ({ many, one }) => ({
  postedBy: one(profiles, {
    fields: [posts.profileId],
    references: [profiles.id],
  }),
  comments: many(comments),
  reactions: many(postReactions),
  mentions: many(postMentions),
}));
export type Post = InferModel<typeof posts, "select">;
export type NewPost = InferModel<typeof posts, "insert">;

// Post Mentions
export const postMentions = pgTable("postMentions", {
  id: varchar("id", idConfig).primaryKey().notNull(),
  postId: varchar("postId", idConfig)
    .references(() => posts.id)
    .notNull(),
  profileId: varchar("profileId", idConfig)
    .references(() => profiles.id)
    .notNull(),
});
export const postMentionsRelations = relations(postMentions, ({ one }) => ({
  post: one(posts, {
    fields: [postMentions.postId],
    references: [posts.id],
  }),
  profile: one(profiles, {
    fields: [postMentions.profileId],
    references: [profiles.id],
  }),
}));
export type PostMention = InferModel<typeof postMentions, "select">;
export type NewPostMention = InferModel<typeof postMentions, "insert">;

// Post Reactions
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
export const postReactionsRelations = relations(postReactions, ({ one }) => ({
  post: one(posts, {
    fields: [postReactions.postId],
    references: [posts.id],
  }),
  postedBy: one(profiles, {
    fields: [postReactions.profileId],
    references: [profiles.id],
  }),
}));
export type PostReaction = InferModel<typeof postReactions, "select">;
export type NewPostReaction = InferModel<typeof postReactions, "insert">;

// Profiles
export const profiles = pgTable("profiles", {
  id: varchar("id", idConfig).primaryKey().notNull(),
  name: varchar("name", { length: 191 }).notNull(),
  handle: varchar("handle", { length: 191 }).notNull(),
  normalizedHandle: varchar("normalizedHandle", { length: 191 }).notNull(),
  biography: varchar("biography", { length: 191 }),
  location: varchar("location", { length: 191 }),
  website: varchar("website", { length: 191 }),
  avatarUrl: varchar("avatarUrl", { length: 191 })
    .default(DEFAULT_AVATAR_URL)
    .notNull(),
  headerUrl: varchar("headerUrl", { length: 191 })
    .default(DEFAULT_HEADER_URL)
    .notNull(),
  birthdate: varchar("birthdate", { length: 191 }),
  followerCount: integer("followerCount").default(0).notNull(),
  followingCount: integer("followingCount").default(0).notNull(),
  postCount: integer("postCount").default(0).notNull(),
  canChangeHandle: boolean("canChangeHandle").default(true).notNull(),
  searchVector: tsvector("search", {
    sources: ["name", "handle"],
    weighted: true,
  }),
});
export const profileRelations = relations(profiles, ({ one, many }) => ({
  comments: many(comments),
  commentLikes: many(commentLikes),
  posts: many(posts),
  mentions: many(postMentions),
  reactions: many(postReactions),
  savedReactions: many(profileReactions),
  relationships: many(profileRelationships),
  settings: one(profileSettings, {
    fields: [profiles.id],
    references: [profileSettings.id],
  }),
  requests: many(relationshipRequests),
}));
export type Profile = InferModel<typeof profiles, "select">;
export type NewProfile = InferModel<typeof profiles, "insert">;

// Profile Reactions
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
export const profileReactionsRelations = relations(
  profileReactions,
  ({ one }) => ({
    profile: one(profiles, {
      fields: [profileReactions.profileId],
      references: [profiles.id],
    }),
  })
);
export type ProfileReaction = InferModel<typeof profileReactions, "select">;
export type NewProfileReaction = InferModel<typeof profileReactions, "insert">;

// Profile Relationships
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
  requestedAt: timestamp("requestedAt", {
    mode: "string",
    withTimezone: true,
  }).notNull(),
});
export const profileRelationshipsRelations = relations(
  profileRelationships,
  ({ one }) => ({
    follower: one(profiles, {
      fields: [profileRelationships.followerId],
      references: [profiles.id],
    }),
    following: one(profiles, {
      fields: [profileRelationships.followingId],
      references: [profiles.id],
    }),
  })
);
export type ProfileRelationship = InferModel<
  typeof profileRelationships,
  "select"
>;
export type NewProfileRelationship = InferModel<
  typeof profileRelationships,
  "insert"
>;

// Profile Settings
export const profileSettings = pgTable("profileSettings", {
  id: varchar("id", idConfig).primaryKey().notNull(),
  reaction: reactionEnum("reaction").default(Reaction.Smile).notNull(),
  catMode: boolean("catMode").default(false).notNull(),
  theme: themeEnum("theme").default(Theme.Auto).notNull(),
  relativeTimestamps: boolean("relativeTimestamps").default(true).notNull(),
});
export const profileSettingsRelations = relations(
  profileSettings,
  ({ one }) => ({
    profile: one(profiles, {
      fields: [profileSettings.id],
      references: [profiles.id],
    }),
  })
);
export type ProfileSetting = InferModel<typeof profileSettings, "select">;
export type NewProfileSetting = InferModel<typeof profileSettings, "insert">;

// Relationship Requests
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
export const relationshipRequestsRelations = relations(
  relationshipRequests,
  ({ one }) => ({
    follower: one(profiles, {
      fields: [relationshipRequests.followerId],
      references: [profiles.id],
    }),
    following: one(profiles, {
      fields: [relationshipRequests.followingId],
      references: [profiles.id],
    }),
  })
);
export type RelationshipRequest = InferModel<
  typeof relationshipRequests,
  "select"
>;
export type NewRelationshipRequest = InferModel<
  typeof relationshipRequests,
  "insert"
>;

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

export const relationSchema = {
  commentsRelations,
  commentLikesRelations,
  postsRelations,
  postMentionsRelations,
  postReactionsRelations,
  profileRelations,
  profileReactionsRelations,
  profileRelationshipsRelations,
  profileSettingsRelations,
  relationshipRequestsRelations,
};

export default appSchema;
