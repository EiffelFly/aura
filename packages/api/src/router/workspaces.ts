import { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { and, desc, eq } from "@aura/db";
import {
  CreateWorkspaceSchema,
  UpdateWorkspaceSchema,
  Workspace,
} from "@aura/db/schema";

import { protectedProcedure } from "../trpc";

export const workspacesRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.Workspace.findMany({
      where: eq(Workspace.owner_id, ctx.session.user.id),
      orderBy: desc(Workspace.id),
      limit: 100,
    });
  }),
  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.Workspace.findFirst({
        where: and(
          eq(Workspace.id, input.id),
          eq(Workspace.owner_id, ctx.session.user.id),
        ),
      });
    }),
  create: protectedProcedure
    .input(CreateWorkspaceSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db
        .insert(Workspace)
        .values({
          ...input,
          owner_id: ctx.session.user.id,
        })
        .returning();
    }),
  update: protectedProcedure
    .input(UpdateWorkspaceSchema)
    .mutation(({ ctx, input }) => {
      const { workspace_id, ...data } = input;

      return ctx.db
        .update(Workspace)
        .set(data)
        .where(
          and(
            eq(Workspace.id, workspace_id),
            eq(Workspace.owner_id, ctx.session.user.id),
          ),
        )
        .returning();
    }),
  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db
      .delete(Workspace)
      .where(
        and(
          eq(Workspace.id, input),
          eq(Workspace.owner_id, ctx.session.user.id),
        ),
      );
  }),
} satisfies TRPCRouterRecord;
