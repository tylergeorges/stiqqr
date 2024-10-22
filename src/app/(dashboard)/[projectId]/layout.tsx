import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

import type { LayoutProps } from '@/types';

import { useUserQuery } from '@/hooks/use-user-query';
import { useProjectsQuery } from '@/hooks/use-projects-query';
import { useProjectMembersQuery } from '@/hooks/use-project-members-query';
import { useMemberQuery } from '@/hooks/use-member-query';
import { useProjectQuery } from '@/hooks/use-project-query';

import { CommandMenu } from '@/components/command-menu';
import { ProjectSidebar } from '@/components/project-sidebar';

export const metadata: Metadata = {
  title: {
    absolute: 'Dashboard',
    default: 'Dashboard'
  },
  description: 'Manage your project.'
};

export default async function DashboardLayout({
  children,
  params
}: LayoutProps<{ projectId: string }>) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { refetchOnWindowFocus: false } }
  });

  const user = await queryClient.fetchQuery(useUserQuery());

  if (!user) {
    redirect('/');
  }

  const { projectId } = await params;

  const projects = await queryClient.fetchQuery(useProjectsQuery(user.id));

  if (!projects.length) {
    redirect('/onboarding');
  }

  const isValidProject = projects.find(p => p.project.id === projectId);

  if (!isValidProject) {
    redirect(`/${projects[0].project.id}/issues`);
  }

  await Promise.all([
    queryClient.prefetchQuery(useMemberQuery(user.id)),
    queryClient.prefetchQuery(useProjectMembersQuery(projectId)),
    queryClient.prefetchQuery(useProjectQuery(projectId, user.id))
  ]);

  return (
    <div className="size-full flex-1 horizontal">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CommandMenu />

        <ProjectSidebar projectId={projectId} user={user} />

        {children}
      </HydrationBoundary>
    </div>
  );
}
