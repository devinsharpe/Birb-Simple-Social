import { authRouter } from "./auth";
import { postsRouter } from "./posts";
import { router } from "../trpc";

export const appRouter = router({
  auth: authRouter,
  posts: postsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
