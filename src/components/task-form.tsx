'use client';

import { z } from 'zod';
import {
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
  useFormContext,
  UseFormReturn
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Status } from '@/lib/db/schema';

import { Form } from '@/components/ui/form';

const taskFormSchema = z.object({
  assignee: z
    .object({
      name: z.string(),
      id: z.string(),
      avatarUrl: z.string().optional()
    })
    .optional(),
  status: z.nativeEnum(Status)
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

export const useTaskForm = () => {
  return useFormContext<TaskFormValues>();
};

interface TaskFormProps extends Partial<TaskFormValues> {
  children: (methods: UseFormReturn<TaskFormValues>) => JSX.Element;
}

export const TaskForm = ({ children, assignee, status }: TaskFormProps) => {
  const form = useForm<TaskFormValues>({
    defaultValues: {
      assignee: assignee,
      status: status ?? Status.Todo
    },
    resolver: zodResolver(taskFormSchema)
  });

  return <Form {...form}>{children(form)}</Form>;
};
