import { Metadata } from 'next';
import { QueryClient } from '@tanstack/react-query';
import { redirect } from 'next/navigation';

import type { PageProps } from '@/types';

import { projectQueryKey } from '@/hooks/use-project-query';
import { getUser } from '@/lib/supabase/get-user';
import { getTaskInfo, type Project } from '@/lib/db/queries/project';
import { taskQueryKey, useTaskQuery } from '@/hooks/use-task-query';

import { IssueEditorSidebar } from '@/components/issue-editor-sidebar';
import { ExpandedEditor } from '@/components/expanded-editor';

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

  if (!task) return redirect(`/${params.projectId}/issues`);

  const project = queryClient.getQueryData<Project>([
    ...projectQueryKey,
    params.projectId,
    user.id
  ]);

  return (
    <div className="size-full flex-1">
      <div className="size-full flex-1 horizontal">
        <div className="flex-1 gap-8 px-9 py-6 vertical">
          <div className="vertical">
            <p className="font-medium">{project?.project.name}</p>
          </div>

          <ExpandedEditor projectId={params.projectId} taskId={task.id} task={task} />
        </div>

        <IssueEditorSidebar task={task} projectId={params.projectId} />
      </div>
    </div>
  );
}
