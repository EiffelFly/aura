import { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { and, desc, eq } from "@aura/db";
import {
  Character,
  createWorkCharacterSchema,
  Work,
  WorkCharacter,
} from "@aura/db/schema";

import { protectedProcedure } from "../trpc";

export const workCharactersRouter = {
  all: protectedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .query(({ ctx }) => {
      return ctx.db.query.WorkCharacter.findMany({
        where: and(
          eq(WorkCharacter.ownerId, ctx.session.user.id),
          eq(Work.workspaceId, ctx.session.user.id),
        ),
        orderBy: desc(Work.id),
        limit: 100,
      });
    }),
  byWorkId: protectedProcedure
    .input(z.object({ workId: z.string(), workspaceId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.WorkCharacter.findMany({
        where: and(
          eq(Work.id, input.workId),
          eq(WorkCharacter.ownerId, ctx.session.user.id),
          eq(Work.workspaceId, input.workspaceId),
        ),
        limit: 100,
      });
    }),
  byCharacterId: protectedProcedure
    .input(z.object({ characterId: z.string(), workspaceId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.WorkCharacter.findMany({
        where: and(
          eq(Character.id, input.characterId),
          eq(WorkCharacter.ownerId, ctx.session.user.id),
          eq(Work.workspaceId, input.workspaceId),
        ),
        limit: 100,
      });
    }),
  byWorkAndCharacterId: protectedProcedure
    .input(
      z.object({
        workId: z.string(),
        characterId: z.string(),
        workspaceId: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.query.WorkCharacter.findFirst({
        where: and(
          eq(Work.id, input.workId),
          eq(Character.id, input.characterId),
          eq(WorkCharacter.ownerId, ctx.session.user.id),
          eq(Work.workspaceId, input.workspaceId),
        ),
      });
    }),
  create: protectedProcedure
    .input(createWorkCharacterSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db
        .insert(WorkCharacter)
        .values({
          ...input,
          ownerId: ctx.session.user.id,
        })
        .returning();
    }),
  delete: protectedProcedure
    .input(z.object({ workId: z.string(), characterId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db
        .delete(WorkCharacter)
        .where(
          and(
            eq(Work.id, input.workId),
            eq(Character.id, input.characterId),
            eq(WorkCharacter.ownerId, ctx.session.user.id),
          ),
        );
    }),
} satisfies TRPCRouterRecord;
