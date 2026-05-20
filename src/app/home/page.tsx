'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  HomeSelectedIcon,
  BriefDisabledIcon,
  BoardDisabledIcon,
  ReportDisabledIcon,
  MyDisabledIcon,
} from '@/components/Icons';


const STAGES = [
  { id: 'list-up', label: '리스트업', count: '-' },
  { id: 'contacting', label: '컨택', count: '3' },
  { id: 'negotiating', label: '협의중', count: '2' },
  { id: 'reviewing', label: '시안확인', count: '2' },
  { id: 'uploaded', label: '업로드완료', count: '1' },
];

const KPI_DATA = [
  { id: 'click', label: '클릭',     value: '820'  },
  { id: 'conv',  label: '전환',     value: '5'    },
  { id: 'roas',  label: '평균 ROAS', value: '140%' },
];

const URGENT_ITEMS = [
  {
    id: 1,
    icon: '/draft-icon-1.svg',
    title: '시안 확인 필요 - leeum님',
    subtitle: '내일 포스팅 예정 - 최종 승인 확인',
    href: '/board/6',
  },
  {
    id: 2,
    icon: '/followup-icon.svg',
    title: '미응답 팔로업 - haye0님 외 2명',
    subtitle: '브리프 전송 26일 경과',
    href: '/board?tab=contacting',
  },
  {
    id: 3,
    icon: '/draft-icon.svg',
    title: '박진이님 시안 전달 독촉',
    subtitle: '시안 전달 예정일 2일 초과',
    href: '/board/8',
  },
];

const AI_INSIGHTS = [
  {
    id: 1,
    highlight: 'haye0님 외 2명이 브리프 전송 후 26일째 미응답',
    text: '이에요. 리스트에서 제거하거나 팔로업을 보내보세요.',
    action: '응답 상태 확인',
    href: '/board?tab=contacting',
  },
  {
    id: 2,
    highlight: 'dearyq님의 콘텐츠가 업로드 D+1 – 클릭 820건 유입 중',
    text: '이에요. 초기 UTM 성과를 확인해보세요.',
    action: '성과 보기',
    href: '/performance/influencers/dearyq',
  },
];

type StageBadge = { label: string; bg: string; text: string };
type StatusBadge = { label: string; bg: string; text: string };

type InfluencerRank = {
  id: string;
  name: string;
  handle: string;
  followers: string;
  profileImg: string;
  roas?: string;
  clicks?: string;
  stage?: StageBadge;
  status?: StatusBadge;
};

const INFLUENCER_RANKS: InfluencerRank[] = [
  { id: '1', name: 'dearyq', handle: '@dearyq', followers: '10.1만', profileImg: '/profile-dearyq.png', roas: '140%', clicks: '820' },
  { id: '2', name: 'paooar', handle: '@paooar', followers: '9.2만', profileImg: '/profile-paooar.png', roas: '-', clicks: '-' },
  {
    id: '3', name: 'leeum', handle: '@leeum', followers: '4.6만', profileImg: '/profile-leeum.png',
    stage: { label: '시안확인', bg: 'bg-[#f0fdf4]', text: 'text-[#22c55e]' },
    status: { label: '포스팅 D-1', bg: 'bg-[#f5f5f3]', text: 'text-stone-600' }
  },
  {
    id: '4', name: '이가흔', handle: '@gaaa934', followers: '2.4만', profileImg: '/profile-igaheun.png',
    stage: { label: '시안확인', bg: 'bg-[#f0fdf4]', text: 'text-[#22c55e]' },
    status: { label: '수정본 D-2', bg: 'bg-[#fffbeb]', text: 'text-[#f59e0b]' }
  },
  {
    id: '5', name: '박진이', handle: '@jinstlee', followers: '6.8만', profileImg: '/profile-parkjini.png',
    stage: { label: '협의중', bg: 'bg-[#fef6f1]', text: 'text-[#d96430]' },
    status: { label: '보류', bg: 'bg-[#f5f5f3]', text: 'text-stone-600' }
  },
  {
    id: '6', name: 'haye0', handle: '@haye0', followers: '10.4만', profileImg: '/profile-haye0.png',
    stage: { label: '컨택', bg: 'bg-[#eef2ff]', text: 'text-iris-600' },
    status: { label: '미응답', bg: 'bg-[#fef2f2]', text: 'text-red-500' }
  },
  {
    id: '7', name: 'zigoo', handle: '@zigoo', followers: '2만', profileImg: '/profile-zigoo.png',
    stage: { label: '컨택', bg: 'bg-[#eef2ff]', text: 'text-iris-600' },
    status: { label: '미응답', bg: 'bg-[#fef2f2]', text: 'text-red-500' }
  },
  {
    id: '8', name: '김지영', handle: '@jijizero', followers: '21만', profileImg: '/profile-kimjiyoung.png',
    stage: { label: '컨택', bg: 'bg-[#eef2ff]', text: 'text-iris-600' },
    status: { label: '미응답', bg: 'bg-[#fef2f2]', text: 'text-red-500' }
  },
  {
    id: '9', name: 'minj_', handle: '@minj_', followers: '24.9만', profileImg: '/profile-kimminji.png',
    stage: { label: '리스트업', bg: 'bg-[#f5f5f3]', text: 'text-stone-600' }
  },
  {
    id: '10', name: '박서연', handle: '@ppseo0', followers: '4만', profileImg: '/profile-parkseo.png',
    stage: { label: '리스트업', bg: 'bg-[#f5f5f3]', text: 'text-stone-600' }
  },
];

