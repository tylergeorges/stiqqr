'use client';

import { cn, getRelativeTimeString } from '@/lib/utils';
import { useState } from 'react';

interface TimeProps {
  timestamp: Date;
  className?: string;
}

export const ShortTimestamp = ({ timestamp, className }: TimeProps) => {
  const [formatted] = useState(() => getRelativeTimeString(timestamp, 'narrow'));

  return (
    <time className={cn('', className)} suppressHydrationWarning>
      {formatted}
    </time>
  );
};

export const LongTimestamp = ({ timestamp, className }: TimeProps) => {
  return (
    <time className={cn('', className)} suppressHydrationWarning>
      {timestamp.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
    </time>
  );
};
