import { Task } from '@/lib/db/queries/project';
import { Status } from '@/lib/db/schema';

export interface TaskLabel {
  color: string;
  value: string;
}

export interface TaskGroup {
  value: Status;
  label: string;
}

// export interface Task {
//   name: string;
//   status: Status;
//   assignee: ProjectMember;
//   labels: ProjectLabel[];
//   createdAt: Date;
//   updatedAt: Date;
//   project: Project;
// }

export type GroupedTask = Record<Status, { tasks: Task[] }>;
// export type GroupedTask = Record<Status, { tasks: Task[]; group: TaskGroup }>;
