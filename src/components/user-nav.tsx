'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Icons } from '@/components/icons';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export const UserNav = () => {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          active={open}
          size="lg"
          fill
          variant="ghost"
          className="pr-4 text-sm text-foreground center-v"
        >
          <div className="leading-none horizontal center-v">
            <Avatar className="mr-2">
              <AvatarFallback className="rounded-full bg-sky-400" />
            </Avatar>
            kneadle
          </div>

          <Icons.DotsVert className="ml-auto size-3.5 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <div className="horizontal center-v">
              <Avatar className="mr-2 size-4 rounded-full">
                <AvatarFallback className="bg-sky-400" />
              </Avatar>

              <p className="font-medium leading-none">kneadle</p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>Settings</DropdownMenuItem>

          <DropdownMenuItem>Log out</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
