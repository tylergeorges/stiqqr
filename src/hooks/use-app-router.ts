'use client';

import { usePathname } from 'next/navigation';

interface AppRoutes {
  projectId?: string;
  issueName?: string;
}

export const useAppRouter = (): AppRoutes => {
  const path = usePathname();

  const paths = path.split('/');

  return {
    projectId: paths[1],
    issueName: paths[3]
  };
};
