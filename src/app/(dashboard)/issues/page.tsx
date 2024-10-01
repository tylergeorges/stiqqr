import { DashboardPageContainer } from '@/components/dashboard-page-container';
import { TaskList } from '@/components/task-list';

export default function IssuesPage() {
  return (
    <DashboardPageContainer>
      <h1 className="text-2xl font-semibold">Issues</h1>

      <TaskList></TaskList>
    </DashboardPageContainer>
  );
}
