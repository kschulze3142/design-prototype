import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Robin Dock — Design Directions',
  description: 'Robin Dock design-prototype: four directions, three screens each.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
