import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { InsertProject } from '@/lib/db/schema';
import { insertProject, type Project } from '@/lib/db/queries/project';

import { projectsQueryKey } from '@/hooks/use-projects-query';

export const useCreateProjectMutation = () => {
  const queryClient = useQueryClient();

  const mutationFn = async (project: InsertProject) => insertProject(project);

  return useMutation({
    mutationFn,

    onMutate: async project => {
      await queryClient.cancelQueries({ queryKey: projectsQueryKey });

      const prevProjects = queryClient.getQueryData<Project[]>(projectsQueryKey) ?? [];

      queryClient.setQueryData<Project[]>(projectsQueryKey, projects => [
        ...(projects || prevProjects),
        project
      ]);

      return { prevProjects };
    },

    // If the mutation fails, use the context we returned above
    onError: (err, _, context) => {
      queryClient.setQueryData(projectsQueryKey, context?.prevProjects);

      toast.error(err.message);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: projectsQueryKey });
    }
  });
};
