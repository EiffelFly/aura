import "@aura/db/schema";

import { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { desc, eq } from "@aura/db";
import { Character, CreateDialogueSchema } from "@aura/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const characterRouter = {
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.Character.findMany({
      orderBy: desc(Character.id),
      limit: 100,
    });
  }),
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.Character.findFirst({
        where: eq(Character.id, input.id),
      });
    }),
  create: protectedProcedure
    .input(CreateDialogueSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(Character).values(input);
    }),
  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.delete(Character).where(eq(Character.id, input));
  }),
} satisfies TRPCRouterRecord;
