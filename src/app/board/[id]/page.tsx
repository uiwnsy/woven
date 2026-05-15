'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';

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
};

const STAGES = ['리스트업', '컨택', '협의중', '시안확인', '업로드'];
const STAGE_IDS: Stage[] = ['list-up', 'contacting', 'negotiating', 'reviewing', 'uploaded'];

const BRIEF_TEXT = `안녕하세요 minj_님! 😊\n루미에르입니다.\n\n루미에르 여름 선케어 캠페인에 함께할 크리에이터를 찾고 있어요. minj_님의 뷰티 콘텐츠를 보고 저희 톤과 잘 맞을 것 같아 연락드렸어요!\n\n🎁 제품: 루미에르 선블럭 크림 (신제품)\n🎬 콘텐츠: 인스타그램 릴스 1건 — 봄 무드 데일리 메이크업 룩\n🏷 필수 태그: #선케어 #자외선차단 #수분 #루미에르\n📎 가이드라인: docs.google.com/fxB2eY1zadeox4dkz\n🚫 경쟁 브랜드 언급 금지 · 프로모션 용어 사용 금지 · 과장 표현 금지`;

const MOCK_DETAILS: Record<string, InfluencerDetail> = {
  'lu1': {
    id: 'lu1', name: 'minj_', handle: '@minj_', followers: '24.5만', posts: '1,842',
    categories: ['뷰티', '패션'], profileImg: '/profile-kimminji.png',
    stage: 'list-up', campaignName: '루미에르 봄봄 프로모션', dDay: 'D-8',
    isFirstCollab: true,
    memo: '뷰티 리뷰 콘텐츠 퀄리티 높음 / 팔로워 대비 참여율 상위권,, 릴스 편집 스타일이 브랜드 톤에 잘 맞음!',
    memoDate: '2025.04.15 작성',
    brief: BRIEF_TEXT,
  },
  'lu2': {
    id: 'lu2', name: '박서연', handle: '@ppseo0', followers: '48만', posts: '2,310',
    categories: ['뷰티', '패션'], profileImg: '/profile-parkseo.png',
    stage: 'list-up', campaignName: '루미에르 봄봄 프로모션', dDay: 'D-8',
    isFirstCollab: true, brief: BRIEF_TEXT,
  },
  'lu3': {
    id: 'lu3', name: 'leezsu', handle: '@leezsu', followers: '12만', posts: '987',
    categories: ['뷰티', '일상'], profileImg: '/profile-paooar.png',
    stage: 'list-up', campaignName: '루미에르 봄봄 프로모션', dDay: 'D-8',
    isFirstCollab: false, brief: BRIEF_TEXT,
  },
  '1': {
    id: '1', name: 'haye0', handle: '@haye0', followers: '10.4만', posts: '1,234',
    categories: ['뷰티', '패션'], profileImg: '/profile-haye0.png',
    stage: 'contacting', campaignName: '루미에르 봄봄 프로모션', dDay: 'D+26',
    brief: BRIEF_TEXT,
  },
  '2': {
    id: '2', name: 'zigoo', handle: '@zigoo', followers: '8만', posts: '934',
    categories: ['뷰티', '패션'], profileImg: '/profile-zigoo.png',
    stage: 'contacting', campaignName: '루미에르 봄봄 프로모션', dDay: 'D+26',
    brief: BRIEF_TEXT,
  },
  '3': {
    id: '3', name: '김지영', handle: '@jijizero', followers: '21만', posts: '2,103',
    categories: ['뷰티', '연애/결혼', '일상'], profileImg: '/profile-kimjiyoung.png',
    stage: 'contacting', campaignName: '루미에르 봄봄 프로모션', dDay: 'D+26',
    brief: BRIEF_TEXT,
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
        <span className="text-[20px] font-bold text-black">인플루언서 상세</span>
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
              캠페인 기본값이 자동으로 채워져 있어요. 변경하면 브리프가 실시간 업데이트돼요.
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
          <div className="flex flex-col" style={{ gap: 12 }}>
            <div className="flex items-center" style={{ gap: 6 }}>
              <span className="text-[18px] font-medium text-black">개별 가이드라인</span>
              <span className="text-[15px]" style={{ color: '#91929F' }}>(선택)</span>
            </div>
            <div
              className="flex items-center"
              style={{ backgroundColor: '#F9FAFB', borderRadius: 10, padding: '12px 20px' }}
            >
              <span className="text-[16px] font-medium" style={{ color: '#4B5969' }}>캠페인 기본: Google Sheets 링크</span>
            </div>
            <div
              className="flex items-center justify-between"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E7E4', borderRadius: 10, padding: '15px 20px' }}
            >
              <input
                value={guidelineUrl}
                onChange={e => setGuidelineUrl(e.target.value)}
                placeholder="개별 가이드라인 링크"
                className="flex-1 bg-transparent outline-none text-[18px] font-medium"
                style={{ color: '#1C1A17' }}
              />
              <button className="shrink-0 w-[34px] h-[34px] flex items-center justify-center rounded-[8px] active:opacity-70" style={{ backgroundColor: '#F2F4F6' }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M9 3v12M3 9h12" stroke="#78756E" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <span className="text-[14px] font-medium" style={{ color: '#D4D2CE' }}>캠페인 기본 가이드라인과 함께 브리프에 포함돼요.</span>
          </div>

          {/* 개별 요청사항 */}
          <div className="flex flex-col" style={{ gap: 12 }}>
            <div className="flex items-center" style={{ gap: 6 }}>
              <span className="text-[18px] font-medium text-black">개별 요청사항</span>
              <span className="text-[15px]" style={{ color: '#91929F' }}>(선택)</span>
            </div>
            <textarea
              value={requests}
              onChange={e => setRequests(e.target.value)}
              placeholder="예: 봄 컬러 위주로 촬영 부탁드려요"
              rows={3}
              className="w-full outline-none resize-none text-[18px] font-medium"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E7E4', borderRadius: 10, padding: '10px 20px', color: '#1C1A17' }}
            />
            <span className="text-[14px] font-medium" style={{ color: '#D4D2CE' }}>AI 브리프에 개인화된 메시지로 포함됩니다.</span>
          </div>

          {/* Save button */}
          <button
            className="w-full flex items-center justify-center active:opacity-80"
            style={{ backgroundColor: '#6366F1', borderRadius: 12, padding: 16 }}
          >
            <span className="text-[18px] font-bold text-white">저장</span>
          </button>
        </div>

        <div className="h-2 bg-[#F5F5F3]" />

        {/* ── AI 브리프 ── */}
        <div className="bg-white" style={{ padding: '30px 20px', gap: 20, display: 'flex', flexDirection: 'column' }}>
          <span className="text-[22px] font-bold text-black">AI 브리프</span>

          {/* Info note */}
          <div
            className="flex items-start"
            style={{ backgroundColor: '#EEF7FF', borderRadius: 12, padding: 20, gap: 7 }}
          >
            <span className="text-[16px] font-semibold" style={{ color: '#2D92FE', lineHeight: '135%' }}>
              캠페인 정보를 기반으로 AI가 자동 생성한 브리프예요. 바로 보내거나 수정 후 전송할 수 있어요.
            </span>
          </div>

          {/* Brief card */}
          <div style={{ border: '1px solid #ECECEF', borderRadius: 14, overflow: 'hidden' }}>
            {/* Card header */}
            <div
              className="flex items-center"
              style={{ backgroundColor: '#F8FAFF', padding: '15px 22px', gap: 10, borderBottom: '1px solid #ECECEF' }}
            >
              <span className="text-[16px] font-medium text-black">생성된 브리프</span>
              <span
                className="text-[16px] font-bold text-white"
                style={{ backgroundColor: '#6366F1', borderRadius: 7, padding: '3px 8px', fontFamily: 'Manrope, sans-serif' }}
              >
                AI
              </span>
            </div>
            {/* Brief body */}
            <div style={{ padding: '16px 22px' }}>
              <p className="text-[18px] font-medium whitespace-pre-line" style={{ color: '#1C1A17', lineHeight: '150%' }}>
                {data.brief}
              </p>
            </div>
            {/* Card footer */}
            <div className="flex" style={{ borderTop: '1px solid #ECECEF' }}>
              <button
                className="flex-1 flex items-center justify-center active:opacity-70"
                style={{ backgroundColor: '#F8FAFF', padding: '15px 22px', borderRight: '1px solid #ECECEF' }}
              >
                <span className="text-[16px] font-medium text-black">수정하기</span>
              </button>
              <button
                onClick={handleCopyBrief}
                className="flex-1 flex items-center justify-center active:opacity-70"
                style={{ backgroundColor: '#F8FAFF', padding: '15px 22px' }}
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
              className="flex flex-col"
              style={{ backgroundColor: '#F8F8FF', borderRadius: 14, padding: 22, gap: 6 }}
            >
              <span className="text-[18px] font-medium" style={{ color: '#6D6E8C', lineHeight: '140%' }}>
                첫 협업 인플루언서예요!
              </span>
              <span className="text-[18px] font-medium" style={{ color: '#6D6E8C', lineHeight: '140%' }}>
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

          {data.memo && (
            <div className="flex flex-col" style={{ backgroundColor: '#FFFDE5', borderRadius: 14, padding: 22, gap: 6 }}>
              <p className="text-[16px] font-medium whitespace-pre-line" style={{ color: '#705448', lineHeight: '22px' }}>
                {data.memo}
              </p>
              {data.memoDate && (
                <span className="text-[14px] font-medium" style={{ color: 'rgba(112,84,72,0.6)', lineHeight: '22px' }}>
                  {data.memoDate}
                </span>
              )}
            </div>
          )}

          {/* 메모 추가 버튼 */}
          <button
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

      {/* ── Bottom action bar ── */}
      <div
        className="absolute bottom-0 w-full bg-white flex flex-col"
        style={{ borderTop: '1px solid #E8E7E4', padding: 20, gap: 10 }}
      >
        <button
          className="w-full flex items-center justify-center active:opacity-80"
          style={{ backgroundColor: '#2E2C28', borderRadius: 12, padding: 16 }}
        >
          <span className="text-[18px] font-bold text-white">발송 완료</span>
        </button>
        <button className="w-full flex items-center justify-center active:opacity-60">
          <span className="text-[18px] font-medium" style={{ color: '#B7B7B7' }}>임시 저장</span>
        </button>
      </div>

    </div>
  );
}
