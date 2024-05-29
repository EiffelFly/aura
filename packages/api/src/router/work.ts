import { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { desc, eq } from "@aura/db";
import { CreateWorkSchema, Work } from "@aura/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const workRouter = {
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.Work.findMany({
      orderBy: desc(Work.id),
      limit: 100,
    });
  }),
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.Work.findFirst({
        where: eq(Work.id, input.id),
      });
    }),
  create: protectedProcedure
    .input(CreateWorkSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(Work).values(input);
    }),
  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.delete(Work).where(eq(Work.id, input));
  }),
} satisfies TRPCRouterRecord;
