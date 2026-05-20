import type { Viewport } from 'next';

export const viewport: Viewport = {
  themeColor: '#1C1C1E',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
