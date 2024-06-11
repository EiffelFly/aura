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

export const Workspace = pgTable("workspaces", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => new Date()),
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

export const UpdateWorkspaceSchema = createInsertSchema(Workspace, {
  name: z.string().max(256).optional(),
})
  .omit({
    id: true,
    created_at: true,
    updated_at: true,
    owner_id: true,
  })
  .setKey("workspace_id", z.string());

export const Work = pgTable("works", {
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
  }).$onUpdateFn(() => new Date()),
  processed: boolean("processed").default(false),
});

export const WorkVersion = pgTable("work_versions", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  version: integer("version").notNull(),
  work_id: uuid("work_id")
    .notNull()
    .references(() => Work.id),
  content: text("content"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => new Date()),
});

export const workVersionRelation = relations(WorkVersion, ({ one, many }) => ({
  work: one(Work, {
    fields: [WorkVersion.work_id],
    references: [Work.id],
  }),
}));

export const workRelation = relations(Work, ({ one, many }) => ({
  owner: one(User, { fields: [Work.owner_id], references: [User.id] }),
  workspace: one(Workspace, {
    fields: [Work.workspace_id],
    references: [Workspace.id],
  }),
  workCharacter: many(WorkCharacter),
  workVersion: many(WorkVersion),
}));

export const CreateWorkSchema = createInsertSchema(Work, {
  name: z.string().max(256),
  content: z.string().optional(),
  workspace_id: z.string(),
  processed: z.boolean().optional(),
}).omit({
  id: true,
  created_at: true,
  updated_at: true,
  owner_id: true,
});

export const UpdateWorkSchema = createInsertSchema(Work, {
  name: z.string().max(256).optional(),
  content: z.string().optional(),
  processed: z.boolean().optional(),
})
  .omit({
    id: true,
    created_at: true,
    updated_at: true,
    owner_id: true,
    workspace_id: true,
  })
  .setKey("work_id", z.string());

export const Dialogue = pgTable("dialogues", {
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
  }).$onUpdateFn(() => new Date()),
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

export const UpdateDialogueSchema = createInsertSchema(Dialogue, {
  name: z.string().max(256).optional(),
  content: z.string().optional(),
  start_at: z.number().optional(),
  end_at: z.number().optional(),
})
  .omit({
    id: true,
    created_at: true,
    updated_at: true,
    owner_id: true,
    workspace_id: true,
    work_id: true,
  })
  .setKey("dialogue_id", z.string());

export const Character = pgTable("characters", {
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
  }).$onUpdateFn(() => new Date()),
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

export const UpdateCharacterSchema = createInsertSchema(Character, {
  name: z.string().max(256).optional(),
  image: z.string().optional(),
  description: z.string().optional(),
})
  .omit({
    id: true,
    created_at: true,
    updated_at: true,
    owner_id: true,
    workspace_id: true,
  })
  .setKey("character_id", z.string());

export const WorkCharacter = pgTable(
  "work_characters",
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
    }).$onUpdateFn(() => new Date()),
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
  "character_dialogues",
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
    }).$onUpdateFn(() => new Date()),
  },
  (characterDialogue) => ({
    pk: primaryKey({
      columns: [characterDialogue.character_id, characterDialogue.dialogue_id],
    }),
  }),
);

export const CreateCharacterDialogueSchema = createInsertSchema(
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

export const User = pgTable("users", {
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
  "accounts",
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

export const Session = pgTable("sessions", {
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
