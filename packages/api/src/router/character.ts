import "@aura/db/schema";

import { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { and, desc, eq } from "@aura/db";
import { Character, CreateDialogueSchema } from "@aura/db/schema";

import { protectedProcedure } from "../trpc";

export const characterRouter = {
  all: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.Character.findMany({
      where: eq(Character.owner_id, ctx.session.user.id),
      orderBy: desc(Character.id),
      limit: 100,
    });
  }),
  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.Character.findFirst({
        where: and(
          eq(Character.id, input.id),
          eq(Character.owner_id, ctx.session.user.id),
        ),
      });
    }),
  create: protectedProcedure
    .input(CreateDialogueSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db
        .insert(Character)
        .values({
          ...input,
          owner_id: ctx.session.user.id,
        })
        .returning();
    }),
  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db
      .delete(Character)
      .where(
        and(
          eq(Character.id, input),
          eq(Character.owner_id, ctx.session.user.id),
        ),
      );
  }),
} satisfies TRPCRouterRecord;
