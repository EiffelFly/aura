import { relations, sql } from "drizzle-orm";
import {
  boolean,
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

export const Workspace = pgTable("workspace", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
  owner_id: uuid("owner_id")
    .notNull()
    .references(() => User.id),
});

export const workspaceRelation = relations(Workspace, ({ one }) => ({
  owner: one(User, { fields: [Workspace.owner_id], references: [User.id] }),
}));

export const CreateWorkspaceSchema = createInsertSchema(Workspace, {
  name: z.string().max(256),
}).omit({
  id: true,
  created_at: true,
  updated_at: true,
  owner_id: true,
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
  updated_at: timestamp("updated_at", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
});

export const workRelation = relations(Work, ({ one, many }) => ({
  owner: one(User, { fields: [Work.owner_id], references: [User.id] }),
  workspace: one(Workspace, {
    fields: [Work.workspace_id],
    references: [Workspace.id],
  }),
  workCharacter: many(WorkCharacter),
}));

export const CreateWorkSchema = createInsertSchema(Work, {
  name: z.string().max(256),
  content: z.string().optional(),
  workspace_id: z.string(),
}).omit({
  id: true,
  created_at: true,
  updated_at: true,
  owner_id: true,
});

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
  updated_at: timestamp("updated_at", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
});

export const dialogueRelation = relations(Dialogue, ({ one, many }) => ({
  owner: one(User, { fields: [Dialogue.owner_id], references: [User.id] }),
  workspace: one(Workspace, {
    fields: [Dialogue.workspace_id],
    references: [Workspace.id],
  }),
  work: one(Work, { fields: [Dialogue.work_id], references: [Work.id] }),
  characterDialogue: many(CharacterDialogue),
}));

export const CreateDialogueSchema = createInsertSchema(Dialogue, {
  name: z.string().max(256),
  content: z.string().optional(),
  start_at: z.number(),
  end_at: z.number(),
  workspace_id: z.string(),
  work_id: z.string(),
}).omit({
  id: true,
  created_at: true,
  updated_at: true,
  owner_id: true,
});

export const Character = pgTable("character", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
  image: text("image"),
  description: text("description"),
  owner_id: uuid("owner_id")
    .notNull()
    .references(() => User.id),
  workspace_id: uuid("workspace_id")
    .notNull()
    .references(() => Workspace.id),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => sql`now()`),
});

export const characterRelation = relations(Character, ({ one, many }) => ({
  owner: one(User, { fields: [Character.owner_id], references: [User.id] }),
  workspace: one(Workspace, {
    fields: [Character.workspace_id],
    references: [Workspace.id],
  }),
  workCharacter: many(WorkCharacter),
  characterDialogue: many(CharacterDialogue),
}));

export const CreateCharacterSchema = createInsertSchema(Character, {
  name: z.string().max(256),
  image: z.string().optional(),
  description: z.string().optional(),
  owner_id: z.string(),
  workspace_id: z.string(),
}).omit({
  id: true,
  created_at: true,
  updated_at: true,
  owner_id: true,
});

export const WorkCharacter = pgTable(
  "work_character",
  {
    work_id: uuid("work_id")
      .notNull()
      .references(() => Work.id),
    character_id: uuid("character_id")
      .notNull()
      .references(() => Character.id),
    owner_id: uuid("owner_id")
      .notNull()
      .references(() => User.id),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at", {
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

export const createWorkCharacterSchema = createInsertSchema(WorkCharacter, {
  work_id: z.string(),
  character_id: z.string(),
}).omit({
  created_at: true,
  updated_at: true,
  owner_id: true,
});

export const WorkCharacterRelation = relations(WorkCharacter, ({ one }) => ({
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
    owner_id: uuid("owner_id")
      .notNull()
      .references(() => User.id),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at", {
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

export const createCharacterDialogueSchema = createInsertSchema(
  CharacterDialogue,
  {
    character_id: z.string(),
    dialogue_id: z.string(),
  },
).omit({
  created_at: true,
  updated_at: true,
  owner_id: true,
});

export const CharacterDialogueRelation = relations(
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
  image: text("image"),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("emailVerified", {
    mode: "date",
    withTimezone: true,
  }),
  onboarded: boolean("onboarded").default(false),
});

export const userRelation = relations(User, ({ many }) => ({
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

export const AccountRelation = relations(Account, ({ one }) => ({
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

export const SessionRelation = relations(Session, ({ one }) => ({
  user: one(User, { fields: [Session.userId], references: [User.id] }),
}));
