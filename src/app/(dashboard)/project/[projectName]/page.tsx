import { PageProps } from '@/types';

export default function ProjectPage({ params }: PageProps<{ projectName: string }>) {
  return (
    <div className="gap-10 px-9 py-6 vertical">
      <div className="vertical">
        <p className="text-lg font-bold text-muted-foreground">Projects</p>
        <h1 className="text-2xl font-bold">{params.projectName}</h1>
      </div>

      <div className="vertical">
        <div className="">
          <h2 className="font-semibold">Todo</h2>
        </div>
      </div>
    </div>
  );
}
