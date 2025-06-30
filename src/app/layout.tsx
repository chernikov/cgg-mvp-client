import "./globals.css";
import RootLayoutContent from './components/RootLayoutContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Career Guidance Guild",
  description: "Magical career guidance platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <RootLayoutContent>
        {children}
      </RootLayoutContent>
    </html>
  );
}
