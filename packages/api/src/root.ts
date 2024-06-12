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
  work_characters: workCharactersRouter,
  character_dialogues: characterDialoguesRouter,
  work_version: workVersionRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
