import type { TaskStatus } from '@/types/project';
import { cn } from '@/lib/utils';

interface TaskStatusIndicatorProps {
  status: TaskStatus;
}

export const TaskStatusIndicator = ({ status }: TaskStatusIndicatorProps) => {
  return (
    <div
      className={cn(
        'aspect-square size-3 rounded-full ring-2 horizontal center',
        status === 'in-progress' && 'ring-[lch(80_100_85)]',
        status === 'todo' && 'ring-foreground'
      )}
    >
      <div
        className={cn(
          'aspect-square size-2 rounded-full',
          status === 'in-progress' && 'bg-[lch(80_100_85)]',
          status === 'todo' && 'bg-secondary'
        )}
      />
    </div>
  );
};
