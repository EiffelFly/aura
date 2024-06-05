import { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { and, desc, eq } from "@aura/db";
import { CreateWorkSchema, Work } from "@aura/db/schema";

import { protectedProcedure } from "../trpc";

export const workRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.Work.findMany({
      where: eq(Work.owner_id, ctx.session.user.id),
      orderBy: desc(Work.id),
      limit: 100,
    });
  }),
  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.Work.findFirst({
        where: and(
          eq(Work.id, input.id),
          eq(Work.owner_id, ctx.session.user.id),
        ),
      });
    }),
  create: protectedProcedure
    .input(CreateWorkSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(Work).values({
        ...input,
        owner_id: ctx.session.user.id,
      });
    }),
  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db
      .delete(Work)
      .where(and(eq(Work.id, input), eq(Work.owner_id, ctx.session.user.id)));
  }),
} satisfies TRPCRouterRecord;
