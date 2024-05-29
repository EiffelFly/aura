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

export const workCharacterRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.WorkCharacter.findMany({
      where: eq(WorkCharacter.ownerId, ctx.session.user.id),
      orderBy: desc(Work.id),
      limit: 100,
    });
  }),
  byWorkId: protectedProcedure
    .input(z.object({ workId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.WorkCharacter.findMany({
        where: and(
          eq(Work.id, input.workId),
          eq(WorkCharacter.ownerId, ctx.session.user.id),
        ),
        limit: 100,
      });
    }),
  byCharacterId: protectedProcedure
    .input(z.object({ characterId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.WorkCharacter.findMany({
        where: and(
          eq(Character.id, input.characterId),
          eq(WorkCharacter.ownerId, ctx.session.user.id),
        ),
        limit: 100,
      });
    }),
  byWorkAndCharacterId: protectedProcedure
    .input(z.object({ workId: z.string(), characterId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.WorkCharacter.findFirst({
        where: and(
          eq(Work.id, input.workId),
          eq(Character.id, input.characterId),
          eq(WorkCharacter.ownerId, ctx.session.user.id),
        ),
      });
    }),
  create: protectedProcedure
    .input(createWorkCharacterSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(WorkCharacter).values(input);
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
