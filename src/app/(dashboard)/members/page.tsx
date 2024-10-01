import Link from 'next/link';

import { projects } from '@/lib/test-data';
import { encodeUrlPath } from '@/lib/utils';

import { Icons } from '@/components/icons';
import {
  ProjectCard,
  ProjectCardMember,
  ProjectCardMembers,
  ProjectDescription,
  ProjectTitle
} from '@/components/project-card';
import { AvatarStack } from '@/components/ui/avatar';
import { CardContent, CardHeader } from '@/components/ui/card';
import { DashboardPageContainer } from '@/components/dashboard-page-container';

export default function MembersPage() {
  return (
    <DashboardPageContainer>
      <h1 className="text-2xl font-semibold">Members</h1>

      <div className="relative grid shrink-0 flex-wrap gap-7 md:grid-cols-3">
        {projects.map(project => {
          const encodedProjectName = encodeUrlPath(project.name);

          return (
            <Link
              key={project.id}
              href={`/project/${encodedProjectName}`}
              className="col-span-full inline-flex w-full shrink-0 lg:col-span-1 lg:max-w-[500px]"
            >
              <ProjectCard>
                <CardHeader className="space-y-0">
                  <div className="w-full justify-between horizontal center-v">
                    <ProjectTitle className="line-clamp-1">{project.name}</ProjectTitle>
                    <Icons.DotsVert className="size-3" />
                  </div>

                  <ProjectDescription>{project.description}</ProjectDescription>
                </CardHeader>

                <CardContent>
                  <ProjectCardMembers>
                    <AvatarStack className="child:text-primary child:ring-primary">
                      {project.members.map(member => (
                        <ProjectCardMember
                          avatarUrl={member.avatarUrl}
                          username={member.username}
                          id={member.id}
                          key={member.id}
                        />
                      ))}
                    </AvatarStack>
                  </ProjectCardMembers>
                </CardContent>
              </ProjectCard>
            </Link>
          );
        })}
      </div>
    </DashboardPageContainer>
  );
}
