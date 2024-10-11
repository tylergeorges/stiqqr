'use client';

import { forwardRef } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

const badgeVariants = tv({
  base: 'relative z-10 inline-flex w-fit items-center justify-center rounded-full  px-2.5 py-1 text-xs',

  variants: {
    variant: {
      none: '',
      outline: 'border',
      ghost: 'bg-transparent',
      fill: ''
    },

    color: {
      default: 'bg-primary text-primary',
      secondary: 'border-muted-foreground/30 bg-muted-foreground/40    text-secondary-foreground40',
      white: 'text-white',
      orange: 'bg-orange-500 text-orange-500',
      red: 'text-red-500'
    }
  },

  compoundVariants: [
    {
      variant: 'fill',
      color: 'default',
      className: 'bg-primary text-primary-foreground'
    },
    {
      variant: 'fill',
      color: 'orange',
      className: 'bg-orange-500 text-black'
    },
    {
      variant: 'fill',
      color: 'red',
      className: 'bg-red-500 text-black'
    },
  
    {
      variant: 'fill',
      color: 'white',
      className: 'bg-white text-black'
    },

    {
      variant: 'outline',
      color: 'default',
      className: 'bg-transparent'
    },
    {
      variant: 'outline',
      color: 'orange',
      className: 'bg-transparent'
    },
    {
      variant: 'outline',
      color: 'red',
      className: 'bg-transparent'
    },
    {
      variant: 'ghost',
      color: 'secondary',
      className: 'bg-transparent'
    },

    {
      variant: 'outline',
      color: 'white',
      className: 'bg-transparent'
    }
  ],

  defaultVariants: {
    color: 'default'
  }
});

type BadgeVariants = VariantProps<typeof badgeVariants>;

interface BadgeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>, BadgeVariants {}

export const Badge = forwardRef<HTMLDivElement, React.PropsWithChildren<BadgeProps>>(
  ({ className, children, variant, color, ...props }, ref) => {
    return (
      <div
        {...props}
        className={badgeVariants({
          variant,
          color,
          className
        })}
        ref={ref}
      >
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';
