'use client';

import { Inter } from "next/font/google";
import dynamic from 'next/dynamic';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../config/i18n';

const inter = Inter({ subsets: ["latin"] });

// Dynamically import LanguageSwitcher with no SSR
const LanguageSwitcher = dynamic(() => import('./LanguageSwitcher'), {
  ssr: false
});

export default function RootLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <body className={`${inter.className} min-h-screen`}>
      <I18nextProvider i18n={i18n}>
        <LanguageSwitcher />
        {children}
      </I18nextProvider>
    </body>
  );
} 