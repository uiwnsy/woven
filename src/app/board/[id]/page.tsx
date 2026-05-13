'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react';
import {
  ChevronLeft, MoreHorizontal, ChevronDown, ChevronUp,
  Copy, Check, Plus, ThumbsUp, X, Clock, Play, Paperclip,
} from 'lucide-react';

type Stage = 'list-up' | 'contacting' | 'negotiating' | 'reviewing' | 'uploaded';
type ResponseStatus = 'positive' | 'declined' | 'no-response' | null;
type ContactLog = { date: string; event: string };

type InfluencerDetail = {
  id: string; name: string; handle: string;
  followers: string; posts: string;
  categories: string[]; profileImg?: string;
  stage: Stage; campaignName: string; dDay: string; platform: string;
  brief: string; contactHistory: ContactLog[]; memo?: string;
  negotiationPrice?: number; contentFormat?: string;
  draftDueDate?: string; deliveryDone?: boolean;
  hasDraftFile?: boolean;
  postingUrl?: string; postDate?: string;
  settlementAmount?: number; paymentStatus?: string;
};

const STAGES = [
  { id: 'list-up', label: '리스트업' },
  { id: 'contacting', label: '컨택' },
  { id: 'negotiating', label: '협의중' },
  { id: 'reviewing', label: '시안확인' },
  { id: 'uploaded', label: '업로드' },
];

const PAOOAR_BRIEF = `안녕하세요 paooar님 😊\n\n루미에르에서 새로운 봄봄 스킨케어 업제인에 함께할 크리에이터를 찾고 있어요. paooar님의 뷰티 콘텐츠를 보고 저희 톤과 잘 맞을 것 같아 연락드렸어요!\n\n💄 제품\n루미에르 선블락 크림 (신제품)`;
const PAOOAR_MEMO = '이전 캠페인 ROAS 3.2x. 릴스 편집 퀄리티 좋음. 이번 단가 35만원으로\n2026.04.10 작성';
const PAOOAR_HISTORY = [
  { date: '2026.04.10', event: '캠페인에 추가됨' },
  { date: '2026.04.11', event: '인스타그램 DM 발송 완료' },
  { date: '2026.04.14', event: '긍정 응답 수신' },
];

