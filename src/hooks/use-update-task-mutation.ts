import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Task, updateTask, UpdateTask } from '@/lib/db/queries/project';

import { taskQueryKey } from '@/hooks/use-task-query';

export const useUpdateTaskMutation = (projectId: string, taskId: string) => {
  const queryClient = useQueryClient();

  const mutationFn = async (task: UpdateTask) => updateTask(task);

  const queryKey = [...taskQueryKey, projectId, taskId];

  return useMutation({
    mutationFn,

    // onMutate: async task => {
    //   await queryClient.cancelQueries({ queryKey: queryKey });

    //   const prevTask = queryClient.getQueryData<Task>(queryKey);

    //   queryClient.setQueryData<Task>(queryKey, prev => {
    //     return { ...prev, ...task } as Task;
    //   });

    //   return { prevTask };
    // },

    // If the mutation fails, use the context we returned above
    onError: err => {
      // queryClient.setQueryData(queryKey, context?.prevTask);

      toast.error(err.message);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
    }
  });
};
