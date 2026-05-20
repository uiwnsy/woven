'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';


// ─── Slide data ────────────────────────────────────────────────────────────

const SLIDES = [
  {
    illust: <img src="/onboarding01.png" alt="" className="w-full max-w-[344px] object-contain" />,
    title: '인플루언서를\n캠페인에 추가하세요',
    desc: '계정 아이디를 입력하면\n프로필 정보를 불러와\n캠페인 보드에 추가할 수 있어요.',
    cta: '다음',
  },
  {
    illust: <img src="/onboarding02.png" alt="" className="w-full max-w-[344px] object-contain" />,
    title: '캠페인 정보로\nAI 브리프를 만드세요',
    desc: '제품, 예산, 핵심 메시지를 입력하면\n인플루언서에게 보낼\n제안서를 빠르게 생성해요.',
    cta: '다음',
  },
  {
    illust: <img src="/onboarding03.png" alt="" className="w-full max-w-[344px] object-contain" />,
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
  const dragStartX = useRef<number | null>(null);

  const skip = () => router.push('/login');
  const next = () => {
    if (step < SLIDES.length - 1) setStep(step + 1);
    else router.push('/login');
  };

  const handleDragStart = (x: number) => { dragStartX.current = x; };
  const handleDragEnd = (x: number) => {
    if (dragStartX.current === null) return;
    const delta = x - dragStartX.current;
    dragStartX.current = null;
    if (delta < -50 && step < SLIDES.length - 1) setStep(s => s + 1);
    if (delta > 50 && step > 0) setStep(s => s - 1);
  };

  const slide = SLIDES[step];

  return (
    <div
      className="flex flex-col bg-white max-w-[430px] mx-auto overflow-hidden relative"
      style={{ height: '100dvh', minHeight: '100dvh' }}
      onTouchStart={e => handleDragStart(e.touches[0].clientX)}
      onTouchEnd={e => handleDragEnd(e.changedTouches[0].clientX)}
      onMouseDown={e => handleDragStart(e.clientX)}
      onMouseUp={e => handleDragEnd(e.clientX)}
    >

      {/* Skip */}
      {step < SLIDES.length - 1 && (
        <button
          onClick={skip}
          className="absolute top-[14px] right-[20px] text-[18px] font-medium text-[#999999] py-[10px] z-20 active:opacity-60"
        >
          건너뛰기
        </button>
      )}

      {/* Illustration */}
      <div className="flex-1 min-h-0 flex items-center justify-center px-[43px] relative">
        {SLIDES.map((s, i) => (
          <div
            key={i}
            className={`absolute inset-0 flex items-center justify-center px-[43px] transition-opacity duration-200 ${i === step ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            {s.illust}
          </div>
        ))}
      </div>

      {/* Title + desc */}
      <div className="flex flex-col items-center gap-[14px] px-6 pb-6">
        <h1 className="text-[24px] font-semibold text-black leading-[1.4] text-center whitespace-pre-line">
          {slide.title}
        </h1>
        <p className="text-[18px] text-black leading-[1.4] text-center whitespace-pre-line">
          {slide.desc}
        </p>
      </div>

      {/* Dots + CTA */}
      <div className="px-5 pt-6 flex flex-col gap-[16px]" style={{ paddingBottom: 'max(2.25rem, env(safe-area-inset-bottom))' }}>

        {/* Dots */}
        <div className="flex items-center justify-center gap-[10px]">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`rounded-full transition-all duration-300
                ${i === step
                  ? 'w-10 h-3 bg-[#1C1A17]'
                  : 'w-3 h-3 bg-[#D9D9D9]'}`}
            />
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={next}
          className="w-full py-4 bg-[#2E2C28] text-white text-[18px] font-semibold rounded-xl active:opacity-80"
        >
          {slide.cta}
        </button>

      </div>
    </div>
  );
}
