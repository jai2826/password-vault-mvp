// src/app/providers.tsx (Example for Next.js App Router)
'use client';

import { ThemeProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes';

export function ThemeProviders({ children, ...props }: ThemeProviderProps) {
  // Use 'class' strategy for Tailwind CSS integration
  return <ThemeProvider attribute="class" defaultTheme="system" enableSystem {...props}>{children}</ThemeProvider>;
}