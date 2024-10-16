'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSuspenseQuery } from '@tanstack/react-query';

import { cn } from '@/lib/utils';
import { useProjectsQuery } from '@/hooks/use-projects-query';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Icons } from '@/components/icons';
import { Dialog } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { CreateProjectModal } from '@/components/modal/create-project-modal';

interface ProjectSwitcherProps {
  memberId: string;
  projectId: string;
}

export const ProjectSwitcher = ({ memberId, projectId }: ProjectSwitcherProps) => {
  const router = useRouter();
  const { data: projects, error } = useSuspenseQuery(useProjectsQuery(memberId));

  const [open, setOpen] = useState(false);
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);

  const [selectedProject, setSelectedProject] = useState(() =>
    projects.find(p => p.project.id === projectId)
  );

  if (error) {
    return;
  }

  return (
    <Dialog open={showNewProjectDialog} onOpenChange={setShowNewProjectDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            active={open}
            size="lg"
            color="secondary"
            fill
            className="px-2 text-sm text-foreground"
          >
            <div className="leading-none horizontal center-v">
              <Avatar className="mr-2">
                <AvatarFallback className="bg-primary" />
              </Avatar>
              {selectedProject && selectedProject.project.name}
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
                    key={project.project.id}
                    onSelect={() => {
                      if (!selectedProject || selectedProject.project.id !== project.project.id) {
                        router.push(`/${project.project.id}/issues`);
                        
                        setSelectedProject(project);
                        setOpen(false);
                      }
                    }}
                    className="leading-none"
                  >
                    <Avatar className="mr-2">
                      <AvatarFallback className="bg-sky-400" />
                    </Avatar>

                    {project.project.name}

                    <Icons.Check
                      className={cn(
                        'ml-auto h-4 w-4',
                        selectedProject?.project?.id === project.project.id
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}

                <CommandItem
                  onSelect={() => {
                    setShowNewProjectDialog(true);
                    setOpen(false);
                  }}
                  className="leading-none"
                >
                  <Icons.Plus className="mr-2 size-4" />
                  Create Project
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <CreateProjectModal setShowNewProjectDialog={setShowNewProjectDialog} />
    </Dialog>
  );
};
