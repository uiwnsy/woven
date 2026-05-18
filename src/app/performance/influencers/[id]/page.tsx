'use client';

import { useRouter, useParams } from 'next/navigation';

const MANROPE: React.CSSProperties = { fontFamily: 'Manrope, sans-serif' };

const CHART_H = 140;

type DailyStat = { date: string; clicks: number; conversions: number };

type InfluencerDetail = {
  name: string;
  handle: string;
  followers: string;
  profile: string;
  roas: string;
  clicks: number;
  conversions: number;
  cvr: string;
  cost: string;
  hasUtm: boolean;
  postingUrl: string;
  postingDate: string;
  campaign: string;
  daily: DailyStat[];
};

const DETAIL_DATA: Record<string, InfluencerDetail> = {
  dearyq: {
    name: 'dearyq', handle: '@dearyq', followers: '10.1만',
    profile: '/profile-dearyq.png',
    roas: '1.4x', clicks: 820, conversions: 5, cvr: '0.61%', cost: '450,000원',
    hasUtm: true,
    postingUrl: 'https://instagram.com/p/C4xBkQFP5Xx/',
    postingDate: '2025.05.02',
    campaign: '루미에르 봄봄 프로모션',
    daily: [
      { date: '5/2',  clicks: 48,  conversions: 0 },
      { date: '5/3',  clicks: 72,  conversions: 1 },
      { date: '5/4',  clicks: 210, conversions: 2 },
      { date: '5/5',  clicks: 180, conversions: 1 },
      { date: '5/6',  clicks: 140, conversions: 1 },
      { date: '5/7',  clicks: 95,  conversions: 0 },
      { date: '5/8',  clicks: 75,  conversions: 0 },
    ],
  },
  leeum: {
    name: 'leeum', handle: '@leeum', followers: '4.6만',
    profile: '/profile-leeum.png',
    roas: '1.1x', clicks: 640, conversions: 3, cvr: '0.47%', cost: '350,000원',
    hasUtm: true,
    postingUrl: 'https://instagram.com/p/C5aBcDeFgHi/',
    postingDate: '2025.05.04',
    campaign: '루미에르 봄봄 프로모션',
    daily: [
      { date: '5/4',  clicks: 30,  conversions: 0 },
      { date: '5/5',  clicks: 95,  conversions: 1 },
      { date: '5/6',  clicks: 180, conversions: 1 },
      { date: '5/7',  clicks: 150, conversions: 1 },
      { date: '5/8',  clicks: 100, conversions: 0 },
      { date: '5/9',  clicks: 55,  conversions: 0 },
      { date: '5/10', clicks: 30,  conversions: 0 },
    ],
  },
  paooar: {
    name: 'paooar', handle: '@paooar', followers: '9.2만',
    profile: '/profile-paooar.png',
    roas: '0.8x', clicks: 310, conversions: 2, cvr: '0.65%', cost: '350,000원',
    hasUtm: false,
    postingUrl: 'https://instagram.com/p/C6jKlMnOpQr/',
    postingDate: '2025.05.05',
    campaign: '루미에르 봄봄 프로모션',
    daily: [
      { date: '5/5',  clicks: 20,  conversions: 0 },
      { date: '5/6',  clicks: 60,  conversions: 1 },
      { date: '5/7',  clicks: 90,  conversions: 1 },
      { date: '5/8',  clicks: 70,  conversions: 0 },
      { date: '5/9',  clicks: 40,  conversions: 0 },
      { date: '5/10', clicks: 20,  conversions: 0 },
      { date: '5/11', clicks: 10,  conversions: 0 },
    ],
  },
  'minj_': {
    name: 'minj_', handle: '@minj_', followers: '24.5만',
    profile: '/profile-kimminji.png',
    roas: '1.2x', clicks: 1240, conversions: 8, cvr: '0.65%', cost: '600,000원',
    hasUtm: true,
    postingUrl: 'https://instagram.com/p/C3sTuVwXyZa/',
    postingDate: '2025.03.14',
    campaign: '선크림 런칭 캠페인',
    daily: [
      { date: '3/14', clicks: 80,  conversions: 1 },
      { date: '3/15', clicks: 320, conversions: 3 },
      { date: '3/16', clicks: 420, conversions: 2 },
      { date: '3/17', clicks: 250, conversions: 1 },
      { date: '3/18', clicks: 100, conversions: 1 },
      { date: '3/19', clicks: 50,  conversions: 0 },
      { date: '3/20', clicks: 20,  conversions: 0 },
    ],
  },
  zigoo: {
    name: 'zigoo', handle: '@zigoo', followers: '8만',
    profile: '/profile-zigoo.png',
    roas: '0.9x', clicks: 560, conversions: 3, cvr: '0.54%', cost: '280,000원',
    hasUtm: true,
    postingUrl: 'https://instagram.com/p/C3bCdEfGhIj/',
    postingDate: '2025.03.16',
    campaign: '선크림 런칭 캠페인',
    daily: [
      { date: '3/16', clicks: 40,  conversions: 0 },
      { date: '3/17', clicks: 140, conversions: 1 },
      { date: '3/18', clicks: 180, conversions: 1 },
      { date: '3/19', clicks: 120, conversions: 1 },
      { date: '3/20', clicks: 50,  conversions: 0 },
      { date: '3/21', clicks: 20,  conversions: 0 },
      { date: '3/22', clicks: 10,  conversions: 0 },
    ],
  },
};

