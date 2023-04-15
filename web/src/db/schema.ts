import {
  mysqlTable,
  uniqueIndex,
  index,
  varchar,
  text,
  int,
  mysqlEnum,
  datetime,
  tinyint,
  serial,
} from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm/sql";

function createEnumValues<T>(val: { [key: string]: string | number }) {
  return [...Object.values(val)] as unknown as readonly [T, ...T[]];
}

export enum POST_TYPE {
  Image = "IMAGE",
  Text = "TEXT",
}

export enum REACTION {
  Downcast = "DOWNCAST",
  Fire = "FIRE",
  Heart = "HEART",
  HeartEyes = "HEART_EYES",
  Joy = "JOY",
  PinchedFingers = "PINCHED_FINGERS",
  Skull = "SKULL",
  Smile = "SMILE",
  ThumbsUp = "THUMBS_UP",
  Weeping = "WEEPING",
}

export enum RELATIONSHIP_TYPE {
  Block = "Block",
  Follow = "FOLLOW",
}

export enum REQUEST_STATUS {
  Accepted = "ACCEPTED",
  Cancelled = "CANCELLED",
  Denied = "DENIED",
  Forced = "FORCED",
  Pending = "PENDING",
  Removed = "REMOVED",
}

export enum STATUS {
  Approved = "APPROVED",
  Appealed = "APPEALED",
  Processing = "PROCESSING",
  RejectedAuto = "REJECTED_AUTO",
  RejectedManual = "REJECTED_MANUAL",
}

export enum THEME {
  Auto = "AUTO",
  Dark = "DARK",
  Light = "LIGHT",
}

export enum VISIBILITY {
  Active = "ACTIVE",
  Archived = "ARCHIVED",
}

export const POST_TYPE_VALUES = createEnumValues<POST_TYPE>(POST_TYPE);
export const REACTION_VALUES = createEnumValues<REACTION>(REACTION);
export const RELATIONSHIP_TYPE_VALUES =
  createEnumValues<RELATIONSHIP_TYPE>(RELATIONSHIP_TYPE);
export const REQUEST_STATUS_VALUES =
  createEnumValues<REQUEST_STATUS>(REQUEST_STATUS);
export const STATUS_VALUES = createEnumValues<STATUS>(STATUS);
export const THEME_VALUES = createEnumValues<THEME>(THEME);
export const VISIBILITY_VALUES = createEnumValues<VISIBILITY>(VISIBILITY);

export const account = mysqlTable(
  "Account",
  {
    id: varchar("id", { length: 191 }).primaryKey().notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
    type: varchar("type", { length: 191 }).notNull(),
    provider: varchar("provider", { length: 191 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 191 }).notNull(),
    refreshToken: text("refresh_token"),
    accessToken: text("access_token"),
    expiresAt: int("expires_at"),
    tokenType: varchar("token_type", { length: 191 }),
    scope: varchar("scope", { length: 191 }),
    idToken: text("id_token"),
    sessionState: varchar("session_state", { length: 191 }),
  },
  (table) => {
    return {
      providerProviderAccountIdKey: uniqueIndex(
        "Account_provider_providerAccountId_key"
      ).on(table.provider, table.providerAccountId),
      userIdIdx: index("Account_userId_idx").on(table.userId),
    };
  }
);

export const comment = mysqlTable(
  "Comment",
  {
    id: serial("id").primaryKey().notNull(),
    postId: varchar("postId", { length: 191 }).notNull(),
    profileId: varchar("profileId", { length: 191 }).notNull(),
    text: varchar("text", { length: 191 }).notNull(),
    reviewStatus: mysqlEnum("reviewStatus", STATUS_VALUES)
      .default(STATUS.Processing)
      .notNull(),
    visibility: mysqlEnum("visibility", VISIBILITY_VALUES)
      .default(VISIBILITY.Active)
      .notNull(),
    likeCount: int("likeCount").default(0).notNull(),
    commentId: varchar("commentId", { length: 191 }),
    autoReviewedAt: datetime("autoReviewedAt", { mode: "string", fsp: 3 }),
    manualReviewedAt: datetime("manualReviewedAt", { mode: "string", fsp: 3 }),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`(CURRENT_TIMESTAMP(3))`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).notNull(),
  },
  (table) => {
    return {
      commentIdIdx: index("Comment_commentId_idx").on(table.commentId),
      postIdIdx: index("Comment_postId_idx").on(table.postId),
      profileIdIdx: index("Comment_profileId_idx").on(table.profileId),
    };
  }
);

