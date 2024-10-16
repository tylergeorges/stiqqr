'use client';

import { DragDropContext, OnDragEndResponder } from '@hello-pangea/dnd';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { tasksQueryKey, useTasksQuery } from '@/hooks/use-tasks-query';
import { entries } from '@/lib/utils';
import type { GroupedTask } from '@/types/project';
import { Role, Status } from '@/lib/db/schema/projects';
import { useCurrentMember } from '@/hooks/use-current-member';

import { TaskListGroup } from '@/components/task-list-group';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CreateTaskModal } from '@/components/modal/create-task-modal';
import { Table } from '@/components/ui/table';

interface ControlledTaskModalProps {
  projectId: string;
}

const ControlledTaskModal = ({ projectId }: ControlledTaskModalProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">Create new issue</Button>
      </DialogTrigger>

      <CreateTaskModal projectId={projectId} setOpen={setOpen} />
    </Dialog>
  );
};

interface TaskListProps {
  projectId: string;
}

export const TaskList = ({ projectId }: TaskListProps) => {
  const { data: projectTasks } = useSuspenseQuery(useTasksQuery(projectId));
  const queryClient = useQueryClient();

  const { data: member } = useSuspenseQuery(useCurrentMember());

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

  const isAdmin = member.role === Role.Owner || member.role === Role.Admin;

  return (
    <div className="size-full flex-1">
      {tasks.length ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <Table className="border-0">
            {tasks.map(([status, group]) => {
              return (
                <TaskListGroup
                  key={status}
                  projectId={projectId}
                  status={status}
                  tasks={group.tasks}
                  isAdmin={isAdmin}
                />
              );
            })}
          </Table>
        </DragDropContext>
      ) : null}

      {!tasks.length && isAdmin ? (
        <div className="size-full flex-1 horizontal center">
          <ControlledTaskModal projectId={projectId} />
        </div>
      ) : null}
    </div>
  );
};
