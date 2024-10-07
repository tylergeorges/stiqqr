'use client';

import { DragDropContext, OnDragEndResponder } from '@hello-pangea/dnd';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

import { tasksQueryKey, useTasksQuery } from '@/hooks/use-tasks-query';
import { entries } from '@/lib/utils';
import type { GroupedTask } from '@/types/project';
import { Status } from '@/lib/db/schema/projects';

import { TaskListGroup } from '@/components/task-list-group';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CreateTaskModal } from '@/components/modal/create-task-modal';

interface TaskListProps {
  projectId: string;
}

export const TaskList = ({ projectId }: TaskListProps) => {
  const { data: projectTasks } = useSuspenseQuery(useTasksQuery(projectId));
  const queryClient = useQueryClient();

  const onDragEnd: OnDragEndResponder = result => {
    // dropped outside the list
    if (!result.destination) return;

    const { source, destination } = result;

    const start = source.index;
    const end = destination.index;
    const status = destination.droppableId as Status;

    const items = structuredClone(projectTasks);

    const prevGroupStatus = result.source.droppableId as Status;
    const newGroupStatus = destination.droppableId as Status;

    const tasks = items[newGroupStatus].tasks;

    // same group
    if (prevGroupStatus === newGroupStatus) {
      const [removed] = tasks.splice(start, 1);

      tasks.splice(end, 0, { ...removed, status: status });

      items[status].tasks = tasks;
    } else {
      const [removed] = items[prevGroupStatus].tasks.splice(start, 1);

      items[newGroupStatus].tasks.splice(end, 0, { ...removed, status: newGroupStatus });

      if (!items[prevGroupStatus].tasks.length) {
        delete items[prevGroupStatus];
      }
    }

    queryClient.setQueryData<GroupedTask>([...tasksQueryKey, projectId], items);
  };

  const tasks = entries(projectTasks);

  return (
    <div className="size-full flex-1">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="rounded-t-xl border border-muted-foreground/20">
          {tasks.map(([status, group]) => {
            return (
              <TaskListGroup
                key={status}
                projectId={projectId}
                status={status}
                tasks={group.tasks}
              />
            );
          })}
        </div>
      </DragDropContext>

      {!tasks.length ? (
        <div className="size-full flex-1 horizontal center">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Create new issue</Button>
            </DialogTrigger>

            <CreateTaskModal projectId={projectId} />
          </Dialog>
        </div>
      ) : null}
    </div>
  );
};
