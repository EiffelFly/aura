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
  all: protectedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.CharacterDialogue.findMany({
        where: and(
          eq(CharacterDialogue.ownerId, ctx.session.user.id),
          eq(CharacterDialogue.workspaceId, input.workspaceId),
        ),
        orderBy: desc(Character.id),
        limit: 100,
      });
    }),
  byCharacterId: protectedProcedure
    .input(z.object({ characterId: z.string(), workspaceId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.CharacterDialogue.findMany({
        where: and(
          eq(CharacterDialogue.characterId, input.characterId),
          eq(CharacterDialogue.ownerId, ctx.session.user.id),
          eq(CharacterDialogue.workspaceId, input.workspaceId),
        ),
        limit: 100,
      });
    }),
  byDialogueId: protectedProcedure
    .input(z.object({ dialogueId: z.string(), workspaceId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.CharacterDialogue.findMany({
        where: and(
          eq(CharacterDialogue.dialogueId, input.dialogueId),
          eq(CharacterDialogue.ownerId, ctx.session.user.id),
          eq(CharacterDialogue.workspaceId, input.workspaceId),
        ),
        limit: 100,
      });
    }),
  byCharacterAndDialogueId: protectedProcedure
    .input(
      z.object({
        characterId: z.string(),
        dialogueId: z.string(),
        workspaceId: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.query.CharacterDialogue.findFirst({
        where: and(
          eq(CharacterDialogue.characterId, input.characterId),
          eq(CharacterDialogue.dialogueId, input.dialogueId),
          eq(CharacterDialogue.ownerId, ctx.session.user.id),
          eq(CharacterDialogue.workspaceId, input.workspaceId),
        ),
      });
    }),
  create: protectedProcedure
    .input(CreateCharacterDialogueSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db
        .insert(CharacterDialogue)
        .values({ ...input, ownerId: ctx.session.user.id })
        .returning();
    }),
  delete: protectedProcedure
    .input(
      z.object({
        characterId: z.string(),
        dialogueId: z.string(),
        workspaceId: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db
        .delete(CharacterDialogue)
        .where(
          and(
            eq(Character.id, input.characterId),
            eq(Dialogue.id, input.dialogueId),
            eq(CharacterDialogue.ownerId, ctx.session.user.id),
            eq(CharacterDialogue.workspaceId, input.workspaceId),
          ),
        );
    }),
} satisfies TRPCRouterRecord;
