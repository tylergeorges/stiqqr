import { useSuspenseQuery } from '@tanstack/react-query';

import { useUserQuery } from '@/hooks/use-user-query';

export const useUser = () => {
  return useSuspenseQuery(useUserQuery());
};
