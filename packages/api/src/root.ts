import { authRouter } from "./router/auth";
import { characterRouter } from "./router/character";
import { dialogueRouter } from "./router/dialogue";
import { workRouter } from "./router/work";
import { workspaceRouter } from "./router/workspace";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  work: workRouter,
  workspace: workspaceRouter,
  character: characterRouter,
  dialogue: dialogueRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
