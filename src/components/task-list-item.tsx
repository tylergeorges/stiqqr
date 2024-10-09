'use client';

import { DraggableProvided, DraggableRubric, DraggableStateSnapshot } from '@hello-pangea/dnd';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import type { Task } from '@/lib/db/queries/project';

import { TaskStatusIndicator } from '@/components/task-status-indicator';
import { ShortTimestamp } from '@/components/ui/timestamp';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TaskListItemProps {
  task: Task;
  index: number;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
}

export const TaskListItem = ({ task, provided, snapshot }: TaskListItemProps) => {
  return (
    <Link
      className={cn(
        'px-4 py-2 horizontal center-v space-between even:bg-muted-foreground/10',
        !snapshot.isDragging && 'border-b border-b-muted-foreground/20'
      )}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      href={`/${task.projectId}/issue/${task.id}`}
    >
      <div className="horizontal center-v">
        <TaskStatusIndicator status={task.status} />

        <div className="ml-2">{task.title}</div>
      </div>

      <div className="space-x-2 text-foreground/40 horizontal">
        {task.labels.map(label => (
          <div key={label.name} className="px-2 text-xs horizontal center-v">
            <div
              className="size-[9px] rounded-full bg-[var(--label-color)]"
              // @ts-expect-error - defining color variable
              style={{ '--label-color': label.color }}
            />

            <span className="ml-1.5 mr-[1px] leading-[normal]">{label.name}</span>
          </div>
        ))}

        <ShortTimestamp timestamp={task.createdAt} />
        <ShortTimestamp timestamp={task.updatedAt} />

        {task.assignee ? (
          <Avatar size="sm" className={cn('relative rounded-full')}>
            {task.assignee?.member.avatarUrl ? (
              <AvatarImage
                src={task.assignee.member.avatarUrl}
                alt={`Avatar of ${task.assignee.member.username}`}
              />
            ) : (
              <AvatarFallback className="rounded-full bg-muted-foreground" />
            )}
          </Avatar>
        ) : (
          <Avatar size="sm" className={'relative rounded-full'}>
            <AvatarFallback className="rounded-full border-2 border-dotted border-muted-foreground" />
          </Avatar>
        )}
      </div>
    </Link>
  );
};

TaskListItem.displayName = 'TaskListItem';

export const renderTaskListItem = (tasks: Task[]) =>
  function innnerRender(
    provided: DraggableProvided,
    snapshot: DraggableStateSnapshot,
    rubric: DraggableRubric
  ) {
    return (
      <TaskListItem
        index={rubric.source.index}
        provided={provided}
        snapshot={snapshot}
        task={tasks[rubric.source.index]}
      />
    );
  };
