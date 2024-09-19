'use client';

import { cn } from '@/lib/utils';

import { Card } from '@/components/ui/card';

export const ProjectCard = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <Card className={cn('', className)} {...props}></Card>;
};
