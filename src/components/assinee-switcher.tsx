'use client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import { useProjectMembersQuery } from '@/hooks/use-project-members-query';
import { useTaskForm } from '@/components/task-form';

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
import { FormField } from '@/components/ui/form';

interface AssigneeSwitcherProps extends React.ComponentProps<typeof PopoverContent> {
  projectId: string;
  issueId?: string;
}

export const AssigneeSwitcher = ({ projectId, className, ...props }: AssigneeSwitcherProps) => {
  const [open, setOpen] = useState(false);

  const form = useTaskForm();

  const { data: assignees } = useSuspenseQuery(useProjectMembersQuery(projectId));

  return (
    <FormField
      control={form.control}
      name="assignee"
      render={({ field }) => (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              role="combobox"
              className={cn('relative gap-1', field?.value ? 'text-foreground' : '')}
              color="secondary"
            >
              {field?.value ? (
                <>
                  <Avatar className="rounded-md" size="sm">
                    {field?.value.avatarUrl ? (
                      <AvatarImage
                        src={field?.value.avatarUrl}
                        alt={`${field?.value.name}'s Avatar.`}
                      />
                    ) : (
                      <AvatarFallback className="bg-muted-foreground font-bold">
                        {field?.value.name[0].toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>

                  {field?.value.name}
                </>
              ) : (
                <div className="contents">
                  <Avatar className="rounded-md" size="sm">
                    <AvatarFallback className="rounded-full border-2 border-dotted border-muted-foreground"></AvatarFallback>
                  </Avatar>

                  <span className="font-normal text-foreground/50">Assignee</span>
                </div>
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent
            side="left"
            align="start"
            className={cn('border border-muted-foreground/10 px-0 w-fit md:w-[235px]', className)}
            {...props}
          >
            <Command>
              <CommandInput placeholder="Search members..." />
              <CommandList className="px-0">
                <CommandEmpty></CommandEmpty>

                <CommandGroup className="">
                  {assignees.map(assignee => (
                    <CommandItem
                      className={cn(
                        'justify-between horizontal',
                        assignee.member.id === field?.value?.id ? 'text-foreground' : ''
                      )}
                      key={assignee.member.id}
                      value={assignee.member.id}
                      onSelect={() => {
                        if (field?.value && field?.value.id === assignee.member.id) {
                          setOpen(false);
                          form.setValue('assignee', null);

                          return;
                        }

                        setOpen(false);
                        form.setValue('assignee', {
                          id: assignee.member.id,
                          name: assignee.member.username,
                          avatarUrl: assignee.member.avatarUrl
                        });
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

                      <div
                        className={cn(
                          'aspect-square size-4 rounded-full bg-emerald-400 horizontal center',
                          assignee.member.id === field?.value?.id ? 'opacity-100' : 'opacity-0'
                        )}
                      >
                        <Icons.Check className={'size-4 text-background'} />
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    />
  );
};
