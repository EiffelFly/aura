import { inferRouterOutputs, TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { and, desc, eq } from "@aura/db";
import {
  CreateWorkSchema,
  UpdateWorkSchema,
  Work,
  WorkVersion,
} from "@aura/db/schema";

import { protectedProcedure } from "../trpc";

export const worksRouter = {
  all: protectedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.Work.findMany({
        where: and(
          eq(Work.ownerId, ctx.session.user.id),
          eq(Work.workspaceId, input.workspaceId),
        ),
        orderBy: desc(Work.id),
        limit: 100,
      });
    }),
  byId: protectedProcedure
    .input(z.object({ workId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.Work.findFirst({
        where: and(
          eq(Work.id, input.workId),
          eq(Work.ownerId, ctx.session.user.id),
        ),
      });
    }),
  worksWithVersions: protectedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .query(({ ctx, input }) => {
      const query = ctx.db.query.Work.findMany({
        where: and(
          eq(Work.ownerId, ctx.session.user.id),
          eq(Work.workspaceId, input.workspaceId),
        ),
        orderBy: desc(Work.id),
        limit: 100,
        with: {
          workVersion: {
            orderBy: desc(WorkVersion.version),
          },
        },
      });

      console.log(query.toSQL());

      return query;
    }),
  byIdWithVersions: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db
        .select()
        .from(Work)
        .rightJoin(WorkVersion, eq(Work.id, WorkVersion.workId))
        .where(
          and(eq(Work.id, input.id), eq(Work.ownerId, ctx.session.user.id)),
        );
    }),
  create: protectedProcedure
    .input(CreateWorkSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db
        .insert(Work)
        .values({
          ...input,
          ownerId: ctx.session.user.id,
        })
        .returning();
    }),
  update: protectedProcedure
    .input(UpdateWorkSchema)
    .mutation(({ ctx, input }) => {
      const { workId, ...data } = input;

      return ctx.db
        .update(Work)
        .set(data)
        .where(and(eq(Work.id, workId), eq(Work.ownerId, ctx.session.user.id)))
        .returning();
    }),
  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db
      .delete(Work)
      .where(and(eq(Work.id, input), eq(Work.ownerId, ctx.session.user.id)));
  }),
} satisfies TRPCRouterRecord;
