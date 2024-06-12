import { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { and, desc, eq } from "@aura/db";
import { CreateWorkVersionSchema, Work, WorkVersion } from "@aura/db/schema";

import { protectedProcedure } from "../trpc";

export const workVersionRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.WorkVersion.findMany({
      where: eq(WorkVersion.owner_id, ctx.session.user.id),
      orderBy: desc(Work.id),
      limit: 100,
    });
  }),
  by_id: protectedProcedure
    .input(z.object({ version_id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.WorkVersion.findMany({
        where: and(
          eq(WorkVersion.id, input.version_id),
          eq(WorkVersion.owner_id, ctx.session.user.id),
        ),
        limit: 100,
      });
    }),
  by_work_id: protectedProcedure
    .input(z.object({ work_id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.WorkVersion.findMany({
        where: and(
          eq(WorkVersion.work_id, input.work_id),
          eq(WorkVersion.owner_id, ctx.session.user.id),
        ),
        limit: 100,
      });
    }),
  create: protectedProcedure
    .input(CreateWorkVersionSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db
        .insert(WorkVersion)
        .values({
          ...input,
          id: `${input.work_id}-${input.version}`,
          owner_id: ctx.session.user.id,
        })
        .returning();
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db
        .delete(WorkVersion)
        .where(
          and(
            eq(Work.id, input.id),
            eq(WorkVersion.owner_id, ctx.session.user.id),
          ),
        );
    }),
} satisfies TRPCRouterRecord;
