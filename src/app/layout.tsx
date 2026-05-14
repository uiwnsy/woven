import type { Metadata } from 'next';
import { Manrope } from 'next/font/google';
import './globals.css';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Woven',
  description: '뷰티 브랜드 인하우스 마케터를 위한 인플루언서 캠페인 관리 앱',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={manrope.variable}>
      <body className="bg-gray-100 min-h-screen font-sans">{children}</body>
    </html>
  );
}
