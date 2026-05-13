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
    <div className="flex flex-col items-center justify-center h-screen max-w-[430px] mx-auto"
      style={{ backgroundColor: '#15163a' }}>
      <img src="/woven-logo.svg" alt="Woven" width={115} height={21} />
    </div>
  );
}
