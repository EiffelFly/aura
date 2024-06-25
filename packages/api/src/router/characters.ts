import "@aura/db/schema";

import { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { and, desc, eq } from "@aura/db";
import {
  Character,
  CreateCharacterSchema,
  UpdateCharacterSchema,
} from "@aura/db/schema";

import { protectedProcedure } from "../trpc";

export const charactersRouter = {
  all: protectedProcedure
    .input(z.object({ workspaceId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.Character.findMany({
        where: and(
          eq(Character.ownerId, ctx.session.user.id),
          eq(Character.workspaceId, input.workspaceId),
        ),
        orderBy: desc(Character.id),
        limit: 100,
      });
    }),
  byId: protectedProcedure
    .input(z.object({ characterId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.Character.findFirst({
        where: and(
          eq(Character.id, input.characterId),
          eq(Character.ownerId, ctx.session.user.id),
        ),
      });
    }),
  create: protectedProcedure
    .input(CreateCharacterSchema)
    .mutation(({ ctx, input }) => {
      return ctx.db
        .insert(Character)
        .values({
          ...input,
          ownerId: ctx.session.user.id,
        })
        .returning();
    }),
  update: protectedProcedure
    .input(UpdateCharacterSchema)
    .mutation(({ ctx, input }) => {
      const { characterId, ...data } = input;

      return ctx.db
        .update(Character)
        .set(data)
        .where(
          and(
            eq(Character.id, characterId),
            eq(Character.ownerId, ctx.session.user.id),
          ),
        )
        .returning();
    }),
  delete: protectedProcedure
    .input(z.object({ characterId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db
        .delete(Character)
        .where(
          and(
            eq(Character.id, input.characterId),
            eq(Character.ownerId, ctx.session.user.id),
          ),
        );
    }),
} satisfies TRPCRouterRecord;
