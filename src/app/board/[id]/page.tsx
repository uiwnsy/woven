'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';

const MANROPE: React.CSSProperties = { fontFamily: 'Manrope, sans-serif' };

type Stage = 'list-up' | 'contacting' | 'negotiating' | 'reviewing' | 'uploaded';

type InfluencerDetail = {
  id: string;
  name: string;
  handle: string;
  followers: string;
  posts: string;
  categories: string[];
  profileImg: string;
  stage: Stage;
  campaignName: string;
  dDay: string;
  isFirstCollab?: boolean;
  memo?: string;
  memoDate?: string;
  brief: string;
  campaignGuidelineUrl?: string; // 캠페인 추가 시 입력한 가이드라인 링크 (없으면 기본값 미표시)
};

const STAGES = ['리스트업', '컨택', '협의중', '시안확인', '업로드'];
const STAGE_IDS: Stage[] = ['list-up', 'contacting', 'negotiating', 'reviewing', 'uploaded'];

const BRIEF_VARIANTS = [
  `안녕하세요 minj_님! 😊\n루미에르입니다.\n\n루미에르 여름 선케어 캠페인에 함께할 크리에이터를 찾고 있어요. minj_님의 뷰티 콘텐츠를 보고 저희 톤과 잘 맞을 것 같아 연락드렸어요!\n\n🎁 제품: 루미에르 선블럭 크림 (신제품)\n🎬 콘텐츠: 인스타그램 릴스 1건 — 봄 무드 데일리 메이크업 룩\n🏷 필수 태그: #선케어 #자외선차단 #수분 #루미에르\n📎 가이드라인: docs.google.com/fxB2eY1zadeox4dkz\n🚫 경쟁 브랜드 언급 금지 · 프로모션 용어 사용 금지 · 과장 표현 금지`,
  `안녕하세요 minj_님,\n뷰티 브랜드 루미에르 마케팅팀입니다.\n\n이번 봄봄 선케어 캠페인을 위해 협업을 제안드리고 싶어 연락드렸습니다. 평소 minj_님의 진정성 있는 리뷰 콘텐츠를 인상 깊게 보았습니다.\n\n■ 제품: 루미에르 선블럭 크림\n■ 게시 채널: 인스타그램 릴스 1건\n■ 콘텐츠 방향: 일상 속 자연스러운 선케어 루틴\n■ 필수 해시태그: #루미에르 #선케어 #자외선차단\n■ 참고 가이드라인: docs.google.com/fxB2eY1zadeox4dkz\n\n※ 경쟁사 언급 및 과장 광고 표현은 삼가 주시기 바랍니다.`,
  `minj_ 님, 안녕하세요 🌿\n루미에르 팀이에요!\n\nminj_ 님 피드 보다가 꼭 함께하고 싶어서 연락드렸어요. 이번에 출시한 선블럭 크림, 뷰티 루틴 좋아하시는 분들이 진짜 좋아할 것 같거든요 ☀️\n\n📦 제품: 루미에르 선블럭 크림\n📱 형식: 인스타 릴스 1개 — 데일리 메이크업 or 스킨케어 루틴에 자연스럽게\n🏷 태그: #루미에르 #선케어 #자외선차단 #수분크림\n🔗 가이드: docs.google.com/fxB2eY1zadeox4dkz\n\n경쟁 브랜드 언급이나 과장 표현만 피해주시면 나머지는 minj_ 님 스타일대로 자유롭게 해주세요!`,
];

const BRIEF_TEXT = BRIEF_VARIANTS[0];

