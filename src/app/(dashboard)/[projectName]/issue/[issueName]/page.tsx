import type { PageProps } from '@/types';
import { cn, decodeUrlPath } from '@/lib/utils';

import { AssigneeSwitcher } from '@/components/assinee-switcher';
import { Editor } from '@/components/editor';
import { Sidebar } from '@/components/sidebar';
import { StatusSwitcher } from '@/components/status-switcher';

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

export default function ProjectIssuePage({
  params
}: PageProps<{ issueName: string; projectName: string }>) {
  const issue = decodeUrlPath(params.issueName);
  const project = decodeUrlPath(params.projectName);

  return (
    <div className="size-full flex-1">
      <div className="size-full flex-1 horizontal">
        <div className="flex-1 gap-8 px-9 py-6 vertical">
          <div className="vertical">
            <p className="font-medium">{project}</p>
          </div>

          <div className="relative mx-auto max-w-[76ch] overflow-y-auto">
            <Editor
              issueTitle={issue}
              desc={
                'Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit labore veniam quo distinctio corrupti, nam sint, odit error laudantium minima eaque laboriosam in facere, dolores aliquid modi excepturi a quas.'
              }
            ></Editor>
          </div>
        </div>

        <Sidebar className="min-w-[220px] max-w-[280px]">
          <div className="py-6 vertical">
            {/* <div className="vertical">
              <p className="text-sm font-medium text-muted-foreground">Properties</p>
            </div> */}

            <div className="w-full vertical">
              <SidebarGroupLabel>Status</SidebarGroupLabel>
              <StatusSwitcher status="in-progress" />
            </div>

            <div className="w-full vertical">
              <SidebarGroupLabel>Assignee</SidebarGroupLabel>
              <AssigneeSwitcher />
            </div>
          </div>
        </Sidebar>
      </div>
    </div>
  );
}
