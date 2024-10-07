'use client';

import { useState } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';

import { cn } from '@/lib/utils';
import { useProjectMembersQuery } from '@/hooks/use-project-members-query';

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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface AssigneeSwitcherProps extends React.ComponentProps<typeof PopoverContent> {
  projectId: string;
}

export const AssigneeSwitcher = ({ projectId, className, ...props }: AssigneeSwitcherProps) => {
  const { data: assignees } = useSuspenseQuery(useProjectMembersQuery(projectId));

  const [currentAssignee, setAssignee] = useState<string>();

  const currentAssigneeLabel = currentAssignee
    ? assignees.find(a => a.member.id === currentAssignee)?.member?.username
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
        className={cn('w-[235px] border border-muted-foreground/10 px-0', className)}
        {...props}
      >
        <Command>
          <CommandInput placeholder="Search members..." />
          <CommandList className="px-0">
            <CommandEmpty></CommandEmpty>

            <CommandGroup className="">
              {assignees.map(assignee => (
                <CommandItem
                  className="justify-between horizontal"
                  key={assignee.member.id}
                  onSelect={() => {
                    setAssignee(assignee.member.id);
                  }}
                >
                  <div className="horizontal center-v">
                    <Avatar className="mr-2 rounded-md" size="md">
                      {assignee.member.avatarUrl ? (
                        <AvatarImage
                          src={assignee.member.avatarUrl}
                          alt={`${assignee.member.username}'s Avatar.`}
                        />
                      ) : (
                        <AvatarFallback className="bg-muted-foreground font-bold">
                          {assignee.member.username[0].toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>

                    {assignee.member.username}
                  </div>

                  {
                    <div
                      className={cn(
                        'aspect-square size-4 rounded-full bg-emerald-400 horizontal center',
                        assignee.member.id === currentAssignee ? 'opacity-100' : 'opacity-0'
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
