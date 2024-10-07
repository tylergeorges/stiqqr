'use client';

import { ButtonLink } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

type ActiveLinkProps = React.ComponentProps<typeof ButtonLink>;

export const ActiveLink = ({ href, className, ...props }: ActiveLinkProps) => {
  const path = usePathname();

  const active = path.includes(href as string);

  return (
    <ButtonLink
      href={href}
      variant="ghost"
      fill
      className={cn('justify-start text-sm leading-none horizontal', className)}
      {...props}
      active={active}
    />
  );
};
