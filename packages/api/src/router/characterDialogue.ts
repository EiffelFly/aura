import { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { and, desc, eq } from "@aura/db";
import {
  Character,
  CharacterDialogue,
  createCharacterDialogueSchema,
  Dialogue,
} from "@aura/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const characterDialogueRouter = {
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.CharacterDialogue.findMany({
      orderBy: desc(Character.id),
      limit: 100,
    });
  }),
  byCharacterId: publicProcedure
    .input(z.object({ characterId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.CharacterDialogue.findMany({
        where: eq(Character.id, input.characterId),
        limit: 100,
      });
    }),
  byDialogueId: publicProcedure
    .input(z.object({ dialogueId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.CharacterDialogue.findMany({
        where: eq(Dialogue.id, input.dialogueId),
        limit: 100,
      });
    }),
  byCharacterAndDialogueId: publicProcedure
    .input(z.object({ characterId: z.string(), dialogueId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.CharacterDialogue.findFirst({
        where: and(
          eq(Character.id, input.characterId),
          eq(Dialogue.id, input.dialogueId),
        ),
      });
    }),
  create: protectedProcedure
    .input(createCharacterDialogueSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(CharacterDialogue).values(input);
    }),
  delete: protectedProcedure
    .input(z.object({ characterId: z.string(), dialogueId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db
        .delete(CharacterDialogue)
        .where(
          and(
            eq(Character.id, input.characterId),
            eq(Dialogue.id, input.dialogueId),
          ),
        );
    }),
} satisfies TRPCRouterRecord;
