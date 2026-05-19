'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Check } from 'lucide-react';

type Step = 1 | 2 | 3 | 4;

const PLATFORMS = ['인스타그램', '유튜브', '틱톡', '블로그'];
const CONTACT_CHANNELS = ['DM', '이메일', '카카오톡'];

type InfluencerProfile = {
  handle: string;
  name: string;
  followers: string;
  categories: string[];
  profileImg: string;
  selected: boolean;
};

// Mock profile lookup for demo
const MOCK_PROFILES: Record<string, Omit<InfluencerProfile, 'handle' | 'selected'>> = {
  'minj_':  { name: '김민지', followers: '24.5만', categories: ['뷰티', '패션'],           profileImg: 'https://i.pravatar.cc/150?img=47' },
  'ppseo0': { name: '박서연', followers: '48만',   categories: ['뷰티', '일상', '여행/관광'], profileImg: 'https://i.pravatar.cc/150?img=48' },
  'leezsu': { name: 'leezsu', followers: '12만',  categories: ['뷰티', '여행/관광'],        profileImg: 'https://i.pravatar.cc/150?img=49' },
};


function parseHandles(raw: string): string[] {
  return raw
    .split(/[\n,\s]+/)
    .map(h => h.trim().replace(/^@/, '').toLowerCase())
    .filter(h => h.length > 0);
}

function getProfile(handle: string): InfluencerProfile {
  const mock = MOCK_PROFILES[handle];
  return mock
    ? { handle, ...mock, selected: true }
    : {
        handle,
        name: handle,
        followers: `${Math.floor(Math.random() * 50 + 5)}만`,
        categories: ['뷰티'],
        profileImg: `https://i.pravatar.cc/150?u=${handle}`,
        selected: true,
      };
}

// ─── Step 1: 계정 입력 ──────────────────────────────────────────────────────

