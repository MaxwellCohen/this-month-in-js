import type { Metadata } from 'next';
import { Instrument_Sans, Instrument_Serif, JetBrains_Mono } from 'next/font/google';
import { Suspense, type ReactNode, ViewTransition } from 'react';

import { Footer } from '@/components/footer';
import { Header } from '@/components/header';

import './globals.css';

const display = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-display-family',
  weight: '400',
  style: ['normal', 'italic'],
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono-family',
  weight: ['400', '500'],
});

const body = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-body-family',
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: {
    default: 'On This Month in JavaScript',
    template: '%s — On This Month in JavaScript',
  },
  description:
    'Browse HTML, CSS, and JavaScript features by when they became Baseline newly available or widely available.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

type RootLayoutProps = { children: ReactNode };

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${mono.variable} ${body.variable}`}
    >
      <body>
        <div className="flex min-h-svh flex-col">
          <Header />
          <main className="mx-auto w-full max-w-shell flex-1 px-6 pt-10 pb-20">
            <ViewTransition name="page-fade">
              <Suspense>{children}</Suspense>
            </ViewTransition>
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
