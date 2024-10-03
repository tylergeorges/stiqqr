import type { Metadata } from 'next';

import type { LayoutProps } from '@/types';

import { Sidebar } from '@/components/sidebar';
import { ActiveLink } from '@/components/active-link';
import { Icons } from '@/components/icons';

import { ProjectSwitcher } from '@/components/project-switcher';
import { UserNav } from '@/components/user-nav';

export const metadata: Metadata = {
  title: {
    absolute: 'Dashboard',
    default: 'Dashboard'
  },
  description: 'Manage your project.'
};

export default function DashboardLayout({ children }: LayoutProps) {
  return (
    <div className="size-full flex-1 horizontal">
      <Sidebar className="h-full w-72 justify-between border-r center-h vertical">
        <div className="mt-1 w-full vertical">
          <ProjectSwitcher />

          <div className="space-y-2">
            <ActiveLink href="/issues" className="mt-8">
              <Icons.Issues className="size-4 text-muted-foreground" />
              Issues
            </ActiveLink>

            <ActiveLink href="/members">
              <Icons.Members className="size-4 text-muted-foreground" />
              Members
            </ActiveLink>
          </div>
        </div>

        <UserNav></UserNav>
      </Sidebar>

      {children}
    </div>
  );
}
