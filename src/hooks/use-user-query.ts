import type { User } from '@/lib/db/schema/users';
import { getUser } from '@/lib/supabase/get-user';

export const userQueryKey = ['user'];

export const useUserQuery = () => {
  const queryFn = async (): Promise<User> => {
    const user = await getUser();

    if (!user) {
      throw new Error('User not found.');
    }

    return user;
  };

  return { queryKey: [userQueryKey], queryFn };
};
