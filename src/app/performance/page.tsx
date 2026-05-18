'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  SearchIcon, AlertIcon,
  HomeDisabledIcon, BriefDisabledIcon,
  BoardDisabledIcon, ReportSelectedIcon, MyDisabledIcon,
} from '@/components/Icons';

const CHART_DATA = [
  { date: '4/12', clicks: 48,  conversions: 0 },
  { date: '4/13', clicks: 35,  conversions: 0 },
  { date: '4/14', clicks: 72,  conversions: 1 },
  { date: '4/15', clicks: 95,  conversions: 1 },
  { date: '4/16', clicks: 210, conversions: 2 },
  { date: '4/17', clicks: 580, conversions: 5 },
  { date: '4/18', clicks: 340, conversions: 3 },
];
const MAX_CLICKS = 600;
const CHART_H = 160;

const UPLOAD_WAITING = [
  {
    name: 'leeum', handle: '@leeum', followers: '4.6만',
    profile: '/profile-leeum.png',
    stage: { label: '시안확인', bg: 'bg-[#F0FDF4]', text: 'text-[#22C55E]' },
    status: { label: '포스팅 D-1', bg: 'bg-[#F5F5F3]', text: 'text-[#5C5A54]' },
  },
  {
    name: '이가흔', handle: '@gaaa934', followers: '2.4만',
    profile: '/profile-igaheun.png',
    stage: { label: '시안확인', bg: 'bg-[#F0FDF4]', text: 'text-[#22C55E]' },
    status: { label: '수정본 D-2', bg: 'bg-[#FFFBEB]', text: 'text-[#F59E0B]' },
  },
  {
    name: '박진이', handle: '@jinstlee', followers: '6.8만',
    profile: '/profile-parkjini.png',
    stage: { label: '협의중', bg: 'bg-[#FEF6F1]', text: 'text-[#D96430]' },
    status: { label: '보류', bg: 'bg-[#F5F5F3]', text: 'text-[#5C5A54]' },
  },
  {
    name: 'haye0', handle: '@haye0', followers: '10.4만',
    profile: '/profile-haye0.png',
    stage: { label: '컨택', bg: 'bg-[#EFF6FF]', text: 'text-[#3B82F6]' },
    status: { label: '미응답', bg: 'bg-[#FEF2F2]', text: 'text-[#991B1B]' },
  },
  {
    name: 'zigoo', handle: '@zigoo', followers: '8만',
    profile: '/profile-zigoo.png',
    stage: { label: '컨택', bg: 'bg-[#EFF6FF]', text: 'text-[#3B82F6]' },
    status: { label: '미응답', bg: 'bg-[#FEF2F2]', text: 'text-[#991B1B]' },
  },
  {
    name: '김지영', handle: '@jijizero', followers: '21만',
    profile: '/profile-kimjiyoung.png',
    stage: { label: '컨택', bg: 'bg-[#EFF6FF]', text: 'text-[#3B82F6]' },
    status: { label: '미응답', bg: 'bg-[#FEF2F2]', text: 'text-[#991B1B]' },
  },
  {
    name: '김민지', handle: '@minj_', followers: '24.5만',
    profile: '/profile-kimminji.png',
    stage: { label: '리스트업', bg: 'bg-[#EEEEFF]', text: 'text-[#3D3FC7]' },
    status: null,
  },
  {
    name: '박서연', handle: '@ppseo0', followers: '48만',
    profile: '/profile-parkseo.png',
    stage: { label: '리스트업', bg: 'bg-[#EEEEFF]', text: 'text-[#3D3FC7]' },
    status: null,
  },
  {
    name: 'leezsu', handle: '@leezsu', followers: '12만',
    profile: '/profile-paooar.png',
    stage: { label: '리스트업', bg: 'bg-[#EEEEFF]', text: 'text-[#3D3FC7]' },
    status: null,
  },
];

const CAMPAIGNS = [
  { id: 1, title: '루미에르 봄봄 프로모션', status: '진행중' },
  { id: 2, title: '수분크림 마이크로 인플루언서', status: '기획' },
  { id: 3, title: '선크림 런칭 캠페인', status: '완료' },
] as const;

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  진행중: { bg: '#FEF6F1', text: '#D96430' },
  기획:   { bg: '#FFFBEB', text: '#92400E' },
  완료:   { bg: '#F0FDF4', text: '#26AF58' },
};

const MANROPE: React.CSSProperties = { fontFamily: 'Manrope, sans-serif' };

