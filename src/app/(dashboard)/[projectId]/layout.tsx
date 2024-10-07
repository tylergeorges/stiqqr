import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import type { LayoutProps } from '@/types';

import { useUserQuery } from '@/hooks/use-user-query';
import { useProjectsQuery } from '@/hooks/use-projects-query';
import { useProjectMembersQuery } from '@/hooks/use-project-members-query';
import { useProjectQuery } from '@/hooks/use-project-query';

import { Sidebar } from '@/components/sidebar';
import { ActiveLink } from '@/components/active-link';
import { Icons } from '@/components/icons';
import { ProjectSwitcher } from '@/components/project-switcher';
import { UserNav } from '@/components/user-nav';

export const metadata: Metadata = {
  title: {
    absolute: 'Dashboard',
    default: 'Dashboard'
  },
  description: 'Manage your project.'
};

export default async function DashboardLayout({
  children,
  params: { projectId }
}: LayoutProps<{ projectId: string }>) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { refetchOnWindowFocus: false } }
  });

  const user = await queryClient.fetchQuery(useUserQuery());

  if (!user) {
    redirect('/');
  }

  await Promise.all([
    queryClient.prefetchQuery(useProjectsQuery(user.id)),
    queryClient.prefetchQuery(useProjectMembersQuery(projectId)),
    queryClient.prefetchQuery(useProjectQuery(projectId, user.id))
  ]);

  return (
    <div className="size-full flex-1 bg-secondary horizontal">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Sidebar className="h-full w-72 justify-between border-r center-h vertical">
          <div className="mt-1 w-full vertical">
            <ProjectSwitcher memberId={user.id} projectId={projectId} />

            <div className="space-y-2">
              <ActiveLink href={`/${projectId}/issues`} className="mt-8">
                <Icons.Issues className="size-4 text-muted-foreground" />
                Issues
              </ActiveLink>

              <ActiveLink href={`/${projectId}/members`}>
                <Icons.Members className="size-4 text-muted-foreground" />
                Members
              </ActiveLink>
            </div>
          </div>

          <UserNav></UserNav>
        </Sidebar>

        {children}
      </HydrationBoundary>
    </div>
  );
}
