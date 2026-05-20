'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    // Set all theme-color meta tags to dark for splash
    const metas = document.querySelectorAll('meta[name="theme-color"]');
    const prevValues = Array.from(metas).map(m => m.getAttribute('content'));
    metas.forEach(m => m.setAttribute('content', '#1C1C1E'));
    document.body.style.backgroundColor = '#1C1C1E';

    const t = setTimeout(() => router.push('/onboarding'), 2000);

    return () => {
      clearTimeout(t);
      // Restore white before leaving
      metas.forEach((m, i) => m.setAttribute('content', prevValues[i] ?? '#ffffff'));
      document.body.style.backgroundColor = '';
    };
  }, [router]);

  return (
    <div className="fixed inset-0" style={{ backgroundColor: '#1C1C1E' }}>
      <div className="flex flex-col items-center justify-center h-full max-w-[430px] mx-auto">
        <img src="/woven-logo.svg" alt="Woven" width={91.17} height={16.38} />
      </div>
    </div>
  );
}
