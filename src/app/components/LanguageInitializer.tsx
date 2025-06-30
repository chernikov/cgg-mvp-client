'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageInitializer({ children }: { children?: React.ReactNode }) {
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Set mounted to true first
    setMounted(true);
    
    // Load saved language from localStorage on client side only
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('selectedLanguage');
      if (savedLanguage && savedLanguage !== i18n.language) {
        i18n.changeLanguage(savedLanguage);
      }
    }
  }, [i18n]);

  // Prevent hydration mismatch by showing children immediately with suppression
  if (!mounted) {
    return <div suppressHydrationWarning>{children}</div>;
  }

  return <>{children}</>;
} 