import { getMemberById, ProjectMember } from '@/lib/db/queries/user';

export const memberQueryKey = ['member'];

export const useMemberQuery = (memberId:string) => {
  const queryFn = async (): Promise<ProjectMember> => {
    const member = await getMemberById(memberId);

    if (!member) {
      throw new Error('Member not found.');
    }

    return member;
  };

  return { queryKey: [...memberQueryKey, memberId], queryFn };
};
