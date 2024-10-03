'use client';

import { useMemo } from 'react';

import { createClient } from '@/lib/supabase/browser';

export const useSupabase = () => useMemo(createClient, []);
