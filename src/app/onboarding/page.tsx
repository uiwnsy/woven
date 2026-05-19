'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';


// ─── Slide data ────────────────────────────────────────────────────────────

const SLIDES = [
  {
    illust: <img src="/onboarding01.png" alt="" className="w-full max-w-[320px] object-contain" />,
    title: '인플루언서 계정\n아이디 입력',
    desc: '인플루언서의 계정 아이디를 입력하면,\n프로필 정보를 자동으로 가져와 추가해요.',
    cta: '다음',
  },
  {
    illust: <img src="/onboarding02.png" alt="" className="w-full max-w-[320px] object-contain" />,
    title: 'AI 브리프로\n쉽고 빠르게 제안',
    desc: '브랜드와 캠페인 정보만 입력하면\nAI가 최적의 브리프를 생성해요.',
    cta: '다음',
  },
  {
    illust: <img src="/onboarding03.png" alt="" className="w-full max-w-[320px] object-contain" />,
    title: '모든 협업 과정을\n한눈에 관리',
    desc: '리스트업부터 업로드 완료까지\n단계별로 인플루언서를 관리해요.',
    cta: '다음',
  },
  {
    illust: <img src="/onboarding04.png" alt="" className="w-full max-w-[320px] object-contain" />,
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
      <div className="flex justify-end px-5 pt-4">
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
