'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Users, PlusCircle } from 'lucide-react';
import {
  SearchIcon, AlertIcon,
  HomeDisabledIcon, BriefSelectedIcon,
  BoardDisabledIcon, ReportDisabledIcon, MyDisabledIcon,
} from '@/components/Icons';

type CampaignStatus = '전체' | '기획' | '진행중' | '완료';

const FILTERS: CampaignStatus[] = ['전체', '마감 임박순' as any, '기획', '진행중', '완료'];

type Campaign = {
  id: number;
  title: string;
  status: '기획' | '진행중' | '완료';
  dateRange: string;
  influencerCount: string;
  progressLabel?: string;
  progressFraction?: string;
  progressPct?: number;
  briefDone: boolean;
};

const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 1,
    title: '루미에르 봄봄 프로모션',
    status: '진행중',
    dateRange: '4.17 ~ 4.26',
    influencerCount: '3',
    progressLabel: '업로드 완료',
    progressFraction: '1 / 3',
    progressPct: 1 / 3,
    briefDone: true,
  },
  {
    id: 2,
    title: '수분크림 마이크로 인플루언서',
    status: '기획',
    dateRange: '5.10 ~ 5.17',
    influencerCount: '-',
    briefDone: false,
  },
  {
    id: 3,
    title: '선크림 런칭 캠페인',
    status: '완료',
    dateRange: '3.23 ~ 3.29',
    influencerCount: '3',
    progressLabel: '전체 완료',
    progressFraction: '3 / 3',
    progressPct: 1,
    briefDone: true,
  },
];

const STATUS_STYLES: Record<Campaign['status'], { bg: string; text: string }> = {
  진행중: { bg: 'bg-[#fef6f1]', text: 'text-[#d96430]' },
  기획:   { bg: 'bg-[#fffbeb]', text: 'text-[#92400e]' },
  완료:   { bg: 'bg-[#f0fdf4]', text: 'text-[#26af58]' },
};

