'use client';

import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';

import type { Task } from '@/lib/db/queries/project';
import { useUpdateTaskMutation } from '@/hooks/use-update-task-mutation';

import { TaskForm, TaskFormValues } from '@/components/task-form';
import { StatusSwitcher } from '@/components/status-switcher';
import { AssigneeSwitcher } from '@/components/assinee-switcher';

interface TaskButtonsProps extends UseFormReturn<TaskFormValues> {
  projectId: string;
  task: Task;
}

const TaskButtons = ({ projectId, task, ...form }: TaskButtonsProps) => {
  const updateTaskMutation = useUpdateTaskMutation(projectId, task.id);

  useEffect(() => {
    const subscription = form.watch(data => {
      updateTaskMutation.mutate({
        taskId: task.id,
        projectId,
        assigneeId: data?.assignee ? data.assignee.id : null,
        status: data?.status
      });
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <form>
      <div className="horizontal">
        <StatusSwitcher />

        <AssigneeSwitcher projectId={projectId} />
      </div>
    </form>
  );
};

interface TaskToolbarProps {
  task: Task;
  projectId: string;
}

export const TaskToolbar = ({ task, projectId }: TaskToolbarProps) => {
  return (
    <TaskForm status={task.status} assignee={task?.assignee}>
      {form => <TaskButtons {...form} projectId={projectId} task={task} />}
    </TaskForm>
  );
};
