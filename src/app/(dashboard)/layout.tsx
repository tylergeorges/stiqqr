import type { LayoutProps } from '@/types';

import { Sidebar } from '@/components/sidebar';
import { ActiveLink } from '@/components/active-link';
import { Icons } from '@/components/icons';

export default function DashboardLayout({ children }: LayoutProps) {
  return (
    <div className="size-full flex-1 horizontal">
      <Sidebar className="w-20 center-h bg-secondary/15">
        <div className="mt-1 space-y-6 vertical">
          <ActiveLink href="/dashboard" size="icon" variant="ghost">
            <Icons.Dashboard className="square size-6" />
          </ActiveLink>

          <ActiveLink href="/projects" size="icon" variant="ghost">
            <Icons.Projects className="size-6" />
          </ActiveLink>
        </div>
      </Sidebar>
      {children}
    </div>
  );
}
