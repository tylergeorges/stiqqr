import type { QueryKey, UseQueryOptions } from '@tanstack/react-query';

import type { GroupedTask } from '@/types/project';
import { getProjectTasks, type Task } from '@/lib/db/queries/project';
import { Status } from '@/lib/db/schema/projects';

import { capitalize } from '@/lib/utils';

export const tasksQueryKey = ['tasks'];

export const getGroupLabel = (group: Status) => {
  if (group.includes('-')) {
    return group.split('-').map(capitalize).join(' ');
  }

  return capitalize(group);
};

const groupTasks = (tasks: Task[]): GroupedTask => {
  const taskLookup = [] as GroupedTask;

  const tasksIndex = {} as Record<Status, number>;

  for (let i = 0; i < tasks.length; i++) {
    const projectTask = tasks[i];

    const issueGroupIdx = tasksIndex[projectTask.status];

    if (issueGroupIdx === undefined) {
      taskLookup.push([]);
      tasksIndex[projectTask.status] = taskLookup.length - 1;
    }

    taskLookup[tasksIndex[projectTask.status]].push(projectTask);
  }

  return taskLookup;
};

export const useTasksQuery = (
  projectId: string,
  queryOptions?: UseQueryOptions<GroupedTask, Error, GroupedTask, QueryKey>
) => {
  const queryFn = async (): Promise<GroupedTask> => {
    const tasks = await getProjectTasks(projectId);

    return groupTasks(tasks);
  };

  return { queryKey: [...tasksQueryKey, projectId], queryFn, ...queryOptions };
};
