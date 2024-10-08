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
  id: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export type QueryReturnType<T extends (...args: any) => any> =
    Awaited<ReturnType<T>> extends Array<infer U> ? Prettify<U> : Prettify<Awaited<ReturnType<T>>>;

  export type Prettify<T> = {
    [K in keyof T]: T[K];
  } & {};
}

export type {};
