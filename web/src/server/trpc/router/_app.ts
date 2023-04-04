import { authRouter } from "./auth";
import { commentsRouter } from "./posts/comments";
import { postsRouter } from "./posts";
import { profileRouter } from "./profile";
import { relationshipRouter } from "./relationship";
import { requestRouter } from "./request";
import { router } from "../trpc";
import { settingsRouter } from "./profile/settings";

export const appRouter = router({
  auth: authRouter,
  comments: commentsRouter,
  posts: postsRouter,
  profiles: profileRouter,
  profileSettings: settingsRouter,
  relationships: relationshipRouter,
  requests: requestRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
