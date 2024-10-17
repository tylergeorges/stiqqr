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

export type GroupedTask = Array<Task[]>;
