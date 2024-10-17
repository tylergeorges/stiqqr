import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { InsertTask } from '@/lib/db/schema';
import { insertTask } from '@/lib/db/queries/project';

import { tasksQueryKey } from '@/hooks/use-tasks-query';
import { GroupedTask } from '@/types/project';
import { ProjectMember, projectMembersQueryKey } from '@/hooks/use-project-members-query';
import { generateUuid } from '@/lib/utils';

export const useCreateTaskMutation = (projectId: string) => {
  const queryClient = useQueryClient();

  const mutationFn = async (task: InsertTask) => insertTask(task);

  const queryKey = [...tasksQueryKey, projectId];

  return useMutation({
    mutationFn,

    onMutate: async task => {
      await queryClient.cancelQueries({ queryKey: queryKey });

      const prevTasks = queryClient.getQueryData<GroupedTask>(queryKey);

      const projectMembers =
        queryClient.getQueryData<ProjectMember[]>([...projectMembersQueryKey, projectId]) ?? [];

      const taskAssignee =
        task.assigneeId === null
          ? null
          : projectMembers.find(member => member.member.id === task.assigneeId);

      queryClient.setQueryData<GroupedTask>(queryKey, prev => {
        if (!task.status || !prev) return prev;

        const statusGroupIdx = prev.findIndex(group => group[0].status === task.status);

        if (statusGroupIdx < 0) {
          prev.push([
            {
              // ...task,

              assigneeId: task.assigneeId || null,
              createdAt: task.createdAt || new Date(),
              description: task.description || null,
              id: task.id || generateUuid(),
              labels: [],
              projectId: task.projectId,
              status: task.status,
              title: task.title,
              updatedAt: task.updatedAt || new Date(),
              assignee: taskAssignee
                ? {
                    joinedAt: taskAssignee?.joinedAt,
                    member: taskAssignee?.member,
                    memberId: taskAssignee?.member.id,
                    projectId: task.projectId,
                    role: taskAssignee.role
                  }
                : null
            }
          ]);

          return prev;
        }

        const statusGroup = [...prev[statusGroupIdx]];

        statusGroup.push({
          assigneeId: task.assigneeId || null,
          createdAt: task.createdAt || new Date(),
          description: task.description || null,
          id: task.id || generateUuid(),
          labels: [],
          projectId: task.projectId,
          status: task.status,
          title: task.title,
          updatedAt: task.updatedAt || new Date(),
          assignee: taskAssignee
            ? {
                joinedAt: taskAssignee?.joinedAt,
                member: taskAssignee?.member,
                memberId: taskAssignee?.member.id,
                projectId: task.projectId,
                role: taskAssignee.role
              }
            : null
        });

        return prev.map((group, idx) => {
          if (idx === statusGroupIdx) return statusGroup;

          return group;
        });
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
