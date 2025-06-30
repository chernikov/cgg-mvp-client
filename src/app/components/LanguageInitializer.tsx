'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageInitializer({ children }: { children?: React.ReactNode }) {
  const { i18n } = useTranslation();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Load saved language from localStorage on client side only
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage).then(() => setReady(true));
    } else {
      setReady(true);
    }
  }, [i18n]);

  if (!ready) return null; // Or a loader if you want
  return <>{children}</>;
} 