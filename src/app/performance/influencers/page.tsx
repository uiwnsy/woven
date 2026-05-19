'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const MANROPE: React.CSSProperties = { fontFamily: 'Manrope, sans-serif' };
const RANK_COLORS = ['#FFC800', '#B8BFC9', '#CD7F32'];

type InfluencerStat = {
  rank: number; name: string; handle: string; followers: string; profile: string;
  roas: string; clicks: string; conversions: string; cvr: string; cost: string; hasUtm: boolean;
};

type AllTimeStat = {
  rank: number; name: string; handle: string; followers: string; profile: string;
  avgRoas: string; totalClicks: string; totalConversions: string; avgCvr: string;
  campaigns: number; lastCampaign: string;
};

type Campaign = { id: number; title: string; status: '진행중' | '완료' | '기획' };

const CAMPAIGNS: Campaign[] = [
  { id: 1, title: '루미에르 봄봄 프로모션', status: '진행중' },
  { id: 3, title: '선크림 런칭 캠페인', status: '완료' },
  { id: 2, title: '수분크림 마이크로 인플루언서', status: '기획' },
];

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  진행중: { bg: '#FEF6F1', text: '#D96430' },
  완료:   { bg: '#F0FDF4', text: '#26AF58' },
  기획:   { bg: '#FFFBEB', text: '#92400E' },
};

const CAMPAIGN_DATA: Record<number, InfluencerStat[]> = {
  1: [
    { rank: 1, name: 'dearyq', handle: '@dearyq', followers: '10.1만', profile: '/profile-dearyq.png', roas: '1.4x', clicks: '820',   conversions: '5', cvr: '0.61%', cost: '45만', hasUtm: true },
    { rank: 2, name: 'leeum',  handle: '@leeum',  followers: '4.6만',  profile: '/profile-leeum.png',  roas: '1.1x', clicks: '640',   conversions: '3', cvr: '0.47%', cost: '35만', hasUtm: true },
    { rank: 3, name: 'paooar', handle: '@paooar', followers: '9.2만',  profile: '/profile-paooar.png', roas: '0.8x', clicks: '310',   conversions: '2', cvr: '0.65%', cost: '35만', hasUtm: false },
  ],
  3: [
    { rank: 1, name: 'minj_',  handle: '@minj_',  followers: '24.5만', profile: '/profile-kimminji.png', roas: '1.2x', clicks: '1,240', conversions: '8', cvr: '0.65%', cost: '60만', hasUtm: true },
    { rank: 2, name: 'zigoo',  handle: '@zigoo',  followers: '8만',    profile: '/profile-zigoo.png',    roas: '0.9x', clicks: '560',   conversions: '3', cvr: '0.54%', cost: '28만', hasUtm: true },
    { rank: 3, name: 'haye0',  handle: '@haye0',  followers: '10.4만', profile: '/profile-haye0.png',    roas: '0.7x', clicks: '390',   conversions: '1', cvr: '0.26%', cost: '30만', hasUtm: false },
  ],
  2: [],
};

const ALL_TIME: AllTimeStat[] = [
  { rank: 1, name: 'dearyq', handle: '@dearyq', followers: '10.1만', profile: '/profile-dearyq.png',   avgRoas: '1.6x', totalClicks: '2,410', totalConversions: '14', avgCvr: '0.58%', campaigns: 3, lastCampaign: '루미에르 봄봄 프로모션' },
  { rank: 2, name: 'minj_',  handle: '@minj_',  followers: '24.5만', profile: '/profile-kimminji.png', avgRoas: '1.2x', totalClicks: '1,800', totalConversions: '10', avgCvr: '0.56%', campaigns: 2, lastCampaign: '선크림 런칭 캠페인' },
  { rank: 3, name: 'leeum',  handle: '@leeum',  followers: '4.6만',  profile: '/profile-leeum.png',    avgRoas: '1.1x', totalClicks: '1,280', totalConversions: '7',  avgCvr: '0.55%', campaigns: 2, lastCampaign: '루미에르 봄봄 프로모션' },
  { rank: 4, name: 'paooar', handle: '@paooar', followers: '9.2만',  profile: '/profile-paooar.png',   avgRoas: '0.9x', totalClicks: '980',   totalConversions: '5',  avgCvr: '0.51%', campaigns: 2, lastCampaign: '루미에르 봄봄 프로모션' },
  { rank: 5, name: 'zigoo',  handle: '@zigoo',  followers: '8만',    profile: '/profile-zigoo.png',    avgRoas: '0.7x', totalClicks: '560',   totalConversions: '3',  avgCvr: '0.54%', campaigns: 1, lastCampaign: '선크림 런칭 캠페인' },
];

