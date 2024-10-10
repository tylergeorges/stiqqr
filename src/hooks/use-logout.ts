'use client';

import { useRouter } from 'next/navigation';

import { useSupabase } from '@/hooks/use-supabase';

export const useLogout = () => {
  const supabase = useSupabase();
  const router = useRouter();

  const logout = async (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
    }

    await supabase.auth.signOut();

    router.refresh();

    router.push('/');
  };

  return logout;
};
