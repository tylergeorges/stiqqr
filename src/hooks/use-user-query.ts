import { getUser } from '@/lib/supabase/get-user';

export const userQueryKey = ['user'];

export const useUserQuery = () => {
  const queryFn = async () => {
    const user = await getUser();

    return user;
  };

  return { queryKey: [userQueryKey], queryFn };
};
