import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { Metadata } from 'next';

import type { PageProps } from '@/types';
import { useTasksQuery } from '@/hooks/use-tasks-query';

import { DashboardPageContainer } from '@/components/dashboard-page-container';
import { TaskList } from '@/components/task-list';
import { PageHeader } from '@/components/page-header';

export const metadata: Metadata = {
  title: 'Issues'
};

export default async function IssuesPage({ params }: PageProps<{ projectId: string }>) {
  const queryClient = new QueryClient();

  const { projectId } = await params;

  await queryClient.prefetchQuery(useTasksQuery(projectId));

  return (
    <DashboardPageContainer>
      <PageHeader className="px-4">Issues</PageHeader>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <TaskList projectId={projectId} />
      </HydrationBoundary>
    </DashboardPageContainer>
  );
}
