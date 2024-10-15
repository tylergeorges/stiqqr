'use client';

import { useQueryClient } from '@tanstack/react-query';

import { projectsQueryKey } from '@/hooks/use-projects-query';
import { useCreateProjectMutation } from '@/hooks/use-create-project-mutation';
import { getAuthUser } from '@/lib/supabase/get-user';

import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CreateProjectModalProps {
  setShowNewProjectDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

export const CreateProjectModal = ({ setShowNewProjectDialog }: CreateProjectModalProps) => {
  const createProjectMutation = useCreateProjectMutation();
  const queryClient = useQueryClient();

  const createProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const target = e.target as HTMLFormElement;
    const inputElement = target[0] as HTMLInputElement;

    const projectName = inputElement.value?.trim() as string;

    if (!projectName) return;

    const { data: userData } = await getAuthUser();

    if (!userData || !userData.user) return;

    setShowNewProjectDialog(false);

    createProjectMutation.mutate(
      {
        name: projectName,
        ownerId: userData.user.id
      },

      {
        onSettled: () => {
          queryClient.invalidateQueries({
            queryKey: projectsQueryKey
          });
        },

        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: projectsQueryKey
          });
        }
      }
    );
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create Project</DialogTitle>
        <DialogDescription>Create a new project.</DialogDescription>
      </DialogHeader>

      <form onSubmit={createProject}>
        <div>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project name</Label>
              <Input id="name" placeholder="Acme Inc." className="bg-muted" />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button size="sm" type="submit">
            Create
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
