'use client';

import { useState } from 'react';

import { useTaskForm } from '@/components/task-form';
import { cn } from '@/lib/utils';
import { Status } from '@/lib/db/schema/projects';

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
import { TaskStatusIndicator } from '@/components/task-status-indicator';
import { FormControl, FormField, FormItem } from '@/components/ui/form';

interface StatusData {
  label: string;
  value: Status;
}

export const taskStatuses = [
  { label: 'Todo', value: Status.Todo },
  { label: 'In Progress', value: Status.InProgress },
  { label: 'Canceled', value: Status.Canceled },
  { label: 'Done', value: Status.Done },
  { label: 'Backlog', value: Status.Backlog }
] satisfies StatusData[];

export interface CreateTaskFormValues {
  status: Status;
}

interface StatusSwitcherProps extends React.ComponentProps<typeof PopoverContent> {}

export const StatusSwitcher = ({ className, ...props }: StatusSwitcherProps) => {
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const form = useTaskForm();

  return (
    <Popover open={showStatusMenu} onOpenChange={setShowStatusMenu}>
      <FormField
        control={form.control}
        {...form.register('status')}
        render={({ field }) => {
          const currentStatus = taskStatuses.find(t => t.value === field.value);

          return (
            <FormItem>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="ghost"
                    role="combobox"
                    className="relative gap-1 text-foreground"
                    size="sm"
                    color="secondary"
                  >
                    <TaskStatusIndicator status={field.value} className="size-3" />

                    {currentStatus?.label}
                  </Button>
                </FormControl>
              </PopoverTrigger>

              <PopoverContent
                side="left"
                align="start"
                className={cn(
                  'w-fit border border-muted-foreground/10 px-0 md:w-[235px]',
                  className
                )}
                {...props}
              >
                <Command>
                  <CommandInput placeholder="Change status..." />
                  <CommandList className="px-0">
                    <CommandEmpty></CommandEmpty>

                    <CommandGroup className="">
                      {taskStatuses.map(task => (
                        <CommandItem
                          className={cn(
                            'justify-between horizontal',
                            task.value === currentStatus?.value
                              ? 'bg-muted-foreground/20 text-foreground hover:bg-muted-foreground/20 hover:text-foreground'
                              : 'hover:bg-muted-foreground/10 hover:text-foreground/50 data-[selected=true]:bg-none data-[selected=true]:text-muted-foreground'
                            // task.value === currentStatus?.value
                            //   ? 'bg-muted-foreground/20 text-foreground hover:bg-muted-foreground/20 hover:text-foreground'
                            //   : 'hover:bg-muted-foreground/10 hover:text-foreground/50'
                          )}
                          key={task.value}
                          value={task.value}
                          onSelect={() => {
                            form.setValue('status', task.value);

                            setShowStatusMenu(false);
                          }}
                        >
                          <div className="horizontal center-v">
                            <TaskStatusIndicator status={task.value} className="mr-2 size-3" />
                            {task.label}
                          </div>

                          <div
                            className={cn(
                              'aspect-square size-4 rounded-full bg-emerald-400 horizontal center',
                              task.value === currentStatus?.value ? 'opacity-100' : 'opacity-0'
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
            </FormItem>
          );
        }}
      />
    </Popover>
  );
};
