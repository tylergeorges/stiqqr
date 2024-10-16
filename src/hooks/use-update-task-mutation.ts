import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Task, updateTask, UpdateTask } from '@/lib/db/queries/project';

import { GroupedTask } from '@/types/project';
import { taskQueryKey } from '@/hooks/use-task-query';
import { tasksQueryKey } from '@/hooks/use-tasks-query';
import { Status } from '@/lib/db/schema';

export const useUpdateTaskMutation = (projectId: string, taskId: string) => {
  const queryClient = useQueryClient();

  const mutationFn = async (task: UpdateTask) => updateTask(task);

  const taskListQueryKey = [...tasksQueryKey, projectId];

  const queryKey = [...taskQueryKey, projectId, taskId];

  return useMutation({
    mutationFn,

    onMutate: async updatedTask => {
      await queryClient.cancelQueries({ queryKey: queryKey });
      await queryClient.cancelQueries({ queryKey: taskListQueryKey });

      const prevTask = queryClient.getQueryData<Task>(queryKey);
      const prevTasks = queryClient.getQueryData<GroupedTask>(taskListQueryKey);

      queryClient.setQueryData<Task>(queryKey, prev => {
        return { ...prev, ...updatedTask } as Task;
      });

      queryClient.setQueryData<GroupedTask>(taskListQueryKey, prev => {
        if (!prev) {
          const status = updatedTask?.status ?? Status.Todo;

          return {
            ...prevTasks,
            [status]: {
              tasks: [updatedTask]
            }
          } as GroupedTask;
        }

        const statusGroup = prev[updatedTask.status ?? Status.Todo];

        prev[updatedTask.status ?? Status.Todo] = {
          ...statusGroup,
          tasks: statusGroup.tasks.map(task =>
            task.id === updatedTask.taskId ? { ...task, ...updatedTask } : task
          )
        };

        return prev;
      });

      return { prevTask, prevTasks };
    },

    // If the mutation fails, use the context we returned above
    onError: err => {
      // queryClient.setQueryData(queryKey, context?.prevTask);

      toast.error(err.message);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
      queryClient.invalidateQueries({ queryKey: taskListQueryKey });
    }
  });
};
