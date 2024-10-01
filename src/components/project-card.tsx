'use client';

import { cn } from '@/lib/utils';
import type { Member } from '@/types';

import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const ProjectCard = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <Card
      className={cn(
        'size-full max-h-52 shrink-0 justify-between overflow-hidden rounded-3xl border-none bg-primary text-primary-foreground',
        className
      )}
      {...props}
    ></Card>
  );
};

export const ProjectTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
  return <CardTitle className={cn('text-xl font-bold', className)} {...props}></CardTitle>;
};

export const ProjectDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => {
  return (
    <CardDescription
      className={cn('text-current/0 mt-0 line-clamp-2', className)}
      {...props}
    ></CardDescription>
  );
};

interface ProjectCardMembersProps extends Member {
  className?: string;
}

export const ProjectCardMember = (member: ProjectCardMembersProps) => {
  return (
    <Avatar size="md" className={cn('relative', member.className)}>
      {member?.avatarUrl ? (
        <AvatarImage src={member.avatarUrl} alt={`Avatar of ${member.username}`} />
      ) : (
        <AvatarFallback />
      )}
    </Avatar>
  );
};

export const ProjectCardMembers = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn('relative horizontal', className)} {...props}></div>;
};
