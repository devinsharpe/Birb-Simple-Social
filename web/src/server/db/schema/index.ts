import appSchema, { enumSchema, relationSchema } from "./app";

import authSchema from "./auth";

const schema = { ...authSchema, ...appSchema, ...relationSchema };

export default schema;

// Auth Schema
export const users = authSchema.users;
export const accounts = authSchema.accounts;
export const sessions = authSchema.sessions;
export const verificationTokens = authSchema.verificationTokens;

// App Enums
export const reactionEnum = enumSchema.reaction;
export const relationshipEnum = enumSchema.relationship;
export const reviewStatusEnum = enumSchema.reviewStatus;
export const requestStatusEnum = enumSchema.requestStatus;
export const postTypeEnum = enumSchema.postType;
export const themeEnum = enumSchema.theme;
export const visibilityEnum = enumSchema.visibility;

// App Schema
export const comments = appSchema.comments;
export const commentLikes = appSchema.commentLikes;
export const posts = appSchema.posts;
export const postMentions = appSchema.postMentions;
export const postReactions = appSchema.postReactions;
export const profiles = appSchema.profiles;
export const profileReactions = appSchema.profileReactions;
export const profileRelationships = appSchema.profileRelationships;
export const profileSettings = appSchema.profileSettings;
export const relationshipRequests = appSchema.relationshipRequests;
