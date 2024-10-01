import { Icons } from '@/components/icons';

export default function Home() {
  return (
    <div className="flex-1 vertical">
      <div className="flex-1 center vertical">
        <div className="text-center">
          <h1 className="relative text-balance bg-gradient-to-r from-sky-300 to-blue-500 text-center font-black text-gradient sm:text-5xl md:text-6xl lg:text-8xl">
            Stiqq&nbsp;
            <Icons.Sparkles className="absolute -left-8 -top-10 size-12 text-sky-300" />
            Your Tasks
            <br /> Boost Your <span className=" ">Flow</span>
          </h1>

          <p className="max-w-[55ch] text-balance text-lg font-medium tracking-tight text-muted-foreground md:text-2xl">
            Meet Stiqqr, the next-gen task management tool that lets you stick to what’s important.
          </p>
        </div>
      </div>
    </div>
  );
}
