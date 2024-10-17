import { relations } from 'drizzle-orm';
import { pgEnum, pgTable, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { users } from '@/lib/db/schema/users';
import { enumToPgEnum } from '@/lib/utils';

export enum Role {
  Owner = 'owner',
  Admin = 'admin',
  Member = 'member'
}

export enum Status {
  Todo = 'todo',
  InProgress = 'in-progress',
  Backlog = 'backlog',
  Canceled = 'canceled',
  Done = 'done'
}

export const role = pgEnum('role', enumToPgEnum(Role));
// export const role= pgEnum('role', enumToPgEnum(Role));
export const status = pgEnum('status', enumToPgEnum(Status));

export const labels = pgTable('labels', {
  id: uuid('id').primaryKey().notNull().defaultRandom().unique(),
  name: text('name').notNull(),
  color: text('color').notNull(),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  taskId: uuid('task_id').references(() => tasks.id, { onDelete: 'cascade' })
});

export const tasks = pgTable('tasks', {
  id: uuid('id').primaryKey().notNull().defaultRandom().unique(),
  title: text('title').notNull(),
  description: text('description'),
  status: status('status').default(Status.Todo).notNull(),
  projectId: uuid('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
  assigneeId: uuid('assignee_id').references(() => users.id, { onDelete: 'cascade' })
});

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().notNull().defaultRandom().unique(),
  inviteCode: uuid('invite_code').notNull().defaultRandom(),
  ownerId: uuid('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  icon: text('icon')
});

export const projectMembers = pgTable(
  'project_members',
  {
    role: role('role').default(Role.Member).notNull(),
    memberId: uuid('member_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    projectId: uuid('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    joinedAt: timestamp('joined_at', { mode: 'date' }).notNull().defaultNow()
  },
  t => ({
    pk: primaryKey({ columns: [t.memberId, t.projectId] })
  })
);

export const labelsRelations = relations(labels, ({ one }) => ({
  project: one(projects, {
    fields: [labels.projectId],
    references: [projects.id]
  }),
  task: one(tasks, {
    fields: [labels.taskId],
    references: [tasks.id]
  })
}));

export const projectRelations = relations(projects, ({ many }) => ({
  members: many(projectMembers),
  labels: many(labels)
}));

export const taskRelations = relations(tasks, ({ many, one }) => ({
  labels: many(labels),
  assignee: one(projectMembers, {
    fields: [tasks.assigneeId],
    references: [projectMembers.memberId]
  })
}));

export const projectMembersRelations = relations(projectMembers, ({ one, many }) => ({
  project: one(projects, {
    fields: [projectMembers.projectId],
    references: [projects.id]
  }),
  member: one(users, {
    fields: [projectMembers.memberId],
    references: [users.id]
  }),
  tasks: many(tasks)
}));

export const userRelations = relations(users, ({ many }) => ({
  projectMembers: many(projectMembers)
}));

export type InsertProjectMember = typeof projectMembers.$inferInsert;

export type InsertTask = typeof tasks.$inferInsert;

export type InsertProject = typeof projects.$inferInsert;

export type ProjectLabel = typeof labels.$inferSelect;
export type InsertLabel = typeof labels.$inferInsert;
