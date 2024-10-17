'use client';

import { useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useCreateTaskMutation } from '@/hooks/use-create-task-mutation';
import { Status } from '@/lib/db/schema';
import { useAppRouter } from '@/hooks/use-app-router';
import { tasksQueryKey } from '@/hooks/use-tasks-query';

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
import { TaskForm, TaskFormMethods, TaskFormValues } from '@/components/task-form';

type InnerProps = CreateTaskModalProps & TaskFormMethods;

const CreateTaskModalForm = ({ setOpen, projectId, ...form }: InnerProps) => {
  const createTaskMutation = useCreateTaskMutation(projectId as string);
  const queryClient = useQueryClient();

  const editorRef = useRef<EditorInstance>(null!);

  const createTask = (data: TaskFormValues) => {
    const editor = editorRef.current;

    const title = editor.getTitle();
    const description = editor.getDescription();

    if (!editor || !projectId) return;

    if (!title) {
      toast.info('Title required', { description: 'Please enter a title before submtiting.' });

      return;
    }

    setOpen(false);

    createTaskMutation.mutate(
      {
        title: title,
        description: description,
        projectId: projectId,
        status: data.status,
        assigneeId: data.assignee?.id || null
      },

      {
        onSettled: () => {
          queryClient.invalidateQueries({
            queryKey: [...tasksQueryKey, projectId]
          });
        },

        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [...tasksQueryKey, projectId]
          });
        }
      }
    );
  };

  return (
    <form>
      <div className="px-4 pb-4">
        <div className="relative mx-auto max-w-[76ch] overflow-y-auto">
          <Editor ref={editorRef} />
        </div>

        <div className="horizontal center-v">
          <StatusSwitcher side="bottom" align="center" />

          <AssigneeSwitcher side="bottom" align="center" projectId={projectId as string} />
        </div>
      </div>

      <DialogFooter className="border-t border-muted p-3">
        <Button type="submit" size="xs" onClick={form.handleSubmit(createTask)}>
          Create issue
        </Button>
      </DialogFooter>
    </form>
  );
};

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

  const acutalProjectId = projectId ?? routerProjectId ?? '';

  return (
    <DialogContent className="px-0 pb-0">
      <DialogHeader className="mb-4 items-center gap-2 space-y-0 px-4 text-left horizontal">
        <DialogTitle className="text-sm">New issue</DialogTitle>
        <DialogDescription className="text-sm">Create a new issue.</DialogDescription>
      </DialogHeader>

      <TaskForm status={status}>
        {form => (
          <CreateTaskModalForm
            projectId={acutalProjectId}
            setOpen={setOpen}
            status={status}
            {...form}
          />
        )}
      </TaskForm>
    </DialogContent>
  );

  // return (
  //   <DialogContent className="px-0 pb-0">
  //     {/* <TaskForm status={status}> */}
  //       {/* {form => ( */}
  //         <InnerCreateTaskModal
  //           setOpen={setOpen}
  //           projectId={projectId ?? routerProjectId}
  //           status={status}
  //           {...form}
  //         />
  //       {/* )} */}
  //     </TaskForm>
  //   </DialogContent>
  // );
};