function Step1({
  platform, setPlatform, inputText, setInputText, onNext,
}: {
  platform: string; setPlatform: (p: string) => void;
  inputText: string; setInputText: (v: string) => void;
  onNext: () => void;
}) {
  const handles = parseHandles(inputText);
  const isFilled = handles.length > 0;

  return (
    <>
      <div className="flex-1 overflow-y-auto pb-[120px] px-5 pt-6">
        <h1 className="text-[20px] font-bold text-stone-900 mb-1">추가할 인플루언서 계정을 알려주세요</h1>
        <p className="text-[14px] text-stone-400 mb-6">@, 프로필 URL, 엑셀 붙여넣기 모두 인식해요.</p>

        {/* 플랫폼 */}
        <p className="text-[15px] font-semibold text-stone-800 mb-3">플랫폼</p>
        <div className="flex gap-2 mb-4">
          {PLATFORMS.map(p => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              className={`h-9 px-4 rounded-full text-[14px] font-medium transition-all active:opacity-70
                ${platform === p ? 'bg-[#EEEEFF] text-[#6366F1] border border-[#6366F1]' : 'border border-stone-200 text-stone-600 bg-white'}`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder={'예: @woven01\n@woven02\n@woven03'}
          rows={5}
          className="w-full border border-stone-200 rounded-xl px-4 py-3 text-[15px] text-stone-900 outline-none resize-none focus:border-iris-400 placeholder:text-stone-400 bg-white mb-3"
        />

        {/* Count */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[14px] font-medium text-stone-600">입력된 핸들</span>
          <span className="text-[14px] font-semibold text-stone-900">{handles.length}명</span>
        </div>

        {/* Info banner */}
        <div className="bg-[#eef0fd] rounded-xl px-4 py-3 flex gap-2 mb-6">
          <span className="text-iris-500 text-[14px] shrink-0 mt-0.5">⚠</span>
          <p className="text-[14px] text-stone-600 leading-relaxed">
            콤마(,) 또는 줄바꿈으로 구분해주세요.<br />
            엑셀의 핸들 열을 복사 붙여넣기하면 자동으로 인식돼요.
          </p>
        </div>

        {/* Campaign */}
        <p className="text-[15px] font-semibold text-stone-800 mb-3">연결된 캠페인</p>
        <div className="border border-stone-100 rounded-2xl px-5 py-4 flex items-center justify-between bg-[#fafbfe]">
          <div>
            <p className="text-[15px] font-medium text-stone-500">2026 여름 선케어</p>
            <p className="text-[14px] text-stone-400 mt-0.5">6.1 ~ 7.31</p>
          </div>
          <div className="w-7 h-7 bg-iris-500 rounded-full flex items-center justify-center shrink-0">
            <Check size={14} className="text-white" strokeWidth={3} />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 w-full px-5 pb-8 pt-4 bg-white border-t border-[#f0f2f8]">
        <button
          onClick={onNext}
          disabled={!isFilled}
          className={`w-full h-[56px] rounded-2xl text-[16px] font-semibold transition-colors
            ${isFilled ? 'bg-stone-900 text-white active:opacity-80' : 'bg-stone-100 text-stone-400'}`}
        >
          계정 확인하기
        </button>
      </div>
    </>
  );
}

// ─── Step 2: 인플루언서 확인 ───────────────────────────────────────────────

function Step2({
  profiles, setProfiles, onNext,
}: {
  profiles: InfluencerProfile[];
  setProfiles: (p: InfluencerProfile[]) => void;
  onNext: () => void;
}) {
  const selectedCount = profiles.filter(p => p.selected).length;
  const allSelected = profiles.every(p => p.selected);

  const toggleAll = () => setProfiles(profiles.map(p => ({ ...p, selected: !allSelected })));
  const toggleOne = (handle: string) =>
    setProfiles(profiles.map(p => p.handle === handle ? { ...p, selected: !p.selected } : p));

  return (
    <>
      <div className="flex-1 overflow-y-auto pb-[120px] px-5 pt-6">
        <h1 className="text-[20px] font-bold text-stone-900 mb-1">인플루언서를 확인해주세요</h1>
        <p className="text-[14px] text-stone-400 mb-6">추가할 인플루언서 선택해 주세요.</p>

        {/* Count + 전체 선택 */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-[16px] font-bold text-stone-900">{profiles.length}명</span>
          <button
            onClick={toggleAll}
            className="bg-iris-500 text-white text-[14px] font-semibold px-4 py-1.5 rounded-full active:opacity-70"
          >
            전체 선택
          </button>
        </div>

        {/* Influencer cards */}
        <div className="flex flex-col mb-6">
          {profiles.map(inf => {
            const getCategoryStyle = (cat: string) => {
              switch (cat) {
                case '뷰티':      return { bg: 'bg-[#fdf2fe]', text: 'text-[#87588a]' };
                case '패션':      return { bg: 'bg-[#eef2ff]', text: 'text-[#3e37c3]' };
                case '연애/결혼': return { bg: 'bg-[#fffbeb]', text: 'text-[#92400e]' };
                case '일상':      return { bg: 'bg-[#fef6f1]', text: 'text-[#d96430]' };
                default:          return { bg: 'bg-stone-100',  text: 'text-stone-600' };
              }
            };
            return (
              <button
                key={inf.handle}
                onClick={() => toggleOne(inf.handle)}
                className={`flex flex-col w-full text-left rounded-2xl px-[22px] py-[22px] mb-[10px] border active:opacity-80 transition-all
                  ${inf.selected ? 'border-iris-400 bg-[#fafaff]' : 'border-[#ebeef7] bg-white'}`}
              >
                {/* Top row */}
                <div className={`flex flex-row items-center justify-between ${inf.categories.length > 0 ? 'mb-[10px]' : ''}`}>
                  <div className="flex flex-row items-center flex-1 min-w-0">
                    {/* Profile image */}
                    <div className="relative mr-3 shrink-0">
                      <div className="w-10 h-10 rounded-full bg-stone-200 overflow-hidden flex items-center justify-center">
                        {inf.profileImg
                          ? <img src={inf.profileImg} alt={inf.name} className="w-full h-full object-cover" />
                          : <span className="text-stone-500 font-bold text-sm">{inf.name.charAt(0)}</span>}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-[2px] shadow-sm">
                        <img src="/skill-icons_instagram.svg" alt="Instagram" className="w-4 h-4" />
                      </div>
                    </div>
                    {/* Name + followers */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-row items-baseline gap-1.5 mb-1">
                        <span className="text-[16px] font-semibold text-stone-900 leading-4">{inf.name}</span>
                        <span className="text-[14px] text-stone-500 leading-4">@{inf.handle}</span>
                      </div>
                      <p className="text-[14px] text-stone-500 leading-4">{inf.followers}</p>
                    </div>
                  </div>
                  {/* Radio button */}
                  <div className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center shrink-0 ml-3 transition-colors
                    ${inf.selected ? 'border-iris-500 bg-iris-500' : 'border-stone-300 bg-white'}`}>
                    {inf.selected && <Check size={12} className="text-white" strokeWidth={3} />}
                  </div>
                </div>
                {/* Categories */}
                {inf.categories.length > 0 && (
                  <div className="flex flex-row gap-1.5 flex-wrap">
                    {inf.categories.map((cat, idx) => {
                      const { bg, text } = getCategoryStyle(cat);
                      return (
                        <span key={idx} className={`px-[10px] pt-[4px] pb-[6px] rounded-full text-[14px] font-semibold leading-none ${bg} ${text}`}>
                          {cat}
                        </span>
                      );
                    })}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Campaign */}
        <p className="text-[15px] font-semibold text-stone-800 mb-3">연결된 캠페인</p>
        <div className="border border-stone-100 rounded-2xl px-5 py-4 flex items-center justify-between bg-[#fafbfe]">
          <div>
            <p className="text-[15px] font-medium text-stone-500">2026 여름 선케어</p>
            <p className="text-[14px] text-stone-400 mt-0.5">6.1 ~ 7.31</p>
          </div>
          <div className="w-7 h-7 bg-iris-500 rounded-full flex items-center justify-center shrink-0">
            <Check size={14} className="text-white" strokeWidth={3} />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 w-full px-5 pb-8 pt-4 bg-white border-t border-[#f0f2f8]">
        <button
          onClick={onNext}
          disabled={selectedCount === 0}
          className={`w-full h-[56px] rounded-2xl text-[16px] font-semibold transition-colors
            ${selectedCount > 0 ? 'bg-stone-900 text-white active:opacity-80' : 'bg-stone-100 text-stone-400'}`}
        >
          다음
        </button>
      </div>
    </>
  );
}

// ─── Step 3: 연락 방법 ─────────────────────────────────────────────────────

function Step3({
  contactType, setContactType, channel, setChannel, onNext,
}: {
  contactType: string; setContactType: (v: string) => void;
  channel: string; setChannel: (v: string) => void;
  onNext: () => void;
}) {
  return (
    <>
      <div className="flex-1 overflow-y-auto pb-[120px] px-5 pt-6">
        <h1 className="text-[20px] font-bold text-stone-900 mb-1">연락 방법을 선택해 주세요</h1>
        <p className="text-[14px] text-stone-400 mb-6">
          인플루언서와 주요 연락 방식을 선택하면<br />브리프 전송 시 자동으로 연결돼요.
        </p>

        {/* Contact type cards */}
        <div className="flex gap-3 mb-8">
          {[
            { id: 'direct',  label: '직접 연락',   sub: 'DM 또는 이메일',   icon: '/icon/send-icon.svg' },
            { id: 'agency',  label: '에이전시 경유', sub: '담당자에게 연락', icon: '/icon/message-icon.svg' },
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setContactType(opt.id)}
              className={`flex-1 flex flex-col items-center gap-2 py-5 rounded-2xl border-2 transition-all active:opacity-80
                ${contactType === opt.id ? 'border-iris-500 bg-[#f5f5ff]' : 'border-stone-200 bg-white'}`}
            >
              <img src={opt.icon} alt="" width={32} height={32} />
              <p className="text-[15px] font-semibold text-stone-900">{opt.label}</p>
              <p className="text-[12px] text-stone-400">{opt.sub}</p>
            </button>
          ))}
        </div>

        {/* 주요 연락 채널 */}
        <p className="text-[15px] font-semibold text-stone-800 mb-3">주요 연락 채널</p>
        <div className="flex gap-2 mb-8">
          {CONTACT_CHANNELS.map(ch => (
            <button
              key={ch}
              onClick={() => setChannel(ch)}
              className={`h-9 px-4 rounded-full text-[14px] font-medium transition-all active:opacity-70
                ${channel === ch ? 'bg-[#EEEEFF] text-[#6366F1] border border-[#6366F1]' : 'border border-stone-200 text-stone-600 bg-white'}`}
            >
              {ch}
            </button>
          ))}
        </div>

        {/* Campaign */}
        <p className="text-[15px] font-semibold text-stone-800 mb-3">연결된 캠페인</p>
        <div className="border border-stone-100 rounded-2xl px-5 py-4 flex items-center justify-between bg-[#fafbfe]">
          <div>
            <p className="text-[15px] font-medium text-stone-500">2026 여름 선케어</p>
            <p className="text-[14px] text-stone-400 mt-0.5">6.1 ~ 7.31</p>
          </div>
          <div className="w-7 h-7 bg-iris-500 rounded-full flex items-center justify-center shrink-0">
            <Check size={14} className="text-white" strokeWidth={3} />
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 w-full px-5 pb-8 pt-4 bg-white border-t border-[#f0f2f8]">
        <button
          onClick={onNext}
          className="w-full h-[56px] bg-stone-900 text-white rounded-2xl text-[16px] font-semibold active:opacity-80"
        >
          다음
        </button>
      </div>
    </>
  );
}

// ─── Step 4: 완료 ──────────────────────────────────────────────────────────

function Step4({
  profiles, router,
}: {
  profiles: InfluencerProfile[];
  router: ReturnType<typeof useRouter>;
}) {
  const selected = profiles.filter(p => p.selected);

  return (
    <>
      <div className="flex-1 overflow-y-auto pb-[140px] px-5 pt-16 flex flex-col items-center">
        {/* Checkmark */}
        <div className="w-[72px] h-[72px] bg-iris-500 rounded-full flex items-center justify-center mb-6">
          <Check size={36} className="text-white" strokeWidth={3} />
        </div>

        <h1 className="text-[22px] font-bold text-stone-900 mb-2">
          {selected.length}명이 추가되었어요!
        </h1>
        <p className="text-[15px] text-stone-500 text-center mb-8 leading-relaxed">
          2026 여름 선케어의<br />리스트업 단계에 추가되었어요.
        </p>

        {/* Added influencer list */}
        <div className="w-full border border-stone-100 rounded-2xl overflow-hidden mb-4">
          {selected.map((inf, i) => (
            <div
              key={inf.handle}
              className={`flex items-center gap-3 px-5 py-4 ${i > 0 ? 'border-t border-stone-100' : ''}`}
            >
              <img src={inf.profileImg} alt={inf.name} className="w-10 h-10 rounded-full object-cover shrink-0" />
              <div>
                <p className="text-[15px] font-semibold text-stone-900">@{inf.handle}</p>
                <p className="text-[14px] text-stone-400">{inf.followers}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Info banner */}
        <div className="w-full bg-[#eef0fd] rounded-xl px-4 py-3 flex gap-2">
          <span className="text-iris-500 text-[14px] shrink-0 mt-0.5">⚠</span>
          <p className="text-[14px] text-stone-600 leading-relaxed">
            각 인플루언서의 연락 방식, 협업 조건, AI 브리프는 보드에서 설정할 수 있어요.
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 w-full px-5 pb-8 pt-4 bg-white border-t border-[#f0f2f8]">
        <button
          onClick={() => router.push('/board')}
          className="w-full h-[56px] bg-stone-900 text-white rounded-2xl text-[16px] font-semibold active:opacity-80 mb-3"
        >
          보드에서 컨택 시작하기
        </button>
        <button
          onClick={() => router.push('/board/add')}
          className="w-full py-2 text-[15px] text-stone-400 text-center active:opacity-60"
        >
          인플루언서 더 추가하기
        </button>
      </div>
    </>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────

export default function BoardAddPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);

  // Step 1
  const [platform, setPlatform] = useState('인스타그램');
  const [inputText, setInputText] = useState('');

  // Step 2
  const [profiles, setProfiles] = useState<InfluencerProfile[]>([]);

  // Step 3
  const [contactType, setContactType] = useState('direct');
  const [channel, setChannel] = useState('DM');

  const handleStep1Next = () => {
    const handles = parseHandles(inputText);
    setProfiles(handles.map(getProfile));
    setStep(2);
  };

  const progressPct = step === 1 ? 33 : step === 2 ? 66 : step === 3 ? 100 : 100;

  const title = step === 4 ? '' : '인플루언서 추가';

  return (
    <div className="flex flex-col h-screen bg-white max-w-[430px] mx-auto relative overflow-hidden">
      {/* Header */}
      {step < 4 && (
        <>
          <div className="flex items-center justify-center px-5 h-[65px] border-b border-[#f0f2f8] bg-white shrink-0 relative">
            <button
              onClick={() => step === 1 ? router.back() : setStep(prev => (prev - 1) as Step)}
              className="absolute left-5 active:opacity-60"
            >
              <ChevronLeft size={24} className="text-stone-900" />
            </button>
            <span className="text-[16px] font-semibold text-stone-900">{title}</span>
          </div>
          <div className="h-[4px] bg-stone-100 shrink-0">
            <div className="h-full bg-iris-500 transition-all duration-300" style={{ width: `${progressPct}%` }} />
          </div>
        </>
      )}

      {step === 1 && (
        <Step1
          platform={platform} setPlatform={setPlatform}
          inputText={inputText} setInputText={setInputText}
          onNext={handleStep1Next}
        />
      )}
      {step === 2 && (
        <Step2
          profiles={profiles} setProfiles={setProfiles}
          onNext={() => setStep(3)}
        />
      )}
      {step === 3 && (
        <Step3
          contactType={contactType} setContactType={setContactType}
          channel={channel} setChannel={setChannel}
          onNext={() => setStep(4)}
        />
      )}
      {step === 4 && (
        <Step4 profiles={profiles} router={router} />
      )}
    </div>
  );
}
