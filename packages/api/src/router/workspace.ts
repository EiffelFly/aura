import { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { desc, eq } from "@aura/db";
import { CreateWorkspaceSchema, Workspace } from "@aura/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const workspaceRouter = {
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.Workspace.findMany({
      orderBy: desc(Workspace.id),
      limit: 100,
    });
  }),
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.Workspace.findFirst({
        where: eq(Workspace.id, input.id),
      });
    }),
  create: protectedProcedure
    .input(CreateWorkspaceSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(Workspace).values(input);
    }),
  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.delete(Workspace).where(eq(Workspace.id, input));
  }),
} satisfies TRPCRouterRecord;
