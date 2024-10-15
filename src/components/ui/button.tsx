'use client';

import Link from 'next/link';
import { forwardRef } from 'react';
import { type VariantProps, tv } from 'tailwind-variants';

import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';

const buttonVariants = tv({
  base: cn(
    'relative w-fit cursor-pointer whitespace-nowrap rounded-xl text-center text-sm text-white transition duration-300 ease-out',

    'inline-flex items-center justify-center overflow-hidden align-middle font-semibold outline-none ring-primary focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50',
    ''
  ),

  variants: {
    color: {
      default: 'bg-primary text-primary-foreground ring-primary-foreground hover:bg-primary/90',
      white: 'bg-white text-black',
      secondary: 'bg-foreground/[0.05] text-secondary-foreground hover:bg-muted-foreground/35',
      destructive: 'bg-destructive text-white hover:bg-destructive/60 active:bg-destructive/40',
      success: 'bg-success text-white hover:bg-success/90'
    },

    variant: {
      default: '',
      link: 'bg-transparent hover:bg-transparent hover:underline',
      outline:
        'border border-secondary bg-transparent hover:bg-secondary hover:text-secondary-foreground',
      ghost: 'border-none bg-transparent',
      transparent: 'bg-transparent hover:bg-transparent'
    },

    size: {
      xs: 'h-7 rounded-md px-3.5 text-xs',
      sm: 'h-9 rounded-md px-3 text-sm',
      md: 'h-12 px-4 text-sm',
      // md: 'gap-2 rounded-[4px] py-0.5 pl-1.5 pr-0.5 text-sm',
      lg: 'gap-3 px-7 py-3.5 text-base',
      xl: 'gap-2 px-6 text-base',
      icon: 'size-11 rounded-[15px] p-0 transition-none horizontal center'
    },

    active: {
      true: ''
    },

    round: {
      true: 'rounded-full'
    },

    fill: {
      true: 'w-full'
    }
  },

  defaultVariants: {
    color: 'default',
    size: 'md'
  },

  compoundVariants: [
    {
      color: 'default',
      variant: 'outline',
      className:
        'border border-primary bg-transparent text-primary hover:bg-primary hover:text-white'
    },
    {
      color: 'destructive',
      variant: 'outline',
      className:
        'hover:text-destructive-foreground border border-destructive bg-transparent text-destructive hover:bg-destructive'
    },
    {
      color: 'default',
      variant: 'outline',
      className: 'border-accent hover:bg-accent border bg-transparent text-primary'
    },

    {
      color: 'destructive',
      variant: 'ghost',
      className: 'bg-transparent text-destructive hover:bg-destructive/10 active:bg-destructive/20'
    },
    {
      color: 'secondary',
      variant: 'ghost',
      className: 'bg-transparent text-muted-foreground hover:bg-foreground/[0.05]'
    },
    {
      color: 'secondary',
      active: true,
      variant: 'ghost',
      className: 'bg-foreground/[0.05] text-foreground hover:bg-foreground/[0.05]'
    },
    {
      color: 'default',
      active: true,
      variant: 'ghost',
      size: 'icon',
      className: 'bg-primary text-primary-foreground hover:bg-primary'
    },
    {
      color: 'default',
      variant: 'ghost',
      size: 'icon',
      active: false,
      className: 'hover:bg-transparent'
    }
  ]
});

export type ButtonVariants = VariantProps<typeof buttonVariants>;

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'>,
    ButtonVariants {
  loading?: boolean;
}

interface ButtonStatusLabelProps {
  loading: boolean;
  className?: string;
}

export const ButtonStatusLabel = ({
  loading,
  children,
  className
}: React.PropsWithChildren<ButtonStatusLabelProps>) => {
  return <span className={cn(className, loading && 'invisible')}>{children}</span>;
};

export const Button = forwardRef<HTMLButtonElement, React.PropsWithChildren<ButtonProps>>(
  (
    {
      className,
      type = 'button',
      disabled,
      children,
      variant,
      color,
      loading,
      fill,
      size,
      round,
      active,
      ...props
    },
    ref
  ) => (
    <button
      {...props}
      type={type}
      className={buttonVariants({
        variant,
        color,
        round,
        fill,
        active,
        size,
        className
      })}
      disabled={loading || disabled}
      ref={ref}
    >
      {children}

      {loading && <Icons.Spinner className="size-3 animate-spin" />}
    </button>
  )
);

Button.displayName = 'Button';

type ButtonLinkProps = Omit<React.ComponentProps<typeof Link>, 'color'> &
  ButtonVariants & {
    className?: string;
  };

export const ButtonLink = forwardRef<HTMLAnchorElement, React.PropsWithChildren<ButtonLinkProps>>(
  ({ className, children, color, variant, active, fill, round, size, ...props }, ref) => {
    return (
      <Link
        {...props}
        className={buttonVariants({
          variant,
          fill,
          round,
          active,
          color,
          size,
          className
        })}
        ref={ref}
      >
        {children}
      </Link>
    );
  }
);

ButtonLink.displayName = 'ButtonLink';
