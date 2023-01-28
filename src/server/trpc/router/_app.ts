import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { profileRouter } from "./profile";
import { router } from "../trpc";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  profile: profileRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
