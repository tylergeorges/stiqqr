'use client';

import { useSignIn } from '@/hooks/use-sign-in';

import { Button, ButtonProps } from '@/components/ui/button';

export const LoginButton = ({
  disabled,
  onClick,
  ...props
}: React.PropsWithChildren<ButtonProps>) => {
  const [signIn, isProviderLoading] = useSignIn();

  return (
    <Button
      onClick={e => {
        e.preventDefault();

        if (isProviderLoading) return;

        if (onClick) {
          onClick(e);
        }

        signIn('google');
      }}
      disabled={disabled || isProviderLoading}
      {...props}
    ></Button>
  );
};
