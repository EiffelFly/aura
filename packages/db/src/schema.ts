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
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
  owner_id: uuid("owner_id")
    .notNull()
    .references(() => User.id),
});

export const workspaceRelations = relations(Workspace, ({ one }) => ({
  owner: one(User, { fields: [Workspace.owner_id], references: [User.id] }),
}));

export const CreateWorkspaceSchema = createInsertSchema(Workspace, {
  name: z.string().max(256),
}).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const Work = pgTable("work", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
  content: text("content"),
  owner_id: uuid("owner_id")
    .notNull()
    .references(() => User.id),
  workspace_id: uuid("workspace_id")
    .notNull()
    .references(() => Workspace.id),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
});

export const workRelations = relations(Work, ({ one, many }) => ({
  owner: one(User, { fields: [Work.owner_id], references: [User.id] }),
  workspace: one(Workspace, {
    fields: [Work.workspace_id],
    references: [Workspace.id],
  }),
  workCharacter: many(WorkCharacter),
}));

export const Dialogue = pgTable("dialogue", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
  content: text("content"),
  start_at: integer("start_at").notNull(),
  end_at: integer("end_at").notNull(),
  owner_id: uuid("owner_id")
    .notNull()
    .references(() => User.id),
  workspace_id: uuid("workspace_id")
    .notNull()
    .references(() => Workspace.id),
  work_id: uuid("work_id")
    .notNull()
    .references(() => Work.id),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
});

export const dialogueRelations = relations(Dialogue, ({ one, many }) => ({
  owner: one(User, { fields: [Dialogue.owner_id], references: [User.id] }),
  workspace: one(Workspace, {
    fields: [Dialogue.workspace_id],
    references: [Workspace.id],
  }),
  work: one(Work, { fields: [Dialogue.work_id], references: [Work.id] }),
  characterDialogue: many(CharacterDialogue),
}));

export const Character = pgTable("character", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
  avatar: text("avatar"),
  description: text("description"),
  owner_id: uuid("owner_id")
    .notNull()
    .references(() => User.id),
  workspace_id: uuid("workspace_id")
    .notNull()
    .references(() => Workspace.id),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
});

export const characterRelations = relations(Character, ({ one, many }) => ({
  owner: one(User, { fields: [Character.owner_id], references: [User.id] }),
  workspace: one(Workspace, {
    fields: [Character.workspace_id],
    references: [Workspace.id],
  }),
  workCharacter: many(WorkCharacter),
  characterDialogue: many(CharacterDialogue),
}));

export const WorkCharacter = pgTable(
  "work_character",
  {
    work_id: uuid("work_id")
      .notNull()
      .references(() => Work.id),
    character_id: uuid("character_id")
      .notNull()
      .references(() => Character.id),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updatedAt", {
      mode: "date",
      withTimezone: true,
    }).$onUpdateFn(() => sql`now()`),
  },
  (workCharacter) => ({
    pk: primaryKey({
      columns: [workCharacter.work_id, workCharacter.character_id],
    }),
  }),
);

export const WorkCharacterRelations = relations(WorkCharacter, ({ one }) => ({
  work: one(Work, { fields: [WorkCharacter.work_id], references: [Work.id] }),
  character: one(Character, {
    fields: [WorkCharacter.character_id],
    references: [Character.id],
  }),
}));

export const CharacterDialogue = pgTable(
  "character_dialogue",
  {
    character_id: uuid("character_id")
      .notNull()
      .references(() => Character.id),
    dialogue_id: uuid("dialogue_id")
      .notNull()
      .references(() => Dialogue.id),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updatedAt", {
      mode: "date",
      withTimezone: true,
    }).$onUpdateFn(() => sql`now()`),
  },
  (characterDialogue) => ({
    pk: primaryKey({
      columns: [characterDialogue.character_id, characterDialogue.dialogue_id],
    }),
  }),
);

export const CharacterDialogueRelations = relations(
  CharacterDialogue,
  ({ one }) => ({
    character: one(Character, {
      fields: [CharacterDialogue.character_id],
      references: [Character.id],
    }),
    dialogue: one(Dialogue, {
      fields: [CharacterDialogue.dialogue_id],
      references: [Dialogue.id],
    }),
  }),
);

export const User = pgTable("user", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }),
  avatar: text("avatar"),
  email: varchar("email", { length: 255 }).notNull(),
  email_verified: timestamp("emailVerified", {
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
    user_id: uuid("user_id")
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
  user: one(User, { fields: [Account.user_id], references: [User.id] }),
}));

export const Session = pgTable("session", {
  sessionToken: varchar("sessionToken", { length: 255 }).notNull().primaryKey(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  expires: timestamp("expires", {
    mode: "date",
    withTimezone: true,
  }).notNull(),
});

export const SessionRelations = relations(Session, ({ one }) => ({
  user: one(User, { fields: [Session.user_id], references: [User.id] }),
}));
