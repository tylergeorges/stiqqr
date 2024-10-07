import type { QueryKey, UseQueryOptions } from '@tanstack/react-query';

import { getProjectInfo, type Project } from '@/lib/db/queries/project';

export const projectQueryKey = ['project'];

export const useProjectQuery = (
  projectId: string,
  memberId: string,
  queryOptions?: UseQueryOptions<Project | undefined, Error, Project | undefined, QueryKey>
) => {
  const queryFn = async () => {
    const project = await getProjectInfo(projectId, memberId);

    return project;
  };

  return { queryKey: [...projectQueryKey, projectId, memberId], queryFn, ...queryOptions };
};