export const commentLike = mysqlTable(
  "CommentLike",
  {
    id: varchar("id", { length: 191 }).primaryKey().notNull(),
    commentId: varchar("commentId", { length: 191 }).notNull(),
    profileId: varchar("profileId", { length: 191 }).notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`(CURRENT_TIMESTAMP(3))`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).notNull(),
  },
  (table) => {
    return {
      commentIdIdx: index("CommentLike_commentId_idx").on(table.commentId),
      profileIdIdx: index("CommentLike_profileId_idx").on(table.profileId),
    };
  }
);

export const post = mysqlTable(
  "Post",
  {
    id: varchar("id", { length: 191 }).primaryKey().notNull(),
    text: varchar("text", { length: 300 }).notNull(),
    location: varchar("location", { length: 32 }).notNull(),
    reviewStatus: mysqlEnum("reviewStatus", STATUS_VALUES)
      .default(STATUS.Processing)
      .notNull(),
    visibility: mysqlEnum("visibility", VISIBILITY_VALUES)
      .default(VISIBILITY.Active)
      .notNull(),
    likeCount: int("likeCount").default(0).notNull(),
    commentCount: int("commentCount").default(0).notNull(),
    reactionCount: int("reactionCount").default(0).notNull(),
    updateCount: int("updateCount").default(0).notNull(),
    type: mysqlEnum("type", POST_TYPE_VALUES).default(POST_TYPE.Text).notNull(),
    profileId: varchar("profileId", { length: 191 }).notNull(),
    autoReviewedAt: datetime("autoReviewedAt", { mode: "string", fsp: 3 }),
    manualReviewedAt: datetime("manualReviewedAt", { mode: "string", fsp: 3 }),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`(CURRENT_TIMESTAMP(3))`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).notNull(),
  },
  (table) => {
    return {
      profileIdIdx: index("Post_profileId_idx").on(table.profileId),
    };
  }
);

export const postMention = mysqlTable(
  "PostMention",
  {
    id: varchar("id", { length: 191 }).primaryKey().notNull(),
    postId: varchar("postId", { length: 191 }).notNull(),
    profileId: varchar("profileId", { length: 191 }).notNull(),
  },
  (table) => {
    return {
      postIdIdx: index("PostMention_postId_idx").on(table.postId),
      profileIdIdx: index("PostMention_profileId_idx").on(table.profileId),
    };
  }
);

export const postReaction = mysqlTable(
  "PostReaction",
  {
    id: varchar("id", { length: 191 }).primaryKey().notNull(),
    reaction: mysqlEnum("reaction", [
      "downcast",
      "fire",
      "heart",
      "heart_eyes",
      "joy",
      "pinched_fingers",
      "skull",
      "smile",
      "thumbs_up",
      "weeping",
    ]).notNull(),
    image: varchar("image", { length: 191 }).notNull(),
    postId: varchar("postId", { length: 191 }).notNull(),
    profileId: varchar("profileId", { length: 191 }).notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`(CURRENT_TIMESTAMP(3))`)
      .notNull(),
  },
  (table) => {
    return {
      postIdIdx: index("PostReaction_postId_idx").on(table.postId),
      profileIdIdx: index("PostReaction_profileId_idx").on(table.profileId),
    };
  }
);

export const profile = mysqlTable(
  "Profile",
  {
    id: varchar("id", { length: 191 }).primaryKey().notNull(),
    name: varchar("name", { length: 191 }).notNull(),
    handle: varchar("handle", { length: 191 }).notNull(),
    normalizedHandle: varchar("normalizedHandle", { length: 191 }).notNull(),
    biography: varchar("biography", { length: 191 }),
    location: varchar("location", { length: 191 }),
    website: varchar("website", { length: 191 }),
    avatarUrl: varchar("avatarUrl", { length: 191 }).default(
      "https://source.unsplash.com/random/600×600/?cat"
    ),
    headerUrl: varchar("headerUrl", { length: 191 }).default(
      "https://source.unsplash.com/random/1920×1080/?cat"
    ),
    birthdate: varchar("birthdate", { length: 191 }),
    followerCount: int("followerCount").default(0).notNull(),
    followingCount: int("followingCount").default(0).notNull(),
    postCount: int("postCount").default(0).notNull(),
    canChangeHandle: tinyint("canChangeHandle").default(1).notNull(),
  },
  (table) => {
    return {
      idIdx: index("Profile_id_idx").on(table.id),
      nameHandleIdx: index("Profile_name_handle_idx").on(
        table.name,
        table.handle
      ),
      normalizedHandleKey: uniqueIndex("Profile_normalizedHandle_key").on(
        table.normalizedHandle
      ),
    };
  }
);

