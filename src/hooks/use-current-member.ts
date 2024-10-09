import { useMemberQuery } from '@/hooks/use-member-query';
import { useUser } from '@/hooks/use-user';

export const useCurrentMember = () => {
  const { data: user } = useUser();

  if (!user) throw new Error('User not authenticated.');

  return useMemberQuery(user.id);
};
