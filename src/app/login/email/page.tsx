'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function EmailLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [autoLogin, setAutoLogin] = useState(false);

  const isFilled = email.trim().length > 0 && password.length > 0;

  const handleLogin = () => {
    if (isFilled) router.push('/home');
  };

  const handleScreenTap = () => {
    if (!isFilled) {
      setEmail('jieun@lumiere.co.kr');
      setPassword('lumiere123!');
    }
  };

  return (
    <div onClick={handleScreenTap} className="flex flex-col h-screen bg-white max-w-[430px] mx-auto relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-center px-5 h-[65px] border-b border-[#f0f2f8] shrink-0 relative">
        <button onClick={() => router.back()} className="absolute left-5 active:opacity-60">
          <ChevronLeft size={24} className="text-stone-900" />
        </button>
        <span className="text-[16px] font-semibold text-stone-900">이메일 로그인</span>
      </div>

      {/* Form */}
      <div className="px-5 pt-8 flex flex-col gap-3">
        {/* 아이디/이메일 */}
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="아이디 또는 이메일 주소"
          className="w-full h-[56px] border border-stone-200 rounded-xl px-4 text-[16px] text-stone-900 outline-none focus:border-iris-400 placeholder:text-stone-400 bg-white"
        />

        {/* 비밀번호 */}
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="비밀번호"
          className="w-full h-[56px] border border-stone-200 rounded-xl px-4 text-[16px] text-stone-900 outline-none focus:border-iris-400 placeholder:text-stone-400 bg-white"
        />

        {/* 자동 로그인 + 찾기 링크 */}
        <div className="flex items-center justify-between mt-1">
          <button
            onClick={() => setAutoLogin(v => !v)}
            className="flex items-center gap-2 active:opacity-70"
          >
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
              ${autoLogin ? 'border-iris-500 bg-iris-500' : 'border-stone-300 bg-white'}`}>
              {autoLogin && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <span className="text-[13px] text-stone-600">자동 로그인</span>
          </button>

          <div className="flex items-center gap-3 text-[13px] text-stone-400">
            <button className="active:opacity-60">아이디 찾기</button>
            <span>|</span>
            <button className="active:opacity-60">비밀번호 찾기</button>
          </div>
        </div>

        {/* 로그인 버튼 */}
        <button
          onClick={handleLogin}
          disabled={!isFilled}
          className={`w-full h-[56px] rounded-xl text-[16px] font-semibold mt-2 transition-colors
            ${isFilled
              ? 'bg-stone-900 text-white active:opacity-80'
              : 'bg-stone-100 text-stone-400 cursor-not-allowed'}`}
        >
          로그인
        </button>
      </div>
    </div>
  );
}
