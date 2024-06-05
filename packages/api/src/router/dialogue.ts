import { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { and, desc, eq } from "@aura/db";

import "@aura/db/schema";

import { CreateDialogueSchema, Dialogue } from "@aura/db/schema";

import { protectedProcedure } from "../trpc";

export const dialogueRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.Dialogue.findMany({
      where: eq(Dialogue.owner_id, ctx.session.user.id),
      orderBy: desc(Dialogue.id),
      limit: 100,
    });
  }),
  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.Dialogue.findFirst({
        where: and(
          eq(Dialogue.id, input.id),
          eq(Dialogue.owner_id, ctx.session.user.id),
        ),
      });
    }),
  create: protectedProcedure
    .input(CreateDialogueSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(Dialogue).values({
        ...input,
        owner_id: ctx.session.user.id,
      });
    }),
  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db
      .delete(Dialogue)
      .where(
        and(eq(Dialogue.id, input), eq(Dialogue.owner_id, ctx.session.user.id)),
      );
  }),
} satisfies TRPCRouterRecord;
