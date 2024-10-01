import { Member, Project } from '@/types';

export type TaskStatus = 'todo' | 'done' | 'in-progress' | 'backlog' | 'canceled';

export interface TaskLabel {
  color: string;
  value: string;
}

export interface TaskGroup {
  value: TaskStatus;
  label: string;
}

export interface Task {
  name: string;
  status: TaskStatus;
  members: Member[];
  labels: TaskLabel[];
  createdAt: Date;
  updatedAt: Date;
  project: Project;
}

export type GroupedTask = Record<TaskStatus, { tasks: Task[]; group: TaskGroup }>;
