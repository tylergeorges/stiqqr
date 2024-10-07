import type { PageProps } from '@/types';

import { Editor } from '@/components/editor';
import { QueryClient } from '@tanstack/react-query';
import { projectQueryKey } from '@/hooks/use-project-query';
import { getUser } from '@/lib/supabase/get-user';
import { Project } from '@/lib/db/queries/project';
import { redirect } from 'next/navigation';
import { useTaskQuery } from '@/hooks/use-task-query';
import { IssueEditorSidebar } from '@/components/issue-editor-sidebar';

export default async function ProjectIssuePage({
  params
}: PageProps<{ issueId: string; projectId: string }>) {
  const queryClient = new QueryClient();
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

          <div className="relative mx-auto size-full max-w-[76ch] overflow-y-auto">
            <Editor issueTitle={task.title} desc={task.description}></Editor>
          </div>
        </div>

        <IssueEditorSidebar task={task} projectId={params.projectId} />
      </div>
    </div>
  );
}
