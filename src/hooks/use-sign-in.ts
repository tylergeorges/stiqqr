'use client';

import { useState } from 'react';
import { Provider } from '@supabase/supabase-js';

import { createClient } from '@/lib/supabase/browser';
import { getBaseUrl } from '@/lib/utils';

export const useSignIn = () => {
  const [isProviderLoading, setIsProviderLoading] = useState(false);

  const signInWith = async (provider: Provider = 'google') => {
    if (isProviderLoading) return;

    const supabase = createClient();

    setIsProviderLoading(true);

    const baseUrl = getBaseUrl();

    const redirectUrl = `${baseUrl}/auth/callback`;

    await supabase.auth.signInWithOAuth({
      provider,

      options: {
        redirectTo: redirectUrl
      }
    });
  };

  return [signInWith, isProviderLoading] as const;
};
