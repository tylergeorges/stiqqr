import localFont from 'next/font/local';

export const fontSans = localFont({
  src: '../app/fonts/GeistVF.woff',
  variable: '--font-sans',
  weight: '100 900'
});

export const fontMono = localFont({
  src: '../app/fonts/GeistMonoVF.woff',
  variable: '--font-mono',
  weight: '100 900'
});