function BarChart() {
  const yLabels = [600, 450, 300, 150, 0];
  return (
    <div className="flex gap-2">
      {/* Y-axis: absolutely positioned so each label centers on its grid line */}
      <div className="relative shrink-0" style={{ height: CHART_H, width: 28 }}>
        {yLabels.map((v, i) => (
          <span
            key={v}
            className="absolute text-[12px] leading-none w-full text-right"
            style={{
              color: 'rgba(155,161,170,0.5)',
              top: `${(i / 4) * 100}%`,
              transform: 'translateY(-50%)',
            }}
          >
            {v}
          </span>
        ))}
      </div>

      <div className="flex-1 flex flex-col">
        <div className="relative" style={{ height: CHART_H }}>
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} className="absolute w-full border-t border-[#E4E8F4]" style={{ top: `${(i / 4) * 100}%` }} />
          ))}
          {/* Bars: equal-width columns, centered */}
          <div className="absolute inset-x-0 bottom-0 flex items-end">
            {CHART_DATA.map(d => {
              const clickH = Math.round((d.clicks / MAX_CLICKS) * CHART_H);
              const convH = d.conversions > 0 ? Math.max(2, Math.round((d.conversions / MAX_CLICKS) * CHART_H)) : 0;
              return (
                <div key={d.date} className="flex-1 flex justify-center items-end gap-[2px]">
                  <div className="w-[14px] rounded-t-sm bg-[#A5A8F5]" style={{ height: clickH }} />
                  {convH > 0 && <div className="w-[14px] rounded-t-sm bg-iris-500" style={{ height: convH }} />}
                </div>
              );
            })}
          </div>
        </div>
        {/* Date labels: equal-width columns matching bars */}
        <div className="flex mt-2">
          {CHART_DATA.map(d => (
            <div key={d.date} className="flex-1 text-center">
              <span className="text-[12px] font-medium leading-none" style={{ color: 'rgba(155,161,170,0.6)' }}>{d.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function IGBadge({ size = 40 }: { size?: number }) {
  return (
    <img
      src="/skill-icons_instagram.svg"
      alt="instagram"
      width={16}
      height={16}
      className="absolute"
      style={{ bottom: 0, right: -(size === 40 ? 4 : 2), width: 16, height: 16 }}
    />
  );
}

export default function PerformancePage() {
  const router = useRouter();
  const [period, setPeriod] = useState<'전체' | '7일' | '14일' | '30일'>('7일');
  const [chartGranularity, setChartGranularity] = useState<'일별' | '주별'>('일별');
  const [selectedCampaignId, setSelectedCampaignId] = useState<number | 'all'>(1);
  const [showCampaignSheet, setShowCampaignSheet] = useState(false);
  const selectedCampaign = selectedCampaignId !== 'all' ? CAMPAIGNS.find(c => c.id === selectedCampaignId) : null;

  return (
    <div className="flex flex-col h-screen bg-white max-w-[430px] mx-auto relative overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 h-[65px] border-b border-[#F0F2F8] bg-white shrink-0">
        <span className="text-[20px] font-bold text-stone-900 tracking-[-0.4px]">성과</span>
        <div className="flex items-center gap-3">
          <button className="active:opacity-60"><SearchIcon size={32} className="text-stone-900" /></button>
          <button className="relative active:opacity-60">
            <AlertIcon size={32} className="text-stone-900" />
            <span className="absolute top-0 right-0 w-[10px] h-[10px] bg-iris-500 rounded-full border-2 border-white" />
          </button>
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 bg-[#FAFBFE] overflow-y-auto pb-[95px]">

        {/* ── Content Box: Selector + Filters + Summary ── */}
        <div className="bg-white px-5 pt-[26px] pb-[26px] flex flex-col gap-5">

          {/* Campaign Selector */}
          <button
            onClick={() => setShowCampaignSheet(true)}
            className="flex items-center justify-between w-full bg-white rounded-[46px] px-[22px] py-[14px] shadow-[0_0_2px_rgba(99,102,241,0.3)] active:opacity-80"
          >
            <div className="flex items-center gap-2">
              {selectedCampaignId === 'all' ? (
                <span className="text-[16px] font-medium text-[#1C1A17]">전체 캠페인</span>
              ) : (
                <>
                  <span className="text-[16px] font-medium text-[#1C1A17]">{selectedCampaign!.title}</span>
                  <span className="text-[12px] font-semibold rounded-full px-[8px] py-[3px] shrink-0"
                    style={{ backgroundColor: STATUS_STYLES[selectedCampaign!.status].bg, color: STATUS_STYLES[selectedCampaign!.status].text }}>
                    {selectedCampaign!.status}
                  </span>
                </>
              )}
            </div>
            <img src="/arrow-down-campaign.svg" alt="" width={24} height={24} />
          </button>

          {/* Period Filters */}
          <div className="flex items-center gap-[10px]">
            {(['전체', '7일', '14일', '30일'] as const).map(p => {
              const isActive = period === p;
              return (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`rounded-full px-[10px] py-[5px] text-[14px] font-semibold active:opacity-70 transition-all
                    ${isActive ? 'bg-iris-500 text-white' : 'border border-[#D4D2CE] text-[#78756E] bg-white'}`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          {/* Summary Card */}
          <div className="bg-[#F8FAFF] rounded-[14px] border border-[rgba(221,231,255,0.4)] px-5 py-[30px] flex flex-col gap-5">

            {/* ROAS headline */}
            <div className="flex flex-col gap-[10px]">
              <span className="text-[16px] font-medium text-[#78756E]">평균 ROAS</span>
              <span className="text-[28px] font-extrabold text-black" style={MANROPE}>1.4x</span>
            </div>

            {/* Click + Conversion */}
            <div className="flex gap-3">
              {[{ label: '총 클릭 수', value: '820' }, { label: '추적 전환 수', value: '5' }].map(item => (
                <div key={item.label} className="flex-1 bg-white border border-[#F5F5F3] rounded-[14px] p-5 flex flex-col gap-[6px]">
                  <span className="text-[14px] font-medium text-[#78756E]">{item.label}</span>
                  <span className="text-[20px] font-extrabold text-black" style={MANROPE}>{item.value}</span>
                  <span className="self-start bg-[#F0FDF4] text-[#22C55E] text-[14px] font-semibold rounded-full px-[10px] py-[5px]">
                    UTM 추적
                  </span>
                </div>
              ))}
            </div>

            {/* CVR / CPC / CPA */}
            <div className="flex gap-3">
              {[{ label: 'CVR', value: '0.61%' }, { label: 'CPC', value: '549원' }, { label: 'CPA', value: '9만원' }].map(item => (
                <div key={item.label} className="flex-1 bg-white border border-[#F5F5F3] rounded-[14px] p-5 flex flex-col gap-[6px]">
                  <span className="text-[14px] font-medium text-[#78756E]" style={MANROPE}>{item.label}</span>
                  <span className="text-[16px] font-extrabold text-black" style={MANROPE}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="h-2 bg-stone-100" />

        {/* ── Chart Section ── */}
        <div className="bg-white px-5 py-10 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <span className="text-[20px] font-bold text-black">성과 추이</span>
              <div className="flex items-center bg-[#EAEDF5] rounded-full p-[2px]">
                {(['일별', '주별'] as const).map(g => (
                  <button
                    key={g}
                    onClick={() => setChartGranularity(g)}
                    className={`w-[57px] py-[7px] rounded-full text-[14px] font-semibold transition-all active:opacity-70
                      ${chartGranularity === g ? 'bg-white text-[#78756E] shadow-sm' : 'text-[#ABB3BD]'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-[#F8FAFF] border border-[rgba(221,231,255,0.4)] rounded-[14px] px-[22px] pt-[30px] pb-[22px] flex flex-col gap-[21px]">
              <BarChart />
              <div className="flex items-center justify-center gap-[14px]">
                <div className="flex items-center gap-[6px]">
                  <div className="w-[10px] h-[10px] rounded-full bg-[#AFB2F6]" />
                  <span className="text-[14px] text-[#9BA1AA]">클릭 수</span>
                </div>
                <div className="flex items-center gap-[6px]">
                  <div className="w-[10px] h-[10px] rounded-full bg-iris-500" />
                  <span className="text-[14px] text-[#9BA1AA]">전환 수</span>
                </div>
              </div>
            </div>
        </div>

        <div className="h-2 bg-stone-100" />

        {/* ── Performance Section ── */}
        <div className="bg-white px-5 py-10 flex flex-col gap-5">
            <div className="flex items-center justify-between">
              <span className="text-[20px] font-bold text-black">인플루언서별 성과</span>
              <button onClick={() => router.push('/performance/influencers')} className="border border-[#D4D2CE] rounded-full px-[10px] py-[5px] text-[14px] font-semibold text-[#78756E] active:opacity-70">더보기</button>
            </div>

            <div className="flex flex-col gap-[30px]">

              {/* Top performer card */}
              <div onClick={() => router.push('/performance/influencers/dearyq')} className="bg-[#F8FAFF] border border-[#F5F5F3] rounded-[14px] p-[22px] flex flex-col gap-[10px] cursor-pointer active:opacity-80">

                {/* Summary info row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[14px]">
                    {/* Rank badge */}
                    <div className="relative shrink-0" style={{ width: 24, height: 24 }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <polygon points="12,1 21.5,6.5 21.5,17.5 12,23 2.5,17.5 2.5,6.5" fill="#FFC800" stroke="#ECBF13" strokeWidth="1.5" />
                      </svg>
                      <span
                        className="absolute inset-0 flex items-center justify-center text-white font-extrabold"
                        style={{ ...MANROPE, fontSize: 11, paddingTop: 2 }}
                      >1</span>
                    </div>
                    {/* Profile */}
                    <div className="relative shrink-0" style={{ width: 40, height: 40 }}>
                      <div className="w-full h-full rounded-full overflow-hidden bg-stone-200">
                        <img src="/profile-dearyq.png" alt="dearyq" className="w-full h-full object-cover" />
                      </div>
                      <IGBadge />
                    </div>
                    {/* Name info */}
                    <div className="flex flex-col gap-0">
                      <div className="flex items-end gap-1">
                        <span className="text-[16px] font-semibold text-black" style={MANROPE}>dearyq</span>
                        <span className="text-[14px] text-[#78756E]" style={MANROPE}>@dearyq</span>
                      </div>
                      <span className="text-[14px] text-[#78756E]">10.1만</span>
                    </div>
                  </div>
                  {/* ROAS value */}
                  <div className="flex flex-col items-end gap-[2px]">
                    <span className="text-[20px] font-extrabold text-[#1C1A17]" style={MANROPE}>1.4x</span>
                    <span className="text-[14px] font-semibold text-[#5C5A54]" style={MANROPE}>ROAS</span>
                  </div>
                </div>

                {/* Action tags */}
                <div className="flex items-center gap-1">
                  <span className="bg-[#F0FDF4] text-[#22C55E] text-[14px] font-semibold rounded-full px-[10px] py-[5px]">업로드완료</span>
                  <span className="bg-[#EFF6FF] text-[#3D3FC7] text-[14px] font-semibold rounded-full px-[10px] py-[5px]">UTM 포함</span>
                </div>

                {/* Stats row */}
                <div className="flex gap-1">
                  {[{ l: '클릭', v: '820' }, { l: '전환', v: '5' }, { l: 'CVR', v: '0.61%' }, { l: '단가', v: '45만' }].map(s => (
                    <div key={s.l} className="flex-1 bg-white border border-[#F5F5F3] rounded-[14px] p-[18px] flex flex-col gap-[6px]">
                      <span className="text-[14px] font-medium text-[#78756E]">{s.l}</span>
                      <span className="text-[16px] font-extrabold text-black" style={MANROPE}>{s.v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upload waiting */}
              <div className="flex flex-col gap-[10px]">
                <span className="text-[16px] font-bold text-black">업로드 대기</span>
                <div className="flex flex-col">
                  {UPLOAD_WAITING.map((inf, i) => (
                    <div
                      key={inf.handle}
                      onClick={() => router.push('/performance/influencers/' + inf.handle.replace('@', ''))}
                      className={`flex items-center justify-between py-[14px] cursor-pointer active:opacity-70
                        ${i < UPLOAD_WAITING.length - 1 ? 'border-b border-[rgba(235,238,247,0.5)]' : ''}`}
                    >
                      {/* Left: avatar + name */}
                      <div className="flex items-center gap-3">
                        <div className="relative shrink-0" style={{ width: 40, height: 40 }}>
                          <div className="w-full h-full rounded-full overflow-hidden bg-stone-200">
                            <img src={inf.profile} alt={inf.name} className="w-full h-full object-cover" />
                          </div>
                          <IGBadge />
                        </div>
                        <div className="flex flex-col gap-0">
                          <div className="flex items-end gap-1">
                            <span className="text-[16px] font-semibold text-black">{inf.name}</span>
                            <span className="text-[14px] text-[#78756E]">{inf.handle}</span>
                          </div>
                          <span className="text-[12px] text-[#78756E]">{inf.followers}</span>
                        </div>
                      </div>
                      {/* Right: badges */}
                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        <span className={`${inf.stage.bg} ${inf.stage.text} text-[14px] font-semibold rounded-full px-[10px] py-[5px]`}>
                          {inf.stage.label}
                        </span>
                        {inf.status && (
                          <span className={`${inf.status.bg} ${inf.status.text} text-[14px] font-semibold rounded-full px-[10px] py-[5px]`}>
                            {inf.status.label}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
        </div>

        <div className="h-2 bg-stone-100" />

        {/* ── Report Section ── */}
        <div className="bg-white px-5 py-10 flex flex-col gap-5">
            <span className="text-[20px] font-bold text-black">리포트 내보내기</span>
            <div className="flex flex-col gap-[10px]">
              <button className="bg-white border border-[#E8E7E4] rounded-[10px] p-5 flex items-center gap-[14px] active:opacity-70 text-left w-full">
                <img src="/performance-icon.svg" alt="" width={52} height={52} className="shrink-0" />
                <div className="flex flex-col gap-2">
                  <span className="text-[16px] font-semibold text-[#1C1A17]">캠페인 전체 요약</span>
                  <span className="text-[14px] text-[#555553]">핵심 KPI + 인플루언서별 성과 요약</span>
                </div>
              </button>
              <button className="bg-white border border-[#E8E7E4] rounded-[10px] p-5 flex items-center gap-[14px] active:opacity-70 text-left w-full">
                <img src="/summary-icon.svg" alt="" width={52} height={52} className="shrink-0" />
                <div className="flex flex-col gap-2">
                  <span className="text-[16px] font-semibold text-[#1C1A17]">인플루언서별 상세 데이터</span>
                  <span className="text-[14px] font-medium text-[#B0ADA7]">일별 클릭·전환·ROAS 상세 리포트</span>
                </div>
              </button>
            </div>
        </div>

      </div>

      {/* ── 캠페인 선택 바텀시트 ── */}
      {showCampaignSheet && (
        <div className="absolute inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCampaignSheet(false)} />
          <div className="relative bg-white rounded-t-[20px] px-5 pt-5 pb-10">
            <div className="flex items-center justify-between mb-5">
              <span className="text-[16px] font-bold text-[#1C1A17]">캠페인 선택</span>
              <button onClick={() => setShowCampaignSheet(false)} className="active:opacity-60">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 4l12 12M16 4L4 16" stroke="#1C1A17" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {[{ id: 'all' as const, title: '전체 캠페인', status: null }, ...CAMPAIGNS].map(campaign => {
                const isSelected = selectedCampaignId === campaign.id;
                return (
                  <button
                    key={campaign.id}
                    onClick={() => { setSelectedCampaignId(campaign.id); setShowCampaignSheet(false); }}
                    className="flex items-center justify-between px-4 py-4 rounded-[12px] active:opacity-70 transition-colors"
                    style={{ backgroundColor: isSelected ? '#F0F0FF' : '#FAFBFE', border: isSelected ? '1.5px solid #6366F1' : '1.5px solid transparent' }}
                  >
                    <div className="flex flex-col gap-[6px] text-left flex-1 pr-3">
                      <span className="text-[16px] font-medium text-[#1C1A17] leading-snug">{campaign.title}</span>
                      {campaign.status && (
                        <span className="text-[13px] font-semibold px-[10px] py-[4px] rounded-full w-fit"
                          style={{ backgroundColor: STATUS_STYLES[campaign.status].bg, color: STATUS_STYLES[campaign.status].text }}>
                          {campaign.status}
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0">
                        <path d="M3 9l4.5 4.5L15 5" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom navigation ── */}
      <div className="absolute bottom-0 w-full h-[95px] flex items-start pt-[2px] bg-white border-t border-[#F5F5F3] z-20">
        {[
          { Icon: HomeDisabledIcon,   label: '홈',         active: false, onClick: () => router.push('/home') },
          { Icon: BriefDisabledIcon,  label: '캠페인',     active: false, onClick: () => router.push('/campaign') },
          { Icon: BoardDisabledIcon,  label: '보드',       active: false, onClick: () => router.push('/board') },
          { Icon: ReportSelectedIcon, label: '성과',       active: true,  onClick: () => {} },
          { Icon: MyDisabledIcon,     label: '마이페이지', active: false, onClick: () => router.push('/mypage') },
        ].map(({ Icon, label, active, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className="flex-1 h-[60px] flex flex-col items-center justify-start pt-[7px] gap-[4px] text-black active:opacity-60"
          >
            <Icon size={32} />
            <span
              className="text-[12px] leading-none"
              style={{ fontWeight: active ? 600 : 500, letterSpacing: '-0.5px' }}
            >
              {label}
            </span>
          </button>
        ))}
      </div>

    </div>
  );
}