function IGBadge() {
  return (
    <img src="/skill-icons_instagram.svg" alt="ig" width={16} height={16}
      className="absolute" style={{ bottom: 0, right: -4, width: 16, height: 16 }} />
  );
}

function RankBadge({ rank }: { rank: number }) {
  if (rank > 3) {
    return (
      <div className="shrink-0 flex items-center justify-center" style={{ width: 24, height: 24 }}>
        <span className="text-[15px] font-extrabold" style={{ ...MANROPE, color: '#C0C4CF' }}>{rank}</span>
      </div>
    );
  }
  return (
    <div className="relative shrink-0" style={{ width: 24, height: 24 }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <polygon points="12,1 21.5,6.5 21.5,17.5 12,23 2.5,17.5 2.5,6.5"
          fill={RANK_COLORS[rank - 1]}
          stroke={rank === 1 ? '#ECBF13' : rank === 2 ? '#A0A8B4' : '#B56A22'}
          strokeWidth="1.5" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-white font-extrabold"
        style={{ ...MANROPE, fontSize: 11, paddingTop: 2 }}>{rank}</span>
    </div>
  );
}

export default function InfluencerPerformancePage() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<number | 'all'>(1);
  const [showSheet, setShowSheet] = useState(false);

  const selectedCampaign = selectedId !== 'all' ? CAMPAIGNS.find(c => c.id === selectedId) : null;
  const campaignStats = selectedId !== 'all' ? (CAMPAIGN_DATA[selectedId] ?? []) : [];

  return (
    <div className="flex flex-col h-screen bg-white max-w-[430px] mx-auto relative overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center px-5 h-[56px] border-b border-[#E8E7E4] bg-white shrink-0">
        <button onClick={() => router.back()} className="flex items-center justify-center active:opacity-60 mr-3" style={{ width: 36, height: 36 }}>
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
            <path d="M9 1L1 9L9 17" stroke="#1C1A17" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="text-[18px] font-bold text-black">인플루언서별 성과</span>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 bg-[#FAFBFE] overflow-y-auto pb-10">

        {/* ── 캠페인 셀렉터 ── */}
        <div className="bg-white px-5 pt-5 pb-3">
          <button
            onClick={() => setShowSheet(true)}
            className="flex items-center justify-between w-full bg-white rounded-[46px] px-[22px] py-[14px] shadow-[0_0_2px_rgba(99,102,241,0.3)] active:opacity-80"
          >
            <div className="flex items-center gap-2">
              {selectedId === 'all' ? (
                <span className="text-[16px] font-medium text-[#1C1A17]">전체 캠페인</span>
              ) : (
                <>
                  <span className="text-[16px] font-medium text-[#1C1A17]">{selectedCampaign!.title}</span>
                  <span className="text-[12px] font-semibold rounded-full px-[8px] py-[3px] shrink-0"
                    style={{ backgroundColor: STATUS_STYLE[selectedCampaign!.status].bg, color: STATUS_STYLE[selectedCampaign!.status].text }}>
                    {selectedCampaign!.status}
                  </span>
                </>
              )}
            </div>
            <img src="/arrow-down-campaign.svg" alt="" width={24} height={24} />
          </button>
        </div>

        {selectedId === 'all' ? (
          /* ── 전체 캠페인 ── */
          <div className="bg-white px-5 pt-3 pb-6 flex flex-col gap-4">
            <span className="text-[14px] font-semibold" style={{ color: '#B0ADA7' }}>
              총 {ALL_TIME.length}명 · 평균 ROAS 기준
            </span>
            {ALL_TIME.map(inf => (
              <button key={inf.handle}
                onClick={() => router.push(`/performance/influencers/${inf.handle.replace('@', '')}`)}
                className="bg-[#F8FAFF] border border-[#F5F5F3] rounded-[14px] p-[22px] flex flex-col gap-[10px] w-full text-left active:opacity-70">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[14px]">
                    <RankBadge rank={inf.rank} />
                    <div className="relative shrink-0" style={{ width: 40, height: 40 }}>
                      <div className="w-full h-full rounded-full overflow-hidden bg-stone-200">
                        <img src={inf.profile} alt={inf.name} className="w-full h-full object-cover" />
                      </div>
                      <IGBadge />
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-end gap-1">
                        <span className="text-[16px] font-semibold text-black" style={MANROPE}>{inf.name}</span>
                        <span className="text-[14px] text-[#78756E]" style={MANROPE}>{inf.handle}</span>
                      </div>
                      <span className="text-[14px] text-[#78756E]">{inf.followers}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-[2px]">
                    <span className="text-[20px] font-extrabold text-[#1C1A17]" style={MANROPE}>{inf.avgRoas}</span>
                    <span className="text-[14px] font-semibold text-[#5C5A54]" style={MANROPE}>평균 ROAS</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold rounded-full px-[10px] py-[5px]"
                    style={{ backgroundColor: '#EEEEFF', color: '#6366F1' }}>
                    {inf.campaigns}개 캠페인 참여
                  </span>
                  <span className="text-[13px] font-medium truncate" style={{ color: '#B0ADA7' }}>
                    최근: {inf.lastCampaign}
                  </span>
                </div>
                <div className="flex gap-1">
                  {[{ l: '누적 클릭', v: inf.totalClicks }, { l: '누적 전환', v: inf.totalConversions }, { l: '평균 CVR', v: inf.avgCvr }].map(s => (
                    <div key={s.l} className="flex-1 bg-white border border-[#F5F5F3] rounded-[14px] p-[14px] flex flex-col gap-[6px]">
                      <span className="text-[12px] font-medium text-[#78756E]">{s.l}</span>
                      <span className="text-[15px] font-extrabold text-black" style={MANROPE}>{s.v}</span>
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </div>
        ) : (
          /* ── 특정 캠페인 ── */
          <div className="bg-white px-5 pt-3 pb-6 flex flex-col gap-4">
            {campaignStats.length > 0 ? (
              <>
                <span className="text-[14px] font-semibold" style={{ color: '#B0ADA7' }}>
                  업로드 완료 {campaignStats.length}명
                </span>
                {campaignStats.map(inf => (
                  <button key={inf.handle}
                    onClick={() => router.push(`/performance/influencers/${inf.handle.replace('@', '')}?cid=${selectedId}`)}
                    className="bg-[#F8FAFF] border border-[#F5F5F3] rounded-[14px] p-[22px] flex flex-col gap-[10px] w-full text-left active:opacity-70">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-[14px]">
                        <RankBadge rank={inf.rank} />
                        <div className="relative shrink-0" style={{ width: 40, height: 40 }}>
                          <div className="w-full h-full rounded-full overflow-hidden bg-stone-200">
                            <img src={inf.profile} alt={inf.name} className="w-full h-full object-cover" />
                          </div>
                          <IGBadge />
                        </div>
                        <div className="flex flex-col">
                          <div className="flex items-end gap-1">
                            <span className="text-[16px] font-semibold text-black" style={MANROPE}>{inf.name}</span>
                            <span className="text-[14px] text-[#78756E]" style={MANROPE}>{inf.handle}</span>
                          </div>
                          <span className="text-[14px] text-[#78756E]">{inf.followers}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-[2px]">
                        <span className="text-[20px] font-extrabold text-[#1C1A17]" style={MANROPE}>{inf.roas}</span>
                        <span className="text-[14px] font-semibold text-[#5C5A54]" style={MANROPE}>ROAS</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[{ l: '클릭', v: inf.clicks }, { l: '전환', v: inf.conversions }, { l: 'CVR', v: inf.cvr }, { l: '단가', v: inf.cost }].map(s => (
                        <div key={s.l} className="flex-1 bg-white border border-[#F5F5F3] rounded-[14px] p-[14px] flex flex-col gap-[6px]">
                          <span className="text-[13px] font-medium text-[#78756E]">{s.l}</span>
                          <span className="text-[15px] font-extrabold text-black" style={MANROPE}>{s.v}</span>
                        </div>
                      ))}
                    </div>
                  </button>
                ))}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                  <circle cx="24" cy="24" r="20" stroke="#E8E7E4" strokeWidth="2"/>
                  <path d="M16 24h16M24 16v16" stroke="#E8E7E4" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <span className="text-[15px] font-medium" style={{ color: '#B0ADA7' }}>업로드 완료된 인플루언서가 없어요</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── 캠페인 선택 바텀시트 ── */}
      {showSheet && (
        <>
          <div className="absolute inset-0 z-40 bg-black/30" onClick={() => setShowSheet(false)} />
          <div className="absolute bottom-0 left-0 right-0 z-50 bg-white rounded-t-[20px] pb-8 pt-5">
            <div className="flex items-center justify-between px-5 mb-4">
              <span className="text-[18px] font-bold text-black">캠페인 선택</span>
              <button onClick={() => setShowSheet(false)} className="active:opacity-60">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 4l12 12M16 4L4 16" stroke="#1C1A17" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <div className="flex flex-col px-5 gap-2">
              {/* 전체 캠페인 옵션 */}
              {[{ id: 'all' as const, title: '전체 캠페인', status: null }, ...CAMPAIGNS].map(c => {
                const isSelected = selectedId === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedId(c.id); setShowSheet(false); }}
                    className="flex items-center justify-between py-4 rounded-[14px] active:opacity-70 bg-white"
                  >
                    <div>
                      <span className={`text-[16px] font-medium text-left ${isSelected ? 'text-[#6366F1]' : 'text-[#1C1A17]'}`}>{c.title}</span>
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
        </>
      )}

    </div>
  );
}
