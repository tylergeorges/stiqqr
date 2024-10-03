'use client';

import { useState } from 'react';

import type { TaskStatus } from '@/types/project';
import { cn } from '@/lib/utils';

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

interface Status {
  label: string;
  value: TaskStatus;
}
const taskStatuses = [
  { label: 'Todo', value: 'todo' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'Canceled', value: 'canceled' },
  { label: 'Done', value: 'done' },
  { label: 'Backlog', value: 'backlog' }
] satisfies Status[];

// type TaskStatusFormValues = z.infer<typeof accountFormSchema>

interface StatusSwitcherProps {
  status: TaskStatus;
}

export const StatusSwitcher = ({ status }: StatusSwitcherProps) => {
  const [currentStatus, setCurrentStatus] = useState(status);

  //   const form = useForm<AccountFormValues>({
  //     resolver: zodResolver(accountFormSchema),
  //     defaultValues
  //   });

  const currentStatusLabel = taskStatuses.find(st => st.value === currentStatus)?.label ?? '';

  return (
    <Popover>
      <PopoverTrigger asChild>
        {/* <FormControl> */}
        <Button variant="ghost" role="combobox" className="relative w-full justify-start pl-1.5">
          <TaskStatusIndicator status={currentStatus} className="size-3" />
          {currentStatusLabel}
        </Button>
        {/* </FormControl> */}
      </PopoverTrigger>

      <PopoverContent
        side="left"
        align="start"
        className="w-[235px] border border-muted-foreground/10 px-0"
      >
        <Command>
          <CommandInput placeholder="Change status..." />
          <CommandList className="px-0">
            <CommandEmpty></CommandEmpty>
            <CommandGroup className="">
              {taskStatuses.map(task => (
                <CommandItem
                  className="justify-between horizontal"
                  key={task.value}
                  onSelect={() => {
                    setCurrentStatus(task.value);
                    // form.setValue('language', task.value);
                  }}
                >
                  <div className="horizontal center-v">
                    <TaskStatusIndicator status={task.value} className="mr-2 size-3" />
                    {task.label}
                  </div>

                  <div
                    className={cn(
                      'aspect-square size-4 rounded-full bg-emerald-400 horizontal center',
                      task.value === currentStatus ? 'opacity-100' : 'opacity-0'
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
  );
};
