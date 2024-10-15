'use client';

import { useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { projectsQueryKey } from '@/hooks/use-projects-query';
import { useCreateTaskMutation } from '@/hooks/use-create-task-mutation';
import { Status } from '@/lib/db/schema';
import { useAppRouter } from '@/hooks/use-app-router';

import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Editor, EditorInstance } from '@/components/editor';
import { StatusSwitcher } from '@/components/status-switcher';
import { AssigneeSwitcher } from '@/components/assinee-switcher';
import { TaskForm, TaskFormValues } from '@/components/task-form';

interface CreateTaskModalProps {
  status?: Status;
  projectId?: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CreateTaskModal = ({
  setOpen,
  status = Status.Todo,
  projectId
}: CreateTaskModalProps) => {
  const { projectId: routerProjectId } = useAppRouter();

  const createTaskMutation = useCreateTaskMutation(projectId ?? routerProjectId ?? '');
  const queryClient = useQueryClient();

  const editorRef = useRef<EditorInstance>(null!);

  const createTask = (data: TaskFormValues) => {
    const editor = editorRef.current;

    const title = editor.getTitle();
    const description = editor.getDescription();

    if (!editor || (!projectId && !routerProjectId)) return;

    if (!title) {
      toast.info('Title required', { description: 'Please enter a title before submtiting.' });

      return;
    }

    createTaskMutation.mutate(
      {
        title: title,
        description: description,
        projectId: projectId ?? routerProjectId ?? '',
        status: data.status,
        assigneeId: data.assignee?.id
      },

      {
        onSettled: () => {
          queryClient.invalidateQueries({
            queryKey: projectsQueryKey
          });

          setOpen(false);
        },

        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: projectsQueryKey
          });
        }
      }
    );
  };

  return (
    <DialogContent>
      <TaskForm status={status}>
        {({ handleSubmit }) => (
          <form onSubmit={handleSubmit(createTask)}>
            <DialogHeader className="mb-4 text-left">
              <DialogTitle>New issue</DialogTitle>
              <DialogDescription>Create a new issue.</DialogDescription>
            </DialogHeader>

            <div>
              <div className="relative mx-auto max-w-[76ch] overflow-y-auto">
                <Editor ref={editorRef} />
              </div>

              <div className="horizontal center-v">
                <StatusSwitcher side="bottom" align="center" />

                <AssigneeSwitcher
                  side="bottom"
                  align="center"
                  projectId={projectId ?? routerProjectId ?? ''}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" size="xs">
                Create issue
              </Button>
            </DialogFooter>
          </form>
        )}
      </TaskForm>
    </DialogContent>
  );
};
