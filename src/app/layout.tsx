'use client';

import "./globals.css";
import RootLayoutContent from './components/RootLayoutContent';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <RootLayoutContent>
        {children}
      </RootLayoutContent>
    </html>
  );
}
