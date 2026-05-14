'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  HomeSelectedIcon,
  BriefDisabledIcon,
  BoardDisabledIcon,
  ReportDisabledIcon,
  MyDisabledIcon,
} from '@/components/Icons';


const STAGES = [
  { id: 'list-up',     label: '리스트업',  count: '-' },
  { id: 'contacting',  label: '컨택',      count: '3' },
  { id: 'negotiating', label: '협의중',    count: '2' },
  { id: 'reviewing',   label: '시안확인',  count: '2' },
  { id: 'uploaded',    label: '업로드완료', count: '1' },
];

const KPI_DATA = [
  {
    id: 'click',
    label: '클릭',
    value: '820',
    badge: 'UTM 추적',
    badgeBg: 'bg-[#f0fdf4]',
    badgeText: 'text-[#22c55e]',
  },
  {
    id: 'conv',
    label: '전환',
    value: '5',
    badge: 'UTM 추적',
    badgeBg: 'bg-[#f0fdf4]',
    badgeText: 'text-[#22c55e]',
  },
  {
    id: 'roas',
    label: '평균 ROAS',
    value: '1.4x',
    badge: '목표 28%',
    badgeBg: 'bg-[#eff6ff]',
    badgeText: 'text-[#3b82f6] font-semibold',
  },
];

const URGENT_ITEMS = [
  {
    id: 1,
    icon: '/draft-icon-1.svg',
    title: '시안 확인 필요 - leeum님',
    subtitle: '내일 포스팅 예정 - 최종 승인 확인',
  },
  {
    id: 2,
    icon: '/followup-icon.svg',
    title: '미응답 팔로업 - haye0님 외 2명',
    subtitle: '브리프 전송 26일 경과',
  },
  {
    id: 3,
    icon: '/draft-icon.svg',
    title: '박진이님 시안 전달 독촉',
    subtitle: '시안 전달 예정일 2일 초과',
  },
];

