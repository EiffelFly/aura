import { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import { authRouter } from "./router/auth";
import { characterDialoguesRouter } from "./router/characterDialogues";
import { charactersRouter } from "./router/characters";
import { dialoguesRouter } from "./router/dialogues";
import { workCharactersRouter } from "./router/workCharacters";
import { worksRouter } from "./router/works";
import { workspacesRouter } from "./router/workspaces";
import { workVersionRouter } from "./router/workVersion";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  works: worksRouter,
  workspaces: workspacesRouter,
  characters: charactersRouter,
  dialogues: dialoguesRouter,
  workCharacters: workCharactersRouter,
  characterDialogues: characterDialoguesRouter,
  workVersion: workVersionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
