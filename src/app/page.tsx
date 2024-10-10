import { redirect } from 'next/navigation';
import { QueryClient } from '@tanstack/react-query';

import { useProjectsQuery } from '@/hooks/use-projects-query';
import type { User } from '@/lib/db/schema';
import { getUser } from '@/lib/supabase/get-user';

import { Icons } from '@/components/icons';
import { LoginButton } from '@/components/login-button';
import { ButtonLink } from '@/components/ui/button';

interface RedirectToProjectsProps {
  user: User;
}

const RedirectToProjects = async ({ user }: RedirectToProjectsProps) => {
  const queryClient = new QueryClient();

  const projects = await queryClient.fetchQuery(useProjectsQuery(user.id));

  return redirect(`/${projects[0].project.id}/issues`);
};

export default async function Home() {
  const user = await getUser();

  if (user) return <RedirectToProjects user={user} />;

  return (
    <section className="container center vertical">
      <div className="mx-auto grid place-items-center gap-8 py-20 md:py-32 lg:max-w-screen-xl">
        <div className="space-y-8 text-center">
          <div className="text motion-preset-fade mx-auto text-balance text-center text-5xl font-bold motion-delay-200 -motion-translate-y-in-[15%] md:text-6xl lg:max-w-screen-md">
            <h1>
              Stiqq Your Tasks
              <span className="px-2 text-primary">Boost</span>
              Your Flow
            </h1>
          </div>

          <p className="motion-preset-fade mx-auto max-w-screen-sm text-lg font-medium text-muted-foreground motion-delay-300 -motion-translate-y-in-25">
            Meet Stiqqr, the next-gen task management tool that lets you stick to what’s important.
          </p>

          <div className="motion-preset-fade w-full flex-wrap space-y-4 center vertical motion-delay-[400ms] -motion-translate-y-in-25 md:space-x-4 md:space-y-0 md:horizontal">
            <LoginButton className="group/arrow w-full font-bold md:max-w-fit">
              Get Started
              <Icons.ChevronRight className="ml-2 size-5 transition-transform group-hover/arrow:translate-x-1" />
            </LoginButton>

            <ButtonLink
              href="https://github.com/tylergeorges/stiqqr"
              target="_blank"
              color="secondary"
              className="w-full flex-1 font-bold md:max-w-fit"
            >
              Github respository
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
