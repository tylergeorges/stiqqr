/* eslint-disable @typescript-eslint/ban-types */

export type LayoutProps<Params extends {} = Record<never, never>> = keyof Params extends never
  ? {
      children: React.ReactNode;
    }
  : {
      children: React.ReactNode;
      params: Params;
    };

export type PageProps<Params extends {} = Record<never, never>> = keyof Params extends never
  ? never
  : {
      params: Params;
    };

export interface User {
  username: string;
  avatarUrl?: string;
  id: string;
}

export interface ProjectRole {}

export interface Member extends User {}

export interface Project {
  name: string;
  description: string;
  members: Member[];
}
