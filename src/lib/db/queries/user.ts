'use server';

import { cache } from 'react';

import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { type InsertUser, users } from '@/lib/db/schema/users';
import { projectMembers } from '@/lib/db/schema';

export const userById = cache(async (userId: string) =>
  db.select().from(users).where(eq(users.id, userId))
);

export const insertUser = async (user: InsertUser) => db.insert(users).values(user).returning();

export const getMemberById = async (memberId: string) =>
  db.query.projectMembers.findFirst({
    where: eq(projectMembers.memberId, memberId),

    columns: {
      projectId: true,
      role: true,
      joinedAt: true
    },

    with: {
      member: true,
      tasks: true,
      project: true
    }
  });

export type ProjectMember = Prettify<NonNullable<QueryReturnType<typeof getMemberById>>>;
