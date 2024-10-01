import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'sonner';

import { cn } from '@/lib/utils';
import { fontMono, fontSans } from '@/lib/fonts';
import { siteConfig } from '@/config/site';

import { ReactQueryProvider } from '@/providers/react-query-provider';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: siteConfig.name
  },
  description: siteConfig.description
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'relative flex size-full h-full flex-1 bg-secondary font-sans text-foreground antialiased',
          fontSans.variable,
          fontMono.variable
        )}
      >
        <ReactQueryProvider>
          <Toaster richColors />

          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
