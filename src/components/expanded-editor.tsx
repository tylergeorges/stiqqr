'use client';

import { useUpdateTaskMutation } from '@/hooks/use-update-task-mutation';

import { Editor } from '@/components/editor';
import { Task } from '@/lib/db/queries/project';

interface ExpandedEditorProps {
  projectId: string;
  taskId: string;
  task: Task;
}

export const ExpandedEditor = ({ projectId, taskId, task }: ExpandedEditorProps) => {
  const updateTask = useUpdateTaskMutation(projectId, taskId);

  const debouncedUpdateTask = (title?: string, description?: string) => {
    updateTask.mutate({
      title,
      description,
      taskId,
      projectId,
      position: task.position,
      updatedAt: new Date()
    });
  };

  return (
    <div className="relative mx-auto size-full max-w-[76ch] overflow-y-auto">
      <Editor issueTitle={task.title} desc={task.description} onUpdate={debouncedUpdateTask} />
    </div>
  );
};
