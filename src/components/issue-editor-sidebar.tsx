'use client';

import type { Task } from '@/lib/db/queries/project';
import { cn } from '@/lib/utils';

import { Sidebar } from '@/components/sidebar';
import { StatusSwitcher, useTaskStatusForm } from '@/components/status-switcher';
import { AssigneeSwitcher } from '@/components/assinee-switcher';
import { Form } from '@/components/ui/form';

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

interface IssueEditorSidebarProps {
  task: Task;
  projectId: string;
}

export const IssueEditorSidebar = ({ task, projectId }: IssueEditorSidebarProps) => {
  const statusForm = useTaskStatusForm(task.status);

  return (
    <Sidebar className="min-w-[220px] max-w-[280px]">
      <div className="py-6 vertical">
        {/* <div className="vertical">
            <p className="text-sm font-medium text-muted-foreground">Properties</p>
          </div> */}

        <Form {...statusForm}>
          <form>
            <div className="w-full vertical">
              <SidebarGroupLabel>Status</SidebarGroupLabel>
              <StatusSwitcher status={task.status} form={statusForm} />
            </div>

            <div className="w-full vertical">
              <SidebarGroupLabel>Assignee</SidebarGroupLabel>
              <AssigneeSwitcher projectId={projectId} />
            </div>
          </form>
        </Form>
      </div>
    </Sidebar>
  );
};
