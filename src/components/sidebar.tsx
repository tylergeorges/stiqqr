import { cn } from '@/lib/utils';

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className, children }: React.PropsWithChildren<SidebarProps>) => {
  return (
    <aside className={cn('h-full w-56 space-y-[1px] bg-secondary px-3.5 pt-2 vertical', className)}>
      {children}
    </aside>
  );
};
