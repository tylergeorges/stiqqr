'use client';

import { Draggable, Droppable } from '@hello-pangea/dnd';

import { cn } from '@/lib/utils';
import type { Task } from '@/lib/db/queries/project';

import { renderTaskListItem } from '@/components/task-list-item';
import { TaskStatusIndicator } from '@/components/task-status-indicator';
import { Icons } from '@/components/icons';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { CreateTaskModal } from '@/components/modal/create-task-modal';
import { Status } from '@/lib/db/schema';

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
        <div
          ref={droppableProvided.innerRef}
          {...droppableProvided.droppableProps}
          className={cn(
            'w-full text-sm ring-2 ring-blue-500 ring-opacity-0 transition duration-300',
            snapshot.isDraggingOver && 'ring-opacity-100'
          )}
        >
          <div className="w-full justify-between bg-muted-foreground/10 px-4 py-2 font-medium horizontal center-v">
            <div className="gap-2 horizontal center-v">
              <TaskStatusIndicator status={status} />

              {status === Status.Backlog && 'Backlog'}
              {status === Status.Canceled && 'Canceled'}
              {status === Status.Done && 'Done'}
              {status === Status.InProgress && 'In Progress'}
              {status === Status.Todo && 'Todo'}
            </div>

            {isAdmin ? (
              <Dialog>
                <DialogTrigger>
                  <Icons.Plus className="text-muted-foreground/70 transition hover:text-muted-foreground" />
                </DialogTrigger>

                <CreateTaskModal status={status} projectId={projectId} />
              </Dialog>
            ) : null}
          </div>

          <div>
            {tasks.map((task, idx) => (
              <Draggable key={task.title} draggableId={task.title} index={idx}>
                {renderItem}
              </Draggable>
            ))}
          </div>

          {droppableProvided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
