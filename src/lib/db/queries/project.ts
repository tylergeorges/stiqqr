'use server';

import { eq, asc, and } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';

import { db } from '@/lib/db';
import {
  InsertProject,
  InsertTask,
  projectMembers,
  projects,
  Role,
  Status,
  tasks
} from '@/lib/db/schema';

export const getProjectInfo = async (projectId: string, memberId: string) => {
  return db.query.projectMembers.findFirst({
    where: and(eq(projectMembers.memberId, memberId), eq(projectMembers.projectId, projectId)),

    columns: {
      joinedAt: true,
      role: true
    },

    with: {
      project: {
        columns: {
          name: true,
          id: true,
          icon: true,
          inviteCode: true,
          ownerId: true
        }
      }
    }
  });
};

export const getTaskInfo = async (projectId: string, taskId: string) => {
  return db.query.tasks.findFirst({
    where: and(eq(tasks.projectId, projectId), eq(tasks.id, taskId)),

    columns: {
      assigneeId: true,
      description: true,
      id: true,
      status: true,
      title: true,
      createdAt: true,
      projectId: true,
      updatedAt: true
    },

    with: {
      labels: true,
      assignee: {
        with: {
          member: true
        }
      }
    }
  });
};

export const getProjectTasks = async (projectId: string) => {
  return db.query.tasks.findMany({
    where: and(eq(tasks.projectId, projectId)),

    columns: {
      assigneeId: true,
      description: true,
      id: true,
      status: true,
      title: true,
      projectId: true,
      createdAt: true,
      updatedAt: true
    },

    with: {
      labels: true,
      assignee: {
        with: {
          member: true
        }
      }
    }
  });
};

export const addMemberToProject = async (inviteCode: string, memberId: string) => {
  const project = await db.query.projects.findFirst({
    where: eq(projects.inviteCode, inviteCode)
  });

  if (!project) throw new Error('Project does not exist.');

  const [projectMember] = await db
    .insert(projectMembers)
    .values({
      memberId: memberId,
      projectId: project.id,
      role: Role.Member
    })
    .returning();

  return getProjectInfo(project.id, projectMember.memberId);
};

export const updateTask = async ({
  description,
  taskId,
  title,
  assigneeId,
  status,
  projectId
}: UpdateTask) => {
  await db
    .update(tasks)
    .set({ title, assigneeId, description, projectId, status })
    .where(eq(tasks.id, taskId));
  // .returning();

  // return getTaskInfo(task.projectId, task.id);
};

export const insertTask = async ({
  description,
  projectId,
  title,
  assigneeId,
  status
}: InsertTask) => {
  const [task] = await db
    .insert(tasks)
    .values({ description, projectId, title, assigneeId, status })
    .returning();

  return getTaskInfo(task.projectId, task.id);
};

export const insertProject = async ({ name, ownerId, icon }: InsertProject) => {
  const defaultProjectId = randomUUID();

  await db.insert(projects).values({ name, ownerId, icon, id: defaultProjectId }).returning();

  await db
    .insert(projectMembers)
    .values({ memberId: ownerId, projectId: defaultProjectId, role: Role.Owner });

  return getProjectInfo(defaultProjectId, ownerId);
};

export const getProjectFromInvite = async (inviteCode: string, memberId: string) => {
  const project = await db.query.projects.findFirst({
    where: eq(projects.inviteCode, inviteCode)
  });

  if (!project) throw new Error('Project does not exist.');

  return db.query.projectMembers.findFirst({
    where: and(eq(projectMembers.memberId, memberId), eq(projectMembers.projectId, project.id)),

    columns: {
      projectId: true,
      role: true
    },

    with: {
      project: {
        columns: {
          name: true,
          id: true,
          icon: true,
          inviteCode: true,
          ownerId: true
        }
      }
    }
  });
};

export const getProjectsForMember = async (memberId: string) =>
  db.query.projectMembers.findMany({
    where: eq(projectMembers.memberId, memberId),
    columns: {
      joinedAt: true,
      role: true
    },
    orderBy: asc(projectMembers.joinedAt),
    with: {
      project: {
        columns: {
          name: true,
          id: true,
          icon: true,
          ownerId: true,
          inviteCode: true
        }
      }
    }
  });

export const getProjectMembers = async (projectId: string) =>
  db.query.projectMembers.findMany({
    where: eq(projectMembers.projectId, projectId),
    columns: {
      joinedAt: true,
      role: true
    },
    orderBy: asc(projectMembers.joinedAt),
    with: {
      member: true
    }
  });

export type Project = Prettify<NonNullable<QueryReturnType<typeof getProjectInfo>>>;

export type Task = Prettify<NonNullable<QueryReturnType<typeof getTaskInfo>>>;

export type UpdateTask = {
  title?: string;
  description?: string;
  assigneeId?: string | null;
  status?: Status;
  taskId: string;
  projectId: string;
};
