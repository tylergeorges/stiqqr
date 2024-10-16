'use client';

import { DraggableProvided, DraggableRubric, DraggableStateSnapshot } from '@hello-pangea/dnd';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/utils';
import type { Task } from '@/lib/db/queries/project';

import { TaskStatusIndicator } from '@/components/task-status-indicator';
import { ShortTimestamp } from '@/components/ui/timestamp';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TableCell, TableRow } from '@/components/ui/table';
import { TaskForm, TaskFormMethods, useUpdateTaskForm } from '@/components/task-form';
import { AssigneeSwitcher } from '@/components/assinee-switcher';

interface TaskListItemProps {
  task: Task;
  index: number;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  form: TaskFormMethods;
}

export const TaskListItem = ({ task, provided, snapshot, form }: TaskListItemProps) => {
  useUpdateTaskForm(form, task.projectId, task.id);
  const router = useRouter();

  return (
    <TableRow
      className={cn(
        'w-full rounded-none horizontal center-v hover:bg-foreground/[0.030]',
        !snapshot.isDragging && 'border-b border-b-muted',
        snapshot.draggingOver && 'border-t border-t-primary'
        // 'even:bg-muted-foreground/10'
      )}
      onClick={e => {
        e.preventDefault();

        router.push(`/${task.projectId}/issue/${task.id}`);
      }}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
    >
      <TableCell className="w-full flex-1 horizontal center-v">
        <TaskStatusIndicator status={task.status} />

        <div className="ml-2">{task.title}</div>
      </TableCell>

      <TableCell className="space-x-2 text-foreground/40 horizontal center-v">
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

        <AssigneeSwitcher projectId={task.projectId}>
          <button
            className="z-10 inline-flex size-fit border-none"
            onClick={e => {
              e.stopPropagation();
            }}
          >
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
          </button>
        </AssigneeSwitcher>
      </TableCell>
    </TableRow>
  );
};

TaskListItem.displayName = 'TaskListItem';

export const renderTaskListItem = (tasks: Task[]) =>
  function innnerRender(
    provided: DraggableProvided,
    snapshot: DraggableStateSnapshot,
    rubric: DraggableRubric
  ) {
    const task = tasks[rubric.source.index];

    return (
      <TaskForm status={task.status} assignee={task.assignee}>
        {form => (
          <TaskListItem
            index={rubric.source.index}
            provided={provided}
            snapshot={snapshot}
            task={task}
            form={form}
          />
        )}
      </TaskForm>
    );
  };