const MOCK_DETAILS: Record<string, InfluencerDetail> = {
  'lu1': {
    id: 'lu1', name: 'minj_', handle: '@minj_', followers: '24.5만', posts: '1,842',
    categories: ['뷰티', '패션'], profileImg: '/profile-kimminji.png',
    stage: 'list-up', campaignName: '루미에르 봄봄 프로모션', dDay: 'D-8',
    isFirstCollab: true,
    memo: '뷰티 리뷰 콘텐츠 퀄리티 높음 / 팔로워 대비 참여율 상위권,, 릴스 편집 스타일이 브랜드 톤에 잘 맞음!',
    memoDate: '2025.04.15 작성',
    brief: BRIEF_TEXT,
    campaignGuidelineUrl: 'docs.google.com/fxB2eY1zadeox4dkz',
  },
  'lu2': {
    id: 'lu2', name: '박서연', handle: '@ppseo0', followers: '48만', posts: '2,310',
    categories: ['뷰티', '패션'], profileImg: '/profile-parkseo.png',
    stage: 'list-up', campaignName: '루미에르 봄봄 프로모션', dDay: 'D-8',
    isFirstCollab: true, brief: BRIEF_TEXT,
    campaignGuidelineUrl: 'docs.google.com/fxB2eY1zadeox4dkz',
  },
  'lu3': {
    id: 'lu3', name: 'leezsu', handle: '@leezsu', followers: '12만', posts: '987',
    categories: ['뷰티', '일상'], profileImg: '/profile-paooar.png',
    stage: 'list-up', campaignName: '루미에르 봄봄 프로모션', dDay: 'D-8',
    isFirstCollab: false, brief: BRIEF_TEXT,
    campaignGuidelineUrl: 'docs.google.com/fxB2eY1zadeox4dkz',
  },
  '1': {
    id: '1', name: 'haye0', handle: '@haye0', followers: '10.4만', posts: '1,234',
    categories: ['뷰티', '패션'], profileImg: '/profile-haye0.png',
    stage: 'contacting', campaignName: '루미에르 봄봄 프로모션', dDay: 'D+26',
    brief: BRIEF_TEXT,
    campaignGuidelineUrl: 'docs.google.com/fxB2eY1zadeox4dkz',
  },
  '2': {
    id: '2', name: 'zigoo', handle: '@zigoo', followers: '8만', posts: '934',
    categories: ['뷰티', '패션'], profileImg: '/profile-zigoo.png',
    stage: 'contacting', campaignName: '루미에르 봄봄 프로모션', dDay: 'D+26',
    brief: BRIEF_TEXT,
    campaignGuidelineUrl: 'docs.google.com/fxB2eY1zadeox4dkz',
  },
  '3': {
    id: '3', name: '김지영', handle: '@jijizero', followers: '21만', posts: '2,103',
    categories: ['뷰티', '연애/결혼', '일상'], profileImg: '/profile-kimjiyoung.png',
    stage: 'contacting', campaignName: '루미에르 봄봄 프로모션', dDay: 'D+26',
    brief: BRIEF_TEXT,
    campaignGuidelineUrl: 'docs.google.com/fxB2eY1zadeox4dkz',
  },
};

function getCategoryStyle(c: string) {
  switch (c) {
    case '뷰티':      return { bg: '#FDF2FE', text: '#87588A' };
    case '패션':      return { bg: '#EEF2FF', text: '#3E37C3' };
    case '연애/결혼': return { bg: '#FFFBEB', text: '#92400E' };
    case '일상':      return { bg: '#FEF6F1', text: '#D96430' };
    default:          return { bg: '#F2F4F6', text: '#78756E' };
  }
}

