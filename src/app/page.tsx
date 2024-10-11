import { redirect } from 'next/navigation';
import { QueryClient } from '@tanstack/react-query';
import Image from 'next/image';

import { useProjectsQuery } from '@/hooks/use-projects-query';
import type { User } from '@/lib/db/schema';
import { getUser } from '@/lib/supabase/get-user';

import { Icons } from '@/components/icons';
import { LoginButton } from '@/components/login-button';
import { ButtonLink } from '@/components/ui/button';
import { BlurFade } from '@/components/blur-fade';
import { Particles } from '@/components/particles';

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
    <section className="relative size-full flex-1 overflow-hidden bg-black center-h vertical">
      <div className="absolute z-0 size-full">
        <BlurFade duration={0.7} className="absolute z-0 size-full flex-1" yOffset={0} delay={0.25}>
          <Particles className="inset-0 z-0 size-full flex-1" quantity={100} />
        </BlurFade>
      </div>

      <header className="sticky top-0 z-50 w-full backdrop-blur">
        <div className="container h-14 max-w-screen-2xl select-none horizontal center">
          <div className="mr-2 size-6 rounded-lg bg-[#F51C5D] center vertical">
            <Icons.Stiqqr className="size-5" />
          </div>

          <h1 className="inline-block font-black">stiqqr</h1>
        </div>
      </header>

      <div className="relative z-10 size-full max-w-[80rem] flex-1 justify-around px-6 vertical md:px-8">
        <div className="relative z-0 size-full self-center justify-self-center text-center center vertical md:mt-32">
          <div className="text-center center vertical">
            <div className="center vertical">
              <BlurFade delay={0.15}>
                <h1 className="text relative mx-0 max-w-[43.5rem] text-balance to-foreground pt-5 text-left text-5xl font-bold leading-[1.1] tracking-tighter text-white sm:text-7xl md:px-4 md:py-2 md:text-center md:text-7xl md:leading-[] lg:max-w-screen-md lg:text-8xl">
                  stiqqr
                </h1>
              </BlurFade>

              <BlurFade delay={0.15 * 2} className="mb-12">
                <p className="text-md max-w-lg text-lg font-medium text-foreground/50 md:text-lg">
                  A task management app
                </p>
              </BlurFade>

              <BlurFade delay={0.15 * 3}>
                <div className="w-full flex-wrap space-x-4 horizontal center-v md:space-x-4 md:space-y-0">
                  <LoginButton className="group/arrow">
                    Get Started
                    <Icons.ChevronRight className="ml-2 size-5 transition-transform group-hover/arrow:translate-x-1" />
                  </LoginButton>

                  <ButtonLink
                    href="https://github.com/tylergeorges/stiqqr"
                    target="_blank"
                    color="secondary"
                    className="flex-1 gap-2 center-v"
                    variant="ghost"
                  >
                    <Icons.GitHub className="size-4" />
                    GitHub
                  </ButtonLink>
                </div>
              </BlurFade>
            </div>
          </div>
        </div>

        <BlurFade className="aspect- inline-flex w-full" delay={0.15 * 2}>
          <div className="relative aspect-video size-full flex-1 overflow-hidden rounded-xl bg-black md:-mb-32">
            <Image
              width={2499}
              height={1354}
              alt='App preview'
              src="/assets/stiqqr-preview.png"
              className="aspect-video rounded-xl"
            />

            <div className="absolute inset-0 z-10 aspect-video bg-gradient-to-b from-transparent via-black/40 to-black" />
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
