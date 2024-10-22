import { QueryClient } from '@tanstack/react-query';
import type { Metadata } from 'next';

import type { PageProps } from '@/types';
import { useProjectMembersQuery } from '@/hooks/use-project-members-query';

import { DashboardPageContainer } from '@/components/dashboard-page-container';
import { Role } from '@/lib/db/schema';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Icons } from '@/components/icons';
import { PageHeader } from '@/components/page-header';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: {
    absolute: 'Members',
    default: 'Members'
  },
  description: 'View/manage your project members.'
};

export default async function MembersPage({ params }: PageProps<{ projectId: string }>) {
  const queryClient = new QueryClient();

  const { projectId } = await params;

  const members = await queryClient.fetchQuery(useProjectMembersQuery(projectId));

  return (
    <DashboardPageContainer>
      <PageHeader className="px-4 md:px-0">Members</PageHeader>

      <Table className="w-full px-4">
        <TableHeader></TableHeader>

        <TableBody className="w-full">
          {members.map(projectMember => (
            <TableRow
              key={projectMember.member.id}
              className={'w-full justify-between border-none horizontal odd:bg-muted-foreground/10'}
            >
              <TableCell className="w-full gap-3 p-0 horizontal">
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

                <div className="vertical">
                  <span className="ml-1.5 mr-[1px] leading-[normal] text-foreground">
                    {projectMember.member.username}
                  </span>

                  <span className="ml-1.5 mr-[1px] leading-[normal] text-foreground/40">
                    {projectMember.member.email}
                  </span>
                </div>
              </TableCell>

              <TableCell className="center-v">
                {projectMember.role === Role.Owner && 'Owner'}
                {projectMember.role === Role.Admin && 'Admin'}
                {projectMember.role === Role.Member && 'Member'}
              </TableCell>

              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Icons.DotsVert className="size-4 text-foreground/40" />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="start" side="left" className="w-fit">
                    <DropdownMenuGroup>
                      <Button size="sm" color="destructive" variant="ghost">
                        Remove member
                      </Button>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DashboardPageContainer>
  );
}
