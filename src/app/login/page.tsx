'use client';

import { useRouter } from 'next/navigation';


function EmailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect x="1" y="3" width="16" height="12" rx="2" stroke="white" strokeWidth="1.5"/>
      <path d="M1 6l8 5 8-5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.1 9.2c0-.6-.1-1.2-.2-1.8H9v3.4h4.6c-.2 1-.8 1.9-1.7 2.4v2h2.7c1.6-1.5 2.5-3.7 2.5-6z" fill="#4285F4"/>
      <path d="M9 18c2.3 0 4.2-.8 5.6-2l-2.7-2c-.8.5-1.7.8-2.9.8-2.2 0-4.1-1.5-4.8-3.5H1.4v2.1C2.8 16.1 5.7 18 9 18z" fill="#34A853"/>
      <path d="M4.2 11.3c-.2-.5-.3-1-.3-1.6 0-.6.1-1.1.3-1.6V6H1.4C.8 7.2.5 8.6.5 10s.3 2.8.9 4l2.8-2.7z" fill="#FBBC05"/>
      <path d="M9 3.6c1.3 0 2.4.4 3.3 1.3l2.4-2.4C13.2.8 11.3 0 9 0 5.7 0 2.8 1.9 1.4 4.7l2.8 2.1C4.9 5.1 6.8 3.6 9 3.6z" fill="#EA4335"/>
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M14.5 9.6c0-2.5 2-3.7 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.7 0-1.9-.9-3.1-.9-1.6 0-3.1.9-3.9 2.4-1.7 2.9-.4 7.2 1.2 9.5.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.8 3-.8s1.8.8 3 .7c1.3 0 2.1-1.2 2.9-2.3.9-1.3 1.3-2.6 1.3-2.7-.1-.1-2.2-.9-2.2-3.5z" fill="white"/>
      <path d="M12.1 3.2c.6-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.8-1 2.9 1.1.1 2.2-.6 2.8-1.4z" fill="white"/>
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();

  return (
    <div
      className="flex flex-col h-screen max-w-[430px] mx-auto relative"
      style={{ backgroundColor: '#15163a' }}
    >
      {/* Logo centered */}
      <div className="flex-1 flex items-center justify-center">
        <img src="/woven-logo.svg" alt="Woven" width={115} height={21} />
      </div>

      {/* Buttons */}
      <div className="px-6 pb-10 flex flex-col gap-3">
        {/* 이메일로 로그인 */}
        <button
          onClick={() => router.push('/login/email')}
          className="w-full h-[54px] bg-iris-500 rounded-2xl flex items-center justify-center gap-3 active:opacity-80"
        >
          <EmailIcon />
          <span className="text-white text-[16px] font-semibold">이메일로 로그인</span>
        </button>

        {/* 구글로 로그인 */}
        <button className="w-full h-[54px] bg-transparent border border-[rgba(255,255,255,0.25)] rounded-2xl flex items-center justify-center gap-3 active:opacity-70">
          <GoogleIcon />
          <span className="text-white text-[16px] font-semibold">구글로 로그인</span>
        </button>

        {/* Apple로 로그인 */}
        <button className="w-full h-[54px] bg-transparent border border-[rgba(255,255,255,0.25)] rounded-2xl flex items-center justify-center gap-3 active:opacity-70">
          <AppleIcon />
          <span className="text-white text-[16px] font-semibold">Apple로 로그인</span>
        </button>

        {/* Footer links */}
        <div className="flex items-center justify-center gap-4 mt-2">
          {['회원가입', '계정찾기', '알아보기'].map((label, i) => (
            <span key={label} className="flex items-center gap-4">
              <button className="text-[13px] text-[rgba(255,255,255,0.45)] active:opacity-60">
                {label}
              </button>
              {i < 2 && <span className="text-[rgba(255,255,255,0.2)] text-[12px]">|</span>}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
