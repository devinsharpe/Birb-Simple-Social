import { authRouter } from "./auth";
import { postsRouter } from "./posts";
import { profileRouter } from "./profile";
import { relationshipRouter } from "./relationship";
import { requestRouter } from "./request";
import { router } from "../trpc";

export const appRouter = router({
  auth: authRouter,
  posts: postsRouter,
  profiles: profileRouter,
  relationships: relationshipRouter,
  requests: requestRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
