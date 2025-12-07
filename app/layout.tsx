import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/sonner';
import { Metadata } from 'next';
import { QueryProvider } from '@/providers/query-provider';
import { ThemeProvider } from '@/providers/theme-provider';
import { AuthProvider } from '@/providers/auth-provider';

const inter = Inter({ subsets: ['latin'] });

import '@/css/styles.css';
import '@/components/keenicons/assets/styles.css';

export const metadata: Metadata = {
  title: {
    template: '%s | Storely',
    default: 'Storely',
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-background" suppressHydrationWarning>
      <body
        className={cn(
          'h-full antialiased',
          inter.className,
        )}
      >
        <AuthProvider>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
