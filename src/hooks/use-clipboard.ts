'use client';

import { useCallback, useState } from 'react';
import { toast } from 'sonner';

type CopiedValue = string | null;

type CopyFn = (text: string) => Promise<boolean>;

export const useClipboard = () => {
  const [copied, setCopied] = useState<CopiedValue>(null);

  const copy: CopyFn = useCallback(async text => {
    if (!navigator?.clipboard) {
      toast.error('Clipboard not supported');
      return false;
    }

    // Try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);

      return true;
    } catch (error) {
      console.warn('Copy failed', error);
      setCopied(null);

      return false;
    }
  }, []);

  return [copied, copy] as const;
};
