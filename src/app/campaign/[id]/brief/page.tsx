'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createPortal } from 'react-dom';
import { ChevronLeft, X } from 'lucide-react';

const BRIEF_VARIANTS = [
  `안녕하세요 인플루언서님! 😊\n루미에르입니다.\n\n루미에르 봄봄 프로모션 캠페인에 함께할 크리에이터를 찾고 있어요. 평소 뷰티 콘텐츠를 즐겨보다가 꼭 함께하고 싶어 연락드렸어요!\n\n🎁 제품: 루미에르 선블럭 크림 (신제품)\n🎬 콘텐츠: 인스타그램 릴스 1건 — 봄 무드 데일리 메이크업 룩\n🏷 필수 태그: #선케어 #자외선차단 #수분 #루미에르\n📎 가이드라인: docs.google.com/fxB2eY1zadeox4dkz\n🚫 경쟁 브랜드 언급 금지 · 프로모션 용어 사용 금지 · 과장 표현 금지`,
  `안녕하세요,\n뷰티 브랜드 루미에르 마케팅팀입니다.\n\n이번 봄봄 프로모션 캠페인을 위해 협업을 제안드리고 싶어 연락드렸습니다. 평소 진정성 있는 리뷰 콘텐츠를 인상 깊게 보았습니다.\n\n■ 제품: 루미에르 선블럭 크림\n■ 게시 채널: 인스타그램 릴스 1건\n■ 콘텐츠 방향: 일상 속 자연스러운 선케어 루틴\n■ 필수 해시태그: #루미에르 #선케어 #자외선차단\n■ 참고 가이드라인: docs.google.com/fxB2eY1zadeox4dkz\n\n※ 경쟁사 언급 및 과장 광고 표현은 삼가 주시기 바랍니다.`,
  `안녕하세요 🌿\n루미에르 팀이에요!\n\n피드 보다가 꼭 함께하고 싶어서 연락드렸어요. 이번에 출시한 선블럭 크림, 뷰티 루틴 좋아하시는 분들이 진짜 좋아할 것 같거든요 ☀️\n\n📦 제품: 루미에르 선블럭 크림\n📱 형식: 인스타 릴스 1개 — 데일리 메이크업 or 스킨케어 루틴에 자연스럽게\n🏷 태그: #루미에르 #선케어 #자외선차단 #수분크림\n🔗 가이드: docs.google.com/fxB2eY1zadeox4dkz\n\n경쟁 브랜드 언급이나 과장 표현만 피해주시면 나머지는 자유롭게 해주세요!`,
];

const QUICK_PROMPTS = [
  '더 친근하게',
  '더 짧게',
  '더 전문적으로',
  '제품 혜택 강조',
  '핵심만 간결하게',
  '이모지 없이',
];

const CAMPAIGN_TITLES: Record<string, string> = {
  '1': '루미에르 봄봄 프로모션',
  '2': '수분크림 마이크로 인플루언서',
  '3': '선크림 런칭 캠페인',
};

