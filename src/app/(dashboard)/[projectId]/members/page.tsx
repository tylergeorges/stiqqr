import type { Metadata } from 'next';

import { DashboardPageContainer } from '@/components/dashboard-page-container';

export const metadata: Metadata = {
  title: {
    absolute: 'Members',
    default: 'Members'
  },
  description: 'View/manage your project members.'
};

export default function MembersPage() {
  return (
    <DashboardPageContainer>
      <h1 className="text-2xl font-semibold">Members</h1>

      <div className="relative grid shrink-0 flex-wrap gap-7 md:grid-cols-3">
      
      </div>
    </DashboardPageContainer>
  );
}
