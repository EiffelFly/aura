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
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.WorkCharacter.findMany({
      where: eq(WorkCharacter.owner_id, ctx.session.user.id),
      orderBy: desc(Work.id),
      limit: 100,
    });
  }),
  byWorkId: protectedProcedure
    .input(z.object({ work_id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.WorkCharacter.findMany({
        where: and(
          eq(Work.id, input.work_id),
          eq(WorkCharacter.owner_id, ctx.session.user.id),
        ),
        limit: 100,
      });
    }),
  bycharacter_id: protectedProcedure
    .input(z.object({ character_id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.WorkCharacter.findMany({
        where: and(
          eq(Character.id, input.character_id),
          eq(WorkCharacter.owner_id, ctx.session.user.id),
        ),
        limit: 100,
      });
    }),
  byWorkAndcharacter_id: protectedProcedure
    .input(z.object({ work_id: z.string(), character_id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.WorkCharacter.findFirst({
        where: and(
          eq(Work.id, input.work_id),
          eq(Character.id, input.character_id),
          eq(WorkCharacter.owner_id, ctx.session.user.id),
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
          owner_id: ctx.session.user.id,
        })
        .returning();
    }),
  delete: protectedProcedure
    .input(z.object({ work_id: z.string(), character_id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db
        .delete(WorkCharacter)
        .where(
          and(
            eq(Work.id, input.work_id),
            eq(Character.id, input.character_id),
            eq(WorkCharacter.owner_id, ctx.session.user.id),
          ),
        );
    }),
} satisfies TRPCRouterRecord;
