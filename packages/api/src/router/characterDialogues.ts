import { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { and, desc, eq } from "@aura/db";
import {
  Character,
  CharacterDialogue,
  CreateCharacterDialogueSchema,
  Dialogue,
} from "@aura/db/schema";

import { protectedProcedure } from "../trpc";

export const characterDialoguesRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.CharacterDialogue.findMany({
      where: eq(CharacterDialogue.owner_id, ctx.session.user.id),
      orderBy: desc(Character.id),
      limit: 100,
    });
  }),
  by_character_id: protectedProcedure
    .input(z.object({ character_id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.CharacterDialogue.findMany({
        where: and(
          eq(CharacterDialogue.character_id, input.character_id),
          eq(CharacterDialogue.owner_id, ctx.session.user.id),
        ),
        limit: 100,
      });
    }),
  by_dialogue_id: protectedProcedure
    .input(z.object({ dialogue_id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.CharacterDialogue.findMany({
        where: and(
          eq(CharacterDialogue.dialogue_id, input.dialogue_id),
          eq(CharacterDialogue.owner_id, ctx.session.user.id),
        ),
        limit: 100,
      });
    }),
  by_character_and_dialogue_id: protectedProcedure
    .input(z.object({ character_id: z.string(), dialogue_id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.CharacterDialogue.findFirst({
        where: and(
          eq(CharacterDialogue.character_id, input.character_id),
          eq(CharacterDialogue.dialogue_id, input.dialogue_id),
          eq(CharacterDialogue.owner_id, ctx.session.user.id),
        ),
      });
    }),
  create: protectedProcedure
    .input(CreateCharacterDialogueSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db
        .insert(CharacterDialogue)
        .values({ ...input, owner_id: ctx.session.user.id })
        .returning();
    }),
  delete: protectedProcedure
    .input(z.object({ character_id: z.string(), dialogue_id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db
        .delete(CharacterDialogue)
        .where(
          and(
            eq(Character.id, input.character_id),
            eq(Dialogue.id, input.dialogue_id),
            eq(CharacterDialogue.owner_id, ctx.session.user.id),
          ),
        );
    }),
} satisfies TRPCRouterRecord;
