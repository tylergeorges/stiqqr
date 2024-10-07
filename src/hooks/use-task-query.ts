import type { QueryKey, UseQueryOptions } from '@tanstack/react-query';

import { getTaskInfo, Task } from '@/lib/db/queries/project';

export const taskQueryKey = ['task'];

export const useTaskQuery = (
  projectId: string,
  taskId: string,
  queryOptions?: UseQueryOptions<Task | undefined, Error, Task | undefined, QueryKey>
) => {
  const queryFn = async () => {
    const task = await getTaskInfo(projectId, taskId);

    return task;
  };

  return { queryKey: [...taskQueryKey, projectId, taskId], queryFn, ...queryOptions };
};
