import { authRouter } from "./auth";
import { postsRouter } from "./posts";
import { profileRouter } from "./profile";
import { router } from "../trpc";

export const appRouter = router({
  auth: authRouter,
  posts: postsRouter,
  profiles: profileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