export const profileReaction = mysqlTable(
  "ProfileReaction",
  {
    id: varchar("id", { length: 191 }).primaryKey().notNull(),
    reaction: mysqlEnum("reaction", [
      "downcast",
      "fire",
      "heart",
      "heart_eyes",
      "joy",
      "pinched_fingers",
      "skull",
      "smile",
      "thumbs_up",
      "weeping",
    ]).notNull(),
    image: varchar("image", { length: 191 }).notNull(),
    status: mysqlEnum("status", VISIBILITY_VALUES)
      .default(VISIBILITY.Active)
      .notNull(),
    profileId: varchar("profileId", { length: 191 }).notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`(CURRENT_TIMESTAMP(3))`)
      .notNull(),
  },
  (table) => {
    return {
      profileIdIdx: index("ProfileReaction_profileId_idx").on(table.profileId),
    };
  }
);

export const profileRelationship = mysqlTable(
  "ProfileRelationship",
  {
    id: varchar("id", { length: 191 }).primaryKey().notNull(),
    type: mysqlEnum("type", RELATIONSHIP_TYPE_VALUES)
      .default(RELATIONSHIP_TYPE.Follow)
      .notNull(),
    followerId: varchar("followerId", { length: 191 }).notNull(),
    followingId: varchar("followingId", { length: 191 }).notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`(CURRENT_TIMESTAMP(3))`)
      .notNull(),
    requestedAt: datetime("requestedAt", { mode: "string", fsp: 3 }).notNull(),
  },
  (table) => {
    return {
      followerIdIdx: index("ProfileRelationship_followerId_idx").on(
        table.followerId
      ),
      followingIdIdx: index("ProfileRelationship_followingId_idx").on(
        table.followingId
      ),
    };
  }
);

export const profileSettings = mysqlTable("ProfileSettings", {
  id: varchar("id", { length: 191 }).primaryKey().notNull(),
  reaction: mysqlEnum("reaction", REACTION_VALUES)
    .default(REACTION.Smile)
    .notNull(),
  catMode: tinyint("catMode").default(0).notNull(),
  theme: mysqlEnum("theme", THEME_VALUES).default(THEME.Auto).notNull(),
  relativeTimestamps: tinyint("relativeTimestamps").default(1).notNull(),
});

export const relationshipRequest = mysqlTable(
  "RelationshipRequest",
  {
    id: varchar("id", { length: 191 }).primaryKey().notNull(),
    status: mysqlEnum("status", REQUEST_STATUS_VALUES)
      .default(REQUEST_STATUS.Pending)
      .notNull(),
    followerId: varchar("followerId", { length: 191 }).notNull(),
    followingId: varchar("followingId", { length: 191 }).notNull(),
    createdAt: datetime("createdAt", { mode: "string", fsp: 3 })
      .default(sql`(CURRENT_TIMESTAMP(3))`)
      .notNull(),
    updatedAt: datetime("updatedAt", { mode: "string", fsp: 3 }).notNull(),
  },
  (table) => {
    return {
      followerIdIdx: index("RelationshipRequest_followerId_idx").on(
        table.followerId
      ),
      followingIdIdx: index("RelationshipRequest_followingId_idx").on(
        table.followingId
      ),
    };
  }
);

export const session = mysqlTable(
  "Session",
  {
    id: varchar("id", { length: 191 }).primaryKey().notNull(),
    sessionToken: varchar("sessionToken", { length: 191 }).notNull(),
    userId: varchar("userId", { length: 191 }).notNull(),
    expires: datetime("expires", { mode: "string", fsp: 3 }).notNull(),
  },
  (table) => {
    return {
      sessionTokenKey: uniqueIndex("Session_sessionToken_key").on(
        table.sessionToken
      ),
      userIdIdx: index("Session_userId_idx").on(table.userId),
    };
  }
);

export const user = mysqlTable(
  "User",
  {
    id: varchar("id", { length: 191 }).primaryKey().notNull(),
    name: varchar("name", { length: 191 }),
    email: varchar("email", { length: 191 }),
    emailVerified: datetime("emailVerified", { mode: "string", fsp: 3 }),
    image: varchar("image", { length: 191 }),
  },
  (table) => {
    return {
      emailKey: uniqueIndex("User_email_key").on(table.email),
    };
  }
);

export const verificationToken = mysqlTable(
  "VerificationToken",
  {
    identifier: varchar("identifier", { length: 191 }).notNull(),
    token: varchar("token", { length: 191 }).primaryKey().notNull(),
    expires: datetime("expires", { mode: "string", fsp: 3 }).notNull(),
  },
  (table) => {
    return {
      identifierTokenKey: uniqueIndex(
        "VerificationToken_identifier_token_key"
      ).on(table.identifier, table.token),
      tokenKey: uniqueIndex("VerificationToken_token_key").on(table.token),
    };
  }
);