function StageTracker({ stageId }: { stageId: Stage }) {
  const currentIdx = STAGE_IDS.indexOf(stageId);
  const labels = ['리스트업', '컨택', '협의중', '시안확인', '업로드'];

  // Each value is the x-center of that dot.
  // 리스트업 center = 28px, 업로드 center = calc(100% - 21px)
  // 협의중 = 50% (screen center)
  // 컨택  = midpoint(28px, 50%)  = calc(25% + 14px)
  // 시안확인 = midpoint(50%, 100%-21px) = calc(75% - 10.5px)
  const positions = [
    '28px',
    'calc(25% + 14px)',
    '50%',
    'calc(75% - 10.5px)',
    'calc(100% - 21px)',
  ];

  return (
    <div className="relative w-full" style={{ height: 37 }}>
      {/* Line: first-dot-center → last-dot-center */}
      <div className="absolute"
        style={{ top: 5.25, left: 28, right: 21, height: 3.5, backgroundColor: '#F0F2F8', zIndex: 0 }} />

      {labels.map((label, i) => {
        const isActive = i === currentIdx;
        const isDone = i < currentIdx;
        return (
          // Each step is absolutely centered at positions[i] via translateX(-50%)
          <div key={label}
            className="absolute flex flex-col items-center"
            style={{ left: positions[i], top: 0, transform: 'translateX(-50%)', zIndex: 1 }}>
            {isActive ? (
              <div className="relative flex items-center justify-center shrink-0" style={{ width: 14, height: 14 }}>
                {/* Ping ripple behind the dot */}
                <div className="absolute rounded-full animate-ping"
                  style={{ width: 14, height: 14, backgroundColor: '#6366F1', opacity: 0.35 }} />
                <div className="relative rounded-full flex items-center justify-center"
                  style={{ width: 14, height: 14, backgroundColor: '#FFFFFF', border: '2px solid #6366F1' }}>
                  <div className="rounded-full" style={{ width: 6, height: 6, backgroundColor: '#6366F1' }} />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center shrink-0" style={{ width: 14, height: 14 }}>
                <div className="rounded-full"
                  style={{ width: 10, height: 10, backgroundColor: isDone ? '#6366F1' : '#F0F2F8' }} />
              </div>
            )}
            <span className="whitespace-nowrap"
              style={{ fontSize: 14, lineHeight: '15px', fontWeight: isActive ? 600 : 500,
                color: isActive ? '#6366F1' : '#C0C4CF', marginTop: 8 }}>
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function InfluencerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const data = MOCK_DETAILS[id];

  const [selectedPlatform, setSelectedPlatform] = useState<'ig' | 'yt' | 'tt'>('ig');
  const [guidelineUrl, setGuidelineUrl] = useState('');
  const [requests, setRequests] = useState('');
  const [briefCopied, setBriefCopied] = useState(false);
  const [showMemoOverlay, setShowMemoOverlay] = useState(false);
  const [memoInput, setMemoInput] = useState('');
  const [isEditingBrief, setIsEditingBrief] = useState(false);
  const [editedBrief, setEditedBrief] = useState<string | null>(null);
  const [briefVersion, setBriefVersion] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditingRequests, setIsEditingRequests] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const briefTextareaRef = useRef<HTMLTextAreaElement>(null);
  const requestsTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { setMounted(true); }, []);

  const isAnyOverlayOpen = isEditingBrief || isEditingRequests;
  useEffect(() => {
    if (!isAnyOverlayOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const vv = window.visualViewport;
    const onViewport = () => { if (vv) setKeyboardHeight(Math.max(0, window.innerHeight - vv.height)); };
    if (vv) { vv.addEventListener('resize', onViewport); onViewport(); }
    return () => {
      document.body.style.overflow = prev;
      if (vv) vv.removeEventListener('resize', onViewport);
      setKeyboardHeight(0);
    };
  }, [isAnyOverlayOpen]);

  useLayoutEffect(() => {
    if (!isEditingBrief || !briefTextareaRef.current) return;
    const el = briefTextareaRef.current;
    el.style.height = '0px';
    el.style.height = el.scrollHeight + 'px';
  }, [isEditingBrief]);

  useLayoutEffect(() => {
    if (!isEditingRequests || !requestsTextareaRef.current) return;
    const el = requestsTextareaRef.current;
    el.style.height = '0px';
    el.style.height = el.scrollHeight + 'px';
  }, [isEditingRequests]);
  const [memos, setMemos] = useState<{ text: string; date: string }[]>(
    data.memo ? [{ text: data.memo, date: data.memoDate ?? '' }] : []
  );

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen bg-white max-w-[430px] mx-auto">
        <p style={{ color: '#78756E', fontSize: 15 }}>인플루언서를 찾을 수 없어요.</p>
      </div>
    );
  }

  const handleCopyBrief = async () => {
    await navigator.clipboard.writeText(data.brief).catch(() => {});
    setBriefCopied(true);
    setTimeout(() => setBriefCopied(false), 2000);
  };

  const platforms = [
    { id: 'ig' as const, label: '인스타그램', format: '릴스 · 피드',  icon: '/ig-icon.svg' },
    { id: 'yt' as const, label: '유튜브',      format: '롱폼 · 숏폼', icon: '/yt-icon.svg' },
    { id: 'tt' as const, label: '틱톡',        format: '숏폼',         icon: '/tt-icon.svg' },
  ];

  return (
    <div className="flex flex-col h-screen bg-[#FAFBFE] max-w-[430px] mx-auto relative overflow-hidden">

      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-4 shrink-0"
        style={{ height: 56, backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(203,213,225,0.2)' }}
      >
        <button onClick={() => router.back()} className="w-[42px] h-[42px] flex items-center justify-center active:opacity-60">
          <img src="/back-icon.svg" alt="back" width={24} height={24} />
        </button>
        <span className="text-[18px] font-bold text-black">인플루언서 상세</span>
        <button className="w-[42px] h-[42px] flex items-center justify-center active:opacity-60">
          <img src="/details-icon.svg" alt="more" width={24} height={24} />
        </button>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto pb-[120px]">

        {/* ── Profile Card ── */}
        <div className="bg-white flex flex-col items-center w-full" style={{ padding: '34px 20px', gap: 20 }}>

          {/* Top block: avatar + name/handle + stats + categories (max 295px) */}
          <div className="flex flex-col items-center" style={{ width: 295, gap: 10 }}>

            {/* Avatar + name + handle + stats */}
            <div className="flex flex-col items-center w-full" style={{ gap: 10 }}>

              {/* Avatar 76×76 */}
              <div className="relative shrink-0" style={{ width: 76, height: 76 }}>
                <div className="w-full h-full rounded-full overflow-hidden bg-stone-200">
                  <img src={data.profileImg} alt={data.name} className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Name + handle */}
              <div className="flex flex-col items-center w-full" style={{ gap: 4 }}>
                <span className="text-[22px] font-semibold text-black" style={MANROPE}>{data.name}</span>
                <span className="text-[16px] text-[#78756E] text-center w-full" style={MANROPE}>{data.handle}</span>
              </div>

              {/* Stats row */}
              <div className="flex items-center" style={{ gap: 10 }}>
                <span className="text-[14px] text-black">인스타그램</span>
                <div className="w-[4px] h-[4px] rounded-full bg-[#D9D9D9]" />
                <span className="text-[14px] text-black">팔로워 {data.followers}</span>
                <div className="w-[4px] h-[4px] rounded-full bg-[#D9D9D9]" />
                <span className="text-[14px] text-black">게시물 {data.posts}</span>
              </div>
            </div>

            {/* Category tags */}
            <div className="flex items-center" style={{ gap: 6 }}>
              {data.categories.map(cat => {
                const { bg, text } = getCategoryStyle(cat);
                return (
                  <span
                    key={cat}
                    className="text-[14px] font-medium"
                    style={{ backgroundColor: bg, color: text, borderRadius: 50, padding: '7px 10px' }}
                  >
                    {cat}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Action buttons (390px, full stretch) */}
          <div className="flex w-full" style={{ gap: 10 }}>
            <button
              className="flex-1 flex items-center justify-center active:opacity-80"
              style={{ backgroundColor: '#6366F1', borderRadius: 48, padding: '14px 10px', height: 48 }}
            >
              <span className="text-[16px] font-bold text-white">연락하기</span>
            </button>
            <button
              className="flex-1 flex items-center justify-center active:opacity-80"
              style={{ backgroundColor: '#FFFFFF', border: '2px solid #6366F1', borderRadius: 48, padding: '14px 10px', height: 48 }}
            >
              <span className="text-[16px] font-bold" style={{ color: '#4F52E0' }}>연락 방법 변경</span>
            </button>
          </div>
        </div>

        <div className="h-2 bg-[#F5F5F3]" />

        {/* ── Campaign Progress ── */}
        <div className="bg-white" style={{ padding: '30px 20px', gap: 25, display: 'flex', flexDirection: 'column' }}>

          {/* Status + name + dday row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center" style={{ gap: 8 }}>
              <span
                className="text-[14px] font-semibold"
                style={{ backgroundColor: '#EEEEFF', color: '#3D3FC7', borderRadius: 50, padding: '6px 10px' }}
              >
                리스트업
              </span>
              <span className="text-[20px] font-semibold text-black">{data.campaignName}</span>
            </div>
            <span
              className="text-[14px] font-semibold shrink-0"
              style={{ backgroundColor: '#FEF6F1', color: '#EF8652', borderRadius: 50, padding: '6px 10px', fontFamily: 'Manrope, sans-serif' }}
            >
              {data.dDay}
            </span>
          </div>

          {/* Step tracker */}
          <StageTracker stageId={data.stage} />
        </div>

        <div className="h-2 bg-[#F5F5F3]" />

        {/* ── 협의 조건 ── */}
        <div className="bg-white" style={{ padding: '30px 20px', gap: 20, display: 'flex', flexDirection: 'column' }}>

          {/* Title */}
          <div className="flex flex-col" style={{ gap: 8 }}>
            <span className="text-[22px] font-bold text-black">협의 조건</span>
            <span className="text-[16px] font-medium" style={{ color: '#899098', lineHeight: '150%' }}>
              이 인플루언서에게 맞는 조건을 설정하면 AI 브리프에 자동 반영돼요.
            </span>
          </div>

          {/* Info banner */}
          <div
            className="flex items-start"
            style={{ backgroundColor: '#EEF7FF', borderRadius: 14, padding: 20, gap: 8 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-[2px]">
              <circle cx="8" cy="8" r="7" stroke="#2D92FE" strokeWidth="1.4"/>
              <path d="M8 7v3.5" stroke="#2D92FE" strokeWidth="1.4" strokeLinecap="round"/>
              <circle cx="8" cy="5" r="0.7" fill="#2D92FE"/>
            </svg>
            <span className="text-[14px] font-medium" style={{ color: '#2D92FE', lineHeight: '135%' }}>
              캠페인 기본값이 자동으로 채워져 있어요. 조건을 바꾼 뒤 브리프를 다시 생성해보세요.
            </span>
          </div>

          {/* Platform & Format */}
          <div className="flex flex-col" style={{ gap: 12 }}>
            <div className="flex items-center" style={{ gap: 8 }}>
              <span className="text-[18px] font-medium text-black">플랫폼 &amp; 포맷</span>
              <span
                className="text-[14px] font-semibold"
                style={{ backgroundColor: '#F2F4F6', color: '#939EA9', borderRadius: 30, padding: '7px 10px' }}
              >
                캠페인 기본값
              </span>
            </div>
            <div className="flex" style={{ gap: 14 }}>
              {platforms.map(p => {
                const isSelected = selectedPlatform === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlatform(p.id)}
                    className="flex-1 flex flex-col items-center active:opacity-70"
                    style={{
                      backgroundColor: isSelected ? '#EEEEFF' : '#FFFFFF',
                      border: isSelected ? '1px solid #6366F1' : '1px solid #E8E7E4',
                      borderRadius: 10,
                      padding: 20,
                      gap: 6,
                    }}
                  >
                    <img src={p.icon} alt={p.label} width={52} height={52} />
                    <span className="text-[16px] font-semibold text-center" style={{ color: '#1C1A17' }}>{p.label}</span>
                    <span className="text-[14px] font-medium text-center" style={{ color: '#B0ADA7' }}>{p.format}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 개별 가이드라인 */}
          <div className="flex flex-col" style={{ gap: 12, marginTop: 8 }}>
            <div className="flex items-center" style={{ gap: 6 }}>
              <span className="text-[18px] font-medium text-black">개별 가이드라인</span>
            </div>

            {/* 캠페인 기본값: 캠페인 추가 시 가이드라인을 입력한 경우에만 표시 */}
            {data.campaignGuidelineUrl ? (
              <div
                className="flex items-center"
                style={{ backgroundColor: '#F9FAFB', borderRadius: 10, padding: '12px 20px' }}
              >
                <span className="text-[14px] font-medium" style={{ color: '#899098' }}>캠페인 기본 &nbsp;</span>
                <span className="text-[14px] font-medium" style={{ color: '#4B5969' }}>{data.campaignGuidelineUrl}</span>
              </div>
            ) : (
              <div
                className="flex items-center"
                style={{ backgroundColor: '#F9FAFB', borderRadius: 10, padding: '12px 20px' }}
              >
                <span className="text-[14px] font-medium" style={{ color: '#C7C4BE' }}>캠페인 기본값 없음 (캠페인 추가 시 미입력)</span>
              </div>
            )}

            <div
              className="flex items-center justify-between"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E7E4', borderRadius: 10, padding: '10px 10px 10px 20px' }}
            >
              <input
                value={guidelineUrl}
                onChange={e => setGuidelineUrl(e.target.value)}
                placeholder="개별 가이드라인 링크"
                className="flex-1 bg-transparent outline-none text-[16px] font-medium"
                style={{ color: '#1C1A17', height: '24px' }}
              />
              <button className="shrink-0 w-[34px] h-[34px] flex items-center justify-center rounded-[8px] active:opacity-70" style={{ backgroundColor: '#F2F4F6' }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 3v12M3 9h12" stroke="#78756E" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <span className="text-[14px] font-medium" style={{ color: '#D4D2CE' }}>
              {data.campaignGuidelineUrl
                ? '입력 시 캠페인 기본 가이드라인과 함께 브리프에 포함돼요.'
                : '링크를 입력하면 AI 브리프에 가이드라인으로 포함돼요.'}
            </span>
          </div>

          {/* 개별 요청사항 */}
          <div className="flex flex-col" style={{ gap: 12 }}>
            <div className="flex items-center" style={{ gap: 6 }}>
              <span className="text-[18px] font-medium text-black">개별 요청사항</span>
            </div>
            <div
              onClick={() => setIsEditingRequests(true)}
              className="flex items-center cursor-pointer active:opacity-70"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E7E4', borderRadius: 10, padding: '15px 20px' }}
            >
              <input
                value={requests}
                readOnly
                placeholder="예: 봄 컬러 위주로 촬영 부탁드려요"
                className="flex-1 bg-transparent outline-none text-[16px] font-medium cursor-pointer pointer-events-none"
                style={{ color: requests ? '#1C1A17' : undefined, height: '24px' }}
              />
            </div>
            <span className="text-[14px] font-medium" style={{ color: '#D4D2CE' }}>AI 브리프에 개인화된 메시지로 포함됩니다.</span>
          </div>

          {/* Regenerate brief button */}
          <button
            onClick={() => {
              setIsGenerating(true);
              setEditedBrief(null);
              setTimeout(() => {
                setBriefVersion(v => (v + 1) % BRIEF_VARIANTS.length);
                setIsGenerating(false);
              }, 1200);
            }}
            disabled={isGenerating}
            className="w-full flex items-center justify-center gap-2 active:opacity-80"
            style={{ backgroundColor: isGenerating ? '#A5A8F5' : '#6366F1', borderRadius: 12, padding: 16, transition: 'background-color 0.2s' }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className={isGenerating ? 'animate-spin' : ''}>
              <path d="M15 9A6 6 0 1 1 9 3h3m0 0l-2-2m2 2l-2 2" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-[18px] font-bold text-white">
              {isGenerating ? 'AI 생성 중...' : '브리프 다시 생성하기'}
            </span>
          </button>
        </div>

        <div className="h-2 bg-[#F5F5F3]" />

        {/* ── AI 브리프 ── */}
        <div className="bg-white" style={{ padding: '30px 20px', gap: 20, display: 'flex', flexDirection: 'column' }}>
          <span className="text-[22px] font-bold text-black">AI 브리프</span>

          {/* Info note */}
          <div
            className="flex items-start"
            style={{ backgroundColor: '#EEF7FF', borderRadius: 12, padding: 20, gap: 8 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-[1px]">
              <circle cx="8" cy="8" r="7" stroke="#2D92FE" strokeWidth="1.4"/>
              <path d="M8 7v3.5" stroke="#2D92FE" strokeWidth="1.4" strokeLinecap="round"/>
              <circle cx="8" cy="5" r="0.7" fill="#2D92FE"/>
            </svg>
            <span className="text-[14px] font-medium" style={{ color: '#2D92FE', lineHeight: '135%' }}>
              캠페인 정보를 기반으로 AI가 자동 생성한 브리프예요. 바로 보내거나 수정 후 전송할 수 있어요.
            </span>
          </div>

          {/* Brief card */}
          <div className="border border-[#ECECEF] rounded-[14px] overflow-hidden flex flex-col">
            {/* Card header */}
            <div className="flex items-center justify-between px-5 py-[15px] bg-[#F8FAFF]">
              <span className="text-[16px] font-medium text-black">생성된 브리프</span>
              <div className="w-[36px] bg-[#6366F1] rounded-[7px] flex items-center justify-center py-[3px]">
                <span className="text-[16px] font-bold text-white" style={{ fontFamily: 'Manrope, sans-serif' }}>AI</span>
              </div>
            </div>
            {/* Brief body */}
            <div className="bg-white px-5 py-[14px] border-t border-[#ECECEF]">
              <p className="text-[16px] font-medium whitespace-pre-wrap text-[#1C1A17] leading-[150%]">
                {editedBrief ?? BRIEF_VARIANTS[briefVersion]}
              </p>
            </div>
            {/* Card footer */}
            <div className="flex border-t border-[#ECECEF]">
              <button
                onClick={() => setIsEditingBrief(true)}
                className="flex-1 py-[15px] flex items-center justify-center bg-[#F8FAFF] border-r border-[#ECECEF] rounded-bl-[14px] active:opacity-70"
              >
                <span className="text-[16px] font-medium text-black">수정하기</span>
              </button>
              <button
                onClick={handleCopyBrief}
                className="flex-1 py-[15px] flex items-center justify-center bg-[#F8FAFF] rounded-br-[14px] active:opacity-70"
              >
                <span className="text-[16px] font-medium text-black">{briefCopied ? '복사됨 ✓' : '복사하기'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="h-2 bg-[#F5F5F3]" />

        {/* ── 협업 이력 ── */}
        <div className="bg-white" style={{ padding: '30px 20px', gap: 20, display: 'flex', flexDirection: 'column' }}>
          <div className="flex items-center justify-between">
            <span className="text-[22px] font-bold text-black">협업 이력</span>
            {data.isFirstCollab && (
              <span
                className="text-[14px] font-medium"
                style={{ backgroundColor: '#EEEEFF', color: '#3D3FC7', borderRadius: 50, padding: '4px 8px' }}
              >
                첫 협업
              </span>
            )}
          </div>

          {data.isFirstCollab ? (
            <div
              className="flex flex-col items-center text-center"
              style={{ backgroundColor: '#F8F8FF', borderRadius: 14, padding: 22, gap: 6 }}
            >
              <span className="text-[16px] font-medium" style={{ color: '#6D6E8C', lineHeight: '140%' }}>
                첫 협업 인플루언서예요!
              </span>
              <span className="text-[16px] font-medium" style={{ color: '#6D6E8C', lineHeight: '140%' }}>
                이번 캠페인 성과가{' '}
                <span className="font-bold" style={{ color: '#6366F1' }}>첫 이력으로 기록</span>
                됩니다.
              </span>
            </div>
          ) : (
            <p className="text-[16px] font-medium" style={{ color: '#899098' }}>이전 협업 이력이 없어요.</p>
          )}
        </div>

        <div className="h-2 bg-[#F5F5F3]" />

        {/* ── 내부 메모 ── */}
        <div className="bg-white" style={{ padding: '30px 20px', gap: 20, display: 'flex', flexDirection: 'column' }}>
          <span className="text-[22px] font-bold text-black">내부 메모</span>

          {memos.map((memo, i) => (
            <div key={i} className="flex flex-col" style={{ backgroundColor: '#FFFDE5', borderRadius: 14, padding: 22, gap: 6 }}>
              <div className="flex items-start justify-between" style={{ gap: 10 }}>
                <p className="text-[16px] font-medium whitespace-pre-line flex-1" style={{ color: '#705448', lineHeight: '22px' }}>
                  {memo.text}
                </p>
                <button
                  onClick={() => setMemos(prev => prev.filter((_, idx) => idx !== i))}
                  className="shrink-0 active:opacity-60"
                  style={{ marginTop: 2 }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 3l10 10M13 3L3 13" stroke="rgba(112,84,72,0.45)" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              {memo.date && (
                <span className="text-[14px] font-medium" style={{ color: 'rgba(112,84,72,0.6)', lineHeight: '22px' }}>
                  {memo.date}
                </span>
              )}
            </div>
          ))}

          {/* 메모 추가 버튼 */}
          <button
            onClick={() => setShowMemoOverlay(true)}
            className="w-full flex items-center justify-center active:opacity-70"
            style={{ backgroundColor: 'rgba(221,223,253,0.3)', borderRadius: 14, height: 68, gap: 4 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7.5" stroke="#8486F3"/>
              <path d="M8 5v6M5 8h6" stroke="#8486F3" strokeWidth="1.2" strokeLinecap="round"/>
            </svg>
            <span className="text-[16px] font-medium" style={{ color: '#8486F3' }}>메모 추가</span>
          </button>
        </div>

      </div>

      {/* ── Toast ── */}
      {showToast && (
        <div
          className="absolute left-5 right-5 z-[70] flex items-center gap-3 px-5 py-4 rounded-[14px]"
          style={{ bottom: 175, backgroundColor: '#1C1A17' }}
        >
          <div className="w-6 h-6 rounded-full bg-[#6366F1] flex items-center justify-center shrink-0">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-[15px] font-medium text-white">브리프 발송 완료! 컨택 단계로 이동했어요</span>
        </div>
      )}

      {/* ── Bottom action bar ── */}
      <div
        className="absolute bottom-0 w-full bg-white flex flex-col"
        style={{ borderTop: '1px solid #E8E7E4', padding: 20, gap: 10 }}
      >
        <button
          onClick={() => {
            setShowToast(true);
            setTimeout(() => router.push('/board?tab=contacting'), 1500);
          }}
          className="w-full flex items-center justify-center active:opacity-80"
          style={{ backgroundColor: '#2E2C28', borderRadius: 12, padding: 16 }}
        >
          <span className="text-[18px] font-bold text-white">발송 완료</span>
        </button>
        <button className="w-full flex items-center justify-center active:opacity-60">
          <span className="text-[18px] font-medium" style={{ color: '#B7B7B7' }}>임시 저장</span>
        </button>
      </div>

      {/* ── 브리프 수정 오버레이 (portal) ── */}
      {mounted && isEditingBrief && createPortal(
        <>
          <div className="fixed inset-0 z-50 bg-white" />
          <div className="fixed inset-x-0 top-0 z-[60] h-[56px] flex items-center justify-between px-5 bg-white border-b border-[#E8E7E4]">
            <span className="text-[18px] font-semibold text-black">브리프 수정</span>
            <button
              onClick={() => {
                if (briefTextareaRef.current) setEditedBrief(briefTextareaRef.current.value);
                setIsEditingBrief(false);
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
                ref={briefTextareaRef}
                defaultValue={editedBrief ?? BRIEF_VARIANTS[briefVersion]}
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

      {/* ── 개별 요청사항 수정 오버레이 (portal) ── */}
      {mounted && isEditingRequests && createPortal(
        <>
          <div className="fixed inset-0 z-50 bg-white" />
          <div className="fixed inset-x-0 top-0 z-[60] h-[56px] flex items-center justify-between px-5 bg-white border-b border-[#E8E7E4]">
            <span className="text-[18px] font-semibold text-black">개별 요청사항</span>
            <button
              onClick={() => {
                if (requestsTextareaRef.current) setRequests(requestsTextareaRef.current.value);
                setIsEditingRequests(false);
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
                ref={requestsTextareaRef}
                defaultValue={requests}
                autoFocus
                placeholder="예: 봄 컬러 위주로 촬영 부탁드려요"
                onInput={e => {
                  const el = e.currentTarget;
                  el.style.height = '0px';
                  el.style.height = el.scrollHeight + 'px';
                }}
                className="w-full text-[16px] font-medium text-[#1C1A17] leading-[150%] outline-none resize-none bg-white block placeholder:text-[#C0C4CF]"
                style={{ overflowY: 'hidden' }}
              />
            </div>
          </div>
        </>,
        document.body
      )}

      {/* ── 메모 추가 오버레이 ── */}
      {showMemoOverlay && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
            onClick={() => setShowMemoOverlay(false)}
          />
          {/* Bottom sheet */}
          <div
            className="fixed bottom-0 left-1/2 z-50 w-full max-w-[430px] bg-white flex flex-col"
            style={{ transform: 'translateX(-50%)', borderRadius: '20px 20px 0 0', padding: '20px 20px 40px' }}
          >
            {/* Handle bar */}
            <div className="flex justify-center mb-4">
              <div className="w-10 h-[4px] rounded-full bg-[#E8E7E4]" />
            </div>

            {/* Title row */}
            <div className="flex items-center justify-between mb-5">
              <span className="text-[18px] font-bold text-black">메모 추가</span>
              <button
                onClick={() => setShowMemoOverlay(false)}
                className="w-[36px] h-[36px] flex items-center justify-center rounded-full active:opacity-60"
                style={{ backgroundColor: '#F2F4F6' }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 3l10 10M13 3L3 13" stroke="#78756E" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* Textarea */}
            <textarea
              value={memoInput}
              onChange={e => setMemoInput(e.target.value)}
              placeholder="팀 내부에서만 볼 수 있는 메모를 입력하세요"
              rows={5}
              autoFocus
              className="w-full outline-none resize-none text-[16px] font-medium mb-3"
              style={{
                backgroundColor: '#FAFAFA',
                border: '1px solid #E8E7E4',
                borderRadius: 12,
                padding: '14px 16px',
                color: '#1C1A17',
                lineHeight: '1.6',
              }}
            />
            <span className="text-[13px] font-medium mb-5" style={{ color: '#C0C4CF' }}>
              메모는 팀 내부에서만 확인할 수 있어요.
            </span>

            {/* Save button */}
            <button
              onClick={() => {
                if (!memoInput.trim()) return;
                const now = new Date();
                const dateStr = `${now.getFullYear()}.${String(now.getMonth()+1).padStart(2,'0')}.${String(now.getDate()).padStart(2,'0')} 작성`;
                setMemos(prev => [{ text: memoInput.trim(), date: dateStr }, ...prev]);
                setMemoInput('');
                setShowMemoOverlay(false);
              }}
              className="w-full flex items-center justify-center active:opacity-80"
              style={{ backgroundColor: memoInput.trim() ? '#6366F1' : '#E8E7E4', borderRadius: 12, padding: 16, transition: 'background-color 0.15s' }}
            >
              <span className="text-[16px] font-bold" style={{ color: memoInput.trim() ? '#FFFFFF' : '#B0ADA7' }}>저장</span>
            </button>
          </div>
        </>
      )}

    </div>
  );
}