const AI_INSIGHTS = [
  {
    id: 1,
    highlight: 'haye0님 외 2명이 브리프 전송 후 26일째 미응답',
    text: '이에요. 리스트에서 제거하거나 팔로업을 보내보세요.',
    action: '응답 상태 확인',
  },
  {
    id: 2,
    highlight: 'dearyq님의 콘텐츠가 업로드 D+1 – 클릭 820건 유입 중',
    text: '이에요. 초기 UTM 성과를 확인해보세요.',
    action: '성과 보기',
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
  { id: '1', name: 'dearyq', handle: '@dearyq', followers: '10.1만', profileImg: '/profile-dearyq.png', roas: '1.4x', clicks: '820' },
  { id: '2', name: 'paooar', handle: '@paooar', followers: '9.2만',  profileImg: '/profile-paooar.png', roas: '-',    clicks: '-' },
  { id: '3', name: 'leeum',  handle: '@leeum',  followers: '4.6만',  profileImg: '/profile-leeum.png',
    stage:  { label: '시안확인', bg: 'bg-[#f0fdf4]', text: 'text-[#22c55e]' },
    status: { label: '포스팅 D-1', bg: 'bg-[#f5f5f3]', text: 'text-stone-600' } },
  { id: '4', name: '이가흔', handle: '@gaaa934', followers: '2.4만', profileImg: '/profile-igaheun.png',
    stage:  { label: '시안확인', bg: 'bg-[#f0fdf4]', text: 'text-[#22c55e]' },
    status: { label: '수정본 D-2', bg: 'bg-[#fffbeb]', text: 'text-[#f59e0b]' } },
  { id: '5', name: '박진이', handle: '@jinstlee', followers: '6.8만', profileImg: '/profile-parkjini.png',
    stage:  { label: '협의중', bg: 'bg-[#fef6f1]', text: 'text-[#d96430]' },
    status: { label: '보류', bg: 'bg-[#f5f5f3]', text: 'text-stone-600' } },
  { id: '6', name: 'haye0',  handle: '@haye0',  followers: '10.4만', profileImg: '/profile-haye0.png',
    stage:  { label: '컨택', bg: 'bg-[#eef2ff]', text: 'text-iris-600' },
    status: { label: '미응답', bg: 'bg-[#fef2f2]', text: 'text-red-500' } },
  { id: '7', name: 'zigoo',  handle: '@zigoo',  followers: '2만',    profileImg: '/profile-zigoo.png',
    stage:  { label: '컨택', bg: 'bg-[#eef2ff]', text: 'text-iris-600' },
    status: { label: '미응답', bg: 'bg-[#fef2f2]', text: 'text-red-500' } },
  { id: '8', name: '김지영', handle: '@jijizero', followers: '21만', profileImg: '/profile-kimjiyoung.png',
    stage:  { label: '컨택', bg: 'bg-[#eef2ff]', text: 'text-iris-600' },
    status: { label: '미응답', bg: 'bg-[#fef2f2]', text: 'text-red-500' } },
  { id: '9', name: '김민지', handle: '@minj_',   followers: '24.9만', profileImg: '/profile-kimminji.png',
    stage: { label: '리스트업', bg: 'bg-[#f5f5f3]', text: 'text-stone-600' } },
  { id: '10', name: '박서연', handle: '@ppseoo',  followers: '4만',   profileImg: '/profile-parkseo.png',
    stage: { label: '리스트업', bg: 'bg-[#f5f5f3]', text: 'text-stone-600' } },
];

const RANK_FILTERS = ['ROAS순', '클릭순'];

const CAMPAIGNS = [
  {
    id: 1,
    status: '진행중',
    statusBg: 'bg-[#fef6f1]',
    statusText: 'text-[#d96430]',
    name: '루미에르\n봄봄 프로모션',
    progress: '업로드 1/11',
    dday: 'D-8',
    progressPct: 1 / 11,
  },
  {
    id: 2,
    status: '기획',
    statusBg: 'bg-[#f5f5f3]',
    statusText: 'text-stone-600',
    name: '수분크림 마이크로\n인플루언서',
    progress: '리스트업 2/20',
    dday: 'D-34',
    progressPct: 2 / 20,
  },
];

export default function HomePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'현황' | '인플루언서'>('현황');
  const [rankFilter, setRankFilter] = useState('ROAS순');

  return (
    <div className="flex flex-col h-screen bg-white max-w-[430px] mx-auto relative overflow-hidden">

      {/* ── Fixed nav bar ── */}
      <div className="shrink-0" style={{ background: 'linear-gradient(139deg, #8486F3 0.32%, #6366F1 104.47%)' }}>
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
      <div className="flex-1 overflow-y-auto overflow-x-hidden pb-[95px]">

        {/* Gradient greeting + tabs (scrolls away) */}
        <div style={{ background: 'linear-gradient(139deg, #8486F3 0.32%, #6366F1 104.47%)' }}>
          <div className="px-5">
            {/* Greeting */}
            <div className="pt-[30px] pb-[52px]">
              <p className="text-[17px] font-semibold text-white mb-2">✳︎ 안녕하세요, 김지은님!</p>
              <p className="text-[24px] font-bold text-white leading-[1.45]">
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
        <div className="bg-[#fafbfe]">

        {activeTab === '인플루언서' && (
          <>
            {/* 성과 순위 */}
            <div className="bg-white px-5 pt-[40px] pb-[40px] mb-[10px]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[22px] font-bold text-stone-900">성과 순위</h2>
                <div className="flex gap-2 overflow-x-auto scrollbar-none">
                  {RANK_FILTERS.map(f => (
                    <button
                      key={f}
                      onClick={() => setRankFilter(f)}
                      className={`shrink-0 h-7 px-3 rounded-full text-[14px] transition-all active:opacity-70
                        ${rankFilter === f
                          ? 'bg-iris-500 text-white font-medium'
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
                  className={`flex items-center justify-between py-[14px]
                    ${i < INFLUENCER_RANKS.length - 1 ? 'border-b border-[#f0f2f8]' : ''}`}
                >
                  {/* Left: avatar + info */}
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-full bg-stone-200 overflow-hidden">
                        <img src={inf.profileImg} alt={inf.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-[2px] shadow-sm">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" alt="ig" className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[16px] font-semibold text-black">{inf.name}</span>
                        <span className="text-[13px] text-stone-500">{inf.handle}</span>
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
                        <span className={`${inf.stage.bg} ${inf.stage.text} text-[14px] font-semibold px-3 py-1 rounded-full`}>
                          {inf.stage.label}
                        </span>
                      )}
                      {inf.status && (
                        <span className={`${inf.status.bg} ${inf.status.text} text-[14px] font-semibold px-3 py-1 rounded-full`}>
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
        <div className="bg-white px-5 py-[40px] mb-[10px]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[22px] font-bold text-stone-900">루미에르 봄봄 프로모션</span>
            <span className="bg-iris-500 text-white text-[14px] font-bold px-3 py-[5px] rounded-full shrink-0 ml-2">D-8</span>
          </div>
          <p className="text-[14px] font-medium text-[#8995a2] mb-[32px]">
            4월 26일 마감 &nbsp;·&nbsp; 오늘 오전 8:41
          </p>

          {/* Stage counts */}
          <div className="flex justify-between mb-[30px]">
            {STAGES.map(stage => (
              <div key={stage.id} className="flex flex-col items-center w-[70px]">
                <span className="text-[24px] font-bold text-stone-900 leading-none">{stage.count}</span>
                <span className="text-[14px] text-stone-800 mt-1.5">{stage.label}</span>
              </div>
            ))}
          </div>

          {/* KPI blocks */}
          <div className="flex gap-[11px] pb-[30px] border-b border-[#EBEEF7]">
            {KPI_DATA.map(kpi => (
              <div
                key={kpi.id}
                className="flex-1 min-w-0 bg-white border border-[#E8E7E4] rounded-[14px] px-5 py-[22px] flex flex-col gap-3"
              >
                <div className="flex flex-col gap-1.5">
                  <p className="text-[14px] font-medium leading-none" style={{ color: '#5C5A54' }}>{kpi.label}</p>
                  <p className="text-[26px] font-bold text-black leading-none">{kpi.value}</p>
                </div>
                <div className={`${kpi.badgeBg} px-[10px] py-1 rounded-full inline-flex self-start`}>
                  <span className={`text-[14px] font-semibold ${kpi.badgeText} whitespace-nowrap`}>{kpi.badge}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Urgent section */}
          <h2 className="text-[18px] font-bold text-stone-900 mb-3 pt-5">긴급 확인 필요</h2>
          <div className="flex flex-col gap-3">
            {URGENT_ITEMS.map((item) => (
              <button
                key={item.id}
                className="w-full flex items-center justify-between p-5 bg-white rounded-[14px] border border-[#ebeef7] active:opacity-70"
              >
                <div className="flex items-center gap-3">
                  <img src={item.icon} alt="" width={52} height={52} className="shrink-0" />
                  <div className="text-left">
                    <p className="text-[16px] font-semibold text-black">{item.title}</p>
                    <p className="text-[14px] text-black/60 mt-1">{item.subtitle}</p>
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
        <div className="bg-white pt-[40px] pb-[40px] mb-[10px]">
          <h2 className="text-[22px] font-bold text-stone-900 px-5 mb-4">AI 인사이트</h2>
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
                <button className="bg-iris-500 rounded-xl py-[11px] active:opacity-80">
                  <span className="text-white text-[15px] font-semibold">{insight.action}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 전체 캠페인 */}
        <div className="bg-white pt-[40px] pb-[40px] mb-[10px]">
          <div className="flex items-center justify-between px-5 mb-4">
            <h2 className="text-[22px] font-bold text-stone-900">전체 캠페인</h2>
            <button className="flex items-center gap-0.5 active:opacity-70">
              <span className="text-[14px] font-semibold text-stone-500">더보기</span>
              <img src="/arrow-right.svg" alt="" width={16} height={16} />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto px-5 pb-1 scrollbar-none">
            {CAMPAIGNS.map(campaign => (
              <div
                key={campaign.id}
                className="w-[186px] shrink-0 bg-white border border-[#ebeef7] rounded-2xl p-5 flex flex-col"
              >
                <span className={`${campaign.statusBg} ${campaign.statusText} text-[14px] font-semibold px-3 py-1.5 rounded-full self-start mb-3`}>
                  {campaign.status}
                </span>
                <p className="text-[18px] font-bold text-black leading-[1.4] flex-1 whitespace-pre-line">{campaign.name}</p>
                {/* Progress bar */}
                <div className="mt-4">
                  <div className="w-full h-[3px] bg-stone-200 rounded-full mb-2">
                    <div
                      className="h-full bg-iris-500 rounded-full"
                      style={{ width: `${campaign.progressPct * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-bold text-stone-500">{campaign.progress}</span>
                    <span className="text-[14px] font-bold text-[#d96430]">{campaign.dday}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ / Help */}
        <div className="mx-5 my-5 rounded-[14px] overflow-hidden px-[22px] py-[28px] flex items-center justify-between" style={{ backgroundColor: '#EDF1FF' }}>
          <div className="flex flex-col gap-1">
            <p className="text-[20px] font-semibold leading-none" style={{ color: '#1E2075' }}>막히는 게 있나요?</p>
            <p className="text-[14px] font-semibold leading-[1.4]" style={{ color: 'rgba(30, 32, 117, 0.5)' }}>
              자주 묻는 질문과 사용 가이드를<br />모아뒀어요
            </p>
          </div>
          <img src="/banner-img.png" alt="" width={78} height={78} className="shrink-0 ml-3" />
        </div>

        </div>
      </div>

      {/* ── Bottom navigation ── */}
      <div className="absolute bottom-0 w-full h-[95px] flex items-start pt-3 bg-white border-t border-[#f0f2f8]">
        {[
          { Icon: HomeSelectedIcon,  label: '홈',        active: true,  onClick: () => {} },
          { Icon: BriefDisabledIcon, label: '캠페인',    active: false, onClick: () => router.push('/campaign') },
          { Icon: BoardDisabledIcon, label: '보드',      active: false, onClick: () => router.push('/board') },
          { Icon: ReportDisabledIcon,label: '성과',      active: false, onClick: () => router.push('/performance') },
          { Icon: MyDisabledIcon,    label: '마이페이지', active: false, onClick: () => router.push('/mypage') },
        ].map(({ Icon, label, active, onClick }) => (
          <button
            key={label}
            onClick={onClick}
            className={`flex-1 flex flex-col items-center justify-center gap-[5px] active:opacity-60
              ${active ? 'text-stone-900' : 'text-stone-300'}`}
          >
            <Icon size={32} />
            <span className={`text-[12px] ${active ? 'font-semibold' : 'font-medium'}`}>{label}</span>
          </button>
        ))}
      </div>

    </div>
  );
}
