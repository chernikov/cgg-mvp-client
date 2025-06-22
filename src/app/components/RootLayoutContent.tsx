'use client';

import dynamic from 'next/dynamic';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../config/i18n';

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
    <I18nextProvider i18n={i18n}>
      <div className="min-h-screen">
        <LanguageSwitcher />
        {children}
      </div>
    </I18nextProvider>
  );
} 