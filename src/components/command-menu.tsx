'use client';

import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useKey } from '@/hooks/use-key';
import { useClipboard } from '@/hooks/use-clipboard';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { Icons } from '@/components/icons';
import { Dialog } from '@/components/ui/dialog';
import { CreateTaskModal } from '@/components/modal/create-task-modal';
import { projectQueryKey } from '@/hooks/use-project-query';
import { useAppRouter } from '@/hooks/use-app-router';
import { useUser } from '@/hooks/use-user';
import { createInviteUrl } from '@/lib/utils';
import { Project } from '@/lib/db/queries/project';
import { toast } from 'sonner';

type Command = () => unknown;

export const CommandMenu = () => {
  const [open, setOpen] = useState(false);
  const [createIssueOpen, setCreateIssueOpen] = useState(false);
  const [, copy] = useClipboard();
  const queryClient = useQueryClient();

  const { projectId } = useAppRouter();
  const { data: user } = useUser();

  useKey('k', e => {
    if (e.metaKey || e.ctrlKey || e.key === '/') {
      if (
        (e.target instanceof HTMLElement && e.target.isContentEditable) ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      e.preventDefault();
      setOpen(open => !open);
    }
  });

  const runCommand = useCallback((command: Command) => {
    command();

    setOpen(false);
  }, []);

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />

        <CommandList>
          <CommandEmpty className="gap-2 p-3 horizontal center-v">
            <Icons.Search className="size-4" />
            No results found.
          </CommandEmpty>
          <CommandGroup heading="Issue">
            <CommandItem onSelect={() => runCommand(() => {})} className="gap-2">
              <Icons.Label className="" />
              Create new label...
            </CommandItem>
          </CommandGroup>

          <CommandGroup heading="Issue">
            <CommandItem
              onSelect={() =>
                runCommand(() => {
                  setCreateIssueOpen(o => !o);
                })
              }
              className="gap-2"
            >
              <Icons.Plus className="size-4" />
              Create new issue...
            </CommandItem>
          </CommandGroup>

          <CommandGroup heading="Project">
            <CommandItem
              onSelect={() =>
                runCommand(() => {
                  if (!user) return;

                  const projectInfo = queryClient.getQueryData<Project>([
                    ...projectQueryKey,
                    projectId,
                    user.id
                  ]);

                  if (!projectInfo) return;

                  const inviteUrl = createInviteUrl(projectInfo.project.inviteCode);

                  console.log(inviteUrl);
                  copy(inviteUrl)
                    .then(() => toast.success('Copied invite URL!'))
                    .catch(err => {
                      if (err instanceof Error) {
                        toast.error('Failed to copy invite URL.', { description: err.message });
                      }

                      console.error('Copy invite URL error:', err);
                    });
                })
              }
              className="gap-2"
            >
              <Icons.Clipboard className="size-4" />
              Copy invite URL
            </CommandItem>
          </CommandGroup>

          <div className="h-1 w-full" />
        </CommandList>
      </CommandDialog>

      <Dialog open={createIssueOpen} onOpenChange={setCreateIssueOpen}>
        <CreateTaskModal />
      </Dialog>
    </>
  );
};
