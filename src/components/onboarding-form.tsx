'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

import type { User } from '@/lib/db/schema';
import { cn } from '@/lib/utils';
import { useCreateProjectMutation } from '@/hooks/use-create-project-mutation';
import { projectsQueryKey } from '@/hooks/use-projects-query';
import { useQueryClient } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const onboardingFormSchema = z.object({
  projectName: z
    .string()
    .trim()
    .min(2, {
      message: 'Required.'
    })
    .max(30, {
      message: 'Project name must be at most 30 characters.'
    })
});

type OnboardingFormSchema = z.infer<typeof onboardingFormSchema>;

interface OnboardingFormProps {
  user: User;
}

export const OnboardingForm = ({ user }: OnboardingFormProps) => {
  const createProjectMutation = useCreateProjectMutation();
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<OnboardingFormSchema>({
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: {
      projectName: ''
    }
  });

  const onSubmit = async (data: OnboardingFormSchema) => {
    const projectName = data.projectName.trim();

    if (!projectName || !user) return;

    await createProjectMutation.mutateAsync(
      {
        name: projectName,
        ownerId: user.id
      },

      {
        onSettled: () => {
          queryClient.invalidateQueries({
            queryKey: projectsQueryKey
          });
        },

        onSuccess: project => {
          if (project) {
            router.push(`/${project.project.id}/issues`);
          }

          queryClient.invalidateQueries({
            queryKey: projectsQueryKey
          });
        }
      }
    );
  };

  const {
    formState: { errors, isSubmitting }
  } = form;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="size-full flex-1 center vertical">
        <FormField
          control={form.control}
          name="projectName"
          render={({ field }) => (
            <FormItem className="motion-preset-fade w-full max-w-full motion-delay-[400ms] -motion-translate-y-in-[20%]">
              <FormLabel className="mb-1 text-sm">Project Name</FormLabel>

              <FormControl className="w-full">
                <Input
                  autoFocus
                  autoComplete="off"
                  placeholder="Acme, Inc."
                  className={cn(
                    'w-full focus-visible:ring-2',
                    errors?.projectName?.message ? 'ring-destructive' : ''
                  )}
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="motion-preset-fade relative my-0 w-full min-w-0 max-w-full justify-between space-y-0 pt-2 text-left vertical motion-delay-[300ms] -motion-translate-y-in-[35%]">
          <Button type="submit" fill loading={isSubmitting}>
            Create project
          </Button>
        </div>
      </form>
    </Form>
  );
};
