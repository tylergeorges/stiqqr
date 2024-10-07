import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { InsertTask } from '@/lib/db/schema';
import { insertTask, Task } from '@/lib/db/queries/project';

import { tasksQueryKey } from '@/hooks/use-tasks-query';
import { GroupedTask } from '@/types/project';

export const useCreateTaskMutation = (projectId: string) => {
  const queryClient = useQueryClient();

  const mutationFn = async (task: InsertTask) => insertTask(task);

  const queryKey = [...tasksQueryKey, projectId];

  return useMutation({
    mutationFn,

    onMutate: async task => {
      await queryClient.cancelQueries({ queryKey: queryKey });

      const prevTasks = queryClient.getQueryData<GroupedTask>(queryKey);

      queryClient.setQueryData<GroupedTask>(queryKey, prev => {
        if (!task.status) return prev;

        const tasks = { ...prev } as GroupedTask;

        if (!Object.hasOwn(tasks, task.status)) {
          tasks[task.status] = { tasks: [] };
        }

        const statusGroup = tasks[task.status];

        statusGroup.tasks.push(task as Task);

        return tasks;
      });

      return { prevTasks };
    },

    // If the mutation fails, use the context we returned above
    onError: (err, _, context) => {
      queryClient.setQueryData(queryKey, context?.prevTasks);

      toast.error(err.message);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
    }
  });
};
