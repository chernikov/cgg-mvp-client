'use client';

import { Inter } from "next/font/google";
import "./globals.css";
import RootLayoutContent from './components/RootLayoutContent';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uk" suppressHydrationWarning={true}>
      <body className={`${inter.className} min-h-screen`} suppressHydrationWarning={true}>
        <RootLayoutContent>
          {children}
        </RootLayoutContent>
      </body>
    </html>
  );
}
