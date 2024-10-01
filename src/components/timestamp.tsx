import { cn } from '@/lib/utils';

interface TimeProps {
  timestamp: Date;
  className?: string;
}

export const ShortTimestamp = ({ timestamp, className }: TimeProps) => {
  return (
    <time className={cn('', className)}>
      {timestamp.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
