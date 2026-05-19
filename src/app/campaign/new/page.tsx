'use client';

import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Calendar, Plus, X, Check } from 'lucide-react';

type Step = 1 | 2 | 3 | 4 | 5;

type FormData = {
  campaignName: string;
  productName: string;
  startDate: string;
  endDate: string;
  platforms: string[];
  budget: string;
  manager: string;
  goal: string;
  kpis: string[];
  brandDesc: string;
  productFeatures: string;
  coreMessage: string;
  contentGuide: string;
  requiredTags: string[];
  recommendedTags: string[];
  briefTone: 'formal' | 'friendly' | 'casual';
};

const PLATFORMS = ['인스타그램', '유튜브', '틱톡', '블로그'];

const GOALS = [
  { id: 'purchase',  label: '구매 전환',  desc: '매출 전환율 중심 - 할인코드 UTM 추적', icon: '/shopping-icon.svg' },
  { id: 'awareness', label: '인지도 확대', desc: '도달 노출 중심 - 브랜드 스토리 강조',  icon: '/ad-icon.svg' },
  { id: 'follower',  label: '팔로워 증가', desc: '팔로우 유도 - 계정 성장 목표',         icon: '/influencer-icon.svg' },
  { id: 'content',   label: '콘텐츠 수집', desc: 'UGC 리뷰 확보 - 콘텐츠 자산 구축',    icon: '/contents-icon.svg' },
];

const KPIS = [
  { id: 'roas',       label: 'ROAS',     desc: '광고비 대비 매출' },
  { id: 'clicks',     label: '클릭수',   desc: 'UTM 링크 클릭 수' },
  { id: 'conversion', label: '전환수',   desc: '구매 또는 신청 완료 수' },
  { id: 'upload',     label: '업로드 수', desc: '인플루언서 게시 건수' },
];

const TONES = [
  { id: 'formal',   label: '공식적', icon: '/formal-icon.svg' },
  { id: 'friendly', label: '친근한', icon: '/friendly-icon.svg' },
  { id: 'casual',   label: '캐주얼', icon: '/casual-icon.svg' },
];

const GOAL_KPI_MAP: Record<string, string[]> = {
  purchase:  ['roas', 'clicks', 'conversion'],
  awareness: ['clicks', 'upload'],
  follower:  ['clicks', 'upload'],
  content:   ['upload'],
};

const MOCK_MANAGERS = [
  { id: '1', name: '김지은', team: '마케팅 팀', initial: '김', color: '#f7b898' },
  { id: '2', name: '이수민', team: '마케팅 팀', initial: '이', color: '#98c4f7' },
  { id: '3', name: '박준혁', team: '영업 팀',   initial: '박', color: '#a8f0b8' },
];

