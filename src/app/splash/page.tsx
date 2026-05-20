'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => router.push('/onboarding'), 2000);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="fixed inset-0" style={{ backgroundColor: '#1C1C1E' }}>
      <div className="flex flex-col items-center justify-center h-full max-w-[430px] mx-auto">
        <img src="/woven-logo.svg" alt="Woven" width={91.17} height={16.38} />
      </div>
    </div>
  );
}
