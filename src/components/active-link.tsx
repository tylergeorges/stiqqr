'use client';

import { ButtonLink } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

type ActiveLinkProps = React.ComponentProps<typeof ButtonLink>;

export const ActiveLink = ({ href, className, ...props }: ActiveLinkProps) => {
  const path = usePathname();

  const active = path === href;

  return (
    <ButtonLink
      href={href}
      className={cn(active ? '[&>svg>*]:fill-current' : '[&>svg>*]:stroke-current', className)}
      {...props}
      active={active}
    />
  );
};