const BRIEF_VARIANTS: Record<string, string[]> = {
  formal: [
    `[인플루언서명] 님께,

안녕하세요. 루미에르 마케팅팀입니다.

이번 여름 선케어 캠페인의 공식 협력 파트너로 함께해 주실 분을 찾고 있어, 귀하의 전문적인 뷰티 콘텐츠를 바탕으로 제안드리게 되었습니다.

📦 제품
루미에르 선블럭 크림 (신제품)

📽 콘텐츠 형식
인스타그램 릴스 1건 — 데일리 선케어 루틴 소개

🏷 필수 해시태그
#선케어 #자외선차단 #수분 #루미에르

📎 가이드라인
docs.google.com/fxB2eY1zadeox4dkz

🚫 금지 사항
경쟁 브랜드 언급 금지 · 과장 표현 금지 · 프로모션 용어 사용 금지`,

    `[인플루언서명] 님께,

루미에르 마케팅팀에서 공식 캠페인 협력을 제안드립니다.

여름 시즌 선케어 신제품 출시를 알리는 이번 캠페인에서 귀하의 채널과 협력하고자 합니다.

📦 제품
루미에르 선블럭 크림 (신제품)

📽 콘텐츠 형식
인스타그램 릴스 1건

🏷 필수 해시태그
#선케어 #자외선차단 #수분 #루미에르

📎 가이드라인
docs.google.com/fxB2eY1zadeox4dkz

🚫 금지 사항
경쟁 브랜드 언급 금지 · 과장 표현 금지`,
  ],
  friendly: [
    `안녕하세요 [인플루언서명]님! 😊
루미에르입니다.

루미에르 여름 선케어 캠페인에 함께할 크리에이터를 찾고 있어요. [인플루언서명]님의 뷰티 콘텐츠를 보고 저희 톤과 잘 맞을 것 같아 연락드렸어요!

🎁 제품
루미에르 선블럭 크림 (신제품)

🎬 콘텐츠
인스타그램 릴스 1건 — 봄 무드 데일리 메이크업룩

🏷 필수 태그
#선케어 #자외선차단 #수분 #루미에르

📎 가이드라인
docs.google.com/fxB2eY1zadeox4dkz

🚫 경쟁 브랜드 언급 금지 · 프로모션 용어 사용 금지 · 과장 표현 금지`,

    `안녕하세요 [인플루언서명]님 🌟
루미에르 팀이에요!

[인플루언서명]님 콘텐츠를 즐겨 보고 있는데요, 이번 여름 선케어 신제품 캠페인을 함께해 주실 분을 찾고 있어서 연락드렸어요 😄

🎁 보내드릴 제품
루미에르 선블럭 크림 (신제품)

🎬 콘텐츠 방향
인스타그램 릴스 1건 — 편하게 일상 속 선케어 루틴으로!

🏷 꼭 넣어주세요
#선케어 #자외선차단 #수분 #루미에르

📎 가이드라인
docs.google.com/fxB2eY1zadeox4dkz

🚫 경쟁 브랜드 언급 금지 · 과장 표현은 피해주세요`,
  ],
  casual: [
    `[인플루언서명]님 안녕하세요 ✌️
루미에르예요!

이번 여름 선케어 신제품 같이 해볼 크리에이터 찾고 있었는데, [인플루언서명]님 피드 보다가 딱이다 싶어서 바로 연락했어요 ㅎㅎ

🎁 제품
루미에르 선블럭 크림 (신제품)

🎬 콘텐츠
릴스 1개 — 데일리 선케어 루틴이나 메이크업룩에 자연스럽게 녹여주세요!

🏷 태그
#선케어 #자외선차단 #수분 #루미에르

📎 가이드
docs.google.com/fxB2eY1zadeox4dkz

🚫 경쟁 브랜드 언급 NG · 과장 표현 NG`,

    `[인플루언서명]님~~~ 😎
루미에르 마케팅팀이에요!

솔직히 [인플루언서명]님 뷰티 콘텐츠 진짜 좋아해서요, 이번 여름 선케어 신제품 캠페인 같이 하면 너무 잘 맞을 것 같아 연락드려요 🙌

🎁 제품
루미에르 선블럭 크림

🎬 콘텐츠
릴스 1개 — 자유롭게 일상 선케어로!

🏷 필수 태그
#선케어 #자외선차단 #수분 #루미에르

📎 가이드라인
docs.google.com/fxB2eY1zadeox4dkz

🚫 경쟁 브랜드 NO · 과장 표현 NO`,
  ],
};

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-[52px] h-[30px] rounded-full transition-colors shrink-0
        ${on ? 'bg-[#6366F1]' : 'bg-[#E8E7E4]'}`}
    >
      <div className={`absolute top-[3px] w-[24px] h-[24px] bg-white rounded-full shadow transition-transform
        ${on ? 'translate-x-[25px]' : 'translate-x-[3px]'}`} />
    </button>
  );
}

function FormLabel({ children, required, optional, autoFill }: {
  children: React.ReactNode;
  required?: boolean;
  optional?: boolean;
  autoFill?: boolean;
}) {
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-1">
        <span className="text-[15px] font-semibold text-stone-800">{children}</span>
        {required && <span className="text-iris-500 text-[14px]">*</span>}
        {optional && <span className="text-stone-400 text-[14px] ml-0.5">(선택)</span>}
      </div>
      {autoFill && <span className="text-[14px] text-iris-500 font-medium">자동 채움</span>}
    </div>
  );
}

function TextInput({ value, onChange, placeholder }: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-[52px] border border-stone-200 rounded-xl px-4 text-[16px] text-stone-900 outline-none focus:border-iris-400 placeholder:text-stone-400 bg-white"
    />
  );
}

function TagInput({ tags, onAdd, onRemove, placeholder }: {
  tags: string[];
  onAdd: (t: string) => void;
  onRemove: (t: string) => void;
  placeholder: string;
}) {
  const [value, setValue] = useState('');
  const submit = () => {
    const trimmed = value.trim().replace(/^#/, '');
    if (trimmed) { onAdd(trimmed); setValue(''); }
  };
  return (
    <div>
      <div className="flex items-center border border-stone-200 rounded-xl px-4 h-[52px] gap-2 bg-white">
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && submit()}
          placeholder={placeholder}
          className="flex-1 text-[16px] outline-none text-stone-900 placeholder:text-stone-400"
        />
        <button onClick={submit} className="active:opacity-60">
          <Plus size={20} className="text-stone-400" />
        </button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map(tag => (
            <span key={tag} className="flex items-center gap-1 bg-stone-100 text-stone-700 text-[14px] px-3 py-1 rounded-full">
              {tag}
              <button onClick={() => onRemove(tag)} className="active:opacity-60">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── DateBox ────────────────────────────────────────────────────────────────

function DateBox({ value, onChange, placeholder }: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const formatted = value
    ? value.slice(2).replace(/-/g, '.')
    : '';

  return (
    <div
      className="relative flex-1 h-[52px] border border-[#E8E7E4] rounded-[10px] px-5 flex items-center gap-[6px] bg-white cursor-pointer"
      onClick={() => {
        const el = inputRef.current;
        if (!el) return;
        if (typeof el.showPicker === 'function') el.showPicker();
        else el.click();
      }}
    >
      <Calendar size={20} className="text-stone-400 shrink-0" />
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

// ─── Step 1: Basic Info ─────────────────────────────────────────────────────

function Step1({ form, updateForm, togglePlatform }: {
  form: FormData;
  updateForm: (k: keyof FormData, v: any) => void;
  togglePlatform: (p: string) => void;
}) {
  const [showManagerSheet, setShowManagerSheet] = useState(false);

  const selectedManager = MOCK_MANAGERS.find(m => m.name === form.manager) ?? MOCK_MANAGERS[0];

  return (
    <>
      <div className="px-5 pt-6 pb-2">
        <h1 className="text-[20px] font-bold text-[#1C1A17] mb-6">캠페인 기본 정보</h1>

        {/* 캠페인명 */}
        <div className="mb-6">
          <div className="flex items-center gap-1 mb-2">
            <span className="text-[16px] font-medium text-[#1C1A17]">캠페인명</span>
            <span className="text-iris-500">*</span>
          </div>
          <input
            type="text"
            value={form.campaignName}
            onChange={e => updateForm('campaignName', e.target.value)}
            placeholder="캠페인명을 입력해주세요"
            className="w-full h-[52px] border border-[#E8E7E4] rounded-[10px] px-5 text-[16px] font-medium text-[#1C1A17] outline-none focus:border-iris-400 placeholder:text-[#C7C4BE] bg-white"
          />
        </div>

        {/* 제품명 */}
        <div className="mb-6">
          <div className="flex items-center gap-1 mb-2">
            <span className="text-[16px] font-medium text-[#1C1A17]">제품명</span>
            <span className="text-iris-500">*</span>
          </div>
          <input
            type="text"
            value={form.productName}
            onChange={e => updateForm('productName', e.target.value)}
            placeholder="제품명을 입력해주세요"
            className="w-full h-[52px] border border-[#E8E7E4] rounded-[10px] px-5 text-[16px] font-medium text-[#1C1A17] outline-none focus:border-iris-400 placeholder:text-[#C7C4BE] bg-white"
          />
        </div>

        {/* 캠페인 기간 */}
        <div className="mb-6">
          <div className="flex items-center gap-1 mb-2">
            <span className="text-[16px] font-medium text-[#1C1A17]">캠페인 기간</span>
            <span className="text-iris-500">*</span>
          </div>
          <div className="flex items-center gap-2">
            <DateBox value={form.startDate} onChange={v => updateForm('startDate', v)} placeholder="시작일" />
            <span className="text-[#C7C4BE] font-medium text-[16px]">-</span>
            <DateBox value={form.endDate} onChange={v => updateForm('endDate', v)} placeholder="종료일" />
          </div>
        </div>

        {/* 플랫폼 */}
        <div className="mb-6">
          <div className="flex items-center gap-1 mb-2">
            <span className="text-[16px] font-medium text-[#1C1A17]">플랫폼</span>
            <span className="text-iris-500">*</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map(p => (
              <button
                key={p}
                onClick={() => togglePlatform(p)}
                className={`h-[40px] px-5 rounded-full text-[16px] font-medium transition-all active:opacity-70
                  ${form.platforms.includes(p)
                    ? 'bg-[#EEEEFF] text-[#6366F1] border border-[#6366F1]'
                    : 'border border-[#E8E7E4] text-[#78756E] bg-white'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* 예산 */}
        <div className="mb-6">
          <div className="flex items-center gap-1 mb-2">
            <span className="text-[16px] font-medium text-[#1C1A17]">예산</span>
            <span className="text-[16px] font-medium text-[#78756E]">(선택)</span>
          </div>
          <div className="flex items-center border border-[#E8E7E4] rounded-[10px] px-5 h-[52px] bg-white">
            <input
              type="text"
              value={form.budget}
              onChange={e => updateForm('budget', e.target.value)}
              placeholder="예산을 입력해주세요"
              className="flex-1 text-[16px] font-medium text-[#1C1A17] outline-none placeholder:text-[#C7C4BE]"
            />
            <span className="text-[#78756E] text-[16px] font-semibold shrink-0">원</span>
          </div>
        </div>

        {/* 담당자 */}
        <div className="mb-6">
          <div className="flex items-center gap-1 mb-2">
            <span className="text-[16px] font-medium text-[#1C1A17]">담당자</span>
            <span className="text-[16px] font-medium text-[#78756E]">(선택)</span>
          </div>
          <button
            onClick={() => setShowManagerSheet(true)}
            className="w-full border border-[#E8E7E4] rounded-[10px] p-5 flex items-center justify-between bg-white active:opacity-70"
          >
            <div className="flex items-center gap-[10px]">
              <div
                className="w-[50px] h-[50px] rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: selectedManager.color }}
              >
                <span className="text-white text-[16px] font-semibold">{selectedManager.initial}</span>
              </div>
              <div className="flex flex-col gap-[6px] text-left">
                <p className="text-[16px] font-medium text-[#1C1A17] leading-none">{selectedManager.name}</p>
                <p className="text-[14px] font-medium text-[#B0ADA7] leading-none">{selectedManager.team}</p>
              </div>
            </div>
            <img src="/arrow-down.svg" alt="" className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Manager bottom sheet */}
      {showManagerSheet && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end" style={{ maxWidth: 430, margin: '0 auto' }}>
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowManagerSheet(false)} />
          <div className="relative bg-white rounded-t-[20px] px-5 pt-5 pb-8">
            <div className="flex items-center justify-between mb-5">
              <span className="text-[16px] font-bold text-[#1C1A17]">담당자 선택</span>
              <button onClick={() => setShowManagerSheet(false)} className="active:opacity-60">
                <X size={22} className="text-stone-500" />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {MOCK_MANAGERS.map(mgr => {
                const isSelected = form.manager === mgr.name;
                return (
                  <button
                    key={mgr.id}
                    onClick={() => { updateForm('manager', mgr.name); setShowManagerSheet(false); }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-[12px] active:opacity-70 transition-colors
                      ${isSelected ? 'bg-[#f0f0fd]' : 'bg-[#fafbfe]'}`}
                  >
                    <div
                      className="w-[46px] h-[46px] rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: mgr.color }}
                    >
                      <span className="text-white text-[16px] font-bold">{mgr.initial}</span>
                    </div>
                    <div className="flex-1 flex flex-col gap-[6px] text-left">
                      <p className="text-[16px] font-semibold text-black">{mgr.name}</p>
                      <p className="text-[14px] text-black">{mgr.team}</p>
                    </div>
                    {isSelected && <Check size={18} className="text-iris-500 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Step 2: Goal + KPI ────────────────────────────────────────────────────

function Step2({ form, updateForm, toggleKPI }: {
  form: FormData;
  updateForm: (k: keyof FormData, v: any) => void;
  toggleKPI: (id: string) => void;
}) {
  return (
    <div className="px-5 pt-6 flex flex-col gap-[30px]">
      <h1 className="text-[20px] font-bold text-[#1C1A17]">캠페인 목표</h1>

      <div className="flex flex-col gap-[30px]">
        {/* 목표 유형 */}
        <div className="flex flex-col gap-[12px]">
          <p className="text-[16px] font-medium text-[#1C1A17]">목표 유형</p>
          {GOALS.map(goal => {
            const isActive = form.goal === goal.id;
            return (
              <button
                key={goal.id}
                onClick={() => {
                  updateForm('goal', goal.id);
                  updateForm('kpis', GOAL_KPI_MAP[goal.id]);
                }}
                className={`w-full flex items-center gap-[14px] p-5 rounded-[10px] text-left transition-all active:opacity-80
                  ${isActive ? 'bg-[#EEEEFF] border border-[#6366F1]' : 'bg-white border border-[#E8E7E4]'}`}
              >
                <img src={goal.icon} alt={goal.label} className="w-[52px] h-[52px] shrink-0" />
                <div className="flex flex-col gap-[6px]">
                  <p className="text-[16px] font-semibold text-black">{goal.label}</p>
                  <p className="text-[14px] text-black">{goal.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* KPI 지표 */}
        <div className="flex flex-col gap-[12px]">
          <p className="text-[16px] font-medium text-[#1C1A17]">KPI 지표</p>
          <div className="border border-[#E8E7E4] rounded-[14px] overflow-hidden bg-white">
            {KPIS.map((kpi, i) => (
              <div
                key={kpi.id}
                className={`flex items-center justify-between px-5 py-[14px]
                  ${i > 0 ? 'border-t border-[#E8E7E4]' : ''}`}
              >
                <div className="flex flex-col gap-[6px]">
                  <p className="text-[16px] font-medium text-[#1C1A17]">{kpi.label}</p>
                  <p className="text-[14px] font-medium text-[#B0ADA7]">{kpi.desc}</p>
                </div>
                <Toggle on={form.kpis.includes(kpi.id)} onToggle={() => toggleKPI(kpi.id)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step 3: AI Brief Materials ────────────────────────────────────────────

const DEFAULT_RESTRICTIONS = [
  '경쟁 브랜드 언급 금지',
  '"최저가", "할인" 등 프로모션 용어 사용 금지',
  '과장된 효능/효과 표현 금지',
  '의약품으로 오해할 수 있는 표현 금지',
];

function AutoFillBadge() {
  return (
    <span className="text-[14px] font-semibold text-[#26B059] bg-[#F0FDF4] px-[8px] py-[6px] rounded-full shrink-0">
      자동 채움
    </span>
  );
}

function HashtagSection({ title, tags, onAdd, onRemove }: {
  title: string;
  tags: string[];
  onAdd: (t: string) => void;
  onRemove: (t: string) => void;
}) {
  const [value, setValue] = useState('');
  const submit = () => {
    const trimmed = value.trim().replace(/^#/, '');
    if (trimmed) { onAdd(trimmed); setValue(''); }
  };
  return (
    <div className="flex flex-col gap-[10px]">
      <div className="flex flex-col gap-[12px]">
        <span className="text-[16px] font-semibold text-black">{title}</span>
        <div
          className="flex items-center justify-between border border-[#E8E7E4] rounded-[10px] bg-white h-[56px]"
          style={{ padding: '0 12px 0 20px' }}
        >
          <div className="flex items-center flex-1 gap-[2px]">
            <span className="text-[16px] font-medium text-[#1C1A17]">#</span>
            <input
              type="text"
              value={value}
              onChange={e => setValue(e.target.value.replace(/^#/, ''))}
              onKeyDown={e => e.key === 'Enter' && submit()}
              placeholder="키워드를 입력하세요"
              className="flex-1 text-[16px] font-medium text-[#1C1A17] outline-none placeholder:text-[#B0ADA7]"
            />
          </div>
          <button
            onClick={submit}
            className="w-[34px] h-[34px] flex items-center justify-center rounded-[8px] active:opacity-60 shrink-0"
          >
            <Plus size={18} className="text-[#1C1A17]" />
          </button>
        </div>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-[6px]">
          {tags.map(tag => (
            <span key={tag} className="flex items-center gap-2 bg-[#F5F5F3] text-[14px] font-medium text-[#78756E] px-[14px] py-[8px] rounded-full">
              #{tag}
              <button onClick={() => onRemove(tag)} className="active:opacity-60 flex items-center">
                <X size={9} className="text-[#78756E]" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function Step3({ form, updateForm }: {
  form: FormData;
  updateForm: (k: keyof FormData, v: any) => void;
}) {
  const addRequired       = (t: string) => updateForm('requiredTags',    [...form.requiredTags, t]);
  const removeRequired    = (t: string) => updateForm('requiredTags',    form.requiredTags.filter(x => x !== t));
  const addRecommended    = (t: string) => updateForm('recommendedTags', [...form.recommendedTags, t]);
  const removeRecommended = (t: string) => updateForm('recommendedTags', form.recommendedTags.filter(x => x !== t));

  return (
    <div className="px-5 pt-6 pb-10 flex flex-col gap-[34px]">

      {/* Header + info */}
      <div className="flex flex-col gap-[18px]">
        <h1 className="text-[20px] font-bold text-black">AI 브리프 재료 입력</h1>
        <div className="flex gap-2 bg-[#EEF7FF] rounded-[12px] p-5">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0 mt-[2px]">
            <circle cx="9" cy="9" r="8" stroke="#2D92FE" strokeWidth="1.5"/>
            <path d="M9 8v4.5" stroke="#2D92FE" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="9" cy="6" r="0.75" fill="#2D92FE"/>
          </svg>
          <p className="text-[14px] font-medium text-[#2D92FE] leading-[135%]">
            입력하신 정보를 반영해 AI 브리프를 만들 수 있어요.<br />
            아래 내용을 채울수록 메시지가 정교해집니다.
          </p>
        </div>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-[30px]">

        {/* 브랜드 소개 */}
        <div className="flex flex-col gap-[12px]">
          <div className="flex items-center justify-between">
            <span className="text-[16px] font-semibold text-black">브랜드 소개</span>
            <AutoFillBadge />
          </div>
          <div className="flex flex-col gap-[6px]">
            <div
              className="rounded-[10px] p-5 bg-[#F8FAFF]"
              style={{ border: '1px solid rgba(221,231,255,0.4)' }}
            >
              <p className="text-[16px] font-medium text-[#8995A2] leading-[150%]">{form.brandDesc}</p>
            </div>
            <p className="text-[14px] text-[#B0ADA7]">마이페이지 &gt; AI 브리프 기본 설정에서 불러왔어요.</p>
          </div>
        </div>

        {/* 제품 특징 */}
        <div className="flex flex-col gap-[12px]">
          <div className="flex items-center gap-1">
            <span className="text-[16px] font-semibold text-black">제품 특징</span>
          </div>
          <textarea
            value={form.productFeatures}
            onChange={e => updateForm('productFeatures', e.target.value)}
            onInput={e => { const el = e.currentTarget; el.style.height = '0px'; el.style.height = el.scrollHeight + 'px'; }}
            placeholder={'예) 주요 성분과 효능, 피부 타입, 사용 후 느낌 등을 자유롭게 적어주세요\n예) SPF50+, 세라마이드 함유, 백탁 없는 수분 텍스처, 민감성 피부 테스트 완료'}
            rows={4}
            className="w-full border border-[#E8E7E4] rounded-[10px] p-5 text-[16px] font-medium text-[#1C1A17] leading-[150%] outline-none resize-none focus:border-iris-400 placeholder:text-[#B0ADA7] bg-white"
            style={{ overflowY: 'hidden' }}
          />
        </div>

        {/* 핵심 메시지 */}
        <div className="flex flex-col gap-[12px]">
          <div className="flex items-center gap-[6px]">
            <span className="text-[16px] font-semibold text-black">핵심 메시지</span>
          </div>
          <textarea
            value={form.coreMessage}
            onChange={e => updateForm('coreMessage', e.target.value)}
            onInput={e => { const el = e.currentTarget; el.style.height = '0px'; el.style.height = el.scrollHeight + 'px'; }}
            placeholder="인플루언서가 콘텐츠에서 전달해줬으면 하는 핵심 메시지를 적어주세요"
            rows={2}
            className="w-full border border-[#E8E7E4] rounded-[10px] p-5 text-[16px] font-medium text-[#1C1A17] leading-[150%] outline-none resize-none focus:border-iris-400 placeholder:text-[#B0ADA7] bg-white"
            style={{ overflowY: 'hidden' }}
          />
        </div>

        {/* 금지 사항 */}
        <div className="flex flex-col gap-[12px]">
          <div className="flex items-center justify-between">
            <span className="text-[16px] font-semibold text-black">금지 사항</span>
            <AutoFillBadge />
          </div>
          <div className="flex flex-col gap-[6px]">
            <div
              className="rounded-[10px] p-5 bg-[#F8FAFF]"
              style={{ border: '1px solid rgba(221,231,255,0.4)' }}
            >
              {DEFAULT_RESTRICTIONS.map(r => (
                <p key={r} className="text-[16px] font-medium text-[#8995A2] leading-[150%]">- {r}</p>
              ))}
            </div>
            <p className="text-[14px] text-[#B0ADA7]">마이페이지 &gt; AI 브리프 기본 설정에서 불러왔어요.</p>
          </div>
        </div>

        {/* 콘텐츠 가이드라인 */}
        <div className="flex flex-col gap-[12px]">
          <div className="flex items-center gap-[6px]">
            <span className="text-[16px] font-semibold text-black">콘텐츠 가이드라인</span>
            <span className="text-[15px] font-normal text-[#91929F]">(선택)</span>
          </div>
          <div className="flex flex-col gap-[6px]">
            <div
              className="flex items-center justify-between border border-[#E8E7E4] rounded-[10px] bg-white"
              style={{ padding: '15px 12px 15px 20px' }}
            >
              <input
                type="text"
                value={form.contentGuide}
                onChange={e => updateForm('contentGuide', e.target.value)}
                placeholder="구글 문서·시트 등 가이드라인 링크를 입력해주세요"
                className="flex-1 text-[16px] font-medium text-[#1C1A17] outline-none placeholder:text-[#B0ADA7]"
              />
            </div>
            <p className="text-[14px] text-[#B0ADA7]">
              * 링크 입력 시 AI 브리프에 자동 반영돼요.<br />
              * 인플루언서 상세에서 &apos;캠페인 기본값&apos;으로 표시되며, 개별 변경도 가능해요.
            </p>
          </div>
        </div>

        {/* 필수 해시태그 */}
        <HashtagSection
          title="필수 해시태그"
          tags={form.requiredTags}
          onAdd={addRequired}
          onRemove={removeRequired}
        />

        {/* 추천 해시태그 */}
        <HashtagSection
          title="추천 해시태그"
          tags={form.recommendedTags}
          onAdd={addRecommended}
          onRemove={removeRecommended}
        />

      </div>
    </div>
  );
}

// ─── Step 4: AI Brief Result ───────────────────────────────────────────────

function Step4({ form, updateForm }: {
  form: FormData;
  updateForm: (k: keyof FormData, v: any) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [briefVersion, setBriefVersion] = useState(0);
  const [editedBrief, setEditedBrief] = useState<string | null>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [mounted, setMounted] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { setMounted(true); }, []);

  const variants = BRIEF_VARIANTS[form.briefTone] ?? BRIEF_VARIANTS.friendly;
  const generatedBrief = variants[briefVersion % variants.length];
  const displayBrief = editedBrief ?? generatedBrief;

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(displayBrief); } catch { /* ignore */ }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDoneEditing = () => {
    if (textareaRef.current) setEditedBrief(textareaRef.current.value);
    setIsEditing(false);
  };

  const handleRegenerate = () => {
    setEditedBrief(null);
    setBriefVersion(v => v + 1);
  };

  const handleToneChange = (toneId: string) => {
    updateForm('briefTone', toneId);
    setBriefVersion(0);
    setEditedBrief(null);
  };

  // Body scroll lock + keyboard height via visualViewport
  useEffect(() => {
    if (!isEditing) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const vv = window.visualViewport;
    const onViewport = () => {
      if (!vv) return;
      setKeyboardHeight(Math.max(0, window.innerHeight - vv.height));
    };
    if (vv) {
      vv.addEventListener('resize', onViewport);
      onViewport();
    }

    return () => {
      document.body.style.overflow = prev;
      if (vv) vv.removeEventListener('resize', onViewport);
      setKeyboardHeight(0);
    };
  }, [isEditing]);

  // Set textarea height to content height on open
  useLayoutEffect(() => {
    if (!isEditing || !textareaRef.current) return;
    const el = textareaRef.current;
    el.style.height = '0px';
    el.style.height = el.scrollHeight + 'px';
  }, [isEditing]);

  return (
    <>
      {/* Portal renders outside overflow:hidden container — fixed elements behave correctly on iOS */}
      {mounted && isEditing && createPortal(
        <>
          {/* Layer 1: white backdrop */}
          <div
            className="fixed inset-0 z-50 bg-white"
            onTouchMove={e => { e.stopPropagation(); e.preventDefault(); }}
          />
          {/* Layer 2: header — truly fixed to viewport top, never scrolls */}
          <div className="fixed inset-x-0 top-0 z-[60] h-[56px] flex items-center justify-between px-5 bg-white border-b border-[#E8E7E4]">
            <span className="text-[16px] font-semibold text-black">브리프 수정</span>
            <button
              onClick={handleDoneEditing}
              className="text-[16px] font-semibold text-[#6366F1] px-2 py-2 active:opacity-70"
            >
              완료
            </button>
          </div>
          {/* Layer 3: scroll area — bottom tracks keyboard so content always visible */}
          <div
            className="fixed inset-x-0 z-[60] overflow-y-auto bg-white"
            style={{
              top: '56px',
              bottom: `${keyboardHeight}px`,
              WebkitOverflowScrolling: 'touch',
              overscrollBehavior: 'contain',
            }}
          >
            <div className="p-5 pb-[50px]">
              <textarea
                ref={textareaRef}
                defaultValue={displayBrief}
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

      <div className="px-5 pt-6 flex flex-col gap-[30px] pb-10">

        {/* Header */}
        <div className="flex flex-col gap-[18px]">
          <h1 className="text-[20px] font-bold text-black">브리프를 확인해주세요</h1>
          <div className="flex gap-2 bg-[#EEF7FF] rounded-[12px] p-5">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0 mt-[2px]">
              <circle cx="9" cy="9" r="8" stroke="#2D92FE" strokeWidth="1.5"/>
              <path d="M9 8v4.5" stroke="#2D92FE" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="9" cy="6" r="0.75" fill="#2D92FE"/>
            </svg>
            <p className="text-[14px] font-medium text-[#2D92FE] leading-[135%]">
              캠페인 정보 기반으로 AI가 생성한 브리프예요.<br />
              내용을 확인하고, 필요한 부분을 수정한 뒤 저장하세요.
            </p>
          </div>
        </div>

        {/* Tone selector */}
        <div className="flex flex-col gap-[14px]">
          <span className="text-[16px] font-semibold text-black">브리프 톤</span>
          <div className="flex gap-[14px]">
            {TONES.map(tone => {
              const isActive = form.briefTone === tone.id;
              return (
                <button
                  key={tone.id}
                  onClick={() => handleToneChange(tone.id)}
                  className={`flex-1 flex flex-col items-center gap-2 p-5 rounded-[10px] transition-all active:opacity-80
                    ${isActive ? 'border border-[#6366F1] bg-[#EEEEFF]' : 'border border-[#E8E7E4] bg-white'}`}
                >
                  <img src={tone.icon} alt={tone.label} className="w-[52px] h-[52px]" />
                  <span className="text-[16px] font-semibold text-[#1C1A17]">{tone.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Generated brief card */}
        <div className="flex flex-col gap-[6px]">
          <div className="border border-[#ECECEF] rounded-[14px] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-[15px] bg-[#F8FAFF]">
              <span className="text-[16px] font-medium text-black">생성된 브리프</span>
              <div className="w-[36px] bg-[#6366F1] rounded-[7px] flex items-center justify-center py-[3px]">
                <span className="text-[16px] font-bold text-white" style={{ fontFamily: 'Manrope, sans-serif' }}>AI</span>
              </div>
            </div>
            <div className="bg-white px-5 py-[14px] border-t border-[#ECECEF]">
              <p className="text-[16px] font-medium text-[#1C1A17] leading-[150%] whitespace-pre-wrap">
                {displayBrief}
              </p>
            </div>
            <div className="flex border-t border-[#ECECEF]">
              <button
                onClick={() => setIsEditing(true)}
                className="flex-1 py-[15px] flex items-center justify-center bg-[#F8FAFF] border-r border-[#ECECEF] rounded-bl-[14px] active:opacity-70"
              >
                <span className="text-[16px] font-medium text-black">수정하기</span>
              </button>
              <button
                onClick={handleCopy}
                className="flex-1 py-[15px] flex items-center justify-center gap-1 bg-[#F8FAFF] rounded-br-[14px] active:opacity-70"
              >
                {copied
                  ? <><Check size={14} className="text-[#6366F1]" /><span className="text-[16px] font-medium text-[#6366F1]">복사됨</span></>
                  : <span className="text-[16px] font-medium text-black">복사하기</span>}
              </button>
            </div>
          </div>
          <p className="text-[14px] font-normal text-[#B0ADA7] leading-[135%]">
            인플루언서별 발송 시 이름과 핸들이 자동으로 반영돼요.
          </p>
        </div>

        {/* Regenerate button */}
        <button
          onClick={handleRegenerate}
          className="w-full h-[56px] bg-[#F0F2FB] rounded-[12px] flex items-center justify-center active:opacity-70"
        >
          <span className="text-[16px] font-bold text-[#6366F1]">다시 생성하기</span>
        </button>

      </div>
    </>
  );
}

// ─── Step 5: Completion ────────────────────────────────────────────────────

function Step5({ form, router }: { form: FormData; router: ReturnType<typeof useRouter> }) {
  const goalLabel = GOALS.find(g => g.id === form.goal)?.label ?? '구매전환';
  const dateRange = form.startDate && form.endDate
    ? `${form.startDate.slice(2).replace(/-/g, '.')} ~ ${form.endDate.slice(2).replace(/-/g, '.')}`
    : '6.1 ~ 7.31';

  const rows = [
    { label: '캠페인명', value: form.campaignName || '-' },
    { label: '기간',     value: dateRange },
    { label: '목표',     value: goalLabel },
    { label: '플랫폼',   value: form.platforms.join(', ') || '인스타그램' },
  ];

  return (
    <div className="px-5 pt-12 flex flex-col items-center pb-[140px]">
      {/* Checkmark circle */}
      <div className="w-[72px] h-[72px] bg-iris-500 rounded-full flex items-center justify-center mb-6">
        <Check size={36} className="text-white" strokeWidth={3} />
      </div>

      <h1 className="text-[24px] font-bold text-stone-900 mb-3">캠페인이 추가됐어요!</h1>
      <p className="text-[15px] text-stone-500 text-center mb-8 leading-relaxed">
        이제 인플루언서를 추가하고<br />보드에서 관리해보세요
      </p>

      {/* Summary card */}
      <div className="w-full border border-stone-200 rounded-2xl overflow-hidden mb-3">
        {rows.map((row, i) => (
          <div
            key={row.label}
            className={`flex items-center justify-between px-5 py-4 ${i > 0 ? 'border-t border-stone-100' : ''}`}
          >
            <span className="text-[15px] text-stone-400">{row.label}</span>
            <span className="text-[15px] font-medium text-stone-900">{row.value}</span>
          </div>
        ))}
        <div className="flex items-center justify-between px-5 py-4 border-t border-stone-100">
          <span className="text-[15px] text-stone-400">AI 브리프</span>
          <span className="bg-[#dcfce7] text-[#16a34a] text-[14px] font-semibold px-3 py-1 rounded-full">생성완료</span>
        </div>
      </div>

      <p className="text-[14px] text-stone-400 text-center leading-relaxed">
        보드에서 인플루언서를 추가하면 저장된 브리프를<br />바로 복사해 보낼 수 있어요.
      </p>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────

export default function CampaignNewPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [step]);

  const [form, setForm] = useState<FormData>({
    campaignName: '',
    productName: '',
    startDate: '',
    endDate: '',
    platforms: ['인스타그램'],
    budget: '',
    manager: '김지은',
    goal: 'purchase',
    kpis: ['roas', 'clicks', 'conversion'],
    brandDesc: '루미에르는 자연 유래 성분을 기반으로 한 K-뷰티 스킨케어 브랜드입니다. \'빛나는 피부, 가벼운 일상\'을 슬로건으로, 매일 사용하고 싶은 선케어 라인을 선보이고 있어요.',
    productFeatures: '',
    coreMessage: '',
    contentGuide: '',
    requiredTags: ['선케어', '루미에르'],
    recommendedTags: ['SPF50', '자외선차단', '수분'],
    briefTone: 'friendly',
  });

  const updateForm = (key: keyof FormData, value: any) => setForm(prev => ({ ...prev, [key]: value }));
  const togglePlatform = (p: string) =>
    updateForm('platforms', form.platforms.includes(p)
      ? form.platforms.filter(x => x !== p)
      : [...form.platforms, p]);
  const toggleKPI = (id: string) =>
    updateForm('kpis', form.kpis.includes(id)
      ? form.kpis.filter(x => x !== id)
      : [...form.kpis, id]);


  const step1Valid =
    form.campaignName.trim() !== '' &&
    form.productName.trim() !== '' &&
    form.startDate !== '' &&
    form.endDate !== '' &&
    form.platforms.length > 0;

  const handleGenerateBrief = async () => {
    setIsGenerating(true);
    await new Promise(r => setTimeout(r, 1800));
    setIsGenerating(false);
    setStep(4);
  };

  const goBack = () => {
    if (step === 1) router.back();
    else setStep(prev => (prev - 1) as Step);
  };

  const progressPct = step <= 4 ? (step / 4) * 100 : 100;

  return (
    <div className="flex flex-col h-screen bg-white max-w-[430px] mx-auto relative overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-center px-5 h-[56px] border-b border-[#f0f2f8] bg-white shrink-0 relative">
        {step < 5 && (
          <button onClick={goBack} className="absolute left-5 active:opacity-60">
            <ChevronLeft size={24} className="text-stone-900" />
          </button>
        )}
        <span className="text-[16px] font-semibold text-stone-900">캠페인 추가</span>
      </div>

      {/* Progress bar */}
      <div className="h-[4px] bg-stone-100 shrink-0">
        <div
          className="h-full bg-iris-500 transition-all duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Scrollable content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto pb-[160px]">
        {step === 1 && <Step1 form={form} updateForm={updateForm} togglePlatform={togglePlatform} />}
        {step === 2 && <Step2 form={form} updateForm={updateForm} toggleKPI={toggleKPI} />}
        {step === 3 && <Step3 form={form} updateForm={updateForm} />}
        {step === 4 && <Step4 form={form} updateForm={updateForm} />}
        {step === 5 && <Step5 form={form} router={router} />}
      </div>

      {/* Bottom CTA */}
      <div className="absolute bottom-0 w-full px-5 pt-5 pb-8 bg-white border-t border-[#E8E7E4] flex flex-col gap-[10px]">
        {step === 1 && (
          <button
            onClick={() => step1Valid && setStep(2)}
            className={`w-full py-4 text-white text-[16px] font-bold rounded-[12px] transition-colors
              ${step1Valid ? 'bg-[#2E2C28] active:opacity-80' : 'bg-stone-300 cursor-not-allowed'}`}
          >
            다음
          </button>
        )}

        {step === 2 && (
          <button
            onClick={() => setStep(3)}
            className="w-full py-4 bg-[#2E2C28] text-white text-[16px] font-bold rounded-[12px] active:opacity-80"
          >
            다음
          </button>
        )}

        {step === 3 && (
          <>
            <button
              onClick={handleGenerateBrief}
              disabled={isGenerating}
              className="w-full py-4 bg-[#2E2C28] text-white text-[16px] font-bold rounded-[12px] flex items-center justify-center gap-2 active:opacity-80"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  AI가 브리프를 생성 중이에요...
                </>
              ) : '브리프 생성하기'}
            </button>
            <button
              onClick={() => setStep(5)}
              className="w-full py-4 text-[16px] font-medium text-[#B7B7B7] text-center active:opacity-60"
            >
              브리프 없이 캠페인 만들기
            </button>
          </>
        )}

        {step === 4 && (
          <>
            <button
              onClick={() => setStep(5)}
              className="w-full py-4 bg-[#2E2C28] text-white text-[16px] font-bold rounded-[12px] active:opacity-80"
            >
              브리프 저장하고 캠페인 만들기
            </button>
            <button
              onClick={() => setStep(5)}
              className="w-full py-4 text-[16px] font-medium text-[#B7B7B7] text-center active:opacity-60"
            >
              나중에 할게요
            </button>
          </>
        )}

        {step === 5 && (
          <>
            <button
              onClick={() => router.push('/board')}
              className="w-full py-4 bg-[#2E2C28] text-white text-[16px] font-bold rounded-[12px] active:opacity-80"
            >
              보드에서 인플루언서 관리하기
            </button>
            <button
              onClick={() => router.push('/campaign')}
              className="w-full py-4 text-[16px] font-medium text-[#B7B7B7] text-center active:opacity-60"
            >
              나중에 할게요
            </button>
          </>
        )}
      </div>

    </div>
  );
}
