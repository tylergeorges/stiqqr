'use client';

import { Draggable, Droppable } from '@hello-pangea/dnd';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import type { Task } from '@/lib/db/queries/project';
import { Status } from '@/lib/db/schema';

import { renderTaskListItem } from '@/components/task-list-item';
import { TaskStatusIndicator } from '@/components/task-status-indicator';
import { Icons } from '@/components/icons';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { CreateTaskModal } from '@/components/modal/create-task-modal';
import { TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ActionTooltip } from '@/components/action-tooltip';
import { Button } from '@/components/ui/button';

interface ControlledCreateTaskModalProps {
  status: Status;
  projectId: string;
}

const ControlledCreateTaskModal = ({ projectId, status }: ControlledCreateTaskModalProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" color="secondary" variant="transparent" className="size-fit">
          <ActionTooltip label="Add issue">
            <Icons.Plus className="text-foreground/30 transition hover:text-foreground/60" />
          </ActionTooltip>
        </Button>
      </DialogTrigger>

      <CreateTaskModal setOpen={setOpen} status={status} projectId={projectId} />
    </Dialog>
  );
};

interface TaskListGroupProps {
  // taskGroup: TaskGroup;
  tasks: Task[];
  status: Status;
  isAdmin: boolean;
  projectId: string;
}

export const TaskListGroup = ({ status, tasks, projectId, isAdmin }: TaskListGroupProps) => {
  const renderItem = renderTaskListItem(tasks);

  return (
    <Droppable droppableId={status} renderClone={renderItem}>
      {(droppableProvided, snapshot) => (
        <>
          <TableHeader>
            <TableRow className="w-full justify-between horizontal">
              <TableHead>
                <TaskStatusIndicator status={status} />

                {status === Status.Backlog && 'Backlog'}
                {status === Status.Canceled && 'Canceled'}
                {status === Status.Done && 'Done'}
                {status === Status.InProgress && 'In Progress'}
                {status === Status.Todo && 'Todo'}
              </TableHead>

              <TableHead>
                {isAdmin ? (
                  <ControlledCreateTaskModal projectId={projectId} status={status} />
                ) : null}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody
            ref={droppableProvided.innerRef}
            {...droppableProvided.droppableProps}
            className={cn(
              'w-full text-sm ring-2 ring-blue-500 ring-opacity-0 transition duration-300',
              snapshot.isDraggingOver && 'ring-opacity-100'
            )}
          >
            {tasks.map((task, idx) => (
              <Draggable key={task.title} draggableId={task.title} index={idx}>
                {renderItem}
              </Draggable>
            ))}

            {droppableProvided.placeholder}
          </TableBody>
        </>
      )}
    </Droppable>
  );
};
