import type { QueryKey, UseQueryOptions } from '@tanstack/react-query';

import { getProjectMembers } from '@/lib/db/queries/project';

export type ProjectMember = Prettify<NonNullable<QueryReturnType<typeof getProjectMembers>>>;

export const projectMembersQueryKey = ['members'];

export const useProjectMembersQuery = (
  projectId: string,
  queryOptions?: UseQueryOptions<ProjectMember[], Error, ProjectMember[], QueryKey>
) => {
  const queryFn = async (): Promise<ProjectMember[]> => {
    const members = await getProjectMembers(projectId);

    return members;
  };

  return { queryKey: [...projectMembersQueryKey, projectId], queryFn, ...queryOptions };
};
