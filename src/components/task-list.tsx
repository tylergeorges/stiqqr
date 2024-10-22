'use client';

import { DragDropContext, OnDragEndResponder } from '@hello-pangea/dnd';
import { useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { tasksQueryKey, useTasksQuery } from '@/hooks/use-tasks-query';
import { Role, Status } from '@/lib/db/schema/projects';
import { useCurrentMember } from '@/hooks/use-current-member';
import { useUpdateTaskMutation } from '@/hooks/use-update-task-mutation';

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

  const updatedTaskMutation = useUpdateTaskMutation(projectId);

  const onDragEnd: OnDragEndResponder = result => {
    // dropped outside the list
    if (!result.destination) return;

    const { source, destination } = result;

    const start = source.index;
    const end = destination.index;

    let items = projectTasks;

    const prevGroupStatus = result.source.droppableId as Status;
    const newGroupStatus = destination.droppableId as Status;

    const newGroupIdx = items.findIndex(group => group[0].status === newGroupStatus);

    const prevGroupIdx = items.findIndex(group => group[0].status === prevGroupStatus);

    const tasks = items[newGroupIdx];

    // same group
    if (prevGroupStatus === newGroupStatus) {
      const [removed] = tasks.splice(start, 1);

      tasks.splice(end, 0, { ...removed });

      items[newGroupIdx] = tasks;
    } else {
      const [removed] = items[prevGroupIdx].splice(start, 1);

      tasks.splice(end, 0, { ...removed, status: newGroupStatus });

      updatedTaskMutation.mutate(
        {
          projectId: removed.projectId,
          taskId: removed.id,
          updatedAt: new Date(),
          assigneeId: removed.assigneeId,
          description: removed?.description ?? undefined,
          title: removed.title,
          status: newGroupStatus
        },
        {}
      );

      if (!items[prevGroupIdx].length) {
        items = items.filter((_, idx) => idx !== prevGroupIdx);
      }

      items[newGroupIdx] = tasks;
    }

    queryClient.setQueryData([...tasksQueryKey, projectId], items);
  };

  const isAdmin = member.role === Role.Owner || member.role === Role.Admin;

  return (
    <div className="size-full flex-1 overflow-y-auto">
      {projectTasks.length ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <Table className="border-0">
            {projectTasks.map(taskGroup => {
              return (
                <TaskListGroup
                  key={taskGroup[0].status}
                  projectId={projectId}
                  status={taskGroup[0].status}
                  tasks={taskGroup}
                  isAdmin={isAdmin}
                />
              );
            })}
          </Table>
        </DragDropContext>
      ) : null}

      {!projectTasks.length && isAdmin ? (
        <div className="size-full flex-1 horizontal center">
          <ControlledTaskModal projectId={projectId} />
        </div>
      ) : null}
    </div>
  );
};
