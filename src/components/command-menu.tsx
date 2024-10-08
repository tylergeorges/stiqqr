'use client';

import { useCallback, useState } from 'react';

import { useKey } from '@/hooks/use-key';
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

          <div className="h-1 w-full" />
        </CommandList>
      </CommandDialog>

      <Dialog open={createIssueOpen} onOpenChange={setCreateIssueOpen}>
        <CreateTaskModal />
      </Dialog>
    </>
  );
};
