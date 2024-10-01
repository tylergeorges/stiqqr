import { withTV } from 'tailwind-variants/transformer';
import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

import TailwindAnimate from 'tailwindcss-animate';
import TailwindTypography from '@tailwindcss/typography';
import TailwindAnimated from 'tailwindcss-animated';
import {
  TailwindChildren,
  TailwindFlexible,
  generateScreens,
  TailwindGradientText
} from './src/lib/tailwind/tailwind-plugins';

const config: Config = {
  darkMode: ['class'],

  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],

  theme: {
    screens: {
      ...generateScreens({ sm: 640, md: 768, lg: 1024, xl: 1280 })
    },

    extend: {
      typography: () => ({
        DEFAULT: {
          css: {
            '--tw-prose-body': 'rgb(var(--foreground) / 80%)',
            '--tw-prose-headings': 'rgb(var(--foreground))',
            '--tw-prose-lead': 'rgb(var(--foreground))',
            '--tw-prose-links': 'rgb(var(--foreground))',
            '--tw-prose-bold': 'rgb(var(--foreground))',
            '--tw-prose-counters': 'rgb(var(--muted-foreground))',
            '--tw-prose-bullets': 'rgb(var(--muted-foreground))',
            '--tw-prose-hr': 'rgb(var(--border))',
            '--tw-prose-quotes': 'rgb(var(--foreground))',
            '--tw-prose-quote-borders': 'rgb(var(--border))',
            '--tw-prose-captions': 'rgb(var(--foreground))',
            '--tw-prose-code': 'rgb(var(--foreground))',
            '--tw-prose-pre-code': 'rgb(var(--foreground))',
            '--tw-prose-pre-bg': 'rgb(var(--foreground))',
            '--tw-prose-th-borders': 'rgb(var(--foreground))',
            '--tw-prose-td-borders': 'rgb(var(--foreground))',
            '--tw-prose-invert-body': 'rgb(var(--foreground))',
            '--tw-prose-invert-headings': 'rgb(var(--foreground))',
            '--tw-prose-invert-lead': 'rgb(var(--foreground))',
            '--tw-prose-invert-links': 'rgb(var(--foreground))',
            '--tw-prose-invert-bold': 'rgb(var(--foreground))',
            '--tw-prose-invert-counters': 'rgb(var(--foreground))',
            '--tw-prose-invert-bullets': 'rgb(var(--foreground))',
            '--tw-prose-invert-hr': 'rgb(var(--foreground))',
            '--tw-prose-invert-quotes': 'rgb(var(--foreground))',
            '--tw-prose-invert-quote-borders': 'rgb(var(--foreground))',
            '--tw-prose-invert-captions': 'rgb(var(--foreground))',
            '--tw-prose-invert-code': 'rgb(var(--foreground))',
            '--tw-prose-invert-pre-code': 'rgb(var(--foreground))',
            '--tw-prose-invert-pre-bg': 'rgb(0 0 0 / 50%)',
            '--tw-prose-invert-th-borders': 'rgb(var(--foreground))',
            '--tw-prose-invert-td-borders': 'rgb(var(--foreground))'
          }
        }
      }),
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'card-gradient':
          'linear-gradient(to bottom, var(--card-gradient-primary), var(--card-gradient-secondary))'
      },

      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        ellipsis: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(0.8)', opacity: '0.3' },
          to: { transform: 'scale(1)', opacity: '1' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        ellipsis: 'ellipsis 1.4s infinite ease-in-out'
      },
      colors: {
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        destructive: 'rgb(var(--destructive) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
        border: 'rgb(var(--muted-foreground) / <alpha-value>)',
        input: 'rgb(var(--input) / <alpha-value>)',
        popover: {
          DEFAULT: 'rgb(var(--popover) / <alpha-value>)',
          foreground: 'rgb(var(--popover-foreground) / <alpha-value>)'
        },
        primary: {
          DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
          foreground: 'rgb(var(--primary-foreground) / <alpha-value>)'
        },
        secondary: {
          DEFAULT: 'rgb(var(--secondary) / <alpha-value>)',
          foreground: 'rgb(var(--secondary-foreground) / <alpha-value>)'
        },
        muted: {
          DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
          foreground: 'rgb(var(--muted-foreground) / <alpha-value>)'
        },
        card: {
          DEFAULT: 'rgb(var(--card) / <alpha-value>)',
          foreground: 'rgb(var(--card-foreground) / <alpha-value>)'
        }
      },

      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
        mono: ['var(--font-mono)', ...fontFamily.mono]
      }
    }
  },

  plugins: [
    TailwindGradientText,
    TailwindFlexible,
    TailwindAnimated,
    TailwindTypography,
    TailwindChildren,
    TailwindAnimate
  ]
};

export default withTV(config);