const RANK_FILTERS = ['ROAS순', '클릭순'];

type ActiveCampaign = {
  id: number; type: 'active';
  status: string; statusBg: string; statusText: string;
  name: string; progress: string; dday: string; progressPct: number;
};
type PlanningCampaign = {
  id: number; type: 'planning';
  status: string; statusBg: string; statusText: string;
  name: string; progress: string; dday: string;
};
type CompletedCampaign = {
  id: number; type: 'completed';
  status: string; statusBg: string; statusText: string;
  name: string; roas: string; clicks: string;
  influencerCount: string; completedMonth: string;
};
type Campaign = ActiveCampaign | PlanningCampaign | CompletedCampaign;

const CAMPAIGNS: Campaign[] = [
  {
    id: 1, type: 'active', status: '진행중', statusBg: 'bg-[#fef6f1]', statusText: 'text-[#d96430]',
    name: '루미에르\n봄봄 프로모션', progress: '업로드 1/11', dday: 'D-8', progressPct: 1 / 11
  },
  {
    id: 2, type: 'planning', status: '기획', statusBg: 'bg-[#f5f5f3]', statusText: 'text-[#5C5A54]',
    name: '수분크림 마이크로\n인플루언서', progress: '리스트업 2명', dday: 'D-34'
  },
  {
    id: 3, type: 'completed', status: '완료', statusBg: 'bg-[#f0fdf4]', statusText: 'text-[#166534]',
    name: '루미에르\n스킨케어 신제품 런칭', roas: '410%', clicks: '29.2x',
    influencerCount: '인플루언서 6명', completedMonth: '3월 완료'
  },
  {
    id: 4, type: 'completed', status: '완료', statusBg: 'bg-[#f0fdf4]', statusText: 'text-[#166534]',
    name: '단독 루미에르\n콜라보', roas: '320%', clicks: '18.2x',
    influencerCount: '인플루언서 1명', completedMonth: '1월 완료'
  },
];

