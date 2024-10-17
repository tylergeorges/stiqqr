import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Task, updateTask, UpdateTask } from '@/lib/db/queries/project';
import { GroupedTask } from '@/types/project';

import { taskQueryKey } from '@/hooks/use-task-query';
import { tasksQueryKey } from '@/hooks/use-tasks-query';
import { ProjectMember, projectMembersQueryKey } from '@/hooks/use-project-members-query';

export const useUpdateTaskMutation = (projectId: string, taskId?: string) => {
  const queryClient = useQueryClient();

  const mutationFn = async (task: UpdateTask) => updateTask(task);

  const taskListQueryKey = [...tasksQueryKey, projectId];

  return useMutation({
    mutationFn,

    onMutate: async baseUpdatedTask => {
      const queryKey = [...taskQueryKey, projectId, taskId ?? baseUpdatedTask.taskId];

      await queryClient.cancelQueries({ queryKey: queryKey });
      await queryClient.cancelQueries({ queryKey: taskListQueryKey });

      const prevTask = queryClient.getQueryData<Task>(queryKey);
      const prevTasks = queryClient.getQueryData<GroupedTask>(taskListQueryKey);

      const projectMembers =
        queryClient.getQueryData<ProjectMember[]>([...projectMembersQueryKey, projectId]) ?? [];

      const taskAssignee =
        baseUpdatedTask.assigneeId === null
          ? null
          : projectMembers.find(member => member.member.id === baseUpdatedTask.assigneeId);

      const updatedTask = {
        ...prevTask,
        ...baseUpdatedTask,
        status: baseUpdatedTask.status,
        assigneeId: taskAssignee?.member.id || null,
        assignee: taskAssignee
          ? {
              joinedAt: taskAssignee?.joinedAt,
              member: taskAssignee?.member,
              memberId: taskAssignee?.member.id,
              projectId: baseUpdatedTask.projectId,
              role: taskAssignee.role
            }
          : null
      } as Task;

      queryClient.setQueryData<Task>(queryKey, updatedTask);
      queryClient.setQueryData<GroupedTask>(taskListQueryKey, prev => {
        if (!prev) {
          return [[updatedTask]];
        }

        return prev.map(group => {
          if (group[0].status === updatedTask.status) {
            return group.map(task => {
              if (task.id === baseUpdatedTask.taskId) {
                return { ...task, ...updatedTask };
              }

              return task;
            });
          }
          return group;
        });
      });

      return { prevTask, prevTasks, queryKey: queryKey };
    },

    // If the mutation fails, use the context we returned above
    onError: (err, _, context) => {
      queryClient.setQueryData(context?.queryKey ?? [], context?.prevTask);
      queryClient.setQueryData(taskListQueryKey, context?.prevTasks);

      toast.error(err.message);
    },

    onSettled: (__, _, task) => {
      queryClient.invalidateQueries({ queryKey: [...taskQueryKey, projectId, task.taskId] });
      queryClient.invalidateQueries({ queryKey: taskListQueryKey });
    }
  });
};
