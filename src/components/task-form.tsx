'use client';

import { z } from 'zod';
import { useForm, useFormContext, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Role, Status } from '@/lib/db/schema';

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

export const useTaskForm = () => {
  return useFormContext<TaskFormValues>();
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
