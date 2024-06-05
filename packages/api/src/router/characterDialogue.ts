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
      where: eq(CharacterDialogue.owner_id, ctx.session.user.id),
      orderBy: desc(Character.id),
      limit: 100,
    });
  }),
  bycharacter_id: protectedProcedure
    .input(z.object({ character_id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.CharacterDialogue.findMany({
        where: and(
          eq(Character.id, input.character_id),
          eq(CharacterDialogue.owner_id, ctx.session.user.id),
        ),
        limit: 100,
      });
    }),
  bydialogue_id: protectedProcedure
    .input(z.object({ dialogue_id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.CharacterDialogue.findMany({
        where: and(
          eq(Dialogue.id, input.dialogue_id),
          eq(CharacterDialogue.owner_id, ctx.session.user.id),
        ),
        limit: 100,
      });
    }),
  byCharacterAnddialogue_id: protectedProcedure
    .input(z.object({ character_id: z.string(), dialogue_id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.CharacterDialogue.findFirst({
        where: and(
          eq(Character.id, input.character_id),
          eq(Dialogue.id, input.dialogue_id),
          eq(CharacterDialogue.owner_id, ctx.session.user.id),
        ),
      });
    }),
  create: protectedProcedure
    .input(createCharacterDialogueSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(CharacterDialogue).values(input);
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
