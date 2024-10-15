'use client';

import { HamburgerButton } from '@/components/hamburger-button';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  children: string;
  className?: string;
}

export const PageHeader = ({ className, children }: PageHeaderProps) => {
  return (
    <div className={cn('text-xl font-semibold horizontal center-v', className)}>
      <HamburgerButton />

      <h1>{children}</h1>
    </div>
  );
};
