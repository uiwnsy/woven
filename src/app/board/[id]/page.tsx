'use client';

import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, Check, X } from 'lucide-react';

const MANROPE: React.CSSProperties = { fontFamily: 'Manrope, sans-serif' };

function CalendarSheet({ value, onChange, onClose }: {
  value: string; // YYYY-MM-DD
  onChange: (v: string) => void;
  onClose: () => void;
}) {
  const today = new Date();
  const init = value ? new Date(value) : today;
  const [year, setYear] = useState(init.getFullYear());
  const [month, setMonth] = useState(init.getMonth());
  const [selected, setSelected] = useState(value);

  const prevMonth = () => { if (month === 0) { setYear(y => y - 1); setMonth(11); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setYear(y => y + 1); setMonth(0); } else setMonth(m => m + 1); };

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  const toStr = (d: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col justify-end" style={{ maxWidth: 430, margin: '0 auto' }}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-[20px] px-5 pt-5 pb-8 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-[18px] font-bold text-[#1C1A17]">{year}년 {month + 1}월</span>
          <div className="flex items-center gap-1">
            <button onClick={prevMonth} className="w-9 h-9 flex items-center justify-center active:opacity-60">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#78756E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button onClick={nextMonth} className="w-9 h-9 flex items-center justify-center active:opacity-60">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#78756E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 text-center">
          {['일','월','화','수','목','금','토'].map((d, i) => (
            <span key={d} className={`text-[13px] font-semibold pb-1 ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-[#B0ADA7]'}`}>{d}</span>
          ))}
        </div>
        <div className="grid grid-cols-7 text-center gap-y-1">
          {cells.map((d, i) => {
            if (!d) return <div key={i} className="h-9" />;
            const str = toStr(d);
            const isSel = str === selected;
            const isSun = i % 7 === 0;
            const isSat = i % 7 === 6;
            return (
              <button
                key={i}
                onClick={() => setSelected(str)}
                className={`h-9 w-9 mx-auto rounded-full text-[15px] font-medium flex items-center justify-center active:opacity-70
                  ${isSel ? 'bg-[#6366F1] text-white font-bold' : isSun ? 'text-red-400' : isSat ? 'text-blue-400' : 'text-[#1C1A17]'}`}
              >
                {d}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => { if (selected) { onChange(selected); onClose(); } }}
          disabled={!selected}
          className="w-full h-[52px] rounded-[12px] text-[16px] font-bold text-white active:opacity-80"
          style={{ backgroundColor: selected ? '#2E2C28' : '#D4D2CE' }}
        >
          확인
        </button>
      </div>
    </div>
  );
}

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
const STAGE_TO_TAB: Record<Stage, string> = {
  'list-up': 'list-up',
  'contacting': 'contacting',
  'negotiating': 'negotiated',
  'reviewing': 'inProgress',
  'uploaded': 'uploaded',
};
const STAGE_LABELS: Record<Stage, string> = {
  'list-up': '리스트업',
  'contacting': '컨택',
  'negotiating': '협의중',
  'reviewing': '시안확인',
  'uploaded': '업로드',
};

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
    isFirstCollab: true, brief: BRIEF_TEXT,
    campaignGuidelineUrl: 'docs.google.com/fxB2eY1zadeox4dkz',
  },
  '2': {
    id: '2', name: 'zigoo', handle: '@zigoo', followers: '8만', posts: '934',
    categories: ['뷰티', '패션'], profileImg: '/profile-zigoo.png',
    stage: 'contacting', campaignName: '루미에르 봄봄 프로모션', dDay: 'D+26',
    isFirstCollab: true, brief: BRIEF_TEXT,
    campaignGuidelineUrl: 'docs.google.com/fxB2eY1zadeox4dkz',
  },
  '3': {
    id: '3', name: '김지영', handle: '@jijizero', followers: '21만', posts: '2,103',
    categories: ['뷰티', '연애/결혼', '일상'], profileImg: '/profile-kimjiyoung.png',
    stage: 'contacting', campaignName: '루미에르 봄봄 프로모션', dDay: 'D+26',
    isFirstCollab: true, brief: BRIEF_TEXT,
    campaignGuidelineUrl: 'docs.google.com/fxB2eY1zadeox4dkz',
  },
  '4': {
    id: '4', name: 'paooar', handle: '@paooar', followers: '9.2만', posts: '1,423',
    categories: ['뷰티', '패션', '일상'], profileImg: '/profile-paooar.png',
    stage: 'negotiating', campaignName: '루미에르 봄봄 프로모션', dDay: 'D+5',
    isFirstCollab: true, brief: BRIEF_TEXT,
    campaignGuidelineUrl: 'docs.google.com/fxB2eY1zadeox4dkz',
  },
  '5': {
    id: '5', name: 'minj_', handle: '@minj_', followers: '24.5만', posts: '1,842',
    categories: ['뷰티', '패션'], profileImg: '/profile-kimminji.png',
    stage: 'negotiating', campaignName: '루미에르 봄봄 프로모션', dDay: 'D+3',
    isFirstCollab: true, brief: BRIEF_TEXT,
    campaignGuidelineUrl: 'docs.google.com/fxB2eY1zadeox4dkz',
  },
  '6': {
    id: '6', name: 'leeum', handle: '@leeum', followers: '18.3만', posts: '892',
    categories: ['뷰티', '일상'], profileImg: '/profile-leeum.png',
    stage: 'reviewing', campaignName: '루미에르 봄봄 프로모션', dDay: 'D+12',
    isFirstCollab: true, brief: BRIEF_TEXT,
    campaignGuidelineUrl: 'docs.google.com/fxB2eY1zadeox4dkz',
  },
  '7': {
    id: '7', name: 'dearyq', handle: '@dearyq', followers: '10.1만', posts: '3,421',
    categories: ['뷰티', '패션', '일상'], profileImg: '/profile-dearyq.png',
    stage: 'uploaded', campaignName: '루미에르 봄봄 프로모션', dDay: 'D+1',
    isFirstCollab: true, brief: BRIEF_TEXT,
    campaignGuidelineUrl: 'docs.google.com/fxB2eY1zadeox4dkz',
  },
  '8': {
    id: '8', name: '박진이', handle: '@jinstlee', followers: '6.8만', posts: '1,102',
    categories: ['뷰티', '라이프'], profileImg: '/profile-parkjini.png',
    stage: 'negotiating', campaignName: '루미에르 봄봄 프로모션', dDay: 'D+7',
    isFirstCollab: false, brief: BRIEF_TEXT,
    campaignGuidelineUrl: 'docs.google.com/fxB2eY1zadeox4dkz',
  },
  '9': {
    id: '9', name: '이가흔', handle: '@igaheun', followers: '2.4만', posts: '654',
    categories: ['뷰티', '패션'], profileImg: '/profile-igaheun.png',
    stage: 'reviewing', campaignName: '루미에르 봄봄 프로모션', dDay: 'D+9',
    isFirstCollab: true, brief: BRIEF_TEXT,
    campaignGuidelineUrl: 'docs.google.com/fxB2eY1zadeox4dkz',
  },
};

function TransitionDateBox({ value, onChange, placeholder }: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const formatted = value ? value.slice(2).replace(/-/g, '.') : '';
  return (
    <div
      className="relative flex h-[52px] border border-[#E8E7E4] rounded-[10px] px-5 items-center gap-2 bg-white cursor-pointer"
      onClick={() => {
        const el = inputRef.current;
        if (!el) return;
        if (typeof el.showPicker === 'function') el.showPicker(); else el.click();
      }}
    >
      <Calendar size={18} className="text-stone-400 shrink-0" />
      <span className={`text-[16px] font-medium select-none ${formatted ? 'text-[#1C1A17]' : 'text-[#C7C4BE]'}`}>
        {formatted || placeholder}
      </span>
      <input
        ref={inputRef}
        type="date"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
        tabIndex={-1}
      />
    </div>
  );
}

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
      {/* Progress line in primary color up to current stage */}
      {currentIdx > 0 && (
        <div className="absolute"
          style={{
            top: 5.25, left: 28, height: 3.5, backgroundColor: '#6366F1', zIndex: 0,
            width: ['0px', 'calc(25% - 14px)', 'calc(50% - 28px)', 'calc(75% - 38.5px)', 'calc(100% - 49px)'][currentIdx],
          }} />
      )}

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
  const searchParams = useSearchParams();
  const id = params.id as string;
  const data = MOCK_DETAILS[id];
  const stageParam = searchParams.get('stage') as Stage | null;
  const effectiveStage: Stage = (stageParam && STAGE_IDS.includes(stageParam)) ? stageParam : data?.stage;

  const [responseStatus, setResponseStatus] = useState<'positive' | 'negative' | 'none'>('none');
  const [negotiationPrice, setNegotiationPrice] = useState('');
  const [draftDeadline, setDraftDeadline] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [productShipped, setProductShipped] = useState(false);
  const [briefExpanded, setBriefExpanded] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<'ig' | 'yt' | 'tt'>('ig');
  const [guidelineUrl, setGuidelineUrl] = useState('');
  const [requests, setRequests] = useState('');
  const [briefCopied, setBriefCopied] = useState(false);
  const [showMemoOverlay, setShowMemoOverlay] = useState(false);
  const [memoInput, setMemoInput] = useState('');
  const [driveLink, setDriveLink] = useState('');
  const [draftReviewState, setDraftReviewState] = useState<'empty' | 'has-draft' | 'revision-sent' | 'approved'>(
    () => (effectiveStage === 'reviewing' || effectiveStage === 'uploaded') ? 'approved' : 'empty'
  );
  const [draftType, setDraftType] = useState<'file' | 'link'>('file');
  const [revisionText, setRevisionText] = useState('');
  const [revisionHistory, setRevisionHistory] = useState<{ text: string; date: string; round: number }[]>([]);
  const [showDraftOverlay, setShowDraftOverlay] = useState(false);
  const [overlayMode, setOverlayMode] = useState<'review' | 'requesting'>('review');
  const [isEditingBrief, setIsEditingBrief] = useState(false);
  const [editedBrief, setEditedBrief] = useState<string | null>(null);
  const [briefVersion, setBriefVersion] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEditingRequests, setIsEditingRequests] = useState(false);
  const [negotiatingBriefExpanded, setNegotiatingBriefExpanded] = useState(false);
  const [postingUrl, setPostingUrl] = useState(() => effectiveStage === 'uploaded' ? 'https://instagram.com/p/C4xBkQFP5Xx/' : '');
  const [postingDate, setPostingDate] = useState(() => effectiveStage === 'uploaded' ? '2025.05.02' : '');
  const [showPostingDateCalendar, setShowPostingDateCalendar] = useState(false);
  const [captionHasUtm, setCaptionHasUtm] = useState(() => effectiveStage === 'uploaded');
  const [rvDraftExpanded, setRvDraftExpanded] = useState(false);
  const [rvUtmExpanded, setRvUtmExpanded] = useState(false);
  const [rvNegInfoExpanded, setRvNegInfoExpanded] = useState(false);
  const [rvBriefExpanded, setRvBriefExpanded] = useState(false);
  const [collabHistoryExpanded, setCollabHistoryExpanded] = useState(
    () => effectiveStage !== 'contacting' && effectiveStage !== 'negotiating' && effectiveStage !== 'reviewing' && effectiveStage !== 'uploaded'
  );
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [utmCopied, setUtmCopied] = useState(false);
  const [showTransitionSheet, setShowTransitionSheet] = useState(false);
  const [dmSent, setDmSent] = useState(false);
  const [dmChannel, setDmChannel] = useState('');
  const [settlementAmount, setSettlementAmount] = useState('');
  const [paymentDone, setPaymentDone] = useState(false);
  const briefTextareaRef = useRef<HTMLTextAreaElement>(null);
  const requestsTextareaRef = useRef<HTMLTextAreaElement>(null);
  const memoTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const reset = () => window.scrollTo(0, 0);
    vv.addEventListener('resize', reset);
    vv.addEventListener('scroll', reset);
    return () => {
      vv.removeEventListener('resize', reset);
      vv.removeEventListener('scroll', reset);
    };
  }, []);

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
    <div className="flex flex-col bg-white max-w-[430px] mx-auto relative overflow-hidden" style={{ height: '100svh' }}>

      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-4 shrink-0"
        style={{ height: 56, backgroundColor: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(203,213,225,0.2)' }}
      >
        <button onClick={() => router.push('/board?tab=' + STAGE_TO_TAB[effectiveStage])} className="w-[42px] h-[42px] flex items-center justify-center active:opacity-60">
          <img src="/back-icon.svg" alt="back" width={24} height={24} />
        </button>
        <span className="text-[16px] font-bold text-black">인플루언서 상세</span>
        <button className="w-[42px] h-[42px] flex items-center justify-center active:opacity-60">
          <img src="/details-icon.svg" alt="more" width={24} height={24} />
        </button>
      </div>

      {/* ── Scrollable body ── */}
      <div className={`flex-1 overflow-y-auto ${effectiveStage === 'contacting' || effectiveStage === 'negotiating' ? 'pb-[200px]' : 'pb-[120px]'}`}>

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
                <span className="text-[20px] font-semibold text-black" style={MANROPE}>{data.name}</span>
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

        <div className="h-[10px] bg-[#F5F5F3]" />

        {/* ── Campaign Progress ── */}
        <div className="bg-white" style={{ padding: '30px 20px', gap: 25, display: 'flex', flexDirection: 'column' }}>

          {/* Status + name + dday row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center" style={{ gap: 8 }}>
              <span
                className="text-[14px] font-semibold"
                style={{ backgroundColor: '#EEEEFF', color: '#3D3FC7', borderRadius: 50, padding: '6px 10px' }}
              >
                {STAGE_LABELS[effectiveStage]}
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
          <StageTracker stageId={effectiveStage} />
        </div>

        <div className="h-[10px] bg-[#F5F5F3]" />

        {/* ── 리스트업 전용: 협의 조건 + AI 브리프 ── */}
        {effectiveStage === 'list-up' && <>

        {/* ── 협의 조건 ── */}
        <div className="bg-white" style={{ padding: '30px 20px', gap: 20, display: 'flex', flexDirection: 'column' }}>

          {/* Title */}
          <div className="flex flex-col" style={{ gap: 8 }}>
            <span className="text-[20px] font-bold text-black">협의 조건</span>
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
              <span className="text-[16px] font-medium text-black">플랫폼 &amp; 포맷</span>
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
              <span className="text-[16px] font-medium text-black">개별 가이드라인</span>
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
              <span className="text-[16px] font-medium text-black">개별 요청사항</span>
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
            <span className="text-[16px] font-bold text-white">
              {isGenerating ? 'AI 생성 중...' : '브리프 다시 생성하기'}
            </span>
          </button>
        </div>

        <div className="h-[10px] bg-[#F5F5F3]" />

        {/* ── AI 브리프 ── */}
        <div className="bg-white" style={{ padding: '30px 20px', gap: 20, display: 'flex', flexDirection: 'column' }}>
          <span className="text-[20px] font-bold text-black">AI 브리프</span>

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

        </> /* end list-up only */}

        {/* ── 컨택 전용 섹션들 ── */}
        {effectiveStage === 'contacting' && <>

        {/* 발송 현황 */}
        <div className="bg-white" style={{ padding: '16px 20px 30px', gap: 20, display: 'flex', flexDirection: 'column' }}>
          <span className="text-[20px] font-bold text-black">발송 현황</span>
          <div style={{ border: '1px solid #ECECEF', borderRadius: 14, overflow: 'hidden' }}>
            <div className="flex items-center px-5 py-4" style={{ gap: 10, backgroundColor: '#F8FAFF' }}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
                <path d="M3.5 10.5l4.5 4.5 8.5-9" stroke="#6366F1" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-[16px] font-semibold text-black">브리프 발송 완료</span>
            </div>
            <div className="flex flex-col px-5 py-4 bg-white" style={{ gap: 12, borderTop: '1px solid #ECECEF' }}>
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-medium" style={{ color: '#899098' }}>발송일</span>
                <span className="text-[14px] font-medium" style={{ color: '#1C1A17' }}>2025.04.17</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-medium" style={{ color: '#899098' }}>경과</span>
                <span className="text-[14px] font-semibold" style={{ color: '#EF8652', fontFamily: 'Manrope, sans-serif' }}>{data.dDay}</span>
              </div>
              {dmChannel && (
                <div className="flex items-center justify-between">
                  <span className="text-[14px] font-medium" style={{ color: '#899098' }}>발송 채널</span>
                  <span className="text-[14px] font-medium" style={{ color: '#1C1A17' }}>{dmChannel}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="h-[10px] bg-[#F5F5F3]" />

        {/* 응답 상태 (27:4351) */}
        <div className="bg-white" style={{ padding: '30px 20px', gap: 24, display: 'flex', flexDirection: 'column' }}>
          <span className="text-[20px] font-bold text-black">응답 상태</span>
          <div style={{ display: 'flex', gap: 14 }}>
            {([
              { key: 'positive', icon: '/done-icon.svg',    label: '긍정 응답', sub: '참여 의사 확인' },
              { key: 'negative', icon: '/no-icon.svg',      label: '거절',      sub: '참여 불가'     },
              { key: 'none',     icon: '/nothing-icon.svg', label: '미응답',    sub: '응답 대기중'   },
            ] as const).map(({ key, icon, label, sub }) => {
              const isActive = responseStatus === key;
              return (
                <button
                  key={key}
                  onClick={() => setResponseStatus(key)}
                  className="flex-1 flex flex-col items-center justify-center active:opacity-80"
                  style={{
                    gap: 6, padding: 20, borderRadius: 10,
                    backgroundColor: isActive ? '#EEEEFF' : '#FFFFFF',
                    border: `1px solid ${isActive ? '#6366F1' : '#EBEEF7'}`,
                  }}
                >
                  <img src={icon} alt={label} width={52} height={52} />
                  <span className="text-[16px] font-semibold" style={{ color: '#1C1A17' }}>{label}</span>
                  <span className="text-[14px] font-medium" style={{ color: '#B0ADA7' }}>{sub}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="h-[10px] bg-[#F5F5F3]" />

        {/* 배송 정보 */}
        <div className="bg-white" style={{ padding: '30px 20px', gap: 20, display: 'flex', flexDirection: 'column' }}>
          <span className="text-[20px] font-bold text-black">배송 정보</span>

          {/* 주소 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span className="text-[16px] font-medium text-black">주소</span>
            <div style={{ border: '1px solid #E8E7E4', borderRadius: 10, padding: '10px 20px' }}>
              <input
                value={deliveryAddress}
                onChange={e => setDeliveryAddress(e.target.value)}
                placeholder="인플루언서 수령 주소를 입력해 주세요"
                className="w-full bg-transparent outline-none text-[16px] font-medium"
                style={{ color: '#1C1A17' }}
              />
            </div>
          </div>

          {/* 제품 배송 완료 */}
          <div style={{ border: '1px solid #E8E7E4', borderRadius: 14, padding: 20 }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center" style={{ gap: 10 }}>
                <img src="/ship-icon.svg" alt="배송" width={52} height={52} className="shrink-0" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span className="text-[16px] font-semibold" style={{ color: '#1C1A17' }}>제품 배송 완료</span>
                  <span className="text-[14px] font-medium" style={{ color: '#B0ADA7' }}>인플루언서에게 제품을 발송했나요?</span>
                </div>
              </div>
              <button
                onClick={() => setProductShipped(v => !v)}
                className="shrink-0 active:opacity-80"
                style={{ width: 52, height: 30, borderRadius: 40, padding: 3, backgroundColor: productShipped ? '#6366F1' : '#E8E7E4', transition: 'background-color 0.2s', justifyContent: productShipped ? 'flex-end' : 'flex-start', display: 'flex' }}
              >
                <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
              </button>
            </div>
          </div>
        </div>

        <div className="h-[10px] bg-[#F5F5F3]" />

        {/* 발송된 브리프 (접기/펼치기) */}
        <div className="bg-white" style={{ display: 'flex', flexDirection: 'column' }}>
          <button
            onClick={() => setBriefExpanded(v => !v)}
            className="flex items-center justify-between w-full active:opacity-70"
            style={{ padding: '24px 20px' }}
          >
            <span className="text-[20px] font-bold text-black">발송된 브리프</span>
            <div className="flex items-center gap-2">
              <div className="w-[36px] bg-[#6366F1] rounded-[7px] flex items-center justify-center py-[3px]">
                <span className="text-[16px] font-bold text-white" style={{ fontFamily: 'Manrope, sans-serif' }}>AI</span>
              </div>
              <svg
                width="18" height="18" viewBox="0 0 18 18" fill="none"
                style={{ transform: briefExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
              >
                <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="#899098" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>
          {briefExpanded && (
            <div style={{ padding: '0 20px 24px' }}>
              <div className="border border-[#ECECEF] rounded-[14px] overflow-hidden">
                <div className="bg-white px-5 py-[14px]">
                  <p className="text-[16px] font-medium whitespace-pre-wrap text-[#1C1A17] leading-[150%]">
                    {BRIEF_VARIANTS[0]}
                  </p>
                </div>
                <div className="border-t border-[#ECECEF]">
                  <button onClick={handleCopyBrief} className="w-full py-[15px] flex items-center justify-center bg-[#F8FAFF] active:opacity-70">
                    <span className="text-[16px] font-medium text-black">{briefCopied ? '복사됨 ✓' : '복사하기'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        </> /* end contacting only */}

        {/* ── 협의중 전용 섹션들 ── */}
        {effectiveStage === 'negotiating' && <>

        {/* 시안 섹션 */}
        <div className="bg-white" style={{ padding: '30px 20px', gap: 20, display: 'flex', flexDirection: 'column' }}>

          {/* 헤더 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="flex items-center justify-between">
              <span className="text-[20px] font-bold text-black">시안</span>
              {revisionHistory.length > 0 && (
                <span className="text-[14px] font-semibold" style={{ color: '#EF8652' }}>
                  수정 요청 {revisionHistory.length}회차
                </span>
              )}
            </div>
            <span className="text-[14px] font-medium" style={{ color: '#B0ADA7' }}>
              인플루언서로부터 받은 시안을 첨부하고 검토하세요.
            </span>
          </div>

          {/* ── EMPTY: 파일·링크 입력 ── */}
          {draftReviewState === 'empty' && (
            <>
              <button
                onClick={() => { setDraftType('file'); setDraftReviewState('has-draft'); }}
                className="w-full flex flex-col items-center justify-center gap-[10px] active:opacity-70"
                style={{ border: '1px dashed #B0ADA7', borderRadius: 14, padding: '30px 0' }}
              >
                <img src="/contents-icon.svg" alt="시안 첨부" width={52} height={52} />
                <span className="text-[16px] font-semibold" style={{ color: '#1C1A17' }}>시안 파일 첨부하기</span>
              </button>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-[1px] bg-[#E8E7E4]" />
                <span className="text-[14px] font-medium" style={{ color: '#B0ADA7' }}>또는</span>
                <div className="flex-1 h-[1px] bg-[#E8E7E4]" />
              </div>
              <div>
                <div className="flex items-center justify-between"
                  style={{ border: '1px solid #E8E7E4', borderRadius: 10, padding: '10px 10px 10px 20px' }}>
                  <input
                    value={driveLink}
                    onChange={e => setDriveLink(e.target.value)}
                    placeholder="Google Drive 링크 붙여넣기"
                    className="flex-1 bg-transparent outline-none text-[16px] font-medium"
                    style={{ color: '#1C1A17' }}
                  />
                  <button
                    onClick={() => { if (driveLink.trim()) { setDraftType('link'); setDraftReviewState('has-draft'); } }}
                    className="shrink-0 w-[34px] h-[34px] flex items-center justify-center rounded-[8px] active:opacity-70"
                    style={{ backgroundColor: driveLink ? '#6366F1' : '#F2F4F6' }}
                  >
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M10 3h5v5M8 10l7-7" stroke={driveLink ? '#fff' : '#78756E'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 4H4a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1v-4" stroke={driveLink ? '#fff' : '#78756E'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
                <p className="text-[14px] font-medium mt-2" style={{ color: '#D4D2CE' }}>
                  Google Drive, Dropbox 등 클라우드 링크를 붙여넣으세요.
                </p>
              </div>
            </>
          )}

          {/* ── 첨부 카드 (탭하면 검토 오버레이) ── */}
          {draftReviewState !== 'empty' && (
            <button
              onClick={() => { setOverlayMode('review'); setShowDraftOverlay(true); }}
              className="flex items-center justify-between px-5 py-4 rounded-[14px] w-full active:opacity-70"
              style={{
                backgroundColor: draftReviewState === 'approved' ? '#F0FDF4' : '#F0F2FF',
                border: `1px solid ${draftReviewState === 'approved' ? '#BBF7D0' : '#C7C9F5'}`,
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[10px] bg-white flex items-center justify-center shrink-0"
                  style={{ border: '1px solid #EBEEF7' }}>
                  {draftType === 'file' ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M5 2.5h7l4 4v11a1 1 0 01-1 1H5a1 1 0 01-1-1v-14a1 1 0 011-1z"
                        stroke={draftReviewState === 'approved' ? '#22c55e' : '#6366F1'} strokeWidth="1.3" fill="none"/>
                      <path d="M12 2.5V7H16.5"
                        stroke={draftReviewState === 'approved' ? '#22c55e' : '#6366F1'} strokeWidth="1.3" strokeLinecap="round"/>
                      <path d="M7 11h6M7 13.5h4"
                        stroke={draftReviewState === 'approved' ? '#22c55e' : '#6366F1'} strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M13 3h4v4M10 10l7-7M9 5H5a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1v-4"
                        stroke={draftReviewState === 'approved' ? '#22c55e' : '#6366F1'} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div className="text-left">
                  <p className="text-[14px] font-semibold" style={{ color: '#1C1A17' }}>
                    {draftType === 'file' ? '시안_파일.mp4' : (driveLink.length > 26 ? driveLink.slice(0, 26) + '…' : driveLink)}
                  </p>
                  <p className="text-[12px] font-medium mt-[2px]"
                    style={{ color: draftReviewState === 'approved' ? '#22c55e' : draftReviewState === 'revision-sent' ? '#EF8652' : '#8486F3' }}>
                    {draftReviewState === 'approved' ? '✓ 승인됨' : draftReviewState === 'revision-sent' ? '수정 요청 전송됨 · 탭하여 이력 보기' : '탭하여 검토하기'}
                  </p>
                </div>
              </div>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0">
                <path d="M6.75 4.5L11.25 9L6.75 13.5" stroke="#B0ADA7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}

          {/* ── REVISION-SENT: 새 시안 받기 ── */}
          {draftReviewState === 'revision-sent' && (
            <button
              onClick={() => setDraftReviewState('empty')}
              className="w-full flex items-center justify-center gap-2 active:opacity-70"
              style={{ border: '1px dashed #B0ADA7', borderRadius: 14, padding: '18px 0' }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3v10M3 8h10" stroke="#78756E" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span className="text-[15px] font-semibold" style={{ color: '#78756E' }}>새 시안 파일 받기</span>
            </button>
          )}

        </div>

        <div className="h-[10px] bg-[#F5F5F3]" />

        {/* UTM 링크 */}
        {(() => {
          const handle = data.handle.replace('@', '');
          // deterministic short code from handle
          const seed = [...handle].reduce((acc, c) => (acc * 31 + c.charCodeAt(0)) & 0xFFFFFF, 5381);
          const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
          const shortId = Array.from({ length: 6 }, (_, i) => chars[(seed >> (i * 3)) % chars.length]).join('');
          const shortLink = `https://lumi.re/${shortId}`;
          const fullUtmLink = `https://lumiere.co/?utm_source=instagram&utm_medium=influencer&utm_campaign=spring2025&utm_content=${handle}`;
          return (
            <div className="bg-white" style={{ padding: '30px 20px', gap: 20, display: 'flex', flexDirection: 'column' }}>
              <div className="flex flex-col" style={{ gap: 6 }}>
                <span className="text-[20px] font-bold text-black">개인 UTM 링크</span>
                <span className="text-[14px] font-medium" style={{ color: '#B0ADA7' }}>
                  협의 확정 시 자동 생성된 인플루언서 전용 성과 추적 링크예요.
                </span>
              </div>

              {/* Short link card */}
              <div style={{ border: '1px solid #EBEEF7', borderRadius: 14, overflow: 'hidden' }}>
                {/* Short link + copy */}
                <div className="flex items-center justify-between px-5 py-4" style={{ gap: 12, backgroundColor: '#FAFAFC' }}>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                      <path d="M6.5 9.5a3.5 3.5 0 005 0l2-2a3.5 3.5 0 00-5-5l-1 1" stroke="#6366F1" strokeWidth="1.4" strokeLinecap="round"/>
                      <path d="M9.5 6.5a3.5 3.5 0 00-5 0l-2 2a3.5 3.5 0 005 5l1-1" stroke="#6366F1" strokeWidth="1.4" strokeLinecap="round"/>
                    </svg>
                    <span className="text-[16px] font-bold truncate" style={{ color: '#6366F1', fontFamily: 'Manrope, sans-serif' }}>
                      {shortLink}
                    </span>
                  </div>
                  <button
                    onClick={async () => {
                      await navigator.clipboard.writeText(shortLink).catch(() => {});
                      setUtmCopied(true);
                      setTimeout(() => setUtmCopied(false), 2000);
                    }}
                    className="shrink-0 flex items-center justify-center gap-[6px] active:opacity-70"
                    style={{ backgroundColor: utmCopied ? '#6366F1' : '#EEEEFF', borderRadius: 8, padding: '8px 14px', transition: 'background-color 0.15s' }}
                  >
                    <span className="text-[13px] font-semibold" style={{ color: utmCopied ? '#fff' : '#6366F1' }}>
                      {utmCopied ? '복사됨' : '복사'}
                    </span>
                  </button>
                </div>

                {/* UTM params breakdown */}
                <div style={{ borderTop: '1px solid #EBEEF7' }}>
                  {[
                    { key: 'utm_source',   value: 'instagram' },
                    { key: 'utm_medium',   value: 'influencer' },
                    { key: 'utm_campaign', value: 'spring2025' },
                    { key: 'utm_content',  value: handle },
                  ].map((param, i, arr) => (
                    <div
                      key={param.key}
                      className="flex items-center justify-between px-5 py-3"
                      style={{ borderBottom: i < arr.length - 1 ? '1px solid #F0F2F8' : 'none' }}
                    >
                      <span className="text-[13px] font-medium" style={{ color: '#899098', fontFamily: 'Manrope, sans-serif' }}>{param.key}</span>
                      <span className="text-[13px] font-semibold" style={{ color: '#1C1A17', fontFamily: 'Manrope, sans-serif' }}>{param.value}</span>
                    </div>
                  ))}
                </div>

                {/* Full URL reference */}
                <div className="px-5 py-3" style={{ borderTop: '1px solid #F0F2F8', backgroundColor: '#FAFAFA' }}>
                  <p className="text-[11px] font-medium break-all leading-[160%]" style={{ color: '#C0C4CF', fontFamily: 'Manrope, sans-serif' }}>
                    {fullUtmLink}
                  </p>
                </div>
              </div>
            </div>
          );
        })()}

        <div className="h-[10px] bg-[#F5F5F3]" />

        {/* 협의 정보 */}
        <div className="bg-white" style={{ padding: '30px 20px', gap: 20, display: 'flex', flexDirection: 'column' }}>
          <span className="text-[20px] font-bold text-black">협의 정보</span>

          {/* 2x2 그리드 카드 */}
          <div style={{ border: '1px solid #EBEEF7', borderRadius: 14, overflow: 'hidden', backgroundColor: '#F8FAFF' }}>
            <div className="grid grid-cols-2">
              {/* 협의 단가 */}
              <div className="flex flex-col" style={{ gap: 2, padding: '24px 22px 18px', backgroundColor: '#FAFAFC' }}>
                <p className="text-[14px] font-medium leading-[135%]" style={{ color: '#78756E' }}>협의 단가</p>
                <p className="text-[19px] font-bold leading-[135%]" style={{ fontFamily: 'Manrope, sans-serif', color: '#1C1A17' }}>
                  {negotiationPrice ? `${negotiationPrice}원` : '-'}
                </p>
              </div>
              {/* 콘텐츠 형식 */}
              <div className="flex flex-col" style={{ gap: 2, padding: '24px 22px 18px', backgroundColor: '#FAFAFC' }}>
                <p className="text-[14px] font-medium leading-[135%]" style={{ color: '#78756E' }}>콘텐츠 형식</p>
                <p className="text-[19px] font-semibold leading-[135%]" style={{ color: '#1C1A17' }}>릴스 1건</p>
              </div>
              {/* 시안 전달 예정일 */}
              <div className="flex flex-col" style={{ gap: 2, padding: '18px 22px 24px', backgroundColor: '#FAFAFC' }}>
                <p className="text-[14px] font-medium leading-[135%]" style={{ color: '#78756E' }}>시안 전달 예정일</p>
                <p className="text-[19px] font-bold leading-[135%]" style={{ fontFamily: 'Manrope, sans-serif', color: '#1C1A17' }}>
                  {draftDeadline ? draftDeadline.replace(/-/g, '.') : '-'}
                </p>
              </div>
              {/* 플랫폼 */}
              <div className="flex flex-col" style={{ gap: 2, padding: '18px 22px 24px', backgroundColor: '#FAFAFC' }}>
                <p className="text-[14px] font-medium leading-[135%]" style={{ color: '#78756E' }}>플랫폼</p>
                <p className="text-[19px] font-semibold leading-[135%]" style={{ color: '#1C1A17' }}>인스타그램</p>
              </div>
            </div>
          </div>

          {/* 배송 주소 */}
          <div style={{ border: '1px solid #E8E7E4', borderRadius: 14, padding: '14px 20px' }}>
            <div className="flex items-start justify-between" style={{ gap: 12 }}>
              <span className="text-[14px] font-medium shrink-0" style={{ color: '#78756E' }}>배송 주소</span>
              <span className="text-[14px] font-medium text-right" style={{ color: '#1C1A17' }}>
                {deliveryAddress || '서울 강남구 테헤란로 635, 3층'}
              </span>
            </div>
          </div>

          {/* 제품 배송 완료 */}
          <div style={{ border: '1px solid #E8E7E4', borderRadius: 14, padding: 20 }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center" style={{ gap: 10 }}>
                <img src="/ship-icon.svg" alt="배송" width={52} height={52} className="shrink-0" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span className="text-[16px] font-semibold" style={{ color: '#1C1A17' }}>제품 배송 완료</span>
                  <span className="text-[14px] font-medium" style={{ color: '#B0ADA7' }}>인플루언서에게 제품을 발송했나요?</span>
                </div>
              </div>
              <button
                onClick={() => setProductShipped(v => !v)}
                className="shrink-0 active:opacity-80 flex items-center"
                style={{ width: 52, height: 30, borderRadius: 40, padding: 3, backgroundColor: productShipped ? '#6366F1' : '#E8E7E4', transition: 'background-color 0.2s', justifyContent: productShipped ? 'flex-end' : 'flex-start', display: 'flex' }}
              >
                <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
              </button>
            </div>
          </div>
        </div>

        <div className="h-[10px] bg-[#F5F5F3]" />

        {/* 발송된 브리프 */}
        <div className="bg-white" style={{ display: 'flex', flexDirection: 'column' }}>
          <button
            onClick={() => setNegotiatingBriefExpanded(v => !v)}
            className="flex items-center justify-between w-full active:opacity-70"
            style={{ padding: '24px 20px' }}
          >
            <span className="text-[20px] font-bold text-black">발송된 브리프</span>
            <div className="flex items-center gap-2">
              <div className="w-[36px] bg-[#6366F1] rounded-[7px] flex items-center justify-center py-[3px]">
                <span className="text-[16px] font-bold text-white" style={{ fontFamily: 'Manrope, sans-serif' }}>AI</span>
              </div>
              <svg
                width="18" height="18" viewBox="0 0 18 18" fill="none"
                style={{ transform: negotiatingBriefExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
              >
                <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="#899098" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>
          {negotiatingBriefExpanded && (
            <div style={{ padding: '0 20px 24px' }}>
              <div className="border border-[#ECECEF] rounded-[14px] overflow-hidden">
                <div className="bg-white px-5 py-[14px]">
                  <p className="text-[16px] font-medium whitespace-pre-wrap text-[#1C1A17] leading-[150%]">
                    {editedBrief ?? data.brief ?? BRIEF_VARIANTS[0]}
                  </p>
                </div>
                <div className="border-t border-[#ECECEF]">
                  <button onClick={handleCopyBrief} className="w-full py-[15px] flex items-center justify-center bg-[#F8FAFF] active:opacity-70">
                    <span className="text-[16px] font-medium text-black">{briefCopied ? '복사됨 ✓' : '복사하기'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        </> /* end negotiating only */}

        {/* ── 시안확인 / 업로드 공통 섹션 ── */}
        {(effectiveStage === 'reviewing' || effectiveStage === 'uploaded') && <>

        {effectiveStage === 'uploaded' ? (
          /* ── 업로드된 콘텐츠 (업로드 단계 전용) ── */
          <div className="bg-white" style={{ padding: '30px 20px', gap: 20, display: 'flex', flexDirection: 'column' }}>
            <div className="flex items-center gap-2">
              <span className="text-[20px] font-bold text-black">업로드된 콘텐츠</span>
              <div className="flex items-center justify-center" style={{ backgroundColor: '#F0FDF4', borderRadius: 50, padding: '3px 10px' }}>
                <span className="text-[13px] font-semibold" style={{ color: '#22C55E' }}>업로드 완료</span>
              </div>
            </div>

            {/* 포스팅 URL */}
            <div style={{ border: '1px solid #E8E7E4', borderRadius: 14, overflow: 'hidden' }}>
              <div className="flex items-center justify-between px-5 py-4" style={{ gap: 12, backgroundColor: '#FAFAFA' }}>
                <div className="flex flex-col flex-1 min-w-0" style={{ gap: 3 }}>
                  <span className="text-[13px] font-medium" style={{ color: '#B0ADA7' }}>포스팅 URL</span>
                  <span className="text-[15px] font-semibold truncate" style={{ color: '#6366F1', fontFamily: 'Manrope, sans-serif' }}>
                    {postingUrl || 'https://instagram.com/p/C4xBkQFP5Xx/'}
                  </span>
                </div>
                <a
                  href={postingUrl || 'https://instagram.com/p/C4xBkQFP5Xx/'}
                  target="_blank" rel="noopener noreferrer"
                  className="shrink-0 flex items-center justify-center active:opacity-70"
                  style={{ width: 36, height: 36, backgroundColor: '#EEEEFF', borderRadius: 10 }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M7 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1V9" stroke="#6366F1" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 2h4v4" stroke="#6366F1" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14 2L7.5 8.5" stroke="#6366F1" strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* 게시일 + UTM */}
            <div className="flex gap-3">
              <div className="flex-1 flex flex-col" style={{ gap: 3, backgroundColor: '#F8FAFF', borderRadius: 14, padding: '16px 18px' }}>
                <span className="text-[13px] font-medium" style={{ color: '#B0ADA7' }}>게시일</span>
                <span className="text-[17px] font-bold" style={{ color: '#1C1A17', fontFamily: 'Manrope, sans-serif' }}>
                  {postingDate || '2025.05.02'}
                </span>
              </div>
              <div className="flex-1 flex flex-col" style={{ gap: 3, backgroundColor: '#F8FAFF', borderRadius: 14, padding: '16px 18px' }}>
                <span className="text-[13px] font-medium" style={{ color: '#B0ADA7' }}>UTM 링크</span>
                <span className="text-[17px] font-bold" style={{ color: captionHasUtm ? '#6366F1' : '#B0ADA7' }}>
                  {captionHasUtm ? '포함' : '미포함'}
                </span>
              </div>
            </div>

            {/* 정산 금액 */}
            <div style={{ border: '1px solid #E8E7E4', borderRadius: 14, padding: '14px 20px' }}>
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-medium" style={{ color: '#78756E' }}>정산 금액</span>
                <span className="text-[16px] font-bold" style={{ fontFamily: 'Manrope, sans-serif', color: settlementAmount ? '#1C1A17' : '#B0ADA7' }}>
                  {settlementAmount ? `${settlementAmount}원` : '미입력'}
                </span>
              </div>
            </div>

            {/* 입금 완료 토글 */}
            <div style={{ border: `1px solid ${paymentDone ? '#BBF7D0' : '#E8E7E4'}`, borderRadius: 14, padding: 20, backgroundColor: paymentDone ? '#F0FDF4' : '#FFFFFF', transition: 'all 0.2s' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center" style={{ gap: 10 }}>
                  <div
                    className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center shrink-0"
                    style={{ backgroundColor: paymentDone ? '#DCFCE7' : '#F5F5F3' }}
                  >
                    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                      <path d="M13 3C7.477 3 3 7.477 3 13s4.477 10 10 10 10-4.477 10-10S18.523 3 13 3z"
                        stroke={paymentDone ? '#22C55E' : '#B0ADA7'} strokeWidth="1.5" fill="none"/>
                      <path d="M9 13l2.5 2.5L17 10"
                        stroke={paymentDone ? '#22C55E' : '#B0ADA7'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <span className="text-[16px] font-semibold" style={{ color: paymentDone ? '#16A34A' : '#1C1A17' }}>
                      {paymentDone ? '입금 완료' : '입금 대기'}
                    </span>
                    <span className="text-[14px] font-medium" style={{ color: '#B0ADA7' }}>
                      {paymentDone ? '인플루언서에게 정산을 완료했어요' : '인플루언서 정산을 완료했나요?'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setPaymentDone(v => !v)}
                  className="shrink-0 active:opacity-80 flex items-center"
                  style={{ width: 52, height: 30, borderRadius: 40, padding: 3, backgroundColor: paymentDone ? '#22C55E' : '#E8E7E4', transition: 'background-color 0.2s', justifyContent: paymentDone ? 'flex-end' : 'flex-start', display: 'flex' }}
                >
                  <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                </button>
              </div>
            </div>

          </div>
        ) : (
          /* ── 업로드 정보 (시안확인 단계) ── */
          <div className="bg-white" style={{ padding: '30px 20px', gap: 20, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span className="text-[20px] font-bold text-black">업로드 정보</span>
              <span className="text-[14px] font-medium" style={{ color: '#B0ADA7' }}>
                포스팅 정보와 정산 내역을 입력하면 업로드완료 단계로 이동합니다.
              </span>
            </div>

            {/* 포스팅 URL */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <span className="text-[17px] font-medium text-black">
                  포스팅 URL <span style={{ color: '#6366F1' }}>*</span>
                </span>
                <div style={{ border: '1px solid #E8E7E4', borderRadius: 10, padding: '10px 20px' }}>
                  <input
                    value={postingUrl}
                    onChange={e => setPostingUrl(e.target.value)}
                    placeholder="https://instagram.com/p/..."
                    className="w-full bg-transparent outline-none text-[16px] font-medium"
                    style={{ color: '#1C1A17' }}
                  />
                </div>
              </div>
              <span className="text-[14px] font-medium" style={{ color: '#D4D2CE' }}>
                인플루언서가 올린 게시물의 URL을 붙여넣기 해주세요
              </span>
            </div>

            {/* 게시일 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <span className="text-[17px] font-medium text-black">
                  게시일 <span style={{ color: '#6366F1' }}>*</span>
                </span>
                <button
                  onClick={() => setShowPostingDateCalendar(true)}
                  className="w-full text-left active:opacity-70"
                  style={{ border: '1px solid #E8E7E4', borderRadius: 10, padding: '14px 20px' }}
                >
                  <span className="text-[16px] font-medium" style={{ color: postingDate ? '#1C1A17' : '#D4D2CE' }}>
                    {postingDate || 'YYYY.MM.DD'}
                  </span>
                </button>
              </div>
              <span className="text-[14px] font-medium" style={{ color: '#D4D2CE' }}>
                콘텐츠가 실제로 업로드된 날짜
              </span>
            </div>
            {showPostingDateCalendar && (
              <CalendarSheet
                value={postingDate ? postingDate.replace(/\./g, '-') : ''}
                onChange={v => setPostingDate(v.replace(/-/g, '.'))}
                onClose={() => setShowPostingDateCalendar(false)}
              />
            )}

            {/* 캡션에 UTM 링크 포함 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span className="text-[17px] font-medium text-black">캡션 UTM 링크 포함</span>
              <button
                onClick={() => setCaptionHasUtm(v => !v)}
                className="flex items-center justify-between w-full active:opacity-70"
                style={{ border: `1px solid ${captionHasUtm ? '#A5A8F5' : '#E8E7E4'}`, borderRadius: 10, padding: '14px 20px', backgroundColor: captionHasUtm ? 'rgba(221,223,253,0.15)' : '#FFFFFF', transition: 'all 0.2s' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 3 }}>
                  <span className="text-[15px] font-semibold" style={{ color: captionHasUtm ? '#6366F1' : '#78756E' }}>
                    {captionHasUtm ? '포함' : '미포함'}
                  </span>
                  <span className="text-[13px]" style={{ color: '#B0ADA7' }}>
                    캡션에 UTM 파라미터가 있나요?
                  </span>
                </div>
                <div
                  className="shrink-0 flex items-center"
                  style={{ width: 52, height: 30, borderRadius: 40, padding: 3, backgroundColor: captionHasUtm ? '#6366F1' : '#E8E7E4', transition: 'background-color 0.2s', justifyContent: captionHasUtm ? 'flex-end' : 'flex-start', display: 'flex' }}
                >
                  <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                </div>
              </button>
            </div>

            {/* 정산 금액 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span className="text-[17px] font-medium text-black">
                정산 금액 <span className="text-[14px] font-normal" style={{ color: '#B0ADA7' }}>(선택)</span>
              </span>
              <div className="flex items-center" style={{ border: '1px solid #E8E7E4', borderRadius: 10, padding: '10px 20px' }}>
                <input
                  value={settlementAmount}
                  onChange={e => {
                    const raw = e.target.value.replace(/[^0-9]/g, '');
                    setSettlementAmount(raw ? Number(raw).toLocaleString('ko-KR') : '');
                  }}
                  placeholder="0"
                  inputMode="numeric"
                  className="flex-1 bg-transparent outline-none text-[16px] font-medium"
                  style={{ color: '#1C1A17' }}
                />
                <span className="text-[16px] font-semibold shrink-0" style={{ color: '#78756E' }}>원</span>
              </div>
            </div>
          </div>
        )}

        <div className="h-[10px] bg-[#F5F5F3]" />

        {/* 시안 (접힘) */}
        <div className="bg-white" style={{ display: 'flex', flexDirection: 'column' }}>
          <button
            onClick={() => setRvDraftExpanded(v => !v)}
            className="flex items-center justify-between w-full active:opacity-70"
            style={{ padding: '24px 20px' }}
          >
            <span className="text-[20px] font-bold text-black">시안</span>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
              style={{ transform: rvDraftExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
              <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="#899098" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {rvDraftExpanded && (
            <div style={{ padding: '0 20px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button
                onClick={() => { setOverlayMode('review'); setShowDraftOverlay(true); }}
                className="flex items-center justify-between px-5 py-4 rounded-[14px] w-full active:opacity-70"
                style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[10px] bg-white flex items-center justify-center shrink-0" style={{ border: '1px solid #EBEEF7' }}>
                    {draftType === 'file' ? (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M5 2.5h7l4 4v11a1 1 0 01-1 1H5a1 1 0 01-1-1v-14a1 1 0 011-1z" stroke="#22c55e" strokeWidth="1.3" fill="none"/>
                        <path d="M12 2.5V7H16.5" stroke="#22c55e" strokeWidth="1.3" strokeLinecap="round"/>
                        <path d="M7 11h6M7 13.5h4" stroke="#22c55e" strokeWidth="1.2" strokeLinecap="round"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M13 3h4v4M10 10l7-7M9 5H5a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1v-4" stroke="#22c55e" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-[14px] font-semibold" style={{ color: '#1C1A17' }}>
                      {draftType === 'file' ? '시안_파일.mp4' : (driveLink.length > 26 ? driveLink.slice(0, 26) + '…' : driveLink)}
                    </p>
                    <p className="text-[13px] font-medium" style={{ color: '#22c55e' }}>승인 완료</p>
                  </div>
                </div>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                  <path d="M6 3l5 5-5 5" stroke="#899098" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          )}
        </div>

        <div className="h-[10px] bg-[#F5F5F3]" />

        {/* 개인 UTM 링크 (접힘) */}
        {(() => {
          const handle = data.handle.replace('@', '');
          const shortId = handle.slice(0, 6).padEnd(6, '0');
          const shortLink = `https://lumi.re/${shortId}`;
          return (
            <div className="bg-white" style={{ display: 'flex', flexDirection: 'column' }}>
              <button
                onClick={() => setRvUtmExpanded(v => !v)}
                className="flex items-center justify-between w-full active:opacity-70"
                style={{ padding: '24px 20px' }}
              >
                <span className="text-[20px] font-bold text-black">개인 UTM 링크</span>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
                  style={{ transform: rvUtmExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                  <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="#899098" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {rvUtmExpanded && (
                <div style={{ padding: '0 20px 24px' }}>
                  <div style={{ border: '1px solid #EBEEF7', borderRadius: 14, overflow: 'hidden' }}>
                    <div className="flex items-center justify-between px-5 py-4" style={{ gap: 12, backgroundColor: '#FAFAFC' }}>
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
                          <path d="M6.5 9.5a3.5 3.5 0 005 0l2-2a3.5 3.5 0 00-5-5l-1 1" stroke="#6366F1" strokeWidth="1.4" strokeLinecap="round"/>
                          <path d="M9.5 6.5a3.5 3.5 0 00-5 0l-2 2a3.5 3.5 0 005 5l1-1" stroke="#6366F1" strokeWidth="1.4" strokeLinecap="round"/>
                        </svg>
                        <span className="text-[16px] font-bold truncate" style={{ color: '#6366F1', fontFamily: 'Manrope, sans-serif' }}>{shortLink}</span>
                      </div>
                      <button
                        onClick={async () => { await navigator.clipboard.writeText(shortLink).catch(() => {}); setUtmCopied(true); setTimeout(() => setUtmCopied(false), 2000); }}
                        className="shrink-0 flex items-center justify-center active:opacity-70"
                        style={{ backgroundColor: utmCopied ? '#6366F1' : '#EEEEFF', borderRadius: 8, padding: '8px 14px', transition: 'background-color 0.15s' }}
                      >
                        <span className="text-[13px] font-semibold" style={{ color: utmCopied ? '#fff' : '#6366F1' }}>{utmCopied ? '복사됨' : '복사'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        <div className="h-[10px] bg-[#F5F5F3]" />

        {/* 협의 정보 (접힘) */}
        <div className="bg-white" style={{ display: 'flex', flexDirection: 'column' }}>
          <button
            onClick={() => setRvNegInfoExpanded(v => !v)}
            className="flex items-center justify-between w-full active:opacity-70"
            style={{ padding: '24px 20px' }}
          >
            <span className="text-[20px] font-bold text-black">협의 정보</span>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
              style={{ transform: rvNegInfoExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
              <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="#899098" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {rvNegInfoExpanded && (
            <div style={{ padding: '0 20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ border: '1px solid #EBEEF7', borderRadius: 14, overflow: 'hidden', backgroundColor: '#F8FAFF' }}>
                <div className="grid grid-cols-2">
                  <div className="flex flex-col" style={{ gap: 2, padding: '24px 22px 18px', backgroundColor: '#FAFAFC' }}>
                    <p className="text-[14px] font-medium leading-[135%]" style={{ color: '#78756E' }}>협의 단가</p>
                    <p className="text-[19px] font-bold leading-[135%]" style={{ fontFamily: 'Manrope, sans-serif', color: '#1C1A17' }}>
                      {negotiationPrice ? `${negotiationPrice}원` : '-'}
                    </p>
                  </div>
                  <div className="flex flex-col" style={{ gap: 2, padding: '24px 22px 18px', backgroundColor: '#FAFAFC' }}>
                    <p className="text-[14px] font-medium leading-[135%]" style={{ color: '#78756E' }}>콘텐츠 형식</p>
                    <p className="text-[19px] font-semibold leading-[135%]" style={{ color: '#1C1A17' }}>릴스 1건</p>
                  </div>
                  <div className="flex flex-col" style={{ gap: 2, padding: '18px 22px 24px', backgroundColor: '#FAFAFC' }}>
                    <p className="text-[14px] font-medium leading-[135%]" style={{ color: '#78756E' }}>시안 전달 예정일</p>
                    <p className="text-[19px] font-bold leading-[135%]" style={{ fontFamily: 'Manrope, sans-serif', color: '#1C1A17' }}>
                      {draftDeadline ? draftDeadline.replace(/-/g, '.') : '-'}
                    </p>
                  </div>
                  <div className="flex flex-col" style={{ gap: 2, padding: '18px 22px 24px', backgroundColor: '#FAFAFC' }}>
                    <p className="text-[14px] font-medium leading-[135%]" style={{ color: '#78756E' }}>플랫폼</p>
                    <p className="text-[19px] font-semibold leading-[135%]" style={{ color: '#1C1A17' }}>인스타그램</p>
                  </div>
                </div>
              </div>
              <div style={{ border: '1px solid #E8E7E4', borderRadius: 14, padding: '14px 20px' }}>
                <div className="flex items-start justify-between" style={{ gap: 12 }}>
                  <span className="text-[14px] font-medium shrink-0" style={{ color: '#78756E' }}>배송 주소</span>
                  <span className="text-[14px] font-medium text-right" style={{ color: '#1C1A17' }}>
                    {deliveryAddress || '서울 강남구 테헤란로 635, 3층'}
                  </span>
                </div>
              </div>
              <div style={{ border: '1px solid #E8E7E4', borderRadius: 14, padding: 20 }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center" style={{ gap: 10 }}>
                    <img src="/ship-icon.svg" alt="배송" width={52} height={52} className="shrink-0" />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <span className="text-[16px] font-semibold" style={{ color: '#1C1A17' }}>제품 배송 완료</span>
                      <span className="text-[14px] font-medium" style={{ color: '#B0ADA7' }}>인플루언서에게 제품을 발송했나요?</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setProductShipped(v => !v)}
                    className="shrink-0 active:opacity-80 flex items-center"
                    style={{ width: 52, height: 30, borderRadius: 40, padding: 3, backgroundColor: productShipped ? '#6366F1' : '#E8E7E4', transition: 'background-color 0.2s', justifyContent: productShipped ? 'flex-end' : 'flex-start', display: 'flex' }}
                  >
                    <div style={{ width: 24, height: 24, borderRadius: '50%', backgroundColor: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="h-[10px] bg-[#F5F5F3]" />

        {/* 발송된 브리프 (접힘) */}
        <div className="bg-white" style={{ display: 'flex', flexDirection: 'column' }}>
          <button
            onClick={() => setRvBriefExpanded(v => !v)}
            className="flex items-center justify-between w-full active:opacity-70"
            style={{ padding: '24px 20px' }}
          >
            <span className="text-[20px] font-bold text-black">발송된 브리프</span>
            <div className="flex items-center gap-2">
              <div className="w-[36px] bg-[#6366F1] rounded-[7px] flex items-center justify-center py-[3px]">
                <span className="text-[16px] font-bold text-white" style={{ fontFamily: 'Manrope, sans-serif' }}>AI</span>
              </div>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
                style={{ transform: rvBriefExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="#899098" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </button>
          {rvBriefExpanded && (
            <div style={{ padding: '0 20px 24px' }}>
              <div className="border border-[#ECECEF] rounded-[14px] overflow-hidden">
                <div className="bg-white px-5 py-[14px]">
                  <p className="text-[16px] font-medium whitespace-pre-wrap text-[#1C1A17] leading-[150%]">
                    {editedBrief ?? data.brief ?? BRIEF_VARIANTS[0]}
                  </p>
                </div>
                <div className="border-t border-[#ECECEF]">
                  <button onClick={handleCopyBrief} className="w-full py-[15px] flex items-center justify-center bg-[#F8FAFF] active:opacity-70">
                    <span className="text-[16px] font-medium text-black">{briefCopied ? '복사됨 ✓' : '복사하기'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="h-[10px] bg-[#F5F5F3]" />

        {/* 협업 이력 (접힘) */}
        <div className="bg-white" style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            className="flex items-center justify-between w-full active:opacity-70"
            onClick={() => setCollabHistoryExpanded(v => !v)}
            style={{ padding: '24px 20px', cursor: 'pointer' }}
          >
            <span className="text-[20px] font-bold text-black">협업 이력</span>
            <div className="flex items-center gap-[6px]">
              {data.isFirstCollab && (
                <span className="text-[14px] font-medium" style={{ backgroundColor: '#EEEEFF', color: '#3D3FC7', borderRadius: 50, padding: '4px 8px' }}>
                  첫 협업
                </span>
              )}
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
                style={{ transform: collabHistoryExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="#899098" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          {collabHistoryExpanded && (
            <div style={{ padding: '0 20px 24px' }}>
              <div className="flex flex-col items-center text-center" style={{ backgroundColor: '#F8F8FF', borderRadius: 14, padding: 22, gap: 6 }}>
                {data.isFirstCollab ? (
                  <>
                    <span className="text-[16px] font-medium" style={{ color: '#6D6E8C', lineHeight: '140%' }}>첫 협업 인플루언서예요!</span>
                    <span className="text-[16px] font-medium" style={{ color: '#6D6E8C', lineHeight: '140%' }}>
                      이번 캠페인 성과가{' '}
                      <span className="font-bold" style={{ color: '#6366F1' }}>첫 이력으로 기록</span>
                      됩니다.
                    </span>
                  </>
                ) : (
                  <span className="text-[16px] font-medium" style={{ color: '#6D6E8C', lineHeight: '140%' }}>이전 협업 이력이 없어요.</span>
                )}
              </div>
            </div>
          )}
        </div>

        </> /* end reviewing/uploaded */}

        <div className="h-[10px] bg-[#F5F5F3]" />

        {/* ── 협업 이력 ── */}
        {effectiveStage !== 'reviewing' && effectiveStage !== 'uploaded' && (
        <div className="bg-white" style={{ padding: '30px 20px', gap: 20, display: 'flex', flexDirection: 'column' }}>
          <div
            className="flex items-center justify-between"
            onClick={() => {
              if (effectiveStage === 'contacting' || effectiveStage === 'negotiating') {
                setCollabHistoryExpanded(v => !v);
              }
            }}
            style={(effectiveStage === 'contacting' || effectiveStage === 'negotiating') ? { cursor: 'pointer' } : {}}
          >
            <span className="text-[20px] font-bold text-black">협업 이력</span>
            {data.isFirstCollab && (
              <div className="flex items-center gap-[6px]">
                <span
                  className="text-[14px] font-medium"
                  style={{ backgroundColor: '#EEEEFF', color: '#3D3FC7', borderRadius: 50, padding: '4px 8px' }}
                >
                  첫 협업
                </span>
                {(effectiveStage === 'contacting' || effectiveStage === 'negotiating') && (
                  <svg
                    width="18" height="18" viewBox="0 0 18 18" fill="none"
                    style={{ transform: collabHistoryExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
                  >
                    <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="#899098" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            )}
          </div>

          {collabHistoryExpanded && (
            <div
              className="flex flex-col items-center text-center"
              style={{ backgroundColor: '#F8F8FF', borderRadius: 14, padding: 22, gap: 6 }}
            >
              {data.isFirstCollab ? (
                <>
                  <span className="text-[16px] font-medium" style={{ color: '#6D6E8C', lineHeight: '140%' }}>
                    첫 협업 인플루언서예요!
                  </span>
                  <span className="text-[16px] font-medium" style={{ color: '#6D6E8C', lineHeight: '140%' }}>
                    이번 캠페인 성과가{' '}
                    <span className="font-bold" style={{ color: '#6366F1' }}>첫 이력으로 기록</span>
                    됩니다.
                  </span>
                </>
              ) : (
                <span className="text-[16px] font-medium" style={{ color: '#6D6E8C', lineHeight: '140%' }}>
                  이전 협업 이력이 없어요.
                </span>
              )}
            </div>
          )}
        </div>
        )}

        {(effectiveStage !== 'reviewing' && effectiveStage !== 'uploaded') && (
          <div className="h-[10px] bg-[#F5F5F3]" />
        )}

        {/* ── 메모 ── */}
        <div className="bg-white" style={{ padding: '30px 20px 80px', gap: 20, display: 'flex', flexDirection: 'column' }}>
          <span className="text-[20px] font-bold text-black">메모</span>

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
          style={{ bottom: 160, backgroundColor: '#1C1A17' }}
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
        style={{ borderTop: '1px solid #E8E7E4', padding: 20, paddingBottom: 'max(16px, env(safe-area-inset-bottom))', gap: 10 }}
      >
        {effectiveStage === 'uploaded' ? (
          <button
            onClick={() => router.push('/performance')}
            className="w-full flex items-center justify-center active:opacity-80"
            style={{ backgroundColor: '#2E2C28', borderRadius: 12, padding: 16 }}
          >
            <span className="text-[16px] font-bold text-white">인플루언서별 성과 보기</span>
          </button>
        ) : effectiveStage === 'reviewing' ? (
          <>
            {(!postingUrl.trim() || !postingDate.trim()) && (
              <p className="text-center text-[13px] font-medium" style={{ color: '#B0ADA7' }}>
                포스팅 URL과 게시일을 입력해야 이동할 수 있어요
              </p>
            )}
            <button
              onClick={() => postingUrl.trim() && postingDate.trim() && router.push('/board?tab=uploaded')}
              className="w-full flex items-center justify-center active:opacity-80"
              style={{
                backgroundColor: postingUrl.trim() && postingDate.trim() ? '#2E2C28' : '#D4D2CE',
                borderRadius: 12, padding: 16,
              }}
            >
              <span className="text-[16px] font-bold text-white">업로드 완료로 이동</span>
            </button>
            <button className="w-full flex items-center justify-center active:opacity-60">
              <span className="text-[16px] font-medium" style={{ color: '#B7B7B7' }}>임시 저장</span>
            </button>
          </>
        ) : effectiveStage === 'negotiating' ? (
          <>
            {draftReviewState !== 'approved' && (
              <p className="text-center text-[13px] font-medium" style={{ color: '#B0ADA7' }}>
                시안을 검토하고 승인해야 이동할 수 있어요
              </p>
            )}
            <button
              onClick={() => draftReviewState === 'approved' && router.push('/board?tab=inProgress')}
              className="w-full flex items-center justify-center active:opacity-80"
              style={{
                backgroundColor: draftReviewState === 'approved' ? '#2E2C28' : '#D4D2CE',
                borderRadius: 12, padding: 16,
              }}
            >
              <span className="text-[16px] font-bold text-white">시안 확인 단계로 이동</span>
            </button>
            <button className="w-full flex items-center justify-center active:opacity-60">
              <span className="text-[16px] font-medium" style={{ color: '#B7B7B7' }}>임시 저장</span>
            </button>
          </>
        ) : effectiveStage === 'contacting' ? (
          <>
            <button
              onClick={() => setShowTransitionSheet(true)}
              className="w-full flex items-center justify-center active:opacity-80"
              style={{ backgroundColor: '#2E2C28', borderRadius: 12, padding: 16 }}
            >
              <span className="text-[16px] font-bold text-white">협의 확정하기</span>
            </button>
            <button className="w-full flex items-center justify-center active:opacity-60">
              <span className="text-[16px] font-medium" style={{ color: '#B7B7B7' }}>임시 저장</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setShowTransitionSheet(true)}
              className="w-full flex items-center justify-center active:opacity-80"
              style={{ backgroundColor: '#2E2C28', borderRadius: 12, padding: 16 }}
            >
              <span className="text-[16px] font-bold text-white">발송 완료</span>
            </button>
            <button className="w-full flex items-center justify-center active:opacity-60">
              <span className="text-[16px] font-medium" style={{ color: '#B7B7B7' }}>임시 저장</span>
            </button>
          </>
        )}
      </div>

      {/* ── 단계 이동 바텀시트 ── */}
      {showTransitionSheet && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" style={{ maxWidth: 430, margin: '0 auto' }}>
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowTransitionSheet(false)} />
          <div className="relative bg-white rounded-t-[20px] px-5 pt-5 pb-8 max-h-[85vh] overflow-y-auto">

            {/* ── 리스트업 → 컨택 ── */}
            {effectiveStage === 'list-up' && (() => {
              const canAdvance = dmSent;
              return (
                <>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[16px] font-bold text-[#1C1A17]">컨택 단계로 이동</span>
                    <button onClick={() => setShowTransitionSheet(false)} className="active:opacity-60">
                      <X size={22} className="text-stone-500" />
                    </button>
                  </div>
                  {/* DM 발송 완료 체크 */}
                  <button
                    onClick={() => setDmSent(v => !v)}
                    className="w-full flex items-center gap-3 p-4 rounded-[12px] mb-5 active:opacity-70"
                    style={{ border: `1px solid ${dmSent ? '#6366F1' : '#E8E7E4'}`, backgroundColor: dmSent ? '#EEEEFF' : '#FAFBFE' }}
                  >
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                      style={{ backgroundColor: dmSent ? '#6366F1' : '#E8E7E4' }}
                    >
                      {dmSent && <Check size={14} className="text-white" strokeWidth={2.5} />}
                    </div>
                    <span className="text-[16px] font-medium text-[#1C1A17]">브리프 발송 완료</span>
                  </button>
                  {/* 발송 채널 */}
                  <div className="mb-6">
                    <p className="text-[15px] font-semibold text-[#1C1A17] mb-3">발송 채널</p>
                    <div className="flex gap-2">
                      {(['DM', '이메일', '카카오톡'] as const).map(ch => (
                        <button
                          key={ch}
                          onClick={() => setDmChannel(ch)}
                          className="flex-1 py-3 rounded-[10px] text-[15px] font-medium active:opacity-70"
                          style={{
                            border: `1px solid ${dmChannel === ch ? '#6366F1' : '#E8E7E4'}`,
                            backgroundColor: dmChannel === ch ? '#EEEEFF' : '#FFFFFF',
                            color: dmChannel === ch ? '#6366F1' : '#78756E',
                          }}
                        >
                          {ch}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowTransitionSheet(false);
                      setShowToast(true);
                      setTimeout(() => router.push(`/board?tab=contacting&sent=${id}`), 1500);
                    }}
                    disabled={!canAdvance}
                    className="w-full py-4 rounded-[12px] text-[16px] font-bold text-white active:opacity-80"
                    style={{ backgroundColor: canAdvance ? '#2E2C28' : '#D4D2CE' }}
                  >
                    컨택 단계로 이동
                  </button>
                </>
              );
            })()}

            {/* ── 컨택 → 협의중 ── */}
            {effectiveStage === 'contacting' && (() => {
              const canAdvance = !!negotiationPrice && !!draftDeadline;
              return (
                <>
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[16px] font-bold text-[#1C1A17]">협의중 단계로 이동</span>
                    <button onClick={() => setShowTransitionSheet(false)} className="active:opacity-60">
                      <X size={22} className="text-stone-500" />
                    </button>
                  </div>
                  {/* 협의 단가 */}
                  <div className="mb-5">
                    <p className="text-[15px] font-semibold text-[#1C1A17] mb-2">협의 단가 <span style={{ color: '#6366F1' }}>*</span></p>
                    <div className="flex items-center border border-[#E8E7E4] rounded-[10px] px-5 h-[52px] bg-white">
                      <input
                        value={negotiationPrice}
                        onChange={e => {
                          const raw = e.target.value.replace(/[^0-9]/g, '');
                          setNegotiationPrice(raw ? Number(raw).toLocaleString('ko-KR') : '');
                        }}
                        placeholder="예: 300,000"
                        inputMode="numeric"
                        className="flex-1 text-[16px] font-medium text-[#1C1A17] outline-none placeholder:text-[#C7C4BE]"
                      />
                      <span className="text-[#78756E] text-[16px] font-semibold shrink-0">원</span>
                    </div>
                  </div>
                  {/* 시안 전달 예정일 */}
                  <div className="mb-5">
                    <p className="text-[15px] font-semibold text-[#1C1A17] mb-2">시안 전달 예정일 <span style={{ color: '#6366F1' }}>*</span></p>
                    <TransitionDateBox
                      value={draftDeadline}
                      onChange={setDraftDeadline}
                      placeholder="날짜 선택"
                    />
                  </div>
                  {/* UTM 안내 */}
                  <div className="flex items-start gap-2 mb-6 rounded-[12px] px-4 py-3" style={{ backgroundColor: '#EEF7FF' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-[1px]">
                      <circle cx="8" cy="8" r="7" stroke="#2D92FE" strokeWidth="1.3"/>
                      <path d="M8 7v4" stroke="#2D92FE" strokeWidth="1.3" strokeLinecap="round"/>
                      <circle cx="8" cy="5.5" r="0.6" fill="#2D92FE"/>
                    </svg>
                    <span className="text-[13px] font-semibold" style={{ color: '#2D92FE', lineHeight: '140%' }}>
                      협의 확정 시 인플루언서 고유 UTM 링크가 자동 생성됩니다.
                    </span>
                  </div>
                  <button
                    onClick={() => { setShowTransitionSheet(false); router.push('/board?tab=negotiated'); }}
                    disabled={!canAdvance}
                    className="w-full py-4 rounded-[12px] text-[16px] font-bold text-white active:opacity-80"
                    style={{ backgroundColor: canAdvance ? '#2E2C28' : '#D4D2CE' }}
                  >
                    협의중 단계로 이동
                  </button>
                </>
              );
            })()}



          </div>
        </div>
      )}

      {/* ── 브리프 수정 오버레이 (portal) ── */}
      {mounted && isEditingBrief && createPortal(
        <>
          <div className="fixed inset-0 z-50 bg-white" />
          <div className="fixed inset-x-0 top-0 z-[60] h-[56px] flex items-center justify-between px-5 bg-white border-b border-[#E8E7E4]">
            <span className="text-[16px] font-semibold text-black">브리프 수정</span>
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
            <span className="text-[16px] font-semibold text-black">개별 요청사항</span>
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
      {mounted && showMemoOverlay && createPortal(
        <>
          <div className="fixed inset-0 z-50 bg-white" />
          <div className="fixed inset-x-0 top-0 z-[60] h-[56px] flex items-center justify-between px-5 bg-white border-b border-[#E8E7E4]">
            <span className="text-[16px] font-semibold text-black">메모</span>
            <button
              onClick={() => {
                const val = memoTextareaRef.current?.value.trim() ?? '';
                if (val) {
                  const now = new Date();
                  const dateStr = `${now.getFullYear()}.${String(now.getMonth()+1).padStart(2,'0')}.${String(now.getDate()).padStart(2,'0')} 작성`;
                  setMemos(prev => [{ text: val, date: dateStr }, ...prev]);
                  setMemoInput('');
                }
                setShowMemoOverlay(false);
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
                ref={memoTextareaRef}
                defaultValue={memoInput}
                autoFocus
                placeholder="인플루언서에 대해 기억해두고 싶은 내용을 기록해보세요"
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

      {/* ── 시안 검토 오버레이 (portal) ── */}
      {mounted && showDraftOverlay && createPortal(
        <>
          <div className="fixed inset-0 z-50 bg-white" />

          {/* Header */}
          <div className="fixed inset-x-0 top-0 z-[60] h-[56px] flex items-center justify-between px-5 bg-white border-b border-[#E8E7E4]">
            <span className="text-[16px] font-bold text-black">시안 검토</span>
            <button
              onClick={() => { setShowDraftOverlay(false); setOverlayMode('review'); setRevisionText(''); }}
              className="w-[36px] h-[36px] flex items-center justify-center rounded-full active:opacity-60"
              style={{ backgroundColor: '#F2F4F6' }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 3l10 10M13 3L3 13" stroke="#78756E" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </button>
          </div>

          {/* Scrollable body */}
          <div
            className="fixed inset-x-0 z-[60] overflow-y-auto bg-white"
            style={{ top: '56px', bottom: '100px', WebkitOverflowScrolling: 'touch' as const, overscrollBehavior: 'contain' }}
          >
            <div className="p-5 flex flex-col gap-5 pb-8">

              {/* File/link card preview */}
              <div
                className="flex items-center gap-3 px-5 py-4 rounded-[14px]"
                style={{
                  backgroundColor: draftReviewState === 'approved' ? '#F0FDF4' : '#F0F2FF',
                  border: `1px solid ${draftReviewState === 'approved' ? '#BBF7D0' : '#C7C9F5'}`,
                }}
              >
                <div className="w-10 h-10 rounded-[10px] bg-white flex items-center justify-center shrink-0"
                  style={{ border: '1px solid #EBEEF7' }}>
                  {draftType === 'file' ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M5 2.5h7l4 4v11a1 1 0 01-1 1H5a1 1 0 01-1-1v-14a1 1 0 011-1z"
                        stroke={draftReviewState === 'approved' ? '#22c55e' : '#6366F1'} strokeWidth="1.3" fill="none"/>
                      <path d="M12 2.5V7H16.5"
                        stroke={draftReviewState === 'approved' ? '#22c55e' : '#6366F1'} strokeWidth="1.3" strokeLinecap="round"/>
                      <path d="M7 11h6M7 13.5h4"
                        stroke={draftReviewState === 'approved' ? '#22c55e' : '#6366F1'} strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M13 3h4v4M10 10l7-7M9 5H5a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1v-4"
                        stroke={draftReviewState === 'approved' ? '#22c55e' : '#6366F1'} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-[14px] font-semibold" style={{ color: '#1C1A17' }}>
                    {draftType === 'file' ? '시안_파일.mp4' : (driveLink.length > 30 ? driveLink.slice(0, 30) + '…' : driveLink)}
                  </p>
                  <p className="text-[12px] font-medium mt-[2px]"
                    style={{ color: draftReviewState === 'approved' ? '#22c55e' : '#8486F3' }}>
                    {draftReviewState === 'approved' ? '✓ 승인됨' : '검토 중'}
                  </p>
                </div>
              </div>

              {/* Revision history */}
              {revisionHistory.length > 0 && (
                <div className="flex flex-col gap-3">
                  <span className="text-[16px] font-bold text-black">수정 요청 이력</span>
                  {revisionHistory.map((item, i) => (
                    <div key={i} className="flex flex-col gap-2 px-5 py-4 rounded-[14px]"
                      style={{ backgroundColor: '#FEF6F1', border: '1px solid #FDDEC8' }}>
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-semibold" style={{ color: '#EF8652' }}>{item.round}차 수정 요청</span>
                        <span className="text-[12px] font-medium" style={{ color: '#B0ADA7' }}>{item.date}</span>
                      </div>
                      <p className="text-[14px] font-medium whitespace-pre-line" style={{ color: '#705448', lineHeight: '145%' }}>{item.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Requesting mode: warning banner + textarea */}
              {overlayMode === 'requesting' && (
                <>
                  <div className="flex items-start gap-2 px-4 py-3 rounded-[12px]"
                    style={{ backgroundColor: '#EEF7FF', border: '1px solid #BFDBFE' }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 mt-[2px]">
                      <circle cx="8" cy="8" r="7" stroke="#2D92FE" strokeWidth="1.4"/>
                      <path d="M8 7v3.5" stroke="#2D92FE" strokeWidth="1.4" strokeLinecap="round"/>
                      <circle cx="8" cy="5" r="0.7" fill="#2D92FE"/>
                    </svg>
                    <span className="text-[13px] font-medium" style={{ color: '#1D4ED8', lineHeight: '135%' }}>
                      수정 요청 내용을 기록해두세요. DM은 직접 인플루언서에게 전달해 주세요.
                    </span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-[15px] font-semibold" style={{ color: '#1C1A17' }}>수정 요청 내용</span>
                    <textarea
                      value={revisionText}
                      onChange={e => setRevisionText(e.target.value)}
                      placeholder="수정이 필요한 부분을 구체적으로 입력해 주세요"
                      rows={5}
                      autoFocus
                      className="w-full outline-none resize-none text-[16px] font-medium"
                      style={{
                        backgroundColor: '#FAFAFA',
                        border: '1px solid #E8E7E4',
                        borderRadius: 12,
                        padding: '14px 16px',
                        color: '#1C1A17',
                        lineHeight: '1.6',
                      }}
                    />
                  </div>
                </>
              )}

            </div>
          </div>

          {/* Footer action buttons */}
          <div
            className="fixed inset-x-0 bottom-0 z-[60] bg-white"
            style={{ borderTop: '1px solid #E8E7E4', padding: '16px 20px 36px' }}
          >
            {overlayMode === 'requesting' ? (
              <div className="flex gap-3">
                <button
                  onClick={() => { setOverlayMode('review'); setRevisionText(''); }}
                  className="flex-1 flex items-center justify-center active:opacity-80"
                  style={{ border: '1.5px solid #E8E7E4', borderRadius: 12, padding: 16 }}
                >
                  <span className="text-[16px] font-bold" style={{ color: '#78756E' }}>취소</span>
                </button>
                <button
                  onClick={() => {
                    if (!revisionText.trim()) return;
                    const now = new Date();
                    const dateStr = `${now.getFullYear()}.${String(now.getMonth()+1).padStart(2,'0')}.${String(now.getDate()).padStart(2,'0')}`;
                    setRevisionHistory(prev => [...prev, { text: revisionText.trim(), date: dateStr, round: prev.length + 1 }]);
                    setDraftReviewState('revision-sent');
                    setRevisionText('');
                    setOverlayMode('review');
                    setShowDraftOverlay(false);
                  }}
                  className="flex-1 flex items-center justify-center active:opacity-80"
                  style={{
                    backgroundColor: revisionText.trim() ? '#2E2C28' : '#E8E7E4',
                    borderRadius: 12, padding: 16,
                    transition: 'background-color 0.15s',
                  }}
                >
                  <span className="text-[16px] font-bold" style={{ color: revisionText.trim() ? '#FFFFFF' : '#B0ADA7' }}>수정 요청 기록</span>
                </button>
              </div>
            ) : draftReviewState === 'approved' ? (
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => setShowDraftOverlay(false)}
                  className="w-full flex items-center justify-center active:opacity-80"
                  style={{ backgroundColor: '#2E2C28', borderRadius: 12, padding: 16 }}
                >
                  <span className="text-[16px] font-bold text-white">닫기</span>
                </button>
                <button
                  onClick={() => setDraftReviewState('has-draft')}
                  className="w-full flex items-center justify-center active:opacity-60"
                >
                  <span className="text-[14px] font-medium" style={{ color: '#B0ADA7' }}>승인 취소하기</span>
                </button>
              </div>
            ) : draftReviewState === 'revision-sent' ? (
              <button
                onClick={() => setShowDraftOverlay(false)}
                className="w-full flex items-center justify-center active:opacity-80"
                style={{ backgroundColor: '#2E2C28', borderRadius: 12, padding: 16 }}
              >
                <span className="text-[16px] font-bold text-white">닫기</span>
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => setOverlayMode('requesting')}
                  className="flex-1 flex items-center justify-center active:opacity-80"
                  style={{ border: '1.5px solid #6366F1', borderRadius: 12, padding: 16 }}
                >
                  <span className="text-[16px] font-bold" style={{ color: '#6366F1' }}>수정 요청</span>
                </button>
                <button
                  onClick={() => { setDraftReviewState('approved'); setShowDraftOverlay(false); }}
                  className="flex-1 flex items-center justify-center active:opacity-80"
                  style={{ backgroundColor: '#6366F1', borderRadius: 12, padding: 16 }}
                >
                  <span className="text-[16px] font-bold text-white">승인</span>
                </button>
              </div>
            )}
          </div>
        </>,
        document.body
      )}

    </div>
  );
}