const MOCK_DETAILS: Record<string, InfluencerDetail> = {
  '1': {
    id: '1', name: 'haye0', handle: '@haye0', followers: '24.5만', posts: '1,842',
    categories: ['뷰티', '패션'], profileImg: 'https://i.pravatar.cc/150?img=1',
    stage: 'contacting', campaignName: '루미에르 · 봄봄 프로모션', dDay: 'D+26', platform: '인스타그램',
    brief: `안녕하세요 haye0님 😊\n\n루미에르에서 새로운 스킨케어 업제인에 함께할 크리에이터를 찾고 있어요!\n\n💄 제품\n루미에르 선블락 크림 (신제품)`,
    contactHistory: [{ date: '2026.04.15 14:32', event: '인스타그램 DM 발송 완료' }],
    memo: '뷰티 뷰어 콘텐츠 퀄리티 높음\n피드 대비 참여율 상위권, 릴스 편집 스타일이 브랜드 톤에 잘 맞음',
    negotiationPrice: 300000, contentFormat: '릴스 1건', draftDueDate: '2026.05.15', deliveryDone: false,
  },
  '2': {
    id: '2', name: 'zigoo', handle: '@zigoo', followers: '8만', posts: '934',
    categories: ['뷰티', '패션'], profileImg: 'https://i.pravatar.cc/150?img=5',
    stage: 'contacting', campaignName: '루미에르 · 봄봄 프로모션', dDay: 'D+26', platform: '인스타그램',
    brief: `안녕하세요 zigoo님 😊\n\n루미에르 봄봄 프로모션 협업을 제안드립니다!\n\n💄 제품\n루미에르 선블락 크림 (신제품)`,
    contactHistory: [{ date: '2026.04.15', event: '인스타그램 DM 발송 완료' }],
    memo: '', deliveryDone: false,
  },
  '3': {
    id: '3', name: '김지영', handle: '@jijizero', followers: '21만', posts: '2,103',
    categories: ['뷰티', '연애/결혼', '일상'], profileImg: 'https://i.pravatar.cc/150?img=9',
    stage: 'contacting', campaignName: '루미에르 · 봄봄 프로모션', dDay: 'D+26', platform: '인스타그램',
    brief: `안녕하세요 jijizero님 😊\n\n일상과 뷰티를 자연스럽게 담아내는 콘텐츠가 너무 좋아서 연락드렸어요!\n\n💄 제품\n루미에르 선블락 크림 (신제품)`,
    contactHistory: [
      { date: '2026.04.14', event: '캠페인에 추가됨' },
      { date: '2026.04.15', event: '인스타그램 DM 발송 완료' },
    ],
    memo: '이전 캠페인 ROAS 3.2x, 릴스 편집 퀄리티 좋음. 이번 단가 35만원으로\n2026.04.10 작성',
    negotiationPrice: 350000, deliveryDone: false,
  },
  '4': {
    id: '4', name: 'paooar', handle: '@paooar', followers: '9.2만', posts: '1,523',
    categories: ['뷰티', '패션', '일상'], profileImg: 'https://i.pravatar.cc/150?img=47',
    stage: 'negotiating', campaignName: '루미에르 · 봄봄 프로모션', dDay: 'D-8', platform: '인스타그램',
    brief: PAOOAR_BRIEF, contactHistory: PAOOAR_HISTORY, memo: PAOOAR_MEMO,
    negotiationPrice: 350000, contentFormat: '릴스 1건', draftDueDate: '2025.04.25',
    deliveryDone: true, hasDraftFile: true,
  },
  '5': {
    id: '5', name: 'paooar', handle: '@paooar', followers: '9.2만', posts: '1,523',
    categories: ['뷰티', '패션', '일상'], profileImg: 'https://i.pravatar.cc/150?img=47',
    stage: 'reviewing', campaignName: '루미에르 · 봄봄 프로모션', dDay: 'D-8', platform: '인스타그램',
    brief: PAOOAR_BRIEF,
    contactHistory: [
      ...PAOOAR_HISTORY,
      { date: '2026.04.22', event: '시안 파일 수신' },
      { date: '2026.04.23', event: '시안 승인 완료' },
    ],
    memo: PAOOAR_MEMO,
    negotiationPrice: 350000, contentFormat: '릴스 1건', draftDueDate: '2025.04.25',
    deliveryDone: true, hasDraftFile: true, settlementAmount: 350000,
  },
  '6': {
    id: '6', name: 'paooar', handle: '@paooar', followers: '9.2만', posts: '1,523',
    categories: ['뷰티', '패션', '일상'], profileImg: 'https://i.pravatar.cc/150?img=47',
    stage: 'uploaded', campaignName: '루미에르 · 봄봄 프로모션', dDay: 'D-0', platform: '인스타그램',
    brief: PAOOAR_BRIEF,
    contactHistory: [
      ...PAOOAR_HISTORY,
      { date: '2026.04.22', event: '시안 파일 수신' },
      { date: '2026.04.23', event: '시안 승인 완료' },
      { date: '2026.04.17', event: '인스타그램 업로드 확인' },
    ],
    memo: PAOOAR_MEMO,
    negotiationPrice: 350000, contentFormat: '릴스 1건', draftDueDate: '2025.04.25',
    deliveryDone: true, hasDraftFile: true,
    postingUrl: 'https://instagram.com/p/dlvo2ZkdIzdX', postDate: '2026.04.17',
    settlementAmount: 350000, paymentStatus: '미완료',
  },
};

