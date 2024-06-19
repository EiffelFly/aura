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
    .input(z.object({ workspace_id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.Work.findMany({
        where: and(
          eq(Work.owner_id, ctx.session.user.id),
          eq(Work.workspace_id, input.workspace_id),
        ),
        orderBy: desc(Work.id),
        limit: 100,
      });
    }),
  by_id: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.Work.findFirst({
        where: and(
          eq(Work.id, input.id),
          eq(Work.owner_id, ctx.session.user.id),
        ),
      });
    }),
  works_with_versions: protectedProcedure
    .input(z.object({ workspace_id: z.string() }))
    .query(({ ctx, input }) => {
      const query = ctx.db.query.Work.findMany({
        where: and(
          eq(Work.owner_id, ctx.session.user.id),
          eq(Work.workspace_id, input.workspace_id),
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
  by_id_with_versions: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db
        .select()
        .from(Work)
        .rightJoin(WorkVersion, eq(Work.id, WorkVersion.work_id))
        .where(
          and(eq(Work.id, input.id), eq(Work.owner_id, ctx.session.user.id)),
        );
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
