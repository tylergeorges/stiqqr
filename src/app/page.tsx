import { Icons } from '@/components/icons';

export default function Home() {
  return (
    <div className="flex-1 vertical">
      <div className="flex-1 center vertical">
        <div className="text-center">
          <h1 className="relative text-balance text-center font-black sm:text-5xl md:text-6xl lg:text-8xl">
            {/* Stiqq. Organize. Achieve. */}
            <span className="relative text-primary">
              {/* <Icons.Sparkles className="absolute -left-10 -bottom-2 size-16 fill-yellow-300 text-background" /> */}
              Stiqq
              <Icons.Sparkles className="absolute -left-8 -top-10 size-12 fill-sky-300 text-transparent" />
              {/* <Icons.Sparkles className="absolute -top-6 -right-10 size-16 fill-sky-300 text-transparent" /> */}
            </span>
            Your Tasks
            <br /> Boost Your <span className="text-sky-300">Flow</span>
          </h1>

          <p className="text-balance text-center text-lg font-medium tracking-tight text-muted-foreground md:text-xl">
            Meet Stiqqr, the next-gen task management tool that lets you stick to what’s important.
          </p>
        </div>

        
      </div>
    </div>
  );
}
