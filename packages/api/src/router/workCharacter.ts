import { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { and, desc, eq } from "@aura/db";
import {
  Character,
  createWorkCharacterSchema,
  Work,
  WorkCharacter,
} from "@aura/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const workCharacterRouter = {
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.WorkCharacter.findMany({
      orderBy: desc(Work.id),
      limit: 100,
    });
  }),
  byWorkId: publicProcedure
    .input(z.object({ workId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.WorkCharacter.findMany({
        where: eq(Work.id, input.workId),
        limit: 100,
      });
    }),
  byCharacterId: publicProcedure
    .input(z.object({ characterId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.WorkCharacter.findMany({
        where: eq(Work.id, input.characterId),
        limit: 100,
      });
    }),
  byWorkAndCharacterId: publicProcedure
    .input(z.object({ workId: z.string(), characterId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.WorkCharacter.findFirst({
        where: and(
          eq(Work.id, input.workId),
          eq(Character.id, input.characterId),
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
          and(eq(Work.id, input.workId), eq(Character.id, input.characterId)),
        );
    }),
} satisfies TRPCRouterRecord;