function DocumentIcon({ done }: { done: boolean }) {
  const color = done ? '#3d3fc7' : '#78756e';
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M3 2.5C3 1.95 3.45 1.5 4 1.5H9.5L13 5V13.5C13 14.05 12.55 14.5 12 14.5H4C3.45 14.5 3 14.05 3 13.5V2.5Z"
        stroke={color} strokeWidth="1.2" fill="none" strokeLinejoin="round"/>
      <path d="M9.5 1.5V5H13" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5.5 8H10.5M5.5 10.5H8.5" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

function CampaignCard({ campaign, onClick }: { campaign: Campaign; onClick?: () => void }) {
  const statusStyle = STATUS_STYLES[campaign.status];
  const hasProgress = campaign.progressPct !== undefined;

  return (
    <div onClick={onClick} className="bg-white rounded-[14px] border border-[#EBEEF7] px-5 py-[22px] flex flex-col gap-4 active:opacity-70 cursor-pointer">
      {/* Section 1: Title+status + Info row */}
      <div className="flex flex-col gap-[3px]">
        <div className="flex items-center justify-between">
          <span className="text-[16px] font-semibold text-black leading-[1.3] flex-1 pr-3">
            {campaign.title}
          </span>
          <span className={`${statusStyle.bg} ${statusStyle.text} text-[14px] font-semibold px-[10px] py-[5px] rounded-full shrink-0`}>
            {campaign.status}
          </span>
        </div>
        <div className="flex items-center gap-[14px]">
          <div className="flex items-center gap-[3px]">
            <Calendar size={16} className="shrink-0" style={{ color: '#78756E' }} />
            <span className="text-[14px] font-normal" style={{ color: '#78756E' }}>{campaign.dateRange}</span>
          </div>
          <div className="flex items-center gap-[2px]">
            <Users size={16} className="shrink-0" style={{ color: '#78756E' }} />
            <span className="text-[14px] font-normal" style={{ color: '#78756E' }}>
              인플루언서 {campaign.influencerCount}명 연결
            </span>
          </div>
        </div>
      </div>

      {/* Section 2: Progress bar */}
      {hasProgress && (
        <div className="flex flex-col gap-[6px]">
          <div className="flex items-center justify-between">
            <span className="text-[14px] font-medium" style={{ color: '#78756E' }}>{campaign.progressLabel}</span>
            <span className="text-[14px] font-medium" style={{ color: '#78756E' }}>{campaign.progressFraction}</span>
          </div>
          <div className="w-full h-[5px] bg-stone-200 rounded-full">
            <div
              className="h-full bg-iris-500 rounded-full"
              style={{ width: `${(campaign.progressPct ?? 0) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Section 3: Brief status */}
      <div className="flex items-center gap-[2px]">
        <DocumentIcon done={campaign.briefDone} />
        <span className={`text-[14px] font-semibold ${campaign.briefDone ? 'text-[#3d3fc7]' : 'text-[#78756E]'}`}>
          {campaign.briefDone ? '브리프 생성 완료' : '브리프 생성 필요'}
        </span>
      </div>
    </div>
  );
}

export default function CampaignPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<string>('전체');

  const filtered = activeFilter === '전체' || activeFilter === '마감 임박순'
    ? MOCK_CAMPAIGNS
    : MOCK_CAMPAIGNS.filter(c => c.status === activeFilter);

  return (
    <div className="flex flex-col h-screen bg-white max-w-[430px] mx-auto relative overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 h-[65px] border-b border-[#f0f2f8] bg-white shrink-0">
        <span className="text-[20px] font-bold text-stone-900 tracking-[-0.4px]">캠페인</span>
        <div className="flex items-center gap-3">
          <button className="active:opacity-60">
            <SearchIcon size={32} className="text-stone-900" />
          </button>
          <button className="relative active:opacity-60">
            <AlertIcon size={32} className="text-stone-900" />
            <span className="absolute top-0 right-0 w-[10px] h-[10px] bg-iris-500 rounded-full border-2 border-white" />
          </button>
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 bg-[#fafbfe] overflow-y-auto pb-[125px]">

        {/* Filter chips */}
        <div className="flex gap-2 px-5 pt-[26px] pb-4 overflow-x-auto scrollbar-none">
          {(['전체', '마감 임박순', '기획', '진행중', '완료'] as const).map(filter => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`shrink-0 px-[10px] py-[5px] rounded-full text-[14px] transition-all active:opacity-70
                  ${isActive
                    ? 'bg-[#6366F1] text-white font-semibold'
                    : 'border border-[#d4d2ce] text-[#899098] font-semibold bg-white'}`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        {/* Frame 294: cards + button */}
        <div className="flex flex-col gap-[20px] px-5">
          <div className="flex flex-col gap-[10px]">
            {filtered.map(campaign => (
              <CampaignCard key={campaign.id} campaign={campaign} onClick={() => router.push('/campaign/' + campaign.id)} />
            ))}
          </div>

          <button
            onClick={() => router.push('/campaign/new')}
            className="w-full h-[68px] flex items-center justify-center gap-[4px] rounded-[14px] active:opacity-70"
            style={{ backgroundColor: 'rgba(221, 223, 253, 0.3)' }}
          >
            <PlusCircle size={16} className="text-iris-500" />
            <span className="text-[16px] font-medium text-iris-500">캠페인 만들기</span>
          </button>
        </div>

      </div>

      {/* ── Bottom navigation ── */}
      <div className="absolute bottom-0 w-full h-[95px] flex items-start pt-[2px] bg-white border-t border-[#F5F5F3] z-20">
        {[
          { Icon: HomeDisabledIcon,   label: '홈',        active: false, onClick: () => router.push('/home') },
          { Icon: BriefSelectedIcon,  label: '캠페인',    active: true,  onClick: () => {} },
          { Icon: BoardDisabledIcon,  label: '보드',      active: false, onClick: () => router.push('/board') },
          { Icon: ReportDisabledIcon, label: '성과',      active: false, onClick: () => router.push('/performance') },
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
