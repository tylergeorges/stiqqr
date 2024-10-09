import { redirect } from 'next/navigation';

import type { PageProps } from '@/types';

import { getUser } from '@/lib/supabase/get-user';
import { addMemberToProject, getProjectFromInvite } from '@/lib/db/queries/project';

interface Params {
  inviteCode: string;
}

type Props = PageProps<Params>;

export default async function ProjectInvitePage({ params }: Props) {
  const user = await getUser();

  if (!user) redirect(`/`);

  //  check if user is already a member of the guild
  const projectExistsData = await getProjectFromInvite(params.inviteCode, user.id);

  if (projectExistsData) {
    const { project: existingProject } = projectExistsData;

    return redirect(`/${existingProject.id}/issues`);
  }

  // add user to guild
  const newProjectMemberData = await addMemberToProject(params.inviteCode, user.id);

  if (newProjectMemberData) {
    const { project } = newProjectMemberData;
    return redirect(`/${project.id}/issues`);
  }

  return <div className="flex size-full flex-1 center" />;
}
