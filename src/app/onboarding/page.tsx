import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { QueryClient } from '@tanstack/react-query';

import { useUserQuery } from '@/hooks/use-user-query';
import { useProjectsQuery } from '@/hooks/use-projects-query';
import { OnboardingForm } from '@/components/onboarding-form';
import { Icons } from '@/components/icons';

export const metadata: Metadata = {
  title: {
    absolute: 'Stiqqr - Onboarding',
    default: 'Onboarding'
  },
  description: 'Create a new project.'
};

export default async function OnboardingPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { refetchOnWindowFocus: false } }
  });

  const user = await queryClient.fetchQuery(useUserQuery());

  if (!user) {
    redirect('/');
  }

  const projects = await queryClient.fetchQuery(useProjectsQuery(user.id));

  if (projects.length) {
    redirect(`/${projects[0].project.id}/issues`);
  }

  return (
    <div className="size-full flex-1 px-6 vertical">
      <div className="fixed w-full">
        <div className="pt-2">
          <span className="text-sm text-muted-foreground">Logged in as</span>
          <p className="text-sm font-medium">{user.username}</p>
        </div>
      </div>

      <div className="size-full flex-1 center vertical">
        <div className="prose mx-auto max-w-full gap-8 vertical">
          <div className="gap-6 text-center center vertical">
            <div className="motion-preset-fade-lg inline-flex size-12 items-center justify-center rounded-xl bg-primary text-left motion-delay-100 -motion-translate-y-in-50">
              <Icons.Project className="size-6" />
            </div>

            <h1 className="motion-preset-fade mb-0 font-bold text-foreground motion-delay-200 -motion-translate-y-in-100">
              Create a new project
            </h1>

            <p className="motion-preset-fade mt-0 text-balance font-medium text-muted-foreground motion-delay-[300ms] -motion-translate-y-in-100">
              Projects are where teams can organize and work on project related tasks.
            </p>
          </div>

          <OnboardingForm user={user} />
        </div>
      </div>
    </div>
  );
}
