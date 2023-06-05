CREATE TABLE IF NOT EXISTS "commentLikes" (
	"id" varchar(25) PRIMARY KEY NOT NULL,
	"commentId" varchar(25) NOT NULL,
	"profileId" varchar(25) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "comments" (
	"id" varchar(25) PRIMARY KEY NOT NULL,
	"postId" varchar(25) NOT NULL,
	"profileId" varchar(25) NOT NULL,
	"text" varchar(191) NOT NULL,
	"reviewStatus" reviewStatus DEFAULT 'PROCESSING' NOT NULL,
	"visibility" visibility DEFAULT 'ACTIVE' NOT NULL,
	"likeCount" integer DEFAULT 0 NOT NULL,
	"commentId" varchar(25),
	"autoReviewedAt" timestamp,
	"manualReviewedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "postMentions" (
	"id" varchar(25) PRIMARY KEY NOT NULL,
	"postId" varchar(25) NOT NULL,
	"profileId" varchar(25) NOT NULL
);

CREATE TABLE IF NOT EXISTS "postReactions" (
	"id" varchar(25) PRIMARY KEY NOT NULL,
	"reaction" reaction NOT NULL,
	"image" varchar(191) NOT NULL,
	"postId" varchar(25) NOT NULL,
	"profileId" varchar(25) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "posts" (
	"id" varchar(25) PRIMARY KEY NOT NULL,
	"type" postType DEFAULT 'TEXT' NOT NULL,
	"text" varchar(300) NOT NULL,
	"image" varchar(191) DEFAULT '' NOT NULL,
	"alt" varchar(500) DEFAULT '' NOT NULL,
	"location" varchar(25) NOT NULL,
	"reviewStatus" reviewStatus DEFAULT 'PROCESSING' NOT NULL,
	"visibility" visibility DEFAULT 'ACTIVE' NOT NULL,
	"likeCount" integer DEFAULT 0 NOT NULL,
	"commentCount" integer DEFAULT 0 NOT NULL,
	"reactionCount" integer DEFAULT 0 NOT NULL,
	"updateCount" integer DEFAULT 0 NOT NULL,
	"profileId" varchar(25) NOT NULL,
	"autoReviewedAt" timestamp,
	"manualReviewedAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "profileReactions" (
	"id" varchar(25) PRIMARY KEY NOT NULL,
	"reaction" reaction NOT NULL,
	"image" varchar(191) NOT NULL,
	"status" visibility DEFAULT 'ACTIVE' NOT NULL,
	"profileId" varchar(25) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS "profileRelationships" (
	"id" varchar(25) PRIMARY KEY NOT NULL,
	"type" relationshipType DEFAULT 'FOLLOW' NOT NULL,
	"followerId" varchar(25) NOT NULL,
	"followingId" varchar(25) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"requestedAt" timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS "profileSettings" (
	"id" varchar(25) PRIMARY KEY NOT NULL,
	"reaction" reaction DEFAULT 'SMILE' NOT NULL,
	"catMode" boolean DEFAULT false NOT NULL,
	"theme" theme DEFAULT 'AUTO' NOT NULL,
	"relativeTimestamps" boolean DEFAULT true NOT NULL
);

CREATE TABLE IF NOT EXISTS "profiles" (
	"id" varchar(25) PRIMARY KEY NOT NULL,
	"name" varchar(191) NOT NULL,
	"handle" varchar(191) NOT NULL,
	"normalizedHandle" varchar(191) NOT NULL,
	"biography" varchar(191),
	"location" varchar(191),
	"website" varchar(191),
	"avatarUrl" varchar(191) DEFAULT 'https://source.unsplash.com/random/600×600/?cat' NOT NULL,
	"headerUrl" varchar(191) DEFAULT 'https://source.unsplash.com/random/1920×1080/?cat' NOT NULL,
	"birthdate" varchar(191),
	"followerCount" integer DEFAULT 0 NOT NULL,
	"followingCount" integer DEFAULT 0 NOT NULL,
	"postCount" integer DEFAULT 0 NOT NULL,
	"canChangeHandle" boolean DEFAULT true NOT NULL
);

CREATE TABLE IF NOT EXISTS "relationshipRequests" (
	"id" varchar(25) PRIMARY KEY NOT NULL,
	"status" status DEFAULT 'PENDING' NOT NULL,
	"followerId" varchar(25) NOT NULL,
	"followingId" varchar(25) NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);

DO $$ BEGIN
 ALTER TABLE "commentLikes" ADD CONSTRAINT "commentLikes_commentId_comments_id_fk" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "commentLikes" ADD CONSTRAINT "commentLikes_profileId_profiles_id_fk" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_postId_posts_id_fk" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_profileId_profiles_id_fk" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_commentId_comments_id_fk" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "postMentions" ADD CONSTRAINT "postMentions_postId_posts_id_fk" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "postMentions" ADD CONSTRAINT "postMentions_profileId_profiles_id_fk" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "postReactions" ADD CONSTRAINT "postReactions_postId_posts_id_fk" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "postReactions" ADD CONSTRAINT "postReactions_profileId_profiles_id_fk" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "posts" ADD CONSTRAINT "posts_profileId_profiles_id_fk" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "profileReactions" ADD CONSTRAINT "profileReactions_profileId_profiles_id_fk" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "profileRelationships" ADD CONSTRAINT "profileRelationships_followerId_profiles_id_fk" FOREIGN KEY ("followerId") REFERENCES "profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "profileRelationships" ADD CONSTRAINT "profileRelationships_followingId_profiles_id_fk" FOREIGN KEY ("followingId") REFERENCES "profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "relationshipRequests" ADD CONSTRAINT "relationshipRequests_followerId_profiles_id_fk" FOREIGN KEY ("followerId") REFERENCES "profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "relationshipRequests" ADD CONSTRAINT "relationshipRequests_followingId_profiles_id_fk" FOREIGN KEY ("followingId") REFERENCES "profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
