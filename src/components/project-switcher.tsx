'use client';

import { useState } from 'react';

import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Icons } from '@/components/icons';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface Project {
  value: string;
  label: string;
}

const projects: Project[] = [
  {
    label: 'Test Project',
    value: 'test-project'
  },
  {
    label: 'Second Project',
    value: 'second-project'
  }
];

export const ProjectSwitcher = () => {
  const [open, setOpen] = useState(false);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState(projects[0]);

  return (
    <Dialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            active={open}
            size="lg"
            color="secondary"
            fill
            className="pr-4 text-sm text-foreground"
          >
            <div className="leading-none horizontal center-v">
              <Avatar className="mr-2">
                <AvatarFallback className="bg-primary" />
              </Avatar>
              {selectedProject.label}
            </div>

            <Icons.ChevronVert className="ml-auto size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent>
          <Command>
            <CommandList>
              <CommandGroup heading="Projects">
                {projects.map(project => (
                  <CommandItem
                    key={project.value}
                    onSelect={() => {
                      setSelectedProject(project);
                      setOpen(false);
                    }}
                    className="leading-none"
                  >
                    <Avatar className="mr-2">
                      <AvatarFallback className="bg-sky-400" />
                    </Avatar>

                    {project.label}

                    <Icons.Check
                      className={cn(
                        'ml-auto h-4 w-4',
                        selectedProject.value === project.value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>Create a new project.</DialogDescription>
        </DialogHeader>
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project name</Label>
              <Input id="name" placeholder="Acme Inc." />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setShowNewProjectDialog(false)}>
            Cancel
          </Button>
          <Button type="submit">Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
