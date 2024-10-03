import { forwardRef } from 'react';
import Link from 'next/link';
import { type VariantProps, tv } from 'tailwind-variants';

import { cn } from '@/lib/utils';

const buttonVariants = tv({
  base: cn(
    'relative inline-flex w-fit cursor-pointer items-center whitespace-nowrap rounded-lg text-center text-sm text-white transition duration-300 ease-out',
    'outline-none ring-primary ',
    'items-center justify-center overflow-hidden align-middle font-medium disabled:cursor-not-allowed disabled:opacity-50'
  ),

  variants: {
    color: {
      default: 'bg-primary text-primary-foreground ring-white hover:bg-primary/90',
      white: 'bg-white text-black',
      secondary: 'bg-muted-foreground/10 text-secondary-foreground hover:bg-muted-foreground/20',
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
      xs: 'w-[52px] min-w-[52px] gap-1 p-1 text-xs',
      sm: 'gap-1 px-3 py-2 text-xs',
      md: 'h-9 gap-2 rounded-md px-4 py-0.5 py-2 text-sm',
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
      className:
        'bg-transparent text-destructive hover:bg-destructive hover:text-white active:bg-destructive/90 active:text-white'
    },
    {
      color: 'default',
      variant: 'ghost',
      className: 'bg-transparent text-foreground/90 hover:bg-foreground/5'
    },
    {
      color: 'default',
      active: true,
      variant: 'ghost',
      className: 'bg-foreground/10 text-foreground hover:bg-foreground/10 ring-0'
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

const ButtonLoadingDot = () => (
  <div className="relative size-1.5 rounded-full bg-white opacity-30" />
);

const LoadingEllipsis = () => {
  return (
    <div className="absolute flex h-full w-full gap-1 center child:animate-ellipsis [&>*:nth-child(2)]:delay-200 [&>*:nth-child(3)]:delay-100">
      <ButtonLoadingDot />
      <ButtonLoadingDot />
      <ButtonLoadingDot />
    </div>
  );
};

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

      {loading && <LoadingEllipsis />}
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
          className: ` ${className}`
        })}
        ref={ref}
      >
        {children}
      </Link>
    );
  }
);

ButtonLink.displayName = 'ButtonLink';
