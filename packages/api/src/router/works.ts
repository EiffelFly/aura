import { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { and, desc, eq } from "@aura/db";
import { CreateWorkSchema, UpdateWorkSchema, Work } from "@aura/db/schema";

import { protectedProcedure } from "../trpc";

export const worksRouter = {
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
      return ctx.db
        .insert(Work)
        .values({
          ...input,
          owner_id: ctx.session.user.id,
        })
        .returning();
    }),
  update: protectedProcedure
    .input(UpdateWorkSchema)
    .mutation(({ ctx, input }) => {
      const { work_id, ...data } = input;

      console.log(data);

      return ctx.db
        .update(Work)
        .set(data)
        .where(
          and(eq(Work.id, work_id), eq(Work.owner_id, ctx.session.user.id)),
        )
        .returning();
    }),
  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db
      .delete(Work)
      .where(and(eq(Work.id, input), eq(Work.owner_id, ctx.session.user.id)));
  }),
} satisfies TRPCRouterRecord;
