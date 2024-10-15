import { QueryClient } from '@tanstack/react-query';
import type { Metadata } from 'next';

import { cn } from '@/lib/utils';
import type { PageProps } from '@/types';
import { useProjectMembersQuery } from '@/hooks/use-project-members-query';

import { DashboardPageContainer } from '@/components/dashboard-page-container';
import { Role } from '@/lib/db/schema';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Icons } from '@/components/icons';
import { PageHeader } from '@/components/page-header';

export const metadata: Metadata = {
  title: {
    absolute: 'Members',
    default: 'Members'
  },
  description: 'View/manage your project members.'
};

export default async function MembersPage({ params }: PageProps<{ projectId: string }>) {
  const queryClient = new QueryClient();

  const members = await queryClient.fetchQuery(useProjectMembersQuery(params.projectId));

  return (
    <DashboardPageContainer>
      <PageHeader className="px-4">Members</PageHeader>

      <div className="relative w-full shrink-0 flex-wrap gap-7">
        <div className={'w-full text-sm transition duration-300'}>
          {members.map(projectMember => (
            <div
              key={projectMember.member.id}
              className={cn(
                'grid w-full grid-cols-[10fr_3fr_2fr] items-center px-4 py-2 even:bg-muted-foreground/10',
                'border-b border-b-muted-foreground/20'
              )}
            >
              <div className="col-start-1 col-end-1 px-2 horizontal center-v">
                <Avatar size="md" className={'relative rounded-full'}>
                  {projectMember.member.avatarUrl ? (
                    <AvatarImage
                      src={projectMember.member.avatarUrl}
                      alt={`Avatar of ${projectMember.member.username}`}
                    />
                  ) : (
                    <AvatarFallback className="rounded-full bg-muted-foreground" />
                  )}
                </Avatar>

                <div className="w-full vertical">
                  <span className="ml-1.5 mr-[1px] leading-[normal] text-foreground">
                    {projectMember.member.username}
                  </span>

                  <span className="ml-1.5 mr-[1px] leading-[normal] text-foreground/40">
                    {projectMember.member.email}
                  </span>
                </div>
              </div>

              <div className="col-start-2 col-end-2 w-full">
                {projectMember.role === Role.Owner && 'Owner'}
                {projectMember.role === Role.Admin && 'Admin'}
                {projectMember.role === Role.Member && 'Member'}
              </div>

              <div className="col-span-1 col-start-3 col-end-3 w-full justify-end horizontal center-v">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Icons.DotsVert className="size-2 text-foreground/40" />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="start" side="left" className="w-fit">
                    <DropdownMenuGroup>
                      <DropdownMenuItem>Remove member</DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardPageContainer>
  );
}
