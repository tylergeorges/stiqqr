import { redirect } from 'next/navigation';
import { QueryClient } from '@tanstack/react-query';
import Image from 'next/image';

import { useProjectsQuery } from '@/hooks/use-projects-query';
import type { User } from '@/lib/db/schema';
import { getUser } from '@/lib/supabase/get-user';

import { Icons } from '@/components/icons';
import { LoginButton } from '@/components/login-button';
import { ButtonLink } from '@/components/ui/button';
import { BlurFade } from '@/components/magicui/blur-fade';
import { Particles } from '@/components/magicui/particles';
import { SparklesText } from '@/components/magicui/sparkles-text';

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
    <section className="relative size-full flex-1 overflow-hidden bg-black center-h vertical selection:bg-white selection:text-black">
      <div className="absolute -top-[calc(8rem_+_128px)] right-0 size-full horizontal center">
        <BlurFade duration={0.7} className="inset-0 mb-[8rem] size-full" delay={0.25}>
          <Particles className="z-0 size-full flex-1" quantity={100} />
        </BlurFade>
      </div>

      <div className="relative z-10 mt-32 h-full max-w-[80rem] px-6 center vertical md:px-8">
        <div className="z-0 self-center justify-self-center text-center center vertical">
          <BlurFade yOffset={-6} delay={0.25} className="gap-10 center vertical">
            {/* <h1 className="text relative mx-0 max-w-[43.5rem] text-balance to-foreground pt-5 text-left text-5xl font-bold leading-[1.1] tracking-tighter text-white sm:text-7xl md:px-4 md:py-2 md:text-center md:text-7xl md:leading-[] lg:max-w-screen-md lg:text-8xl"> */}
            <SparklesText
            
            className="text relative mx-0 max-w-[43.5rem] text-balance to-foreground pt-5 text-left text-5xl font-bold leading-[1.1] tracking-tight text-white sm:text-7xl md:px-4 md:py-2 md:text-center md:text-7xl md:leading-[] lg:max-w-screen-md lg:text-8xl">
              stiqqr
            </SparklesText>
            {/* </h1> */}
          </BlurFade>

          <BlurFade yOffset={-6} delay={0.25 * 2} className="mb-12">
            <p className="text-md max-w-lg text-lg font-medium text-foreground/50 md:text-lg">
              A task management app
            </p>
          </BlurFade>

          <BlurFade yOffset={-6} delay={0.25 * 3}>
            <div className="w-full flex-wrap space-x-4 horizontal center-v md:space-x-4 md:space-y-0">
              <LoginButton className="group/arrow" color="white">
                Get Started
                <Icons.ChevronRight className="ml-2 size-5 transition-transform group-hover/arrow:translate-x-1" />
              </LoginButton>

              <ButtonLink
                href="https://github.com/tylergeorges/stiqqr"
                target="_blank"
                color="secondary"
                className="flex-1 gap-2 center-v"
                variant="outline"
              >
                <Icons.GitHub className="size-4" />
                GitHub
              </ButtonLink>
            </div>
          </BlurFade>
        </div>

        <BlurFade
          className="motion-preset-slide-up-sm pointer-events-none mt-[8rem] inline-flex w-full select-none motion-delay-500"
          delay={0.25 * 2}
        >
          <div
            draggable={'false'}
            className="0 pointer-events-none relative aspect-video size-full flex-1 select-none overflow-hidden rounded-xl before:w-full md:-mb-32"
          >
            <Image
              width={2499}
              height={1354}
              draggable={'false'}
              alt="App preview"
              src="/assets/stiqqr-preview.png"
              className="pointer-events-none aspect-video select-none rounded-xl"
            />

            <div
              draggable={'false'}
              className="pointer-events-none absolute inset-0 z-10 aspect-video select-none [background:linear-gradient(to_top,black_30%,transparent)]"
            />
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
