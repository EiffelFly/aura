import { relations } from "drizzle-orm";
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
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const Workspace = pgTable("workspaces", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  name: varchar("name", { length: 256 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => new Date()),
  ownerId: uuid("ownerId")
    .notNull()
    .references(() => User.id),
});

export const workspaceRelation = relations(Workspace, ({ one }) => ({
  owner: one(User, { fields: [Workspace.ownerId], references: [User.id] }),
}));

export const CreateWorkspaceSchema = createInsertSchema(Workspace, {
  name: z.string().max(256),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  ownerId: true,
});

export const UpdateWorkspaceSchema = createInsertSchema(Workspace, {
  name: z.string().max(256).optional(),
})
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    ownerId: true,
  })
  .setKey("workspaceId", z.string());

export const Work = pgTable("works", {
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
  }).$onUpdateFn(() => new Date()),
  processed: boolean("processed").default(false),
  latestVersion: integer("latestVersion").notNull().default(0),
});

export const WorkVersion = pgTable("workVersions", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  version: integer("version").notNull(),
  workId: uuid("workId")
    .notNull()
    .references(() => Work.id),
  content: text("content"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => new Date()),
  ownerId: uuid("ownerId")
    .notNull()
    .references(() => User.id),
});

export const CreateWorkVersionSchema = createInsertSchema(WorkVersion, {
  version: z.number(),
  workId: z.string(),
  content: z.string().optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  ownerId: true,
});

export const workVersionRelation = relations(WorkVersion, ({ one }) => ({
  work: one(Work, {
    fields: [WorkVersion.workId],
    references: [Work.id],
  }),
  owner: one(User, { fields: [WorkVersion.ownerId], references: [User.id] }),
}));

export const workRelation = relations(Work, ({ one, many }) => ({
  owner: one(User, { fields: [Work.ownerId], references: [User.id] }),
  workspace: one(Workspace, {
    fields: [Work.workspaceId],
    references: [Workspace.id],
  }),
  workCharacter: many(WorkCharacter),
  workVersion: many(WorkVersion),
}));

export const CreateWorkSchema = createInsertSchema(Work, {
  name: z.string().max(256),
  content: z.string().optional(),
  workspaceId: z.string(),
  processed: z.boolean().optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  ownerId: true,
});

export const UpdateWorkSchema = createInsertSchema(Work, {
  name: z.string().max(256).optional(),
  content: z.string().optional(),
  processed: z.boolean().optional(),
})
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    ownerId: true,
    workspaceId: true,
  })
  .setKey("workId", z.string());

export const Dialogue = pgTable("dialogues", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  content: text("content"),
  summary: text("summary"),
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
  workVersionId: uuid("workVersionId")
    .notNull()
    .references(() => WorkVersion.id),
  characterId: uuid("characterId")
    .notNull()
    .references(() => Character.id),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", {
    mode: "date",
    withTimezone: true,
  }).$onUpdateFn(() => new Date()),
});

export const dialogueRelation = relations(Dialogue, ({ one, many }) => ({
  owner: one(User, { fields: [Dialogue.ownerId], references: [User.id] }),
  workspace: one(Workspace, {
    fields: [Dialogue.workspaceId],
    references: [Workspace.id],
  }),
  work: one(Work, { fields: [Dialogue.workId], references: [Work.id] }),
  characterDialogue: many(CharacterDialogue),
  character: one(Character, {
    fields: [Dialogue.characterId],
    references: [Character.id],
  }),
  workVersion: one(WorkVersion, {
    fields: [Dialogue.workVersionId],
    references: [WorkVersion.id],
  }),
}));

export const CreateDialogueSchema = createInsertSchema(Dialogue, {
  content: z.string().optional(),
  summary: z.string().optional(),
  startAt: z.number(),
  endAt: z.number(),
  workspaceId: z.string(),
  workId: z.string(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  ownerId: true,
});

export const SelectDialogueSchema = createSelectSchema(Dialogue);

export type TDialogue = z.infer<typeof SelectDialogueSchema>;

export const UpdateDialogueSchema = createInsertSchema(Dialogue, {
  content: z.string().optional(),
  summary: z.string().optional(),
  startAt: z.number().optional(),
  endAt: z.number().optional(),
})
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    ownerId: true,
    workspaceId: true,
    workId: true,
  })
  .setKey("dialogueId", z.string());

export const Character = pgTable("characters", {
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
  }).$onUpdateFn(() => new Date()),
});

export const characterRelation = relations(Character, ({ one, many }) => ({
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
  ownerId: true,
});

export const UpdateCharacterSchema = createInsertSchema(Character, {
  name: z.string().max(256).optional(),
  image: z.string().optional(),
  description: z.string().optional(),
})
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    ownerId: true,
    workspaceId: true,
  })
  .setKey("characterId", z.string());

export const WorkCharacter = pgTable(
  "workCharacters",
  {
    workId: uuid("workId")
      .notNull()
      .references(() => Work.id),
    characterId: uuid("characterId")
      .notNull()
      .references(() => Character.id),
    ownerId: uuid("ownerId")
      .notNull()
      .references(() => User.id),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    workspaceId: uuid("workspaceId")
      .notNull()
      .references(() => Workspace.id),
    updatedAt: timestamp("updatedAt", {
      mode: "date",
      withTimezone: true,
    }).$onUpdateFn(() => new Date()),
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
  workspaceId: z.string(),
}).omit({
  createdAt: true,
  updatedAt: true,
  ownerId: true,
});

export const WorkCharacterRelation = relations(WorkCharacter, ({ one }) => ({
  work: one(Work, { fields: [WorkCharacter.workId], references: [Work.id] }),
  workspace: one(Workspace, {
    fields: [WorkCharacter.workspaceId],
    references: [Workspace.id],
  }),
  character: one(Character, {
    fields: [WorkCharacter.characterId],
    references: [Character.id],
  }),
}));

export const CharacterDialogue = pgTable(
  "characterDialogues",
  {
    characterId: uuid("characterId")
      .notNull()
      .references(() => Character.id),
    dialogueId: uuid("dialogueId")
      .notNull()
      .references(() => Dialogue.id),
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
    }).$onUpdateFn(() => new Date()),
  },
  (characterDialogue) => ({
    pk: primaryKey({
      columns: [characterDialogue.characterId, characterDialogue.dialogueId],
    }),
  }),
);

export const CreateCharacterDialogueSchema = createInsertSchema(
  CharacterDialogue,
  {
    characterId: z.string(),
    dialogueId: z.string(),
    workspaceId: z.string(),
  },
).omit({
  createdAt: true,
  updatedAt: true,
  ownerId: true,
});

export const CharacterDialogueRelation = relations(
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
    workspace: one(Workspace, {
      fields: [CharacterDialogue.workspaceId],
      references: [Workspace.id],
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
