'use client';

import { Draggable } from '@hello-pangea/dnd';
import Link from 'next/link';

import type { Task } from '@/types/project';
import { cn, encodeUrlPath } from '@/lib/utils';

import { TaskStatusIndicator } from '@/components/task-status-indicator';
import { ShortTimestamp } from '@/components/timestamp';
import { Avatar, AvatarFallback, AvatarImage, AvatarStack } from '@/components/ui/avatar';

interface TaskListItemProps {
  task: Task;
  index: number;
}

export const TaskListItem = ({ task, index }: TaskListItemProps) => {
  return (
    <Draggable key={task.name} draggableId={task.name} index={index}>
      {(provided, snapshot) => (
        <Link
          className={cn(
            'px-4 py-2 horizontal center-v space-between even:bg-muted-foreground/10',
            !snapshot.isDragging && 'border-b border-b-muted-foreground/20'
          )}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          href={`/${encodeUrlPath(task.project.name)}/issue/${encodeUrlPath(task.name)}`}
        >
          <div className="horizontal center-v">
            <TaskStatusIndicator status={task.status} />

            <div className="ml-2">{task.name}</div>
          </div>

          <div className="space-x-2 text-foreground/40 horizontal">
            {task.labels.map(label => (
              <div key={label.value} className="px-2 text-xs horizontal center-v">
                <div
                  className="size-[9px] rounded-full bg-[var(--label-color)]"
                  // @ts-expect-error - defining color variable
                  style={{ '--label-color': label.color }}
                />

                <span className="ml-1.5 mr-[1px] leading-[normal]">{label.value}</span>
              </div>
            ))}

            <ShortTimestamp timestamp={task.createdAt} />
            <ShortTimestamp timestamp={task.updatedAt} />

            <AvatarStack
              maxAvatars={2}
              hideCount
              className={cn(task.members.length > 0 && 'child:text-primary child:ring-secondary')}
              spacing="looser"
            >
              {task.members.length ? (
                task.members.map(member => (
                  <Avatar key={member.id} size="sm" className={cn('relative')}>
                    {member?.avatarUrl ? (
                      <AvatarImage src={member.avatarUrl} alt={`Avatar of ${member.username}`} />
                    ) : (
                      <AvatarFallback className="bg-muted-foreground" />
                    )}
                  </Avatar>
                ))
              ) : (
                <Avatar size="sm" className={cn('relative')}>
                  <AvatarFallback className="bg-muted-foreground" />
                </Avatar>
              )}
            </AvatarStack>
          </div>
        </Link>
      )}
    </Draggable>
  );
};
