'use client';

import { UseFormReturn } from 'react-hook-form';
import { useEffect } from 'react';

import type { Task } from '@/lib/db/queries/project';
import { cn } from '@/lib/utils';

import { Sidebar } from '@/components/sidebar';
import { StatusSwitcher } from '@/components/status-switcher';
import { AssigneeSwitcher } from '@/components/assinee-switcher';
import { TaskForm, TaskFormValues } from '@/components/task-form';
import { useUpdateTaskMutation } from '@/hooks/use-update-task-mutation';

interface SidebarGroupLabelProps {
  className?: string;
}

const SidebarGroupLabel = ({
  children,
  className
}: React.PropsWithChildren<SidebarGroupLabelProps>) => (
  <p className={cn('pb-2.5 pt-4 text-sm font-medium text-muted-foreground', className)}>
    {children}
  </p>
);

interface InnerIssueEditorProps extends UseFormReturn<TaskFormValues> {
  projectId: string;
  task: Task;
}

const InnerIssueEditor = ({ projectId, task, ...form }: InnerIssueEditorProps) => {
  const updateTaskMutation = useUpdateTaskMutation(projectId, task.id);

  useEffect(() => {
    const subscription = form.watch(data => {
      updateTaskMutation.mutate({
        taskId: task.id,
        projectId,
        assigneeId: data?.assignee ? data.assignee.id : null,
        status: data?.status
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <form>
      <div className="py-6 vertical">
        <div className="w-full vertical">
          <SidebarGroupLabel>Status</SidebarGroupLabel>
          <StatusSwitcher />
        </div>

        <div className="w-full vertical">
          <SidebarGroupLabel>Assignee</SidebarGroupLabel>
          <AssigneeSwitcher projectId={projectId} />
        </div>
      </div>
    </form>
  );
};

interface IssueEditorSidebarProps {
  task: Task;
  projectId: string;
}

export const IssueEditorSidebar = ({ task, projectId }: IssueEditorSidebarProps) => {
  return (
    <Sidebar className="min-w-[220px] max-w-[280px]">
      <TaskForm status={task.status} assignee={task?.assignee}>
        {form => <InnerIssueEditor {...form} projectId={projectId} task={task} />}
      </TaskForm>
    </Sidebar>
  );
};
