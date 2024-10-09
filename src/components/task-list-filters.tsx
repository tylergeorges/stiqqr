'use client';

import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface TaskListFilterProps {}

const TaskListFilter = ({}: TaskListFilterProps) => {};

interface TaskListFiltersProps {}

export const TaskListFilters = () => {
  return (
    <div className="">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button>
            <Icons.Filter className="" />
            Filter
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
            <DropdownMenuItem>
                <Icons.Assignee />
                Assignee
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
