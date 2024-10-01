import type { LayoutProps } from '@/types';

import { Sidebar } from '@/components/sidebar';
import { ActiveLink } from '@/components/active-link';
import { Icons } from '@/components/icons';

import { ProjectSwitcher } from '@/components/project-switcher';

export default function DashboardLayout({ children }: LayoutProps) {
  return (
    <div className="size-full flex-1 horizontal">
      <Sidebar className="w-96 border-r border-r-foreground/15 bg-background center-h">
        <div className="mt-1 w-full vertical">
          <div>
            <ProjectSwitcher />
          </div>

          <div className="space-y-2">
            <ActiveLink href="/issues" className="mt-8">
              <Icons.Issues className="size-5 text-muted-foreground" />
              Issues
            </ActiveLink>

            <ActiveLink href="/members">
              <Icons.Members className="size-5 text-muted-foreground" />
              Members
            </ActiveLink>
          </div>
        </div>
      </Sidebar>

      {children}
    </div>
  );
}
