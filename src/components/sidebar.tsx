import { cn } from '@/lib/utils';

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className, children }: React.PropsWithChildren<SidebarProps>) => {
  return (
    <aside
      className={cn('h-full w-56 space-y-[1px] border-foreground/5 px-4 py-4 ', className)}
    >
      {children}
    </aside>
  );
};
