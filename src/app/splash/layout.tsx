import type { Metadata } from 'next';

export const metadata: Metadata = {
  themeColor: '#15163a',
};

export default function SplashLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: '#15163a', minHeight: '100vh' }}>
      {children}
    </div>
  );
}
