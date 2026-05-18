'use client';

import { useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

const MANROPE: React.CSSProperties = { fontFamily: 'Manrope, sans-serif' };
const CHART_H = 130;

type DailyStat = { date: string; clicks: number; conversions: number };

type CampaignPerf = {
  campaignId: number;
  campaignTitle: string;
  campaignStatus: '진행중' | '완료' | '기획';
  roas: string;
  clicks: number;
  conversions: number;
  cvr: string;
  cost: string;
  hasUtm: boolean;
  postingUrl: string;
  postingDate: string;
  daily: DailyStat[];
};

type InfluencerFullDetail = {
  name: string;
  handle: string;
  followers: string;
  profile: string;
  avgRoas: string;
  totalClicks: number;
  totalConversions: number;
  avgCvr: string;
  campaigns: CampaignPerf[];
};

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  진행중: { bg: '#FEF6F1', text: '#D96430' },
  완료:   { bg: '#F0FDF4', text: '#26AF58' },
  기획:   { bg: '#FFFBEB', text: '#92400E' },
};

const DETAIL_DATA: Record<string, InfluencerFullDetail> = {
  dearyq: {
    name: 'dearyq', handle: '@dearyq', followers: '10.1만', profile: '/profile-dearyq.png',
    avgRoas: '1.6x', totalClicks: 2410, totalConversions: 14, avgCvr: '0.58%',
    campaigns: [
      {
        campaignId: 1, campaignTitle: '루미에르 봄봄 프로모션', campaignStatus: '진행중',
        roas: '1.4x', clicks: 820, conversions: 5, cvr: '0.61%', cost: '450,000원',
        hasUtm: true, postingUrl: 'https://instagram.com/p/C4xBkQFP5Xx/', postingDate: '2025.05.02',
        daily: [
          { date: '5/2', clicks: 48, conversions: 0 }, { date: '5/3', clicks: 72, conversions: 1 },
          { date: '5/4', clicks: 210, conversions: 2 }, { date: '5/5', clicks: 180, conversions: 1 },
          { date: '5/6', clicks: 140, conversions: 1 }, { date: '5/7', clicks: 95, conversions: 0 },
          { date: '5/8', clicks: 75, conversions: 0 },
        ],
      },
      {
        campaignId: 3, campaignTitle: '선크림 런칭 캠페인', campaignStatus: '완료',
        roas: '1.8x', clicks: 1240, conversions: 7, cvr: '0.56%', cost: '400,000원',
        hasUtm: true, postingUrl: 'https://instagram.com/p/C2yZaBcDeF/', postingDate: '2025.03.10',
        daily: [
          { date: '3/10', clicks: 60, conversions: 0 }, { date: '3/11', clicks: 190, conversions: 2 },
          { date: '3/12', clicks: 380, conversions: 3 }, { date: '3/13', clicks: 310, conversions: 1 },
          { date: '3/14', clicks: 180, conversions: 1 }, { date: '3/15', clicks: 80, conversions: 0 },
          { date: '3/16', clicks: 40, conversions: 0 },
        ],
      },
      {
        campaignId: 2, campaignTitle: '수분크림 마이크로 인플루언서', campaignStatus: '기획',
        roas: '1.6x', clicks: 350, conversions: 2, cvr: '0.57%', cost: '300,000원',
        hasUtm: false, postingUrl: 'https://instagram.com/p/C6mNoPqRsT/', postingDate: '2025.04.20',
        daily: [
          { date: '4/20', clicks: 30, conversions: 0 }, { date: '4/21', clicks: 80, conversions: 1 },
          { date: '4/22', clicks: 110, conversions: 1 }, { date: '4/23', clicks: 70, conversions: 0 },
          { date: '4/24', clicks: 40, conversions: 0 }, { date: '4/25', clicks: 15, conversions: 0 },
          { date: '4/26', clicks: 5, conversions: 0 },
        ],
      },
    ],
  },
  leeum: {
    name: 'leeum', handle: '@leeum', followers: '4.6만', profile: '/profile-leeum.png',
    avgRoas: '1.3x', totalClicks: 1280, totalConversions: 7, avgCvr: '0.55%',
    campaigns: [
      {
        campaignId: 1, campaignTitle: '루미에르 봄봄 프로모션', campaignStatus: '진행중',
        roas: '1.1x', clicks: 640, conversions: 3, cvr: '0.47%', cost: '350,000원',
        hasUtm: true, postingUrl: 'https://instagram.com/p/C5aBcDeFgHi/', postingDate: '2025.05.04',
        daily: [
          { date: '5/4', clicks: 30, conversions: 0 }, { date: '5/5', clicks: 95, conversions: 1 },
          { date: '5/6', clicks: 180, conversions: 1 }, { date: '5/7', clicks: 150, conversions: 1 },
          { date: '5/8', clicks: 100, conversions: 0 }, { date: '5/9', clicks: 55, conversions: 0 },
          { date: '5/10', clicks: 30, conversions: 0 },
        ],
      },
      {
        campaignId: 3, campaignTitle: '선크림 런칭 캠페인', campaignStatus: '완료',
        roas: '1.5x', clicks: 640, conversions: 4, cvr: '0.63%', cost: '320,000원',
        hasUtm: true, postingUrl: 'https://instagram.com/p/C3kLmNoPqR/', postingDate: '2025.03.12',
        daily: [
          { date: '3/12', clicks: 40, conversions: 0 }, { date: '3/13', clicks: 120, conversions: 1 },
          { date: '3/14', clicks: 200, conversions: 2 }, { date: '3/15', clicks: 160, conversions: 1 },
          { date: '3/16', clicks: 80, conversions: 0 }, { date: '3/17', clicks: 30, conversions: 0 },
          { date: '3/18', clicks: 10, conversions: 0 },
        ],
      },
    ],
  },
  paooar: {
    name: 'paooar', handle: '@paooar', followers: '9.2만', profile: '/profile-paooar.png',
    avgRoas: '0.9x', totalClicks: 980, totalConversions: 5, avgCvr: '0.51%',
    campaigns: [
      {
        campaignId: 1, campaignTitle: '루미에르 봄봄 프로모션', campaignStatus: '진행중',
        roas: '0.8x', clicks: 310, conversions: 2, cvr: '0.65%', cost: '350,000원',
        hasUtm: false, postingUrl: 'https://instagram.com/p/C6jKlMnOpQr/', postingDate: '2025.05.05',
        daily: [
          { date: '5/5', clicks: 20, conversions: 0 }, { date: '5/6', clicks: 60, conversions: 1 },
          { date: '5/7', clicks: 90, conversions: 1 }, { date: '5/8', clicks: 70, conversions: 0 },
          { date: '5/9', clicks: 40, conversions: 0 }, { date: '5/10', clicks: 20, conversions: 0 },
          { date: '5/11', clicks: 10, conversions: 0 },
        ],
      },
      {
        campaignId: 3, campaignTitle: '선크림 런칭 캠페인', campaignStatus: '완료',
        roas: '1.0x', clicks: 670, conversions: 3, cvr: '0.45%', cost: '300,000원',
        hasUtm: true, postingUrl: 'https://instagram.com/p/C3sTuVwXyZb/', postingDate: '2025.03.15',
        daily: [
          { date: '3/15', clicks: 50, conversions: 0 }, { date: '3/16', clicks: 160, conversions: 1 },
          { date: '3/17', clicks: 220, conversions: 1 }, { date: '3/18', clicks: 140, conversions: 1 },
          { date: '3/19', clicks: 70, conversions: 0 }, { date: '3/20', clicks: 20, conversions: 0 },
          { date: '3/21', clicks: 10, conversions: 0 },
        ],
      },
    ],
  },
  'minj_': {
    name: 'minj_', handle: '@minj_', followers: '24.5만', profile: '/profile-kimminji.png',
    avgRoas: '1.2x', totalClicks: 1800, totalConversions: 10, avgCvr: '0.56%',
    campaigns: [
      {
        campaignId: 3, campaignTitle: '선크림 런칭 캠페인', campaignStatus: '완료',
        roas: '1.2x', clicks: 1240, conversions: 8, cvr: '0.65%', cost: '600,000원',
        hasUtm: true, postingUrl: 'https://instagram.com/p/C3sTuVwXyZa/', postingDate: '2025.03.14',
        daily: [
          { date: '3/14', clicks: 80, conversions: 1 }, { date: '3/15', clicks: 320, conversions: 3 },
          { date: '3/16', clicks: 420, conversions: 2 }, { date: '3/17', clicks: 250, conversions: 1 },
          { date: '3/18', clicks: 100, conversions: 1 }, { date: '3/19', clicks: 50, conversions: 0 },
          { date: '3/20', clicks: 20, conversions: 0 },
        ],
      },
      {
        campaignId: 1, campaignTitle: '루미에르 봄봄 프로모션', campaignStatus: '진행중',
        roas: '1.2x', clicks: 560, conversions: 2, cvr: '0.36%', cost: '350,000원',
        hasUtm: true, postingUrl: 'https://instagram.com/p/C5xYzAbCdE/', postingDate: '2025.05.03',
        daily: [
          { date: '5/3', clicks: 40, conversions: 0 }, { date: '5/4', clicks: 120, conversions: 1 },
          { date: '5/5', clicks: 180, conversions: 1 }, { date: '5/6', clicks: 130, conversions: 0 },
          { date: '5/7', clicks: 60, conversions: 0 }, { date: '5/8', clicks: 20, conversions: 0 },
          { date: '5/9', clicks: 10, conversions: 0 },
        ],
      },
    ],
  },
  zigoo: {
    name: 'zigoo', handle: '@zigoo', followers: '8만', profile: '/profile-zigoo.png',
    avgRoas: '0.7x', totalClicks: 560, totalConversions: 3, avgCvr: '0.54%',
    campaigns: [
      {
        campaignId: 3, campaignTitle: '선크림 런칭 캠페인', campaignStatus: '완료',
        roas: '0.9x', clicks: 560, conversions: 3, cvr: '0.54%', cost: '280,000원',
        hasUtm: true, postingUrl: 'https://instagram.com/p/C3bCdEfGhIj/', postingDate: '2025.03.16',
        daily: [
          { date: '3/16', clicks: 40, conversions: 0 }, { date: '3/17', clicks: 140, conversions: 1 },
          { date: '3/18', clicks: 180, conversions: 1 }, { date: '3/19', clicks: 120, conversions: 1 },
          { date: '3/20', clicks: 50, conversions: 0 }, { date: '3/21', clicks: 20, conversions: 0 },
          { date: '3/22', clicks: 10, conversions: 0 },
        ],
      },
    ],
  },
};

