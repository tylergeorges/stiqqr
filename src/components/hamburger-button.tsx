'use client';

import { useSidebarStore } from '@/hooks/use-sidebar';

import { Icons } from '@/components/icons';

export const HamburgerButton = () => {
  const toggleSidebar = useSidebarStore(state => state.toggleSidebar);

  const toggle = (e: React.SyntheticEvent) => {
    e.preventDefault();

    toggleSidebar();
  };

  return (
    <button className="mr-2 inline-flex size-fit md:hidden" onClick={toggle}>
      <Icons.Hamburger className="size-4" />
    </button>
  );
};
