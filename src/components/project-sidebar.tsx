'use client';

import type { User } from '@/lib/db/schema';

import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/hooks/use-sidebar';

import { Sidebar } from '@/components/sidebar';
import { ActiveLink } from '@/components/active-link';
import { Icons } from '@/components/icons';
import { ProjectSwitcher } from '@/components/project-switcher';
import { UserNav } from '@/components/user-nav';

interface ProjectSidebarProps {
  user: User;
  projectId: string;
}

export const ProjectSidebar = ({ projectId, user }: ProjectSidebarProps) => {
  const isSidebarOpen = useSidebarStore(state => state.isSidebarOpen);

  return (
    <>
      <ProjectSidebarBackdrop />

      <Sidebar
        className={cn(
          'h-full w-[240px] justify-between border-r center-h vertical',
          'absolute z-10 bg-background transition-transform duration-300 ease-in-out md:relative md:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-[240px]'
        )}
      >
        <div className="mt-1 w-full vertical">
          <ProjectSwitcher memberId={user.id} projectId={projectId} />

          <div className="space-y-2">
            <ActiveLink href={`/${projectId}/issues`} className="mt-8">
              <Icons.Issues className="size-4 text-muted-foreground" />

              <span>Issues</span>
            </ActiveLink>

            <ActiveLink href={`/${projectId}/members`}>
              <Icons.Members className="size-4 text-muted-foreground" />

              <span>Members</span>
            </ActiveLink>
          </div>
        </div>

        <UserNav></UserNav>
      </Sidebar>
    </>
  );
};
export const ProjectSidebarBackdrop = () => {
  const isSidebarOpen = useSidebarStore(state => state.isSidebarOpen);
  const setIsSidebarOpen = useSidebarStore(state => state.setIsSidebarOpen);

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div
      className={cn(
        'absolute z-10 size-full bg-black transition md:hidden',
        isSidebarOpen ? 'opacity-30' : 'pointer-events-none opacity-0'
      )}
      onClick={closeSidebar}
    ></div>
  );
};
