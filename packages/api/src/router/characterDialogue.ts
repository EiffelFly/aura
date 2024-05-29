import { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { and, desc, eq } from "@aura/db";
import {
  Character,
  CharacterDialogue,
  createCharacterDialogueSchema,
  Dialogue,
} from "@aura/db/schema";

import { protectedProcedure } from "../trpc";

export const characterDialogueRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.CharacterDialogue.findMany({
      where: eq(CharacterDialogue.ownerId, ctx.session.user.id),
      orderBy: desc(Character.id),
      limit: 100,
    });
  }),
  byCharacterId: protectedProcedure
    .input(z.object({ characterId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.CharacterDialogue.findMany({
        where: and(
          eq(Character.id, input.characterId),
          eq(CharacterDialogue.ownerId, ctx.session.user.id),
        ),
        limit: 100,
      });
    }),
  byDialogueId: protectedProcedure
    .input(z.object({ dialogueId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.CharacterDialogue.findMany({
        where: and(
          eq(Dialogue.id, input.dialogueId),
          eq(CharacterDialogue.ownerId, ctx.session.user.id),
        ),
        limit: 100,
      });
    }),
  byCharacterAndDialogueId: protectedProcedure
    .input(z.object({ characterId: z.string(), dialogueId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.CharacterDialogue.findFirst({
        where: and(
          eq(Character.id, input.characterId),
          eq(Dialogue.id, input.dialogueId),
          eq(CharacterDialogue.ownerId, ctx.session.user.id),
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
            eq(CharacterDialogue.ownerId, ctx.session.user.id),
          ),
        );
    }),
} satisfies TRPCRouterRecord;
