'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// ─── Slide Illustrations ───────────────────────────────────────────────────

function IllustSlide1() {
  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-[300px]">
      {/* Input card */}
      <div className="w-full bg-[#f4f4fd] rounded-2xl px-4 py-4 shadow-sm">
        <p className="text-[11px] text-stone-400 mb-2">계정 아이디 입력</p>
        <div className="flex items-center bg-white rounded-xl px-4 h-[40px] gap-2 border border-[#e0e1fb]">
          <span className="text-[13px] text-stone-500">@</span>
          <span className="flex-1 text-[13px] text-stone-800">woven</span>
          <div className="w-7 h-7 bg-iris-500 rounded-lg flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M7 3l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Arrow + sparkle */}
      <div className="flex items-center gap-1 text-iris-400">
        <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
          <path d="M9 2v16M9 18l-5-5M9 18l5-5" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-iris-400 text-[16px]">✦</span>
      </div>

      {/* Profile preview card */}
      <div className="w-full bg-[#f4f4fd] rounded-2xl px-4 py-4 shadow-sm">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-stone-200" />
          <div className="flex flex-col gap-1.5">
            <div className="h-2.5 w-24 bg-stone-200 rounded-full" />
            <div className="h-2 w-16 bg-stone-200 rounded-full" />
          </div>
        </div>
        <div className="flex gap-4 border-t border-stone-100 pt-3">
          {[['12.4만', '팔로워'], ['1,250', '게시물'], ['230', '팔로우']].map(([v, l]) => (
            <div key={l} className="flex flex-col items-start">
              <span className="text-[13px] font-semibold text-stone-700">{v}</span>
              <span className="text-[11px] text-stone-400">{l}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function IllustSlide2() {
  return (
    <div className="w-full max-w-[280px]">
      <div className="bg-[#f4f4fd] rounded-2xl px-5 py-5 shadow-sm">
        {[
          { label: '캠페인명', height: 'h-[30px]' },
          { label: '제품 정보', height: 'h-[52px]' },
          { label: '예산',     height: 'h-[30px]' },
        ].map(({ label, height }) => (
          <div key={label} className="mb-3 last:mb-4">
            <p className="text-[11px] text-stone-500 mb-1.5">{label}</p>
            <div className={`w-full ${height} bg-white rounded-lg border border-[#e0e1fb]`}>
              <div className="w-1/2 h-2 bg-stone-100 rounded-full m-2.5" />
              {height === 'h-[52px]' && <div className="w-1/3 h-2 bg-stone-100 rounded-full mx-2.5" />}
            </div>
          </div>
        ))}
        <div className="w-full h-[38px] bg-iris-500 rounded-xl flex items-center justify-center gap-2">
          <span className="text-white text-[13px]">✦</span>
          <span className="text-white text-[13px] font-semibold">AI 생성</span>
        </div>
      </div>
    </div>
  );
}

function IllustSlide3() {
  return (
    <div className="w-full max-w-[300px] flex gap-3 items-center">
      {/* Kanban list */}
      <div className="flex-1 bg-[#f4f4fd] rounded-2xl px-3 py-4 shadow-sm">
        {[1,2,3,4].map(i => (
          <div key={i} className="flex items-center gap-2 mb-2.5 last:mb-0">
            <div className="w-5 h-5 rounded-full bg-iris-500 flex items-center justify-center shrink-0">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="flex-1">
              <div className={`h-2 bg-stone-200 rounded-full ${i===1?'w-full':i===2?'w-4/5':i===3?'w-3/4':'w-2/3'}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Arrow */}
      <div className="flex flex-col gap-1 items-center">
        <div className="w-1 h-1 bg-iris-300 rounded-full"/>
        <div className="w-1 h-1 bg-iris-400 rounded-full"/>
        <svg width="16" height="10" viewBox="0 0 16 10" fill="none">
          <path d="M1 5h12M9 1l4 4-4 4" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* Completion card */}
      <div className="flex-1 bg-[#f4f4fd] rounded-2xl px-3 py-4 shadow-sm flex flex-col items-center gap-3">
        <div className="w-12 h-12 bg-iris-100 rounded-full flex items-center justify-center">
          <div className="w-9 h-9 bg-iris-500 rounded-full flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M4 9l3.5 3.5L14 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <div className="w-full h-[28px] bg-iris-500 rounded-lg" />
      </div>
    </div>
  );
}

function IllustSlide4() {
  return (
    <div className="w-full max-w-[280px]">
      <div className="bg-[#f4f4fd] rounded-2xl px-4 py-4 shadow-sm">
        {/* Line chart */}
        <div className="mb-4 relative h-[80px]">
          <svg width="100%" height="80" viewBox="0 0 240 80" fill="none" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25"/>
                <stop offset="100%" stopColor="#6366f1" stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d="M0 70 C40 65 60 50 90 42 C120 34 140 20 180 15 C210 10 230 8 240 5"
              stroke="#6366f1" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
            <path d="M0 70 C40 65 60 50 90 42 C120 34 140 20 180 15 C210 10 230 8 240 5 L240 80 L0 80Z"
              fill="url(#chartGrad)"/>
            {[[90,42],[180,15],[240,5]].map(([x,y],i) => (
              <circle key={i} cx={x} cy={y} r="4" fill="#6366f1"/>
            ))}
          </svg>
        </div>

        {/* Donut + stats */}
        <div className="flex items-center gap-4">
          <svg width="60" height="60" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="22" fill="none" stroke="#e0e1fb" strokeWidth="10"/>
            <circle cx="30" cy="30" r="22" fill="none" stroke="#6366f1" strokeWidth="10"
              strokeDasharray="83 55" strokeLinecap="round" transform="rotate(-90 30 30)"/>
          </svg>
          <div className="flex flex-col gap-2">
            {[['#6366f1','w-16'],['#a5b4fc','w-10'],['#e0e1fb','w-8']].map(([c,w],i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-sm shrink-0" style={{backgroundColor:c}}/>
                <div className={`h-2 ${w} bg-stone-200 rounded-full`}/>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Slide data ────────────────────────────────────────────────────────────

const SLIDES = [
  {
    illust: <IllustSlide1 />,
    title: '인플루언서 계정\n아이디 입력',
    desc: '인플루언서의 계정 아이디를 입력하면,\n프로필 정보를 자동으로 가져와 추가해요.',
    cta: '다음',
  },
  {
    illust: <IllustSlide2 />,
    title: 'AI 브리프로\n쉽고 빠르게 제안',
    desc: '브랜드와 캠페인 정보만 입력하면\nAI가 최적의 브리프를 생성해요.',
    cta: '다음',
  },
  {
    illust: <IllustSlide3 />,
    title: '모든 협업 과정을\n한눈에 관리',
    desc: '리스트업부터 업로드 완료까지\n단계별로 인플루언서를 관리해요.',
    cta: '다음',
  },
  {
    illust: <IllustSlide4 />,
    title: '데이터로 성과를\n분석하고 최적화',
    desc: 'ROAS, 클릭수, 전환수를 한눈에 보고\n다음 캠페인을 더 똑똑하게 운영해요.',
    cta: '시작하기',
  },
];

// ─── Main ──────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const skip = () => router.push('/login');
  const next = () => {
    if (step < SLIDES.length - 1) setStep(step + 1);
    else router.push('/login');
  };

  const slide = SLIDES[step];

  return (
    <div className="flex flex-col h-screen bg-white max-w-[430px] mx-auto relative overflow-hidden">
      {/* Skip */}
      <div className="flex justify-end px-5 pt-14">
        <button onClick={skip} className="text-[15px] text-stone-400 active:opacity-60">
          건너뛰기
        </button>
      </div>

      {/* Illustration */}
      <div className="flex-1 flex items-center justify-center px-8">
        {slide.illust}
      </div>

      {/* Text + dots + CTA */}
      <div className="px-6 pb-10">
        {/* Title */}
        <h1 className="text-[24px] font-bold text-stone-900 leading-tight mb-3 text-center whitespace-pre-line">
          {slide.title}
        </h1>
        <p className="text-[15px] text-stone-400 text-center leading-relaxed mb-8 whitespace-pre-line">
          {slide.desc}
        </p>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all duration-300
                ${i === step
                  ? 'w-6 h-2.5 bg-stone-900'
                  : 'w-2.5 h-2.5 bg-stone-200'}`}
            />
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={next}
          className="w-full h-[56px] bg-stone-900 text-white text-[16px] font-semibold rounded-2xl active:opacity-80"
        >
          {slide.cta}
        </button>
      </div>
    </div>
  );
}
