'use client';

import { useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { projectsQueryKey } from '@/hooks/use-projects-query';
import { useCreateTaskMutation } from '@/hooks/use-create-task-mutation';
import { Status } from '@/lib/db/schema';

import { Button } from '@/components/ui/button';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Editor, EditorInstance } from '@/components/editor';
import {
  CreateTaskFormValues,
  StatusSwitcher,
  useTaskStatusForm
} from '@/components/status-switcher';
import { AssigneeSwitcher } from '@/components/assinee-switcher';
import { Form } from '@/components/ui/form';
import { useAppRouter } from '@/hooks/use-app-router';

interface CreateTaskModalProps {
  status?: Status;
  projectId?: string;
}

export const CreateTaskModal = ({ status = Status.Todo, projectId }: CreateTaskModalProps) => {
  const { projectId: routerProjectId } = useAppRouter();

  const statusForm = useTaskStatusForm(status);

  const createTaskMutation = useCreateTaskMutation(projectId ?? routerProjectId ?? '');
  const queryClient = useQueryClient();

  const editorRef = useRef<EditorInstance>(null!);

  const createTask = async (data: CreateTaskFormValues) => {
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
        status: data.status
      },

      {
        onSettled: () => {
          queryClient.invalidateQueries({
            queryKey: projectsQueryKey
          });
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
    <Form {...statusForm}>
      <DialogContent >
        <DialogHeader>
          <DialogTitle>New issue</DialogTitle>
        </DialogHeader>

        <form onSubmit={statusForm.handleSubmit(createTask)}>
          <div>
            <div className="relative mx-auto max-w-[76ch] overflow-y-auto">
              <Editor ref={editorRef} />
            </div>

            <div className="horizontal center-v">
              <StatusSwitcher form={statusForm} status={status} side="bottom" align="center" />

              <AssigneeSwitcher
                side="bottom"
                align="center"
                projectId={projectId ?? routerProjectId ?? ''}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Create issue</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Form>
  );
};
