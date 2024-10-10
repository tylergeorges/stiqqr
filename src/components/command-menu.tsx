'use client';

import { useCallback, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { Project } from '@/lib/db/queries/project';
import { createInviteUrl } from '@/lib/utils';

import { useKey } from '@/hooks/use-key';
import { useClipboard } from '@/hooks/use-clipboard';
import { useAppRouter } from '@/hooks/use-app-router';
import { projectQueryKey } from '@/hooks/use-project-query';
import { useUser } from '@/hooks/use-user';

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
        <CreateTaskModal setOpen={setCreateIssueOpen} />
      </Dialog>
    </>
  );
};
