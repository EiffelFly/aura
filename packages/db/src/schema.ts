import { relations, sql } from "drizzle-orm";
import {
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const Workspace = pgTable("post", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
  createdAt: timestamp("d").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
  ownerId: uuid("ownerId")
    .notNull()
    .references(() => User.id),
});

export const workspaceRelations = relations(Workspace, ({ one }) => ({
  owner: one(User, { fields: [Workspace.ownerId], references: [User.id] }),
}));

export const CreateWorkspaceSchema = createInsertSchema(Workspace, {
  name: z.string().max(256),
  ownerId: z.string(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const Work = pgTable("work", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
  content: text("content"),
  ownerId: uuid("ownerId")
    .notNull()
    .references(() => User.id),
  workspaceId: uuid("workspaceId")
    .notNull()
    .references(() => Workspace.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
});

export const workRelations = relations(Work, ({ one, many }) => ({
  owner: one(User, { fields: [Work.ownerId], references: [User.id] }),
  workspace: one(Workspace, {
    fields: [Work.workspaceId],
    references: [Workspace.id],
  }),
  workCharacter: many(WorkCharacter),
}));

export const CreateWorkSchema = createInsertSchema(Work, {
  name: z.string().max(256),
  content: z.string().optional(),
  ownerId: z.string(),
  workspaceId: z.string(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const Dialogue = pgTable("dialogue", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
  content: text("content"),
  startAt: integer("startAt").notNull(),
  endAt: integer("endAt").notNull(),
  ownerId: uuid("ownerId")
    .notNull()
    .references(() => User.id),
  workspaceId: uuid("workspaceId")
    .notNull()
    .references(() => Workspace.id),
  workId: uuid("workId")
    .notNull()
    .references(() => Work.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
});

export const dialogueRelations = relations(Dialogue, ({ one, many }) => ({
  owner: one(User, { fields: [Dialogue.ownerId], references: [User.id] }),
  workspace: one(Workspace, {
    fields: [Dialogue.workspaceId],
    references: [Workspace.id],
  }),
  work: one(Work, { fields: [Dialogue.workId], references: [Work.id] }),
  characterDialogue: many(CharacterDialogue),
}));

export const CreateDialogueSchema = createInsertSchema(Dialogue, {
  name: z.string().max(256),
  content: z.string().optional(),
  startAt: z.number(),
  endAt: z.number(),
  ownerId: z.string(),
  workspaceId: z.string(),
  workId: z.string(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const Character = pgTable("character", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
  image: text("image"),
  description: text("description"),
  ownerId: uuid("ownerId")
    .notNull()
    .references(() => User.id),
  workspaceId: uuid("workspaceId")
    .notNull()
    .references(() => Workspace.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
});

export const characterRelations = relations(Character, ({ one, many }) => ({
  owner: one(User, { fields: [Character.ownerId], references: [User.id] }),
  workspace: one(Workspace, {
    fields: [Character.workspaceId],
    references: [Workspace.id],
  }),
  workCharacter: many(WorkCharacter),
  characterDialogue: many(CharacterDialogue),
}));

export const CreateCharacterSchema = createInsertSchema(Character, {
  name: z.string().max(256),
  image: z.string().optional(),
  description: z.string().optional(),
  ownerId: z.string(),
  workspaceId: z.string(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const WorkCharacter = pgTable(
  "work_character",
  {
    workId: uuid("workId")
      .notNull()
      .references(() => Work.id),
    characterId: uuid("characterId")
      .notNull()
      .references(() => Character.id),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", {
      mode: "date",
      withTimezone: true,
    }).$onUpdateFn(() => sql`now()`),
  },
  (workCharacter) => ({
    pk: primaryKey({
      columns: [workCharacter.workId, workCharacter.characterId],
    }),
  }),
);

export const createWorkCharacterSchema = createInsertSchema(WorkCharacter, {
  workId: z.string(),
  characterId: z.string(),
}).omit({
  createdAt: true,
  updatedAt: true,
});

export const WorkCharacterRelations = relations(WorkCharacter, ({ one }) => ({
  work: one(Work, { fields: [WorkCharacter.workId], references: [Work.id] }),
  character: one(Character, {
    fields: [WorkCharacter.characterId],
    references: [Character.id],
  }),
}));

export const CharacterDialogue = pgTable(
  "character_dialogue",
  {
    characterId: uuid("characterId")
      .notNull()
      .references(() => Character.id),
    dialogueId: uuid("dialogueId")
      .notNull()
      .references(() => Dialogue.id),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt", {
      mode: "date",
      withTimezone: true,
    }).$onUpdateFn(() => sql`now()`),
  },
  (characterDialogue) => ({
    pk: primaryKey({
      columns: [characterDialogue.characterId, characterDialogue.dialogueId],
    }),
  }),
);

export const createCharacterDialogueSchema = createInsertSchema(
  CharacterDialogue,
  {
    characterId: z.string(),
    dialogueId: z.string(),
  },
).omit({
  createdAt: true,
  updatedAt: true,
});

export const CharacterDialogueRelations = relations(
  CharacterDialogue,
  ({ one }) => ({
    character: one(Character, {
      fields: [CharacterDialogue.characterId],
      references: [Character.id],
    }),
    dialogue: one(Dialogue, {
      fields: [CharacterDialogue.dialogueId],
      references: [Dialogue.id],
    }),
  }),
);

export const User = pgTable("user", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }),
  image: text("image"),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    withTimezone: true,
  }),
});

export const userRelations = relations(User, ({ many }) => ({
  workspaces: many(Workspace),
  accounts: many(Account),
}));

export const Account = pgTable(
  "account",
  {
    userId: uuid("userId")
      .notNull()
      .references(() => User.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 255 })
      .$type<"email" | "oauth" | "oidc" | "webauthn">()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("providerAccountId", { length: 255 }).notNull(),
    refresh_token: varchar("refresh_token", { length: 255 }),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const AccountRelations = relations(Account, ({ one }) => ({
  user: one(User, { fields: [Account.userId], references: [User.id] }),
}));

export const Session = pgTable("session", {
  sessionToken: varchar("sessionToken", { length: 255 }).notNull().primaryKey(),
  userId: uuid("userId")
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  expires: timestamp("expires", {
    mode: "date",
    withTimezone: true,
  }).notNull(),
});

export const SessionRelations = relations(Session, ({ one }) => ({
  user: one(User, { fields: [Session.userId], references: [User.id] }),
}));
