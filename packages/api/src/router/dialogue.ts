import { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { desc, eq } from "@aura/db";

import "@aura/db/schema";

import { CreateDialogueSchema, Dialogue } from "@aura/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const dialogueRouter = {
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.Dialogue.findMany({
      orderBy: desc(Dialogue.id),
      limit: 100,
    });
  }),
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.Dialogue.findFirst({
        where: eq(Dialogue.id, input.id),
      });
    }),
  create: protectedProcedure
    .input(CreateDialogueSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(Dialogue).values(input);
    }),
  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.delete(Dialogue).where(eq(Dialogue.id, input));
  }),
} satisfies TRPCRouterRecord;
