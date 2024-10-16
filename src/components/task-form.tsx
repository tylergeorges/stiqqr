'use client';

import { useEffect } from 'react';
import { z } from 'zod';
import { useForm, useFormContext, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Role, Status } from '@/lib/db/schema';
import { useUpdateTaskMutation } from '@/hooks/use-update-task-mutation';

import { Form } from '@/components/ui/form';

const taskFormSchema = z.object({
  assignee: z
    .object({
      name: z.string(),
      id: z.string(),
      avatarUrl: z.string().optional()
    })
    .nullable(),
  status: z.nativeEnum(Status)
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

export type TaskFormMethods = UseFormReturn<TaskFormValues>;

export const useTaskForm = () => {
  return useFormContext<TaskFormValues>();
};

export const useUpdateTaskForm = (form: TaskFormMethods, projectId: string, taskId: string) => {
  const updateTaskMutation = useUpdateTaskMutation(projectId, taskId);

  useEffect(() => {
    const subscription = form.watch(data => {
      updateTaskMutation.mutate({
        taskId: taskId,
        projectId,
        assigneeId: data?.assignee ? data.assignee.id : null,
        status: data?.status
      });
    });

    return () => subscription.unsubscribe();
  }, [taskId, updateTaskMutation, form, projectId]);
};

interface TaskFormProps {
  children: (methods: UseFormReturn<TaskFormValues>) => JSX.Element;
  status: Status;
  assignee?: {
    role: Role;
    projectId: string;
    memberId: string;
    joinedAt: Date;
    member: {
      id: string;
      username: string;
      avatarUrl: string;
      email: string;
    };
  } | null;
}

export const TaskForm = ({ children, assignee, status }: TaskFormProps) => {
  const form = useForm<TaskFormValues>({
    defaultValues: {
      assignee: assignee
        ? {
            avatarUrl: assignee.member.avatarUrl,
            id: assignee.memberId,
            name: assignee.member.username
          }
        : null,
      status: status ?? Status.Todo
    },
    resolver: zodResolver(taskFormSchema)
  });

  return <Form {...form}>{children(form)}</Form>;
};
