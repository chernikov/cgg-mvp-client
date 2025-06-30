import "./globals.css";
import RootLayoutContent from './components/RootLayoutContent';

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