function MiniChart({ daily }: { daily: DailyStat[] }) {
  const maxClicks = Math.max(...daily.map(d => d.clicks), 1);
  return (
    <div className="flex gap-2">
      {/* Y축 */}
      <div className="relative shrink-0" style={{ height: CHART_H, width: 32 }}>
        {[maxClicks, Math.round(maxClicks * 0.5), 0].map((v, i) => (
          <span key={i} className="absolute text-[11px] leading-none w-full text-right"
            style={{ color: 'rgba(155,161,170,0.5)', top: `${i * 50}%`, transform: 'translateY(-50%)' }}>
            {v}
          </span>
        ))}
      </div>
      <div className="flex-1 flex flex-col">
        <div className="relative" style={{ height: CHART_H }}>
          {[0, 0.5, 1].map(t => (
            <div key={t} className="absolute w-full border-t border-[#E4E8F4]" style={{ top: `${t * 100}%` }} />
          ))}
          <div className="absolute inset-x-0 bottom-0 flex items-end">
            {daily.map(d => {
              const clickH = Math.round((d.clicks / maxClicks) * CHART_H);
              const convH = d.conversions > 0 ? Math.max(4, Math.round((d.conversions / maxClicks) * CHART_H)) : 0;
              return (
                <div key={d.date} className="flex-1 flex justify-center items-end gap-[2px]">
                  <div className="w-[14px] rounded-t-sm bg-[#A5A8F5]" style={{ height: clickH }} />
                  {convH > 0 && <div className="w-[14px] rounded-t-sm bg-[#6366F1]" style={{ height: convH }} />}
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex mt-2">
          {daily.map(d => (
            <div key={d.date} className="flex-1 text-center">
              <span className="text-[11px] font-medium" style={{ color: 'rgba(155,161,170,0.6)' }}>{d.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function IGBadge() {
  return (
    <img src="/skill-icons_instagram.svg" alt="ig" width={18} height={18}
      className="absolute" style={{ bottom: 0, right: -2, width: 18, height: 18 }} />
  );
}

export default function InfluencerDetailPerformancePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const inf = DETAIL_DATA[id];

  if (!inf) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-white max-w-[430px] mx-auto">
        <span className="text-[16px] font-medium text-[#B0ADA7]">데이터를 찾을 수 없어요.</span>
        <button onClick={() => router.back()} className="mt-4 text-[#6366F1] font-semibold active:opacity-70">돌아가기</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white max-w-[430px] mx-auto relative overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center px-5 h-[56px] border-b border-[#E8E7E4] bg-white shrink-0">
        <button onClick={() => router.back()} className="flex items-center justify-center active:opacity-60 mr-3" style={{ width: 36, height: 36 }}>
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
            <path d="M9 1L1 9L9 17" stroke="#1C1A17" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="flex flex-col">
          <span className="text-[17px] font-bold text-black leading-tight">{inf.name}</span>
          <span className="text-[13px] font-medium" style={{ color: '#B0ADA7' }}>{inf.handle}</span>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 bg-[#FAFBFE] overflow-y-auto pb-10">

        {/* ── 프로필 + 캠페인 정보 ── */}
        <div className="bg-white px-5 pt-6 pb-6 flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0" style={{ width: 56, height: 56 }}>
              <div className="w-full h-full rounded-full overflow-hidden bg-stone-200">
                <img src={inf.profile} alt={inf.name} className="w-full h-full object-cover" />
              </div>
              <IGBadge />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-end gap-1">
                <span className="text-[18px] font-bold text-black">{inf.name}</span>
                <span className="text-[14px]" style={{ color: '#78756E' }}>{inf.handle}</span>
              </div>
              <span className="text-[14px]" style={{ color: '#78756E' }}>팔로워 {inf.followers}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[13px] font-medium rounded-full px-[10px] py-[5px]"
              style={{ backgroundColor: '#F5F5F3', color: '#78756E' }}>
              {inf.campaign}
            </span>
            <span className="bg-[#F0FDF4] text-[#22C55E] text-[13px] font-semibold rounded-full px-[10px] py-[5px]">업로드완료</span>
            {inf.hasUtm && <span className="bg-[#EFF6FF] text-[#3D3FC7] text-[13px] font-semibold rounded-full px-[10px] py-[5px]">UTM 포함</span>}
          </div>
        </div>

        <div className="h-2 bg-stone-100" />

        {/* ── 핵심 지표 ── */}
        <div className="bg-white px-5 py-6 flex flex-col gap-4">
          <span className="text-[18px] font-bold text-black">핵심 지표</span>

          {/* ROAS 큰 카드 */}
          <div className="rounded-[14px] px-6 py-5 flex items-center justify-between"
            style={{ background: 'linear-gradient(135deg, #6366F1 0%, #818CF8 100%)' }}>
            <div className="flex flex-col gap-1">
              <span className="text-[14px] font-semibold text-white opacity-80">ROAS</span>
              <span className="text-[36px] font-extrabold text-white" style={MANROPE}>{inf.roas}</span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[13px] font-medium text-white opacity-70">집행 단가</span>
              <span className="text-[20px] font-bold text-white" style={MANROPE}>{inf.cost}</span>
            </div>
          </div>

          {/* 세부 지표 4개 */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { l: '총 클릭 수', v: inf.clicks.toLocaleString(), sub: 'UTM 추적' },
              { l: '추적 전환 수', v: inf.conversions.toString(), sub: null },
              { l: 'CVR', v: inf.cvr, sub: null },
              { l: 'CPC', v: `${Math.round((parseInt(inf.cost.replace(/[^0-9]/g, '')) / inf.clicks)).toLocaleString()}원`, sub: null },
            ].map(s => (
              <div key={s.l} className="bg-white border border-[#F0F2F8] rounded-[14px] p-5 flex flex-col gap-[6px]">
                <span className="text-[14px] font-medium text-[#78756E]">{s.l}</span>
                <span className="text-[20px] font-extrabold text-black" style={MANROPE}>{s.v}</span>
                {s.sub && (
                  <span className="self-start bg-[#F0FDF4] text-[#22C55E] text-[13px] font-semibold rounded-full px-[8px] py-[4px]">{s.sub}</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="h-2 bg-stone-100" />

        {/* ── 성과 추이 차트 ── */}
        <div className="bg-white px-5 py-6 flex flex-col gap-4">
          <span className="text-[18px] font-bold text-black">성과 추이</span>
          <div className="bg-[#F8FAFF] border border-[rgba(221,231,255,0.4)] rounded-[14px] px-[18px] pt-[24px] pb-[18px] flex flex-col gap-4">
            <MiniChart daily={inf.daily} />
            <div className="flex items-center justify-center gap-[14px]">
              <div className="flex items-center gap-[6px]">
                <div className="w-[10px] h-[10px] rounded-full bg-[#AFB2F6]" />
                <span className="text-[13px] text-[#9BA1AA]">클릭 수</span>
              </div>
              <div className="flex items-center gap-[6px]">
                <div className="w-[10px] h-[10px] rounded-full bg-[#6366F1]" />
                <span className="text-[13px] text-[#9BA1AA]">전환 수</span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-2 bg-stone-100" />

        {/* ── 포스팅 정보 ── */}
        <div className="bg-white px-5 py-6 flex flex-col gap-4">
          <span className="text-[18px] font-bold text-black">포스팅 정보</span>
          <div style={{ border: '1px solid #E8E7E4', borderRadius: 14, overflow: 'hidden' }}>
            <div className="flex items-center justify-between px-5 py-4 gap-3" style={{ backgroundColor: '#FAFAFA' }}>
              <div className="flex flex-col flex-1 min-w-0 gap-[3px]">
                <span className="text-[13px] font-medium" style={{ color: '#B0ADA7' }}>포스팅 URL</span>
                <span className="text-[14px] font-semibold truncate" style={{ color: '#6366F1', fontFamily: 'Manrope, sans-serif' }}>
                  {inf.postingUrl}
                </span>
              </div>
              <a href={inf.postingUrl} target="_blank" rel="noopener noreferrer"
                className="shrink-0 flex items-center justify-center active:opacity-70"
                style={{ width: 36, height: 36, backgroundColor: '#EEEEFF', borderRadius: 10 }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M7 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1V9" stroke="#6366F1" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 2h4v4" stroke="#6366F1" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 2L7.5 8.5" stroke="#6366F1" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </a>
            </div>
            <div className="flex items-center px-5 py-4 gap-3" style={{ borderTop: '1px solid #F0F0F0' }}>
              <span className="text-[13px] font-medium shrink-0" style={{ color: '#B0ADA7' }}>게시일</span>
              <span className="text-[15px] font-bold" style={{ color: '#1C1A17', fontFamily: 'Manrope, sans-serif' }}>{inf.postingDate}</span>
            </div>
          </div>

          {/* UTM 링크 */}
          {inf.hasUtm && (() => {
            const shortId = inf.handle.replace('@', '').slice(0, 6).padEnd(6, '0');
            const utmLink = `https://lumi.re/${shortId}`;
            return (
              <div style={{ border: '1px solid #EBEEF7', borderRadius: 14, overflow: 'hidden' }}>
                <div className="flex items-center justify-between px-5 py-4 gap-3" style={{ backgroundColor: '#FAFAFC' }}>
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="shrink-0">
                      <path d="M6.5 9.5a3.5 3.5 0 005 0l2-2a3.5 3.5 0 00-5-5l-1 1" stroke="#6366F1" strokeWidth="1.4" strokeLinecap="round"/>
                      <path d="M9.5 6.5a3.5 3.5 0 00-5 0l-2 2a3.5 3.5 0 005 5l1-1" stroke="#6366F1" strokeWidth="1.4" strokeLinecap="round"/>
                    </svg>
                    <span className="text-[14px] font-bold truncate" style={{ color: '#6366F1', fontFamily: 'Manrope, sans-serif' }}>{utmLink}</span>
                  </div>
                  <span className="text-[13px] font-semibold shrink-0" style={{ color: '#B0ADA7' }}>개인 UTM</span>
                </div>
              </div>
            );
          })()}
        </div>

      </div>
    </div>
  );
}