function getCategoryStyle(c: string) {
  switch (c) {
    case '뷰티':      return { bg: 'bg-[#fdf2fe]', text: 'text-[#87588a]' };
    case '패션':      return { bg: 'bg-[#eef2ff]', text: 'text-[#3e37c3]' };
    case '연애/결혼': return { bg: 'bg-[#fffbeb]', text: 'text-[#92400e]' };
    case '일상':      return { bg: 'bg-[#fef6f1]', text: 'text-[#d96430]' };
    default:          return { bg: 'bg-stone-100',  text: 'text-stone-600'  };
  }
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-[50px] h-[28px] rounded-full transition-colors relative shrink-0 ${checked ? 'bg-iris-500' : 'bg-stone-200'}`}
    >
      <div className={`absolute top-[3px] w-[22px] h-[22px] rounded-full bg-white shadow-sm transition-all ${checked ? 'left-[25px]' : 'left-[3px]'}`} />
    </button>
  );
}

function DraftFileCard({ approved }: { approved?: boolean }) {
  return (
    <div className="border border-stone-200 rounded-2xl overflow-hidden">
      <div className="bg-stone-800 h-[130px] relative flex items-center justify-center">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <Play size={18} fill="white" className="text-white ml-0.5" />
        </div>
        {approved && (
          <div className="absolute top-3 right-3 bg-[#22c55e] rounded-full px-3 py-1">
            <span className="text-[12px] font-semibold text-white">승인완료</span>
          </div>
        )}
      </div>
      <div className="px-4 py-3">
        <p className="text-[14px] font-medium text-stone-900">루미에르_봄봄_릴스.mp4</p>
        <p className="text-[12px] text-stone-400 mt-0.5">12.4MB · 2025.04.22 9:21</p>
      </div>
    </div>
  );
}

function NegotiationGrid({
  data, deliveryDone, setDeliveryDone,
}: {
  data: InfluencerDetail;
  deliveryDone: boolean;
  setDeliveryDone: (v: boolean) => void;
}) {
  return (
    <div className="px-5 pt-1 pb-5">
      <p className="text-[16px] font-semibold text-stone-900 mb-3">협의 정보</p>
      <div className="bg-[#fafbfe] rounded-2xl border border-[#ebeef7] overflow-hidden">
        <div className="grid grid-cols-2">
          <div className="px-4 py-3.5 border-b border-r border-[#ebeef7]">
            <p className="text-[12px] text-stone-400 mb-1">협의 단가</p>
            <p className="text-[16px] font-semibold text-iris-500">
              {data.negotiationPrice ? data.negotiationPrice.toLocaleString() + '원' : '-'}
            </p>
          </div>
          <div className="px-4 py-3.5 border-b border-[#ebeef7]">
            <p className="text-[12px] text-stone-400 mb-1">콘텐츠 형식</p>
            <p className="text-[15px] font-semibold text-stone-900">{data.contentFormat || '-'}</p>
          </div>
          <div className="px-4 py-3.5 border-b border-r border-[#ebeef7]">
            <p className="text-[12px] text-stone-400 mb-1">시안 전달 예정일</p>
            <p className="text-[14px] font-medium text-stone-900">{data.draftDueDate || '-'}</p>
          </div>
          <div className="px-4 py-3.5 border-b border-[#ebeef7]">
            <p className="text-[12px] text-stone-400 mb-1">플랫폼</p>
            <p className="text-[14px] font-medium text-stone-900">{data.platform}</p>
          </div>
        </div>
        <div className="px-4 py-3.5 flex items-center justify-between">
          <div>
            <p className="text-[14px] font-medium text-stone-900">제품 배송 완료</p>
            <p className="text-[12px] text-stone-400">인플루언서에게 제품을 발송했나요?</p>
          </div>
          <Toggle checked={deliveryDone} onChange={setDeliveryDone} />
        </div>
      </div>
    </div>
  );
}

export default function InfluencerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const data = MOCK_DETAILS[id];

  const [responseStatus, setResponseStatus] = useState<ResponseStatus>(null);
  const [briefOpen, setBriefOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [utmOpen, setUtmOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [deliveryDone, setDeliveryDone] = useState(data?.deliveryDone ?? false);
  const [hasDraft, setHasDraft] = useState(data?.hasDraftFile ?? false);
  const [postingUrl, setPostingUrl] = useState('');
  const [postDate, setPostDate] = useState('');
  const [utmIncluded, setUtmIncluded] = useState(false);
  const [taxInvoice, setTaxInvoice] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen bg-white max-w-[430px] mx-auto">
        <p className="text-stone-400 text-[15px]">인플루언서를 찾을 수 없어요.</p>
      </div>
    );
  }

  const stageIndex = STAGES.findIndex(s => s.id === data.stage);
  const isOverdue = data.dDay.startsWith('D+');

  const handleCopyBrief = async () => {
    await navigator.clipboard.writeText(data.brief);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ── 업로드완료 stage: separate success screen ── */
  if (data.stage === 'uploaded') {
    return (
      <div className="flex flex-col h-screen bg-white max-w-[430px] mx-auto relative overflow-hidden">
        <div className="flex items-center justify-between px-5 h-[65px] border-b border-[#f0f2f8] bg-white shrink-0">
          <button onClick={() => router.back()} className="active:opacity-60">
            <ChevronLeft size={28} className="text-stone-900" />
          </button>
          <span className="text-[18px] font-bold text-stone-900">인플루언서 상세</span>
          <button className="active:opacity-60">
            <MoreHorizontal size={28} className="text-stone-900" />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-5 pb-[120px]">
          <div className="w-[72px] h-[72px] rounded-full bg-iris-500 flex items-center justify-center mb-6">
            <Check size={34} strokeWidth={3} className="text-white" />
          </div>
          <p className="text-[26px] font-bold text-stone-900 mb-3">업로드 완료!</p>
          <p className="text-[15px] text-stone-500 text-center leading-relaxed mb-10">
            {data.name}님의 콘텐츠가 확인되었어요.<br />
            성과 탭에서 실시간 데이터를 확인하세요.
          </p>

          <div className="w-full bg-[#fafbfe] rounded-2xl border border-[#ebeef7] overflow-hidden">
            {[
              { label: '게시일',   value: data.postDate ?? '-' },
              { label: '정산 금액', value: data.settlementAmount?.toLocaleString() ?? '-' },
              { label: '입금 상태', value: data.paymentStatus ?? '-' },
            ].map(({ label, value }, i, arr) => (
              <div key={label} className={`px-5 py-4 flex items-center justify-between ${i < arr.length - 1 ? 'border-b border-[#ebeef7]' : ''}`}>
                <span className="text-[14px] text-stone-400">{label}</span>
                <span className="text-[14px] font-medium text-stone-900">{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 w-full bg-white border-t border-[#f0f2f8] px-5 pt-3 pb-8">
          <button
            onClick={() => router.push('/performance')}
            className="w-full h-[52px] bg-stone-900 text-white rounded-full text-[17px] font-semibold mb-3 active:opacity-80"
          >
            성과 확인하기
          </button>
          <button
            onClick={() => router.push('/board')}
            className="w-full text-center text-[14px] text-stone-400 active:opacity-60"
          >
            보드로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  /* ── Common detail layout ── */
  const stageBadgeLabel = STAGES[stageIndex]?.label ?? '';

  return (
    <div className="flex flex-col h-screen bg-white max-w-[430px] mx-auto relative overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 h-[65px] border-b border-[#f0f2f8] bg-white shrink-0">
        <button onClick={() => router.back()} className="active:opacity-60">
          <ChevronLeft size={28} className="text-stone-900" />
        </button>
        <span className="text-[18px] font-bold text-stone-900">인플루언서 상세</span>
        <button className="active:opacity-60">
          <MoreHorizontal size={28} className="text-stone-900" />
        </button>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto pb-[110px] bg-white">

        {/* Profile */}
        <div className="flex flex-col items-center px-5 pt-6 pb-6">
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-full bg-stone-200 overflow-hidden">
              {data.profileImg && <img src={data.profileImg} alt={data.name} className="w-full h-full object-cover" />}
            </div>
            <div className="absolute bottom-0 right-0 bg-white rounded-full p-[3px] shadow-sm">
              <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" alt="ig" className="w-[18px] h-[18px]" />
            </div>
          </div>
          <p className="text-[20px] font-bold text-stone-900">{data.name}</p>
          <p className="text-[14px] text-stone-400 mt-0.5 mb-1">{data.handle}</p>
          <p className="text-[13px] text-stone-400 mb-4">
            인스타그램 &nbsp;·&nbsp; 팔로워 {data.followers} &nbsp;·&nbsp; 게시물 {data.posts}
          </p>
          <div className="flex gap-2 flex-wrap justify-center mb-5">
            {data.categories.map((cat, i) => {
              const { bg, text } = getCategoryStyle(cat);
              return <span key={i} className={`px-3 py-1 rounded-full text-[13px] font-medium ${bg} ${text}`}>{cat}</span>;
            })}
          </div>
          <div className="flex gap-3 w-full">
            <button className="flex-1 h-12 bg-iris-500 text-white rounded-full text-[16px] font-semibold active:opacity-80">연락하기</button>
            <button className="flex-1 h-12 border border-stone-200 text-stone-700 rounded-full text-[15px] font-medium active:opacity-80">연락 방법 변경</button>
          </div>
        </div>

        <div className="h-2 bg-[#f5f5f3]" />

        {/* Stage progress */}
        <div className="px-5 pt-4 pb-5 bg-white">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="bg-iris-50 text-iris-500 text-[12px] font-bold px-3 py-1 rounded-full">{stageBadgeLabel}</span>
              <span className="text-[14px] font-medium text-stone-800">{data.campaignName}</span>
            </div>
            <span className={`text-[13px] font-semibold ${isOverdue ? 'text-red-500' : 'text-iris-500'}`}>{data.dDay}</span>
          </div>
          <div className="flex items-start w-full">
            {STAGES.map((stage, i) => {
              const isDone = i <= stageIndex;
              const isCurrent = i === stageIndex;
              return (
                <div key={stage.id} className="flex items-start flex-1">
                  <div className="flex flex-col items-center shrink-0">
                    <div className={`w-2 h-2 rounded-full mt-0.5 ${isDone ? 'bg-iris-500' : 'bg-stone-200'} ${isCurrent ? 'ring-[3px] ring-iris-100' : ''}`} />
                    <span className={`text-[10px] mt-1.5 whitespace-nowrap ${isCurrent ? 'font-bold text-iris-500' : isDone ? 'text-stone-400' : 'text-stone-300'}`}>
                      {stage.label}
                    </span>
                  </div>
                  {i < STAGES.length - 1 && (
                    <div className={`flex-1 h-[1.5px] mt-1.5 mx-0.5 ${i < stageIndex ? 'bg-iris-500' : 'bg-stone-200'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="h-px bg-[#f0f2f8]" />

        {/* ── 컨택 stage ── */}
        {data.stage === 'contacting' && (
          <>
            <div className="px-5 pt-5 pb-5">
              <p className="text-[16px] font-semibold text-stone-900 mb-4">응답 상태</p>
              <div className="flex gap-2.5">
                {([
                  { id: 'positive',    Icon: ThumbsUp, label: '긍정 응답',  sub: '협의 가능 상태', aB: 'bg-iris-50',   aBr: 'border-iris-500', aT: 'text-iris-500'  },
                  { id: 'declined',    Icon: X,        label: '거절',       sub: '협의 거절',     aB: 'bg-red-50',    aBr: 'border-red-400',  aT: 'text-red-500'   },
                  { id: 'no-response', Icon: Clock,    label: '미응답',     sub: '응답 대기',     aB: 'bg-stone-50',  aBr: 'border-stone-400', aT: 'text-stone-500' },
                ] as const).map(({ id: sid, Icon, label, sub, aB, aBr, aT }) => {
                  const active = responseStatus === sid;
                  return (
                    <button key={sid} onClick={() => setResponseStatus(active ? null : sid)}
                      className={`flex-1 rounded-2xl border-2 py-3 flex flex-col items-center gap-1 active:opacity-70 ${active ? `${aB} ${aBr}` : 'bg-white border-stone-200'}`}>
                      <Icon size={18} className={active ? aT : 'text-stone-400'} />
                      <span className={`text-[13px] font-semibold ${active ? aT : 'text-stone-600'}`}>{label}</span>
                      <span className={`text-[11px] ${active ? aT : 'text-stone-400'}`}>{sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="h-px bg-[#f0f2f8] mx-5" />

            <div className="px-5 pt-5 pb-5">
              <p className="text-[16px] font-semibold text-stone-900 mb-3">협의 정보</p>
              <div className="bg-[#fafbfe] rounded-2xl border border-[#ebeef7] overflow-hidden">
                {[
                  { label: '협의 단가 *', value: data.negotiationPrice ? data.negotiationPrice.toLocaleString() + '원' : '', placeholder: '₩ 단가를 입력해주세요', isIris: true },
                  { label: '시안 전달 예정일 *', value: data.draftDueDate ?? '', placeholder: 'YYYY.MM.DD', isIris: false },
                ].map(({ label, value, placeholder, isIris }, i) => (
                  <div key={label} className="px-4 py-3.5 border-b border-[#ebeef7]">
                    <p className="text-[12px] text-stone-400 mb-1">{label}</p>
                    <p className={`text-[15px] font-medium ${value ? (isIris ? 'text-iris-500' : 'text-stone-900') : 'text-stone-300'}`}>
                      {value || placeholder}
                    </p>
                  </div>
                ))}
                <div className="px-4 py-3.5 flex items-center justify-between">
                  <div>
                    <p className="text-[14px] font-medium text-stone-900">제품 배송 완료</p>
                    <p className="text-[12px] text-stone-400">인플루언서에게 제품을 발송했나요?</p>
                  </div>
                  <Toggle checked={deliveryDone} onChange={setDeliveryDone} />
                </div>
              </div>
            </div>
            <div className="h-px bg-[#f0f2f8]" />
          </>
        )}

        {/* ── 협의중 stage ── */}
        {data.stage === 'negotiating' && (
          <>
            <div className="px-5 pt-5 pb-5">
              <p className="text-[16px] font-semibold text-stone-900 mb-1">시안</p>
              <p className="text-[13px] text-stone-400 mb-4">인플루언서로부터 받은 시안을 첨부하고 검토하세요.</p>
              {!hasDraft ? (
                <button
                  onClick={() => setHasDraft(true)}
                  className="w-full border-2 border-dashed border-stone-200 rounded-2xl py-8 flex flex-col items-center gap-3 active:opacity-70"
                >
                  <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center">
                    <Paperclip size={22} className="text-stone-400" />
                  </div>
                  <span className="text-[15px] font-medium text-iris-500">시안 파일 첨부하기</span>
                </button>
              ) : (
                <DraftFileCard />
              )}
            </div>

            <div className="h-px bg-[#f0f2f8] mx-5" />

            <NegotiationGrid data={data} deliveryDone={deliveryDone} setDeliveryDone={setDeliveryDone} />
            <div className="h-px bg-[#f0f2f8]" />
          </>
        )}

        {/* ── 시안확인 stage ── */}
        {data.stage === 'reviewing' && (
          <>
            {/* 업로드 정보 */}
            <div className="px-5 pt-5 pb-5">
              <p className="text-[16px] font-semibold text-stone-900 mb-3">업로드 정보</p>
              <div className="bg-[#fafbfe] rounded-2xl border border-[#ebeef7] overflow-hidden">
                <div className="px-4 py-3.5 border-b border-[#ebeef7]">
                  <p className="text-[12px] text-stone-400 mb-2">포스팅 URL *</p>
                  <input
                    value={postingUrl}
                    onChange={e => setPostingUrl(e.target.value)}
                    placeholder="https://instagram.com/p/..."
                    className="w-full bg-transparent text-[14px] text-stone-900 placeholder:text-stone-300 outline-none"
                  />
                </div>
                <div className="px-4 py-3.5 border-b border-[#ebeef7]">
                  <p className="text-[12px] text-stone-400 mb-2">게시일 *</p>
                  <input
                    value={postDate}
                    onChange={e => setPostDate(e.target.value)}
                    placeholder="YYYY.MM.DD"
                    className="w-full bg-transparent text-[14px] text-stone-900 placeholder:text-stone-300 outline-none"
                  />
                </div>
                <div className="px-4 py-3.5 flex items-center justify-between">
                  <p className="text-[14px] font-medium text-stone-900">캡션에 UTM 링크 포함</p>
                  <Toggle checked={utmIncluded} onChange={setUtmIncluded} />
                </div>
              </div>
            </div>

            <div className="h-px bg-[#f0f2f8] mx-5" />

            {/* 정산 정보 */}
            <div className="px-5 pt-5 pb-5">
              <p className="text-[16px] font-semibold text-stone-900 mb-3">
                정산 정보 <span className="text-stone-400 font-normal text-[14px]">(선택)</span>
              </p>
              <div className="bg-[#fafbfe] rounded-2xl border border-[#ebeef7] overflow-hidden">
                <div className="px-4 py-3.5 border-b border-[#ebeef7]">
                  <p className="text-[12px] text-stone-400 mb-1">정산 금액</p>
                  <p className="text-[16px] font-semibold text-stone-900">
                    {data.settlementAmount?.toLocaleString()}
                  </p>
                </div>
                <div className="px-4 py-3.5 border-b border-[#ebeef7] flex items-center justify-between">
                  <p className="text-[14px] font-medium text-stone-900">세금계산서</p>
                  <Toggle checked={taxInvoice} onChange={setTaxInvoice} />
                </div>
                <div className="px-4 py-3.5 flex items-center justify-between">
                  <p className="text-[14px] font-medium text-stone-900">입금 완료</p>
                  <Toggle checked={paymentDone} onChange={setPaymentDone} />
                </div>
              </div>
            </div>

            <div className="h-px bg-[#f0f2f8] mx-5" />

            {/* 시안 (승인완료) */}
            <div className="px-5 pt-5 pb-5">
              <p className="text-[16px] font-semibold text-stone-900 mb-3">시안</p>
              <DraftFileCard approved />
            </div>

            <div className="h-px bg-[#f0f2f8] mx-5" />

            <NegotiationGrid data={data} deliveryDone={deliveryDone} setDeliveryDone={setDeliveryDone} />
            <div className="h-px bg-[#f0f2f8]" />
          </>
        )}

        {/* ── UTM 트래킹 accordion ── */}
        <div className="border-b border-[#f0f2f8]">
          <button onClick={() => setUtmOpen(!utmOpen)}
            className="flex items-center justify-between w-full px-5 py-4 active:opacity-70">
            <span className="text-[16px] font-semibold text-stone-900">UTM 트래킹</span>
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-stone-400">추적 전</span>
              {utmOpen ? <ChevronUp size={18} className="text-stone-400" /> : <ChevronDown size={18} className="text-stone-400" />}
            </div>
          </button>
          {utmOpen && (
            <div className="px-5 pb-5">
              <div className="bg-[#fafbfe] border border-[#ebeef7] rounded-2xl p-4">
                <p className="text-[13px] text-stone-500 text-center">UTM 트래킹 링크가 아직 생성되지 않았어요.</p>
                <button className="w-full mt-3 h-10 border border-iris-300 rounded-full text-[14px] text-iris-500 active:opacity-70">
                  UTM 링크 생성하기
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── AI 브리프 accordion ── */}
        <div className="border-b border-[#f0f2f8]">
          <button onClick={() => setBriefOpen(!briefOpen)}
            className="flex items-center justify-between w-full px-5 py-4 active:opacity-70">
            <span className="text-[16px] font-semibold text-stone-900">AI 브리프</span>
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-stone-400">발송</span>
              {briefOpen ? <ChevronUp size={18} className="text-stone-400" /> : <ChevronDown size={18} className="text-stone-400" />}
            </div>
          </button>
          {briefOpen && (
            <div className="px-5 pb-5">
              <div className="bg-[#fafbfe] border border-[#ebeef7] rounded-2xl p-4 mb-3">
                <p className="text-[14px] text-stone-700 leading-[1.7] whitespace-pre-line">{data.brief}</p>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 h-10 border border-stone-200 rounded-full text-[14px] text-stone-600 active:opacity-70">수정하기</button>
                <button onClick={handleCopyBrief}
                  className="flex-1 h-10 bg-iris-50 border border-iris-200 rounded-full text-[14px] text-iris-500 flex items-center justify-center gap-1.5 active:opacity-70">
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? '복사됨' : '복사하기'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── 협업 이력 accordion ── */}
        <div className="border-b border-[#f0f2f8]">
          <button onClick={() => setHistoryOpen(!historyOpen)}
            className="flex items-center justify-between w-full px-5 py-4 active:opacity-70">
            <span className="text-[16px] font-semibold text-stone-900">협업 이력</span>
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-stone-400">{data.contactHistory.length}회</span>
              {historyOpen ? <ChevronUp size={18} className="text-stone-400" /> : <ChevronDown size={18} className="text-stone-400" />}
            </div>
          </button>
          {historyOpen && (
            <div className="px-5 pb-5 space-y-3">
              {data.contactHistory.map((log, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-1.5 h-1.5 rounded-full bg-iris-400 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-[14px] text-stone-700">{log.event}</p>
                    <p className="text-[12px] text-stone-400 mt-0.5">{log.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── 내부 메모 ── */}
        <div className="px-5 pt-5 pb-6">
          <p className="text-[16px] font-semibold text-stone-900 mb-3">내부 메모</p>
          {data.memo && (
            <div className="bg-[#fffbeb] rounded-2xl p-4 mb-3">
              <p className="text-[13px] text-stone-700 leading-relaxed whitespace-pre-line">{data.memo}</p>
            </div>
          )}
          <button className="flex items-center gap-1.5 text-iris-500 text-[14px] font-medium active:opacity-70">
            <Plus size={16} />
            메모 추가
          </button>
        </div>

      </div>

      {/* ── Bottom CTA ── */}

      {/* 컨택 단계 */}
      {data.stage === 'contacting' && (
        <div className="absolute bottom-0 w-full bg-white border-t border-[#f0f2f8] px-5 pt-3 pb-7">
          <button
            className={`w-full h-[52px] rounded-full text-[17px] font-semibold transition-colors
              ${responseStatus === 'positive' ? 'bg-stone-900 text-white active:opacity-80' : 'bg-stone-100 text-stone-400'}`}
          >
            협의 확정하기
          </button>
          <p className="text-center text-[13px] text-stone-400 mt-2.5">임시 저장</p>
        </div>
      )}

      {/* 협의중 단계 */}
      {data.stage === 'negotiating' && (
        <div className="absolute bottom-0 w-full bg-white border-t border-[#f0f2f8] px-5 pt-3 pb-7">
          <button
            className={`w-full h-[52px] rounded-full text-[17px] font-semibold transition-colors
              ${hasDraft ? 'bg-stone-900 text-white active:opacity-80' : 'bg-stone-100 text-stone-400'}`}
          >
            시안 승인하기
          </button>
          <div className="flex items-center justify-center gap-4 mt-2.5">
            <button onClick={() => setHasDraft(true)} className="text-[13px] text-stone-400 active:opacity-60">시안 첨부</button>
            <span className="text-stone-200 text-[12px]">|</span>
            <button className="text-[13px] text-stone-400 active:opacity-60">임시 저장</button>
          </div>
        </div>
      )}

      {/* 시안확인 단계 */}
      {data.stage === 'reviewing' && (
        <div className="absolute bottom-0 w-full bg-white border-t border-[#f0f2f8] px-5 pt-3 pb-7">
          <button
            onClick={() => postingUrl.trim() && router.push('/board/6')}
            className={`w-full h-[52px] rounded-full text-[17px] font-semibold transition-colors
              ${postingUrl.trim() ? 'bg-stone-900 text-white active:opacity-80' : 'bg-stone-100 text-stone-400'}`}
          >
            업로드 완료
          </button>
          <div className="flex items-center justify-center gap-4 mt-2.5">
            <button className="text-[13px] text-stone-400 active:opacity-60">포스팅 확인</button>
            <span className="text-stone-200 text-[12px]">|</span>
            <button className="text-[13px] text-stone-400 active:opacity-60">삭제</button>
            <span className="text-stone-200 text-[12px]">|</span>
            <button className="text-[13px] text-stone-400 active:opacity-60">임시 저장</button>
          </div>
        </div>
      )}

    </div>
  );
}