export default function HomePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'현황' | '인플루언서'>('현황');
  const [rankFilter, setRankFilter] = useState('ROAS순');
  const [fabOpen, setFabOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col h-screen bg-white max-w-[430px] mx-auto relative overflow-hidden">

      {/* ── Fixed nav bar ── */}
      <div className="shrink-0" style={{ background: '#8486F3' }}>
        <div className="px-5 flex items-center justify-between h-[65px]">
          <img src="/woven-logo.svg" alt="Woven" width={76.14} height={13.66} />
          <div className="flex items-center gap-2">
            <div className="w-[30px] h-[30px] rounded-full bg-[#f7b898] flex items-center justify-center">
              <span className="text-white text-[14px] font-semibold">김</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden pb-[95px]">

        {/* Gradient greeting + tabs (scrolls away) */}
        <div style={{ background: '#8486F3' }}>
          <div className="px-5">
            {/* Greeting */}
            <div className="pt-[36px] pb-[50px]">
              <p className="text-[17px] font-semibold text-white mb-2">✳︎ 안녕하세요, 김지은님!</p>
              <p className="text-[22px] font-bold text-white leading-[1.45]">
                현재 진행 중인 캠페인은<br />루미에르 봄봄 프로모션이에요.
              </p>
            </div>
          </div>

          {/* Tab toggle - Folder UI */}
          <div className="flex items-end px-0">
            {/* 현황 탭 */}
            <button
              onClick={() => setActiveTab('현황')}
              className={`flex-1 pt-[14px] pb-[12px] text-[15px] transition-all relative
                ${activeTab === '현황'
                  ? 'bg-white text-stone-900 font-bold rounded-t-[18px] z-10'
                  : 'bg-white/15 text-white/70 font-medium rounded-t-[18px] z-0 hover:bg-white/20'}`}
            >
              현황
              {activeTab === '현황' && (
                <svg className="absolute bottom-0 -right-[20px] text-white" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M0 0C0 11.0457 8.9543 20 20 20H0V0Z" fill="currentColor" />
                </svg>
              )}
            </button>

            {/* 인플루언서 탭 */}
            <button
              onClick={() => setActiveTab('인플루언서')}
              className={`flex-1 pt-[14px] pb-[12px] text-[15px] transition-all relative
                ${activeTab === '인플루언서'
                  ? 'bg-white text-stone-900 font-bold rounded-t-[18px] z-10'
                  : 'bg-white/15 text-white/70 font-medium rounded-t-[18px] z-0 hover:bg-white/20'}`}
            >
              인플루언서
              {activeTab === '인플루언서' && (
                <svg className="absolute bottom-0 -left-[20px] text-white" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M20 0C20 11.0457 11.0457 20 0 20H20V0Z" fill="currentColor" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Tab content */}
        <div className="bg-[#F5F5F3]">

          {activeTab === '인플루언서' && (
            <>
              {/* 성과 순위 */}
              <div className="bg-white px-5 pt-[40px] pb-[40px] mb-[14px]">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[20px] font-bold text-stone-900">성과 순위</h2>
                  <div className="flex gap-2 overflow-x-auto scrollbar-none">
                    {RANK_FILTERS.map(f => (
                      <button
                        key={f}
                        onClick={() => setRankFilter(f)}
                        className={`shrink-0 px-[10px] py-[5px] rounded-full text-[14px] transition-all active:opacity-70
                        ${rankFilter === f
                            ? 'bg-[#6366F1] text-white font-semibold'
                            : 'border border-[#d4d2ce] text-[#899098] font-semibold bg-white'}`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Influencer rows */}
                {INFLUENCER_RANKS.map((inf, i) => (
                  <div
                    key={inf.id}
                    onClick={() => router.push('/performance/influencers/' + inf.handle.replace('@', ''))}
                    className={`flex items-center justify-between py-[14px] cursor-pointer active:opacity-70
                    ${i < INFLUENCER_RANKS.length - 1 ? 'border-b border-[#f0f2f8]' : ''}`}
                  >
                    {/* Left: avatar + info */}
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <div className="w-10 h-10 rounded-full bg-stone-200 overflow-hidden">
                          <img src={inf.profileImg} alt={inf.name} className="w-full h-full object-cover" />
                        </div>
                        <img src="/skill-icons_instagram.svg" alt="ig" className="absolute w-4 h-4 bottom-0 -right-[1px]" />
                      </div>
                      <div className="flex flex-col gap-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[16px] font-semibold text-black">{inf.name}</span>
                          <span className="text-[14px] text-stone-500">{inf.handle}</span>
                        </div>
                        <span className="text-[12px] text-stone-500">{inf.followers}</span>
                      </div>
                    </div>

                    {/* Right: stats or stage badges */}
                    {inf.roas !== undefined ? (
                      <div className="flex gap-4">
                        <div className="text-right">
                          <p className="text-[20px] font-extrabold text-stone-900 leading-none">{inf.roas}</p>
                          <p className="text-[12px] font-semibold text-stone-600 mt-0.5">ROAS</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[20px] font-extrabold text-stone-900 leading-none">{inf.clicks}</p>
                          <p className="text-[12px] font-semibold text-stone-600 mt-0.5">CLICKS</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        {inf.stage && (
                          <span className={`${inf.stage.bg} ${inf.stage.text} text-[14px] font-semibold px-[10px] py-[5px] rounded-full`}>
                            {inf.stage.label}
                          </span>
                        )}
                        {inf.status && (
                          <span className={`${inf.status.bg} ${inf.status.text} text-[14px] font-semibold px-[10px] py-[5px] rounded-full`}>
                            {inf.status.label}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Campaign summary - 현황 탭만 */}
          {activeTab === '현황' && (
            <>
              <div className="bg-white px-5 py-[40px] mb-[14px]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[20px] font-bold text-stone-900">루미에르 봄봄 프로모션</span>
                  <span className="bg-iris-500 text-white text-[14px] font-semibold rounded-full shrink-0 ml-2" style={{ padding: '5px 10px' }}>D-8</span>
                </div>
                <p className="text-[14px] font-medium text-[#8995a2] mb-[32px]">
                  4월 26일 마감 &nbsp;·&nbsp; 오늘 오전 8:41
                </p>

                {/* Stage counts */}
                <div className="flex justify-between mb-[30px]">
                  {STAGES.map(stage => (
                    <div key={stage.id} className="flex flex-col items-center w-[70px]">
                      <span className="text-[22px] font-bold text-stone-900 leading-none">{stage.count}</span>
                      <span className="text-[14px] text-stone-800 mt-1.5">{stage.label}</span>
                    </div>
                  ))}
                </div>

                {/* KPI blocks */}
                <div className="flex gap-[11px]">
                  {KPI_DATA.map(kpi => (
                    <div
                      key={kpi.id}
                      className="flex-1 min-w-0 bg-white border border-[#ebeef7] rounded-[14px] px-5 py-[22px] flex flex-col gap-3"
                    >
                      <p className="text-[14px] font-medium leading-none" style={{ color: '#5C5A54' }}>{kpi.label}</p>
                      <p className="text-[24px] font-bold text-black leading-none">{kpi.value}</p>
                    </div>
                  ))}
                </div>

                {/* Urgent section */}
                <h2 className="text-[16px] font-bold text-stone-900 mb-3 pt-[40px]">긴급 확인 필요</h2>
                <div className="flex flex-col gap-3">
                  {URGENT_ITEMS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => router.push(item.href)}
                      className="w-full flex items-center justify-between p-5 bg-white rounded-[14px] border border-[#ebeef7] active:opacity-70"
                    >
                      <div className="flex items-center gap-3">
                        <img src={item.icon} alt="" width={52} height={52} className="shrink-0" />
                        <div className="flex flex-col gap-1 text-left">
                          <p className="text-[16px] font-semibold text-black">{item.title}</p>
                          <p className="text-[14px] text-black">{item.subtitle}</p>
                        </div>
                      </div>
                      <img src="/arrow-right.svg" alt="" width={20} height={20} className="shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              </div>

            </>
          )}

          {/* AI 인사이트 */}
          <div className="bg-white pt-[40px] pb-[40px] mb-[14px]">
            <h2 className="text-[20px] font-bold text-stone-900 px-5 mb-4">AI 인사이트</h2>
            <div className="flex gap-3 overflow-x-auto px-5 pb-1 scrollbar-none">
              {AI_INSIGHTS.map(insight => (
                <div
                  key={insight.id}
                  className="w-[260px] shrink-0 bg-[#f8faff] rounded-2xl p-5 flex flex-col"
                >
                  {/* Star icon */}
                  <img src="/star-icon.png" alt="" width={24} height={24} className="mb-3" />
                  <p className="text-[15px] text-black leading-[1.5] flex-1 mb-4">
                    <span style={{ color: '#4F52E0' }} className="font-semibold">{insight.highlight}</span>{insight.text}
                  </p>
                  <button
                    onClick={() => router.push(insight.href)}
                    className="bg-iris-500 rounded-xl py-[11px] active:opacity-80"
                  >
                    <span className="text-white text-[15px] font-semibold">{insight.action}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 전체 캠페인 */}
          <div className="bg-white pt-[40px] pb-[40px] mb-[14px]">
            <div className="flex items-center justify-between px-5 mb-4">
              <h2 className="text-[20px] font-bold text-stone-900">전체 캠페인</h2>
              <button
                onClick={() => router.push('/campaign')}
                className="border border-[#D4D2CE] rounded-full px-[10px] py-[5px] text-[14px] font-semibold text-[#78756E] active:opacity-70"
              >더보기</button>
            </div>
            <div className="flex gap-[17px] overflow-x-auto px-5 pb-1 scrollbar-none">
              {CAMPAIGNS.map(campaign => (
                <div
                  key={campaign.id}
                  className={`w-[200px] shrink-0 bg-white border border-[#ebeef7] rounded-[14px] p-5 flex flex-col ${campaign.type === 'active' || campaign.type === 'planning' ? 'justify-between' : 'gap-[14px]'}`}
                >
                  {/* Title box */}
                  <div className="flex flex-col gap-[14px]">
                    <span className={`${campaign.statusBg} ${campaign.statusText} text-[14px] font-semibold px-[10px] py-[5px] rounded-full self-start`}>
                      {campaign.status}
                    </span>
                    <p className="text-[16px] font-bold text-black leading-[1.35] whitespace-pre-line">{campaign.name}</p>
                  </div>
                  {/* Active: progress bar */}
                  {campaign.type === 'active' && (
                    <div className="flex flex-col gap-[13px]">
                      <div className="relative w-full h-[3px] bg-[#D9D9D9] rounded-[20px]">
                        <div className="absolute top-0 left-0 h-full bg-iris-500 rounded-[20px]"
                          style={{ width: `${campaign.progressPct * 100}%` }} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[14px] font-semibold" style={{ color: '#78756E' }}>{campaign.progress}</span>
                        <span className="text-[14px] font-semibold text-[#D96430]">{campaign.dday}</span>
                      </div>
                    </div>
                  )}
                  {campaign.type === 'planning' && (
                    <div className="flex items-center justify-between pt-[14px] border-t border-[#ebeef7]">
                      <span className="text-[14px] font-semibold" style={{ color: '#78756E' }}>{campaign.progress}</span>
                      <span className="text-[14px] font-semibold text-[#D96430]">{campaign.dday}</span>
                    </div>
                  )}
                  {/* Completed: titlebox (border-bottom) + info */}
                  {campaign.type === 'completed' && (
                    <>
                      {/* analysis inside titlebox with bottom border */}
                      <div className="flex gap-5 pb-[14px] border-b border-[#ebeef7]">
                        <div className="flex flex-col gap-[3px] py-[5px]">
                          <span className="text-[14px] font-medium" style={{ color: '#78756E' }}>ROAS</span>
                          <span className="text-[20px] font-bold leading-[22px]" style={{ color: '#166534' }}>{campaign.roas}</span>
                        </div>
                        <div className="flex flex-col gap-[3px] py-[5px]">
                          <span className="text-[14px] font-medium" style={{ color: '#78756E' }}>클릭수</span>
                          <span className="text-[20px] font-bold leading-[22px]" style={{ color: '#166534' }}>{campaign.clicks}</span>
                        </div>
                      </div>
                      {/* info below titlebox border */}
                      <div className="flex items-center justify-between">
                        <span className="text-[14px] font-semibold" style={{ color: '#78756E' }}>{campaign.influencerCount}</span>
                        <span className="text-[14px] font-semibold" style={{ color: '#5C5A54' }}>{campaign.completedMonth}</span>
                      </div>
                    </>
                  )}
                </div>
              ))}
              {/* Card 5: 새 캠페인 추가 */}
              <div
                onClick={() => router.push('/campaign/new')}
                className="w-[200px] self-stretch shrink-0 bg-[#F1F2FD] rounded-[14px] p-5 flex flex-col items-center justify-center gap-[14px] cursor-pointer active:opacity-70"
              >
                <div className="w-8 h-8 rounded-full border border-[#8486F3] flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 3v10M3 8h10" stroke="#8486F3" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="text-[16px] font-bold" style={{ color: '#8486F3' }}>새 캠페인 추가</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ── FAB ── */}
      {fabOpen && (
        <div className="absolute inset-0 z-[25]" onClick={() => setFabOpen(false)} />
      )}
      {fabOpen && (
        <div className="absolute bottom-[175px] right-[20px] z-30 flex flex-col items-end gap-3">
          <button
            onClick={() => { setFabOpen(false); router.push('/campaign/new'); }}
            className="flex items-center bg-white rounded-full px-5 py-3 shadow-lg border border-[#ebeef7] active:opacity-70"
          >
            <span className="text-[15px] font-semibold text-stone-900">새 캠페인 만들기</span>
          </button>
          <button
            onClick={() => { setFabOpen(false); router.push('/board/add'); }}
            className="flex items-center bg-white rounded-full px-5 py-3 shadow-lg border border-[#ebeef7] active:opacity-70"
          >
            <span className="text-[15px] font-semibold text-stone-900">인플루언서 추가</span>
          </button>
        </div>
      )}
      <button
        onClick={() => setFabOpen(f => !f)}
        className="absolute bottom-[110px] right-[20px] z-30 w-14 h-14 bg-[#6366F1] rounded-full flex items-center justify-center shadow-lg active:opacity-80 transition-transform duration-200"
        style={{ transform: fabOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>

      {/* ── Bottom navigation ── */}
      <div className="absolute bottom-0 w-full h-[95px] flex items-start pt-[2px] bg-white border-t border-[#F5F5F3] z-20">
        {[
          { Icon: HomeSelectedIcon, label: '홈', active: true, onClick: () => { } },
          { Icon: BriefDisabledIcon, label: '캠페인', active: false, onClick: () => router.push('/campaign') },
          { Icon: BoardDisabledIcon, label: '보드', active: false, onClick: () => router.push('/board') },
          { Icon: ReportDisabledIcon, label: '성과', active: false, onClick: () => router.push('/performance') },
          { Icon: MyDisabledIcon, label: '마이페이지', active: false, onClick: () => router.push('/mypage') },
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
