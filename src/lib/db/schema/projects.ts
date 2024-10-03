import { relations } from 'drizzle-orm';
import { pgEnum, pgTable, primaryKey, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { users } from '@/lib/db/schema/users';

export const roleEnum = pgEnum('role', ['Owner', 'Admin', 'Member']);

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
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
    memberId: uuid('member_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    projectId: uuid('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    joinedAt: timestamp('joined_at', { mode: 'date' }).notNull().defaultNow()
  },
  t => ({
    pk: primaryKey({ columns: [t.projectId, t.memberId] })
  })
);

export const projectRelations = relations(projects, ({ many }) => ({
  members: many(projectMembers)
}));

export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
  project: one(projects, {
    fields: [projectMembers.projectId],
    references: [projects.id]
  }),
  member: one(users, {
    fields: [projectMembers.memberId],
    references: [users.id]
  })
}));

export const userRelations = relations(users, ({ many }) => ({
  projectMembers: many(projectMembers)
}));

export type ProjectMember = typeof projectMembers.$inferSelect;
export type InsertProjectMember = typeof projectMembers.$inferInsert;

export type InsertProject = typeof projects.$inferInsert;
