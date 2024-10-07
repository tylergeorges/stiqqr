import type { QueryKey, UseQueryOptions } from '@tanstack/react-query';

import { getProjectsForMember, type Project } from '@/lib/db/queries/project';

export const projectsQueryKey = ['projects'];

export const useProjectsQuery = (
  memberId: string,
  queryOptions?: UseQueryOptions<Project[], Error, Project[], QueryKey>
) => {
  const queryFn = async (): Promise<Project[]> => {
    const projects = await getProjectsForMember(memberId);

    return projects;
  };

  return { queryKey: [...projectsQueryKey, memberId], queryFn, ...queryOptions };
};
