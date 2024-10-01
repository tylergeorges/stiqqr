import { decodeUrlPath } from '@/lib/utils';
import { PageProps } from '@/types';

export default function ProjectIssuePage({
  params
}: PageProps<{ issueName: string; projectName: string }>) {
  const issue = decodeUrlPath(params.issueName);
  const project = decodeUrlPath(params.projectName);

  return (
    <div className="gap-10 px-9 py-6 vertical">
      <div className="vertical">
        <p className="text-base font-bold text-muted-foreground">{project}</p>
        <h1 className="text-2xl font-bold">{issue}</h1>
      </div>

      <div className="vertical">
        <div className="">{/* <h2 className="font-semibold">Todo</h2> */}</div>
      </div>
    </div>
  );
}
