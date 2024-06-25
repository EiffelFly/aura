import { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { and, desc, eq } from "@aura/db";
import { CreateWorkVersionSchema, Work, WorkVersion } from "@aura/db/schema";

import { protectedProcedure } from "../trpc";

export const workVersionRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.WorkVersion.findMany({
      where: eq(WorkVersion.ownerId, ctx.session.user.id),
      orderBy: desc(Work.id),
      limit: 100,
    });
  }),
  byId: protectedProcedure
    .input(z.object({ version_id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.WorkVersion.findMany({
        where: and(
          eq(WorkVersion.id, input.version_id),
          eq(WorkVersion.ownerId, ctx.session.user.id),
        ),
        limit: 100,
      });
    }),
  by_work_id: protectedProcedure
    .input(z.object({ workId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.WorkVersion.findMany({
        where: and(
          eq(WorkVersion.workId, input.workId),
          eq(WorkVersion.ownerId, ctx.session.user.id),
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
          ownerId: ctx.session.user.id,
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
            eq(WorkVersion.ownerId, ctx.session.user.id),
          ),
        );
    }),
} satisfies TRPCRouterRecord;
