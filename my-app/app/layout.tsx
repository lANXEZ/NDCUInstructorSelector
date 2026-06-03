import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Instructor Selector — NUTR 69-S1',
  description: 'Rank and assign advisors for Nutritions and Dietetics students',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${geist.variable} antialiased`}>
      <body className="min-h-screen bg-white">{children}</body>
    </html>
  );
}
