/* eslint-disable @typescript-eslint/no-explicit-any */
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

export const entries = <T extends object>(obj: T) => Object.entries(obj) as [keyof T, T[keyof T]][];

export const keys = <T extends object>(obj: T) => Object.keys(obj) as Array<keyof T>;

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

// Takes an enum and return an array with each values
export const enumToPgEnum = <T extends Record<string, any>>(
  myEnum: T
): [T[keyof T], ...T[keyof T][]] => {
  // export const enumToPgEnum = <T>(myEnum: T): [string, ...string[]] => {
  return Object.values(myEnum).map((value: any) => `${value}`) as any;
};

export const createInviteUrl = (inviteCode: string) => `${getBaseUrl()}/invite/${inviteCode}`;

/**
 * Convert a date to a relative time string, such as
 * "a minute ago", "in 2 hours", "yesterday", "3 months ago", etc.
 * using Intl.RelativeTimeFormat
 */
export const getRelativeTimeString = (
  date: Date | number,
  style: Intl.RelativeTimeFormatStyle = 'long',
  lang = navigator.language
): string => {
  // Allow dates or times to be passed
  const timeMs = typeof date === 'number' ? date : date.getTime();

  // Get the amount of seconds between the given date and now
  const deltaSeconds = Math.round((timeMs - Date.now()) / 1000);

  // Array reprsenting one minute, hour, day, week, month, etc in seconds
  const cutoffs = [60, 3600, 86400, 86400 * 7, 86400 * 30, 86400 * 365, Infinity];

  // Array equivalent to the above but in the string representation of the units
  const units: Intl.RelativeTimeFormatUnit[] = [
    'second',
    'minute',
    'hour',
    'day',
    'week',
    'month',
    'year'
  ];

  // Grab the ideal cutoff unit
  const unitIndex = cutoffs.findIndex(cutoff => cutoff > Math.abs(deltaSeconds));

  // Get the divisor to divide from the seconds. E.g. if our unit is "day" our divisor
  // is one day in seconds, so we can divide our seconds by this to get the # of days
  const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;

  // Intl.RelativeTimeFormat do its magic
  const rtf = new Intl.RelativeTimeFormat(lang, {
    numeric: 'auto',
    style
  });

  if (style === 'narrow') {
    const parts = rtf.formatToParts(Math.floor(deltaSeconds / divisor), units[unitIndex]);

    const customFormattedString = parts
      .map(part => {
        if (part.type === 'literal' && part.value !== 'now') {
          return part.value.slice(0, part.value.indexOf(' '));
        }

        return part.value;
      })
      .join('');

    return customFormattedString;
  }

  console.log(unitIndex)

  return rtf.format(Math.floor(deltaSeconds / divisor), units[unitIndex]);
};

export const arr = (length: number) => Array.from({ length }).fill(0);
