import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { Metadata } from 'next';

import type { PageProps } from '@/types';
import { useTasksQuery } from '@/hooks/use-tasks-query';

import { DashboardPageContainer } from '@/components/dashboard-page-container';
import { TaskList } from '@/components/task-list';

export const metadata: Metadata = {
  title: 'Issues'
};

export default async function IssuesPage({ params }: PageProps<{ projectId: string }>) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(useTasksQuery(params.projectId));

  return (
    <DashboardPageContainer>
      <h1 className="text-2xl font-semibold">Issues</h1>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <TaskList projectId={params.projectId} />
      </HydrationBoundary>
    </DashboardPageContainer>
  );
}