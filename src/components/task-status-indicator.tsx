import type { TaskStatus } from '@/types/project';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';

interface TaskStatusIndicatorProps {
  status: TaskStatus;
  className?: string;
}

export const TaskStatusIndicator = ({ status, className }: TaskStatusIndicatorProps) => {
  return (
    <div
      className={cn(
        'aspect-square size-3 rounded-full horizontal center',
        status === 'in-progress' && 'border-2 border-[lch(80_100_85)]',
        status === 'todo' && 'border-2 border-foreground',
        status === 'canceled' && 'bg-[rgb(149,162,179)]',
        status === 'backlog' && 'border-2 border-dotted border-[rgb(149,162,179)]',
        status === 'done' && 'bg-[lch(48%_59.31_288.43)]',
        className
      )}
    >
      {status === 'in-progress' && (
        <div className={cn('aspect-square size-1.5 rounded-full bg-[lch(80_100_85)]')}></div>
      )}

      {status === 'done' && <Icons.Check className="size-full text-background" />}

      {status === 'canceled' && <Icons.Cross className="size-full text-background" />}
    </div>
  );
};
