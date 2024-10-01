import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...args: ClassValue[]) => twMerge(clsx(args));

export const getBaseUrl = () => {
  if (typeof window !== 'undefined') return window.location.origin; // browser should use relative url
  // if (typeof window !== 'undefined') return `http://localhost:${process.env.PORT ?? 3000}`; // browser should use relative url

  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

export const generateUuid = () => crypto.randomUUID();

export const encodeUrlPath = (path: string) => {
  const encodedPath = encodeURIComponent(path.toLowerCase().replace('#', ''));

  return encodedPath.split('%20').join('-');
};

export const decodeUrlPath = (path: string) => {
  return decodeURIComponent(path.split('-').join(' '));
};


export const keys = <T extends object>(obj: T) => Object.keys(obj) as Array<keyof T>;

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);