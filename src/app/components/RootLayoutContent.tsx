'use client';

import { Inter } from "next/font/google";
import dynamic from 'next/dynamic';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../config/i18n';

const inter = Inter({ subsets: ["latin"] });

// Dynamically import components with no SSR to prevent hydration issues
const LanguageSwitcher = dynamic(() => import('./LanguageSwitcher'), {
  ssr: false,
  loading: () => <div className="fixed top-4 right-4 z-50 w-10 h-10" />
});

const LanguageInitializer = dynamic(() => import('./LanguageInitializer'), {
  ssr: false,
  loading: () => null
});

export default function RootLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <body className={`${inter.className} min-h-screen`} suppressHydrationWarning>
      <I18nextProvider i18n={i18n}>
        <LanguageInitializer>
          <LanguageSwitcher />
          {children}
        </LanguageInitializer>
      </I18nextProvider>
    </body>
  );
} 