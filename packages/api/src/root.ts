import { authRouter } from "./router/auth";
import { characterRouter } from "./router/character";
import { characterDialogueRouter } from "./router/characterDialogue";
import { dialogueRouter } from "./router/dialogue";
import { workRouter } from "./router/work";
import { workCharacterRouter } from "./router/workCharacter";
import { workspaceRouter } from "./router/workspace";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  work: workRouter,
  workspace: workspaceRouter,
  character: characterRouter,
  dialogue: dialogueRouter,
  workCharacter: workCharacterRouter,
  characterDialogue: characterDialogueRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