function MiniChart({ daily }: { daily: DailyStat[] }) {
  const maxClicks = Math.max(...daily.map(d => d.clicks), 1);
  return (
    <div className="flex gap-2">
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

function CampaignCard({ c, defaultOpen }: { c: CampaignPerf; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-[#EBEEF7] rounded-[14px] overflow-hidden bg-white">
      {/* 헤더 (항상 표시) */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 active:opacity-70"
        style={{ backgroundColor: open ? '#F8FAFF' : '#FFFFFF' }}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-[15px] font-bold text-black truncate">{c.campaignTitle}</span>
          <span
            className="text-[12px] font-semibold rounded-full px-[8px] py-[3px] shrink-0"
            style={{ backgroundColor: STATUS_STYLE[c.campaignStatus].bg, color: STATUS_STYLE[c.campaignStatus].text }}
          >
            {c.campaignStatus}
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0 ml-2">
          <span className="text-[16px] font-extrabold" style={{ ...MANROPE, color: '#1C1A17' }}>{c.roas}</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
            <path d="M4 6l4 4 4-4" stroke="#899098" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </button>

      {/* 펼쳐지는 내용 */}
      {open && (
        <div className="flex flex-col gap-4 px-5 pb-5 pt-1">
          {/* 태그 */}
          <div className="flex items-center gap-1">
            <span className="bg-[#F0FDF4] text-[#22C55E] text-[13px] font-semibold rounded-full px-[10px] py-[4px]">업로드완료</span>
            {c.hasUtm && <span className="bg-[#EFF6FF] text-[#3D3FC7] text-[13px] font-semibold rounded-full px-[10px] py-[4px]">UTM 포함</span>}
          </div>

          {/* 지표 */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { l: '클릭', v: c.clicks.toLocaleString() },
              { l: '전환', v: c.conversions.toString() },
              { l: 'CVR', v: c.cvr },
              { l: '집행 단가', v: c.cost },
            ].map(s => (
              <div key={s.l} className="bg-[#F8FAFF] border border-[#F0F2F8] rounded-[12px] px-4 py-3 flex flex-col gap-[4px]">
                <span className="text-[13px] font-medium text-[#78756E]">{s.l}</span>
                <span className="text-[17px] font-extrabold text-black" style={MANROPE}>{s.v}</span>
              </div>
            ))}
          </div>

          {/* 차트 */}
          <div className="bg-[#F8FAFF] border border-[rgba(221,231,255,0.4)] rounded-[12px] px-4 pt-5 pb-4 flex flex-col gap-3">
            <MiniChart daily={c.daily} />
            <div className="flex items-center justify-center gap-[14px]">
              <div className="flex items-center gap-[5px]">
                <div className="w-[8px] h-[8px] rounded-full bg-[#AFB2F6]" />
                <span className="text-[12px] text-[#9BA1AA]">클릭 수</span>
              </div>
              <div className="flex items-center gap-[5px]">
                <div className="w-[8px] h-[8px] rounded-full bg-[#6366F1]" />
                <span className="text-[12px] text-[#9BA1AA]">전환 수</span>
              </div>
            </div>
          </div>

          {/* 포스팅 정보 */}
          <div style={{ border: '1px solid #E8E7E4', borderRadius: 12, overflow: 'hidden' }}>
            <div className="flex items-center justify-between px-4 py-3 gap-3" style={{ backgroundColor: '#FAFAFA' }}>
              <div className="flex flex-col flex-1 min-w-0 gap-[2px]">
                <span className="text-[12px] font-medium" style={{ color: '#B0ADA7' }}>포스팅 URL</span>
                <span className="text-[13px] font-semibold truncate" style={{ color: '#6366F1', fontFamily: 'Manrope, sans-serif' }}>
                  {c.postingUrl}
                </span>
              </div>
              <a href={c.postingUrl} target="_blank" rel="noopener noreferrer"
                className="shrink-0 flex items-center justify-center active:opacity-70"
                style={{ width: 32, height: 32, backgroundColor: '#EEEEFF', borderRadius: 8 }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M7 3H3a1 1 0 00-1 1v9a1 1 0 001 1h9a1 1 0 001-1V9" stroke="#6366F1" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 2h4v4" stroke="#6366F1" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M14 2L7.5 8.5" stroke="#6366F1" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              </a>
            </div>
            <div className="flex items-center px-4 py-3 gap-3" style={{ borderTop: '1px solid #F0F0F0' }}>
              <span className="text-[12px] font-medium shrink-0" style={{ color: '#B0ADA7' }}>게시일</span>
              <span className="text-[14px] font-bold" style={{ color: '#1C1A17', fontFamily: 'Manrope, sans-serif' }}>{c.postingDate}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PageContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const fromCampaignId = searchParams.get('cid') ? Number(searchParams.get('cid')) : null;

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

        {/* ── 프로필 ── */}
        <div className="bg-white px-5 pt-6 pb-6 flex items-center gap-4">
          <div className="relative shrink-0" style={{ width: 52, height: 52 }}>
            <div className="w-full h-full rounded-full overflow-hidden bg-stone-200">
              <img src={inf.profile} alt={inf.name} className="w-full h-full object-cover" />
            </div>
            <img src="/skill-icons_instagram.svg" alt="ig" width={16} height={16}
              className="absolute" style={{ bottom: 0, right: -2, width: 16, height: 16 }} />
          </div>
          <div className="flex flex-col gap-[2px]">
            <div className="flex items-end gap-1">
              <span className="text-[17px] font-bold text-black">{inf.name}</span>
              <span className="text-[14px]" style={{ color: '#78756E' }}>{inf.handle}</span>
            </div>
            <span className="text-[14px]" style={{ color: '#78756E' }}>팔로워 {inf.followers} · {inf.campaigns.length}개 캠페인 참여</span>
          </div>
        </div>

        <div className="h-2 bg-stone-100" />

        {/* ── 누적 지표 ── */}
        <div className="bg-white px-5 py-6 flex flex-col gap-4">
          <span className="text-[18px] font-bold text-black">누적 성과</span>

          {/* 평균 ROAS 큰 카드 */}
          <div className="rounded-[14px] px-6 py-5 flex items-center justify-between"
            style={{ background: 'linear-gradient(135deg, #6366F1 0%, #818CF8 100%)' }}>
            <div className="flex flex-col gap-1">
              <span className="text-[14px] font-semibold text-white opacity-80">평균 ROAS</span>
              <span className="text-[36px] font-extrabold text-white" style={MANROPE}>{inf.avgRoas}</span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-[13px] font-medium text-white opacity-70">참여 캠페인</span>
              <span className="text-[22px] font-bold text-white" style={MANROPE}>{inf.campaigns.length}개</span>
            </div>
          </div>

          {/* 누적 지표 3개 */}
          <div className="flex gap-2">
            {[
              { l: '누적 클릭', v: inf.totalClicks.toLocaleString() },
              { l: '누적 전환', v: inf.totalConversions.toString() },
              { l: '평균 CVR', v: inf.avgCvr },
            ].map(s => (
              <div key={s.l} className="flex-1 bg-white border border-[#F0F2F8] rounded-[14px] p-4 flex flex-col gap-[6px]">
                <span className="text-[13px] font-medium text-[#78756E]">{s.l}</span>
                <span className="text-[18px] font-extrabold text-black" style={MANROPE}>{s.v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="h-2 bg-stone-100" />

        {/* ── 캠페인별 성과 ── */}
        <div className="bg-white px-5 py-6 flex flex-col gap-3">
          <span className="text-[18px] font-bold text-black">캠페인별 성과</span>
          {inf.campaigns.map(c => (
            <CampaignCard
              key={c.campaignId}
              c={c}
              defaultOpen={fromCampaignId === c.campaignId || (fromCampaignId === null && inf.campaigns.indexOf(c) === 0)}
            />
          ))}
        </div>

      </div>
    </div>
  );
}

export default function InfluencerDetailPerformancePage() {
  return (
    <Suspense>
      <PageContent />
    </Suspense>
  );
}
