import { cn, getRelativeTimeString } from '@/lib/utils';

// const rtf = new Intl.RelativeTimeFormat('en', {
//   style: 'narrow', // long (default), short, narrow
//   numeric: 'always' // always (default), auto
// });

interface TimeProps {
  timestamp: Date;
  className?: string;
}

export const ShortTimestamp = ({ timestamp, className }: TimeProps) => {
  const formatted = getRelativeTimeString(timestamp, 'narrow');

  return (
    <time className={cn('', className)}>
      {formatted}
      {/* {timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} */}
    </time>
  );
};

export const LongTimestamp = ({ timestamp, className }: TimeProps) => {
  return (
    <time className={cn('', className)}>
      {timestamp.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
    </time>
  );
};
