'use client';

import { usePathname } from 'next/navigation';

interface AppRoutes {
  projectId?: string;
  issueId?: string;
}

export const useAppRouter = (): AppRoutes => {
  const path = usePathname();

  const paths = path.split('/');

  return {
    projectId: paths[1],
    issueId: paths[3]
  };
};
