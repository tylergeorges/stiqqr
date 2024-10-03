'use client';

import { useState } from 'react';

import { cn } from '@/lib/utils';
import { member1, member2, member3 } from '@/lib/test-data';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import { Icons } from '@/components/icons';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Assignee {
  label: string;
  value: string;
  avatarUrl?: string;
}
const assignees = [
  { label: member1.username, value: member1.id },
  { label: member2.username, value: member2.id },
  { label: member3.username, value: member3.id }
] satisfies Assignee[];

export const AssigneeSwitcher = () => {
  const [currentAssignee, setAssignee] = useState<string>();

  const currentAssigneeLabel = currentAssignee
    ? assignees.find(a => a.value === currentAssignee)?.label
    : '';

  return (
    <Popover>
      <PopoverTrigger asChild>
        {/* <FormControl> */}
        <Button variant="ghost" role="combobox" className="relative w-full justify-start pl-1.5">
          {currentAssigneeLabel ? (
            <>
              <Avatar className="rounded-md" size="md">
                <AvatarFallback className="bg-muted-foreground font-bold">
                  {currentAssigneeLabel[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {currentAssigneeLabel}
            </>
          ) : (
            <span className="text-foreground/50">Assignee</span>
          )}
        </Button>
        {/* </FormControl> */}
      </PopoverTrigger>

      <PopoverContent
        side="left"
        align="start"
        className="w-[235px] border border-muted-foreground/10 px-0"
      >
        <Command>
          <CommandInput placeholder="Search members..." />
          <CommandList className="px-0">
            <CommandEmpty></CommandEmpty>

            <CommandGroup className="">
              {assignees.map(assignee => (
                <CommandItem
                  className="justify-between horizontal"
                  key={assignee.value}
                  onSelect={() => {
                    setAssignee(assignee.value);
                  }}
                >
                  <div className="horizontal center-v">
                    <Avatar className="mr-2 rounded-md" size="md">
                      <AvatarFallback className="bg-muted-foreground font-bold">
                        {assignee.label[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    {assignee.label}
                  </div>

                  {
                    <div
                      className={cn(
                        'aspect-square size-4 rounded-full bg-emerald-400 horizontal center',
                        assignee.value === currentAssignee ? 'opacity-100' : 'opacity-0'
                      )}
                    >
                      <Icons.Check className={'size-4 text-background'} />
                    </div>
                  }
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
