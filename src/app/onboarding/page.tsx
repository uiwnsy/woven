'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';


// ─── Slide data ────────────────────────────────────────────────────────────

const SLIDES = [
  {
    illust: <img src="/onboarding01.png" alt="" className="w-full max-w-[320px] object-contain" />,
    title: '인플루언서를\n캠페인에 추가하세요',
    desc: '계정 아이디를 입력하면\n프로필 정보를 불러와\n캠페인 보드에 추가할 수 있어요.',
    cta: '다음',
  },
  {
    illust: <img src="/onboarding02.png" alt="" className="w-full max-w-[320px] object-contain" />,
    title: '캠페인 정보로\nAI 브리프를 만드세요',
    desc: '제품, 예산, 핵심 메시지를 입력하면\n인플루언서에게 보낼\n제안서를 빠르게 생성해요.',
    cta: '다음',
  },
  {
    illust: <img src="/onboarding03.png" alt="" className="w-full max-w-[320px] object-contain" />,
    title: '컨택부터 업로드까지\n단계별로 관리하세요',
    desc: '리스트업, 컨택, 협의, 시안 확인,\n업로드 완료까지 진행 상태를 한 화면에서\n확인할 수 있어요.',
    cta: '다음',
  },
  {
    illust: <img src="/onboarding04.png" alt="" className="w-full max-w-[240px] object-contain" />,
    title: '성과를 비교하고\n다음 협업에 활용하세요',
    desc: '클릭, 전환, ROAS를\n인플루언서별로 비교하고\n성과 좋은 협업 이력을 다시 활용할 수 있어요.',
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
      <div className="flex-1 relative">
        {SLIDES.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 flex items-center justify-center px-8 transition-opacity duration-200 ${i === step ? 'opacity-100' : 'opacity-0'}`}
          >
            {s.illust}
          </div>
        ))}
      </div>

      {/* Title + desc */}
      <div className="px-6 pt-2 pb-6">
        <h1 className="text-[24px] font-bold text-stone-900 leading-tight mb-3 text-center whitespace-pre-line">
          {slide.title}
        </h1>
        <p className="text-[15px] text-stone-400 text-center leading-relaxed whitespace-pre-line">
          {slide.desc}
        </p>
      </div>

      {/* Dots + CTA */}
      <div className="px-6 pb-10">
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