export default function CampaignBriefPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [briefVersion, setBriefVersion] = useState(0);
  const [editedBrief, setEditedBrief] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [briefCopied, setBriefCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showRegenSheet, setShowRegenSheet] = useState(false);
  const [regenPrompt, setRegenPrompt] = useState('');
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [mounted, setMounted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const promptRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!isEditing) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const vv = window.visualViewport;
    const onViewport = () => { if (vv) setKeyboardHeight(Math.max(0, window.innerHeight - vv.height)); };
    if (vv) { vv.addEventListener('resize', onViewport); onViewport(); }
    return () => {
      document.body.style.overflow = prev;
      if (vv) vv.removeEventListener('resize', onViewport);
    };
  }, [isEditing]);

  const currentBrief = editedBrief ?? BRIEF_VARIANTS[briefVersion];
  const campaignTitle = CAMPAIGN_TITLES[id] ?? '캠페인';

  const handleRegenerate = () => {
    setShowRegenSheet(false);
    setIsGenerating(true);
    setEditedBrief(null);
    setTimeout(() => {
      setBriefVersion(v => (v + 1) % BRIEF_VARIANTS.length);
      setIsGenerating(false);
      setRegenPrompt('');
    }, 1500);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentBrief).catch(() => {});
    setBriefCopied(true);
    setTimeout(() => setBriefCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-white max-w-[430px] mx-auto relative overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-4 h-[56px] border-b border-[#F0F2F8] bg-white shrink-0">
        <button onClick={() => router.back()} className="w-[42px] h-[42px] flex items-center justify-center active:opacity-60">
          <ChevronLeft size={24} className="text-stone-900" />
        </button>
        <span className="text-[16px] font-bold text-black">AI 브리프</span>
        <button
          onClick={() => router.push(`/campaign/${id}`)}
          disabled={isGenerating}
          className="w-[42px] h-[42px] flex items-center justify-center active:opacity-60"
        >
          <span className="text-[15px] font-semibold text-[#6366F1]">저장</span>
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col gap-[10px] pb-10">

          {/* 캠페인명 */}
          <div className="bg-white px-5 py-[20px]">
            <p className="text-[14px] font-medium text-[#B0ADA7]">캠페인</p>
            <p className="text-[18px] font-bold text-black mt-1">{campaignTitle}</p>
          </div>

          {/* 안내 + 브리프 카드 */}
          <div className="bg-white px-5 py-[30px] flex flex-col gap-5">

            {/* Info note */}
            <div className="flex items-start gap-2 bg-[#EEF7FF] rounded-[12px] px-4 py-3">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-[1px]">
                <circle cx="8" cy="8" r="7" stroke="#2D92FE" strokeWidth="1.4"/>
                <path d="M8 7v3.5" stroke="#2D92FE" strokeWidth="1.4" strokeLinecap="round"/>
                <circle cx="8" cy="5" r="0.7" fill="#2D92FE"/>
              </svg>
              <span className="text-[14px] font-medium leading-[135%]" style={{ color: '#2D92FE' }}>
                캠페인 정보를 기반으로 AI가 자동 생성한 브리프예요. 수정하거나 재생성할 수 있어요.
              </span>
            </div>

            {/* Brief card */}
            <div className="border border-[#ECECEF] rounded-[14px] overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-5 py-[15px] bg-[#F8FAFF]">
                <span className="text-[16px] font-medium text-black">생성된 브리프</span>
                <div className="flex items-center gap-2">
                  {editedBrief && (
                    <span className="text-[13px] font-medium text-[#78756E] bg-[#F5F5F3] px-[8px] py-[3px] rounded-full">수정됨</span>
                  )}
                  <div className="w-[36px] bg-[#6366F1] rounded-[7px] flex items-center justify-center py-[3px]">
                    <span className="text-[16px] font-bold text-white" style={{ fontFamily: 'Manrope, sans-serif' }}>AI</span>
                  </div>
                </div>
              </div>

              <div className="bg-white px-5 py-[18px] border-t border-[#ECECEF]">
                {isGenerating ? (
                  <div className="flex flex-col gap-3 py-4">
                    {[100, 85, 92, 70, 88, 60].map((w, i) => (
                      <div key={i} className="h-4 bg-[#EEEEFF] rounded-full animate-pulse" style={{ width: `${w}%`, animationDelay: `${i * 80}ms` }} />
                    ))}
                  </div>
                ) : (
                  <p className="text-[16px] font-medium whitespace-pre-wrap text-[#1C1A17] leading-[150%]">
                    {currentBrief}
                  </p>
                )}
              </div>

              <div className="flex border-t border-[#ECECEF]">
                <button
                  onClick={() => setIsEditing(true)}
                  disabled={isGenerating}
                  className="flex-1 py-[15px] flex items-center justify-center bg-[#F8FAFF] border-r border-[#ECECEF] rounded-bl-[14px] active:opacity-70"
                >
                  <span className="text-[16px] font-medium text-black">수정하기</span>
                </button>
                <button
                  onClick={handleCopy}
                  disabled={isGenerating}
                  className="flex-1 py-[15px] flex items-center justify-center bg-[#F8FAFF] rounded-br-[14px] active:opacity-70"
                >
                  <span className="text-[16px] font-medium text-black">{briefCopied ? '복사됨 ✓' : '복사하기'}</span>
                </button>
              </div>
            </div>

            {/* 재생성 버튼 */}
            <button
              onClick={() => setShowRegenSheet(true)}
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 active:opacity-80"
              style={{
                backgroundColor: isGenerating ? '#A5A8F5' : '#6366F1',
                borderRadius: 12, padding: 16,
                transition: 'background-color 0.2s',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className={isGenerating ? 'animate-spin' : ''}>
                <path d="M15 9A6 6 0 1 1 9 3h3m0 0l-2-2m2 2l-2 2" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-[16px] font-bold text-white">
                {isGenerating ? 'AI 생성 중...' : '브리프 다시 생성하기'}
              </span>
            </button>
          </div>

        </div>
      </div>

      {/* ── 재생성 바텀시트 ── */}
      {showRegenSheet && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" style={{ maxWidth: 430, margin: '0 auto' }}>
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowRegenSheet(false)} />
          <div className="relative bg-white rounded-t-[20px] px-5 pt-5 pb-8 flex flex-col gap-5">

            {/* 시트 헤더 */}
            <div className="flex items-center justify-between">
              <span className="text-[18px] font-bold text-[#1C1A17]">어떻게 바꿀까요?</span>
              <button onClick={() => setShowRegenSheet(false)} className="active:opacity-60">
                <X size={22} className="text-stone-500" />
              </button>
            </div>

            {/* 빠른 선택 칩 */}
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map(prompt => {
                const isSelected = regenPrompt === prompt;
                return (
                  <button
                    key={prompt}
                    onClick={() => setRegenPrompt(isSelected ? '' : prompt)}
                    className="px-[14px] py-[8px] rounded-full text-[14px] font-medium active:opacity-70 transition-all"
                    style={{
                      border: `1px solid ${isSelected ? '#6366F1' : '#E8E7E4'}`,
                      backgroundColor: isSelected ? '#EEEEFF' : '#FFFFFF',
                      color: isSelected ? '#6366F1' : '#78756E',
                    }}
                  >
                    {prompt}
                  </button>
                );
              })}
            </div>

            {/* 직접 입력 */}
            <div>
              <p className="text-[14px] font-semibold text-[#1C1A17] mb-2">직접 입력</p>
              <div
                className="flex items-start border rounded-[12px] px-4 py-3 bg-white"
                style={{ borderColor: regenPrompt && !QUICK_PROMPTS.includes(regenPrompt) ? '#6366F1' : '#E8E7E4' }}
              >
                <textarea
                  ref={promptRef}
                  value={QUICK_PROMPTS.includes(regenPrompt) ? '' : regenPrompt}
                  onChange={e => setRegenPrompt(e.target.value)}
                  onFocus={() => {
                    if (QUICK_PROMPTS.includes(regenPrompt)) setRegenPrompt('');
                  }}
                  placeholder="예: 제품의 수분감을 더 강조하고, 2030 여성에게 맞는 톤으로 써줘"
                  rows={3}
                  className="flex-1 bg-transparent outline-none text-[15px] font-medium resize-none text-[#1C1A17] placeholder:text-[#C7C4BE] leading-[150%]"
                />
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleRegenerate}
              className="w-full py-4 rounded-[12px] text-[16px] font-bold text-white active:opacity-80"
              style={{ backgroundColor: regenPrompt.trim() ? '#2E2C28' : '#6366F1' }}
            >
              {regenPrompt.trim() ? `"${regenPrompt.length > 14 ? regenPrompt.slice(0, 14) + '…' : regenPrompt}" 반영해서 생성` : '그냥 다시 생성하기'}
            </button>

          </div>
        </div>
      )}

      {/* ── 브리프 편집 오버레이 ── */}
      {mounted && isEditing && createPortal(
        <>
          <div className="fixed inset-0 z-50 bg-white" />
          <div className="fixed inset-x-0 top-0 z-[60] h-[56px] flex items-center justify-between px-5 bg-white border-b border-[#E8E7E4]">
            <button
              onClick={() => setIsEditing(false)}
              className="text-[16px] font-semibold text-[#78756E] px-2 py-2 active:opacity-70"
            >
              취소
            </button>
            <span className="text-[16px] font-semibold text-black">브리프 수정</span>
            <button
              onClick={() => {
                if (textareaRef.current) setEditedBrief(textareaRef.current.value);
                setIsEditing(false);
              }}
              className="text-[16px] font-semibold text-[#6366F1] px-2 py-2 active:opacity-70"
            >
              완료
            </button>
          </div>
          <div
            className="fixed inset-x-0 z-[60] overflow-y-auto bg-white"
            style={{ top: '56px', bottom: `${keyboardHeight}px`, WebkitOverflowScrolling: 'touch', overscrollBehavior: 'contain' }}
          >
            <div className="p-5 pb-[50px]">
              <textarea
                ref={textareaRef}
                defaultValue={currentBrief}
                autoFocus
                onInput={e => {
                  const el = e.currentTarget;
                  el.style.height = '0px';
                  el.style.height = el.scrollHeight + 'px';
                }}
                className="w-full text-[16px] font-medium text-[#1C1A17] leading-[150%] outline-none resize-none bg-white block"
                style={{ overflowY: 'hidden' }}
              />
            </div>
          </div>
        </>,
        document.body
      )}

    </div>
  );
}
