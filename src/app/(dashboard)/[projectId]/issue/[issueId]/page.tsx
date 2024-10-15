import { Metadata } from 'next';
import { QueryClient } from '@tanstack/react-query';
import { redirect } from 'next/navigation';

import type { PageProps } from '@/types';

import { useProjectQuery } from '@/hooks/use-project-query';
import { getUser } from '@/lib/supabase/get-user';
import { getTaskInfo } from '@/lib/db/queries/project';
import { taskQueryKey, useTaskQuery } from '@/hooks/use-task-query';

import { IssueEditorSidebar } from '@/components/issue-editor-sidebar';
import { ExpandedEditor } from '@/components/expanded-editor';
import { PageHeader } from '@/components/page-header';
import { TaskToolbar } from '@/components/task-toolbar';

interface Params {
  issueId: string;
  projectId: string;
}

type Props = PageProps<Params>;

const queryClient = new QueryClient();

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const task = await queryClient.fetchQuery({
    queryFn: () => getTaskInfo(params.projectId, params.issueId),

    queryKey: [...taskQueryKey, params.projectId, params.issueId]
  });

  return {
    title: task?.title ?? 'Issue'
  };
}

export default async function ProjectIssuePage({ params }: Props) {
  const user = await getUser();

  if (!user) redirect(`/`);

  const task = await queryClient.fetchQuery(useTaskQuery(params.projectId, params.issueId));

  const project = await queryClient.fetchQuery(useProjectQuery(params.projectId, user.id));

  if (!task || !project) return redirect(`/${params.projectId}/issues`);

  return (
    <div className="size-full flex-1">
      <div className="size-full flex-1 horizontal">
        <div className="flex-1 gap-8 px-9 py-6 vertical">
          <div className="gap-2 vertical">
            <PageHeader className="">{project?.project.name}</PageHeader>
            <TaskToolbar projectId={params.projectId} task={task} />
          </div>

          <ExpandedEditor projectId={params.projectId} taskId={task.id} task={task} />
        </div>

        <IssueEditorSidebar task={task} projectId={params.projectId} />
      </div>
    </div>
  );
}
