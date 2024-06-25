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
    .input(z.object({ workspaceId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.Dialogue.findMany({
        where: and(
          eq(Dialogue.ownerId, ctx.session.user.id),
          eq(Dialogue.workspaceId, input.workspaceId),
        ),
        orderBy: desc(Dialogue.id),
        limit: 100,
      });
    }),
  allByVersion: protectedProcedure
    .input(
      z.object({
        workVersionId: z.string(),
        workspaceId: z.string(),
        withCharacter: z.boolean().optional(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.query.Dialogue.findMany({
        where: and(
          eq(Dialogue.ownerId, ctx.session.user.id),
          eq(Dialogue.workVersionId, input.workVersionId),
          eq(Dialogue.workspaceId, input.workspaceId),
        ),
        orderBy: desc(Dialogue.id),
        limit: 100,
        with: {
          character: input.withCharacter ? true : undefined,
        },
      });
    }),
  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.Dialogue.findFirst({
        where: and(
          eq(Dialogue.id, input.id),
          eq(Dialogue.ownerId, ctx.session.user.id),
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
          ownerId: ctx.session.user.id,
        })
        .returning();
    }),
  update: protectedProcedure
    .input(UpdateDialogueSchema)
    .mutation(({ ctx, input }) => {
      const { dialogueId, ...data } = input;

      return ctx.db
        .update(Dialogue)
        .set(data)
        .where(
          and(
            eq(Dialogue.id, dialogueId),
            eq(Dialogue.ownerId, ctx.session.user.id),
          ),
        )
        .returning();
    }),
  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db
      .delete(Dialogue)
      .where(
        and(eq(Dialogue.id, input), eq(Dialogue.ownerId, ctx.session.user.id)),
      );
  }),
} satisfies TRPCRouterRecord;
