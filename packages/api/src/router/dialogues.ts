import { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { and, desc, eq } from "@aura/db";

import "@aura/db/schema";

import {
  CreateDialogueSchema,
  Dialogue,
  UpdateDialogueSchema,
} from "@aura/db/schema";

import { protectedProcedure } from "../trpc";

export const dialoguesRouter = {
  all: protectedProcedure
    .input(z.object({ workspace_id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.Dialogue.findMany({
        where: and(
          eq(Dialogue.owner_id, ctx.session.user.id),
          eq(Dialogue.workspace_id, input.workspace_id),
        ),
        orderBy: desc(Dialogue.id),
        limit: 100,
      });
    }),
  all_by_version: protectedProcedure
    .input(
      z.object({
        work_version_id: z.string(),
        workspace_id: z.string(),
        with_character: z.boolean().optional(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.query.Dialogue.findMany({
        where: and(
          eq(Dialogue.owner_id, ctx.session.user.id),
          eq(Dialogue.work_version_id, input.work_version_id),
          eq(Dialogue.workspace_id, input.workspace_id),
        ),
        orderBy: desc(Dialogue.id),
        limit: 100,
        with: {
          character: input.with_character ? true : undefined,
        },
      });
    }),
  by_id: protectedProcedure
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
      return ctx.db
        .insert(Dialogue)
        .values({
          ...input,
          owner_id: ctx.session.user.id,
        })
        .returning();
    }),
  update: protectedProcedure
    .input(UpdateDialogueSchema)
    .mutation(({ ctx, input }) => {
      const { dialogue_id, ...data } = input;

      return ctx.db
        .update(Dialogue)
        .set(data)
        .where(
          and(
            eq(Dialogue.id, dialogue_id),
            eq(Dialogue.owner_id, ctx.session.user.id),
          ),
        )
        .returning();
    }),
  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db
      .delete(Dialogue)
      .where(
        and(eq(Dialogue.id, input), eq(Dialogue.owner_id, ctx.session.user.id)),
      );
  }),
} satisfies TRPCRouterRecord;
