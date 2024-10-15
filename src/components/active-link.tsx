'use client';

import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import { useSidebarStore } from '@/hooks/use-sidebar';

import { ButtonLink } from '@/components/ui/button';

type ActiveLinkProps = React.ComponentProps<typeof ButtonLink>;

export const ActiveLink = ({ href, className, ...props }: ActiveLinkProps) => {
  const path = usePathname();

  const setIsSidebarOpen = useSidebarStore(state => state.setIsSidebarOpen);

  const active = path.includes(href as string);

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <ButtonLink
      href={href}
      variant="ghost"
      fill
      color="secondary"
      onClick={closeSidebar}
      size="sm"
      className={cn(
        'justify-start space-x-2.5 text-sm leading-none horizontal hover:text-foreground/70',
        className
      )}
      {...props}
      active={active}
    />
  );
};
