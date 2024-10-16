'use client';

import { useState } from 'react';

import { useUser } from '@/hooks/use-user';
import { useLogout } from '@/hooks/use-logout';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

  const { data: user, isLoading } = useUser();

  const logout = useLogout();

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          active={open}
          size="lg"
          fill
          variant="ghost"
          color="secondary"
          className="px-2 text-sm text-foreground center-v"
        >
          <div className="leading-none horizontal center-v">
            <Avatar className="mr-2 rounded-full" size="md">
              {isLoading || !user?.avatarUrl ? (
                <AvatarFallback className="bg-primary" />
              ) : (
                <AvatarImage src={user?.avatarUrl} alt={`${user.username}'s Avatar.`} />
              )}
            </Avatar>
            kneadle
          </div>

          <Icons.DotsVert className="ml-auto size-3.5 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 border border-foreground/10">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <div className="cursor-default select-none horizontal center-v">
              <Avatar className="mr-2 rounded-full" size="md">
                {isLoading || !user?.avatarUrl ? (
                  <AvatarFallback className="bg-primary" />
                ) : (
                  <AvatarImage src={user?.avatarUrl} alt={`${user.username}'s Avatar.`} />
                )}
              </Avatar>

              <p className="font-medium leading-none">kneadle</p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuGroup className="">
          <DropdownMenuItem className="p-0">
            <Button size="sm" color="secondary" className="justify-start" fill variant="ghost">
              Settings
            </Button>
          </DropdownMenuItem>

          <DropdownMenuItem className="p-0">
            <Button
              color="destructive"
              variant="ghost"
              fill
              className="justify-start"
              size="sm"
              onClick={e => {
                setOpen(false);
                logout(e);
              }}
            >
              Log out
            </Button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
