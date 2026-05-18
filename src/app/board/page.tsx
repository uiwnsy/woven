'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown, LayoutGrid, List, X, Check } from 'lucide-react';
import {
  SearchIcon, AlertIcon,
  HomeDisabledIcon, BriefDisabledIcon,
  BoardSelectedIcon,
  ReportDisabledIcon, MyDisabledIcon,
} from '@/components/Icons';
import InfluencerCard, { Influencer } from '@/components/InfluencerCard';

type CampaignOption = {
  id: number;
  title: string;
  status: '기획' | '진행중' | '완료';
};

const CAMPAIGNS: CampaignOption[] = [
  { id: 1, title: '루미에르 봄봄 프로모션', status: '진행중' },
  { id: 2, title: '수분크림 마이크로 인플루언서', status: '기획' },
  { id: 3, title: '선크림 런칭 캠페인', status: '완료' },
];

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  진행중: { bg: 'bg-[#fef6f1]', text: 'text-[#d96430]' },
  기획:   { bg: 'bg-[#fffbeb]', text: 'text-[#92400e]' },
  완료:   { bg: 'bg-[#f0fdf4]', text: 'text-[#26af58]' },
};

const CAMPAIGN_BOARD_DATA: Record<number, Record<string, Influencer[]>> = {
  1: {
    'list-up': [
      { id: 'lu1', name: 'minj_', handle: '@minj_',    followers: '24.5만', categories: ['뷰티', '패션'],         statusText: '리스트업', profileImg: '/profile-kimminji.png' },
      { id: 'lu2', name: '박서연', handle: '@ppseoo',   followers: '4만',    categories: ['뷰티', '패션'],         statusText: '리스트업', profileImg: '/profile-parkseo.png' },
      { id: 'lu3', name: '박진이', handle: '@jinstlee', followers: '6.8만',  categories: ['뷰티', '일상'],         statusText: '리스트업', profileImg: '/profile-parkjini.png' },
    ],
    'contacting': [
      { id: '1', name: 'haye0',  handle: '@haye0',    followers: '10.4만', categories: ['뷰티', '패션'],              statusText: '전송 D+26', profileImg: '/profile-haye0.png' },
      { id: '2', name: 'zigoo',  handle: '@zigoo',    followers: '2만',    categories: ['뷰티', '패션'],              statusText: '전송 D+26', profileImg: '/profile-zigoo.png' },
      { id: '3', name: '김지영', handle: '@jijizero', followers: '21만',   categories: ['뷰티', '연애/결혼', '일상'], statusText: '전송 D+26', profileImg: '/profile-kimjiyoung.png' },
    ],
    'negotiated': [
      { id: '4', name: 'paooar', handle: '@paooar', followers: '9.2만',  categories: ['뷰티', '패션', '일상'], statusText: '시안 전달 D+1', amount: '350,000원', profileImg: '/profile-paooar.png' },
      { id: '5', name: 'minj_', handle: '@minj_',  followers: '24.5만', categories: ['뷰티', '패션'],         statusText: '시안 전달 D+3', amount: '280,000원', profileImg: '/profile-kimminji.png' },
    ],
    'inProgress': [
      { id: '4', name: 'leeum',  handle: '@leeum',  followers: '4.6만', categories: ['뷰티', '패션'], statusText: '포스팅 D-1', amount: '350,000원',
        bottomTags: [{ label: '최종 승인', bg: 'bg-[#F0FDF4]', text: 'text-[#22C55E]' }, { label: 'UTM 포함', bg: 'bg-[#EFF6FF]', text: 'text-[#3D3FC7]' }],
        profileImg: '/profile-leeum.png' },
      { id: '2', name: '이가흔', handle: '@gaaa934', followers: '2.4만', categories: ['뷰티', '패션'], statusText: '포스팅 D-3', amount: '280,000원',
        bottomTags: [{ label: '최종 승인', bg: 'bg-[#F0FDF4]', text: 'text-[#22C55E]' }],
        profileImg: '/profile-igaheun.png' },
    ],
    'uploaded': [
      { id: '4', name: 'dearyq', handle: '@dearyq', followers: '10.1만', categories: ['뷰티', '패션', '일상'], statusText: '업로드 D+1', amount: '₩450,000',
        bottomTags: [{ label: 'UTM 포함', bg: 'bg-[#EFF6FF]', text: 'text-[#3D3FC7]' }, { label: '입금 대기', bg: 'bg-[#FFFBEB]', text: 'text-[#F59E0B]' }],
        profileImg: '/profile-dearyq.png' },
    ],
  },
  2: {
    'list-up': [],
    'contacting': [],
    'negotiated': [],
    'inProgress': [],
    'uploaded': [],
  },
  3: {
    'list-up': [],
    'contacting': [
      { id: '6', name: 'paooar', handle: '@paooar', followers: '9.2만',  categories: ['뷰티', '패션', '일상'], statusText: '전송 D+5', profileImg: '/profile-paooar.png' },
      { id: '7', name: 'minj_', handle: '@minj_',  followers: '24.5만', categories: ['뷰티', '패션'],         statusText: '전송 D+5', profileImg: '/profile-kimminji.png' },
      { id: '8', name: 'zigoo',  handle: '@zigoo',  followers: '2만',    categories: ['뷰티', '패션'],         statusText: '전송 D+5', profileImg: '/profile-zigoo.png' },
    ],
    'negotiated': [
      { id: '6', name: 'paooar', handle: '@paooar', followers: '9.2만',  categories: ['뷰티', '패션', '일상'], statusText: '협의 완료', profileImg: '/profile-paooar.png' },
      { id: '7', name: 'minj_', handle: '@minj_',  followers: '24.5만', categories: ['뷰티', '패션'],         statusText: '협의 완료', profileImg: '/profile-kimminji.png' },
      { id: '8', name: 'zigoo',  handle: '@zigoo',  followers: '2만',    categories: ['뷰티', '패션'],         statusText: '협의 완료', profileImg: '/profile-zigoo.png' },
    ],
    'inProgress': [
      { id: '6', name: 'paooar', handle: '@paooar', followers: '9.2만',  categories: ['뷰티', '패션', '일상'], statusText: '시안 확인 중', profileImg: '/profile-paooar.png' },
      { id: '7', name: 'minj_', handle: '@minj_',  followers: '24.5만', categories: ['뷰티', '패션'],         statusText: '시안 확인 중', profileImg: '/profile-kimminji.png' },
      { id: '8', name: 'zigoo',  handle: '@zigoo',  followers: '2만',    categories: ['뷰티', '패션'],         statusText: '시안 확인 중', profileImg: '/profile-zigoo.png' },
    ],
    'uploaded': [
      { id: '6', name: 'paooar', handle: '@paooar', followers: '9.2만',  categories: ['뷰티', '패션', '일상'], statusText: '업로드 완료', profileImg: '/profile-paooar.png' },
      { id: '7', name: 'minj_', handle: '@minj_',  followers: '24.5만', categories: ['뷰티', '패션'],         statusText: '업로드 완료', profileImg: '/profile-kimminji.png' },
      { id: '8', name: 'zigoo',  handle: '@zigoo',  followers: '2만',    categories: ['뷰티', '패션'],         statusText: '업로드 완료', profileImg: '/profile-zigoo.png' },
    ],
  },
};

const TAB_IDS = [
  { id: 'list-up',    label: '리스트업'  },
  { id: 'contacting', label: '컨택'      },
  { id: 'negotiated', label: '협의중'    },
  { id: 'inProgress', label: '시안확인'  },
  { id: 'uploaded',   label: '업로드완료' },
];

export default function BoardPage() {
  return <Suspense><BoardPageContent /></Suspense>;
}

function BoardPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sentId = searchParams.get('sent');

  const [allBoardData] = useState<Record<number, Record<string, Influencer[]>>>(() => {
    const clone: Record<number, Record<string, Influencer[]>> = {};
    for (const [cId, stages] of Object.entries(CAMPAIGN_BOARD_DATA)) {
      const numId = Number(cId);
      clone[numId] = {};
      for (const [stage, cards] of Object.entries(stages)) {
        clone[numId][stage] = [...cards];
      }
    }
    if (sentId) {
      for (const cId of Object.keys(clone)) {
        const numId = Number(cId);
        const listUp = clone[numId]['list-up'];
        const idx = listUp.findIndex(inf => inf.id === sentId);
        if (idx !== -1) {
          const [moved] = listUp.splice(idx, 1);
          clone[numId]['list-up'] = [...listUp];
          clone[numId]['contacting'] = [{ ...moved, statusText: '전송 D+0' }, ...clone[numId]['contacting']];
          break;
        }
      }
    }
    return clone;
  });

  const [activeTab, setActiveTab] = useState(() => searchParams.get('tab') ?? 'list-up');
  const [activeView, setActiveView] = useState<'grid' | 'list'>('grid');
  const [selectedCampaignId, setSelectedCampaignId] = useState(1);
  const [showCampaignSheet, setShowCampaignSheet] = useState(false);

  const selectedCampaign = CAMPAIGNS.find(c => c.id === selectedCampaignId) ?? CAMPAIGNS[0];
  const boardData = allBoardData[selectedCampaignId] ?? {};

  const tabs = TAB_IDS.map(t => ({
    ...t,
    count: (boardData[t.id]?.length ?? 0) > 0 ? String(boardData[t.id].length) : '-',
  }));

  const cards = boardData[activeTab] ?? [];
  const isEmpty = cards.length === 0;

  return (
    <div className="flex flex-col h-screen bg-white max-w-[430px] mx-auto relative overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 h-[65px] border-b border-[#f0f2f8] bg-white shrink-0">
        <span className="text-[20px] font-bold text-stone-900 tracking-[-0.4px]">보드</span>
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
      <div className="flex-1 bg-[#fafbfe] overflow-y-auto pb-[95px]">

        {/* Campaign selector + View toggle + Board tabs */}
        <div className="bg-white">
          <div className="px-5 pt-[26px] pb-4 flex justify-center">
            <button
              onClick={() => setShowCampaignSheet(true)}
              className="flex items-center justify-between bg-white rounded-[46px] px-[22px] py-[14px] w-full max-w-[390px] shadow-[0_0_2px_rgba(99,102,241,0.3)] active:opacity-80"
            >
              <span className="text-[16px] font-medium text-[#1C1A17]">{selectedCampaign.title}</span>
              <img src="/arrow-down-campaign.svg" alt="" width={24} height={24} />
            </button>
          </div>

          <div className="px-5 mb-4 flex justify-center">
            <div className="flex bg-[#F0F2F8] rounded-[36px] p-[3px] w-full max-w-[390px] h-[38px]">
              <button
                onClick={() => setActiveView('grid')}
                className={`flex-1 flex items-center justify-center gap-1 rounded-[56px] text-[13px] font-medium transition-all
                  ${activeView === 'grid' ? 'bg-white shadow-sm text-[#1C1A17]' : 'text-[#9BA1AA]'}`}
              >
                <LayoutGrid size={11} />
                단계별
              </button>
              <button
                onClick={() => setActiveView('list')}
                className={`flex-1 flex items-center justify-center gap-1 rounded-[36px] text-[13px] font-medium transition-all
                  ${activeView === 'list' ? 'bg-white shadow-sm text-[#1C1A17]' : 'text-[#9BA1AA]'}`}
              >
                <List size={11} />
                리스트
              </button>
            </div>
          </div>

          {/* 단계별 탭 — grid 뷰에서만 표시 */}
          {activeView === 'grid' && (
            <div className="flex overflow-x-auto scrollbar-none pl-5">
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1 px-[10px] py-[10px] shrink-0 whitespace-nowrap border-b-[1.5px]
                    ${isActive ? 'border-iris-500' : 'border-[#F0F2F8]'}`}
                >
                  <span className={`text-[13px] ${isActive ? 'font-bold text-iris-500' : 'font-medium text-[#1C1A17]'}`}>
                    {tab.label}
                  </span>
                  <span className={`text-[12px] px-[10px] leading-[20px] rounded-full font-manrope
                    ${isActive
                      ? 'bg-[#EEEEFF] font-bold text-iris-500'
                      : 'bg-[#F0F2F8] font-medium text-[#64666C]'}`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
            <div className="shrink-0 w-5" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-5 pt-5 flex flex-col">

          {activeView === 'grid' ? (
            <>
              {isEmpty ? (
                activeTab === 'list-up' ? (
                  <div className="flex gap-2 bg-[#EEF7FF] rounded-[12px] p-5">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0 mt-[2px]">
                      <circle cx="9" cy="9" r="8" stroke="#2D92FE" strokeWidth="1.5"/>
                      <path d="M9 8v4.5" stroke="#2D92FE" strokeWidth="1.5" strokeLinecap="round"/>
                      <circle cx="9" cy="6" r="0.75" fill="#2D92FE"/>
                    </svg>
                    <p className="text-[13px] font-medium text-[#2D92FE] leading-[150%]">
                      인플루언서를 추가하면 리스트업 단계에 카드가 생성돼요.{'\n'}이후 컨택, 협의중, 시안확인, 업로드완료 단계로 이동하며 관리할 수 있어요.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-stone-300">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mb-3">
                      <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2"/>
                      <path d="M16 24h16M24 16v16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <p className="text-[15px]">인플루언서를 추가해보세요</p>
                  </div>
                )
              ) : (
                cards.map((item, i) =>
                  activeTab === 'negotiated' || activeTab === 'inProgress' || activeTab === 'uploaded' ? (
                    <button
                      key={item.id + i}
                      onClick={() => router.push('/board/' + item.id)}
                      className="bg-white rounded-2xl px-[22px] py-[22px] mb-[10px] border border-[#ebeef7] flex flex-col gap-1.5 w-full text-left active:opacity-80 transition-opacity"
                    >
                      {/* 상단: 프로필 + 상태/금액 */}
                      <div className="flex items-center justify-between gap-3">
                        {/* 프로필 */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="relative shrink-0">
                            <div className="w-10 h-10 rounded-full bg-stone-200 overflow-hidden">
                              {item.profileImg && <img src={item.profileImg} alt={item.name} className="w-full h-full object-cover" />}
                            </div>
                            <img src="/skill-icons_instagram.svg" alt="ig" className="absolute w-4 h-4 bottom-0 -right-[1px]" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-end gap-1">
                              <span className="text-[16px] font-semibold text-black leading-none">{item.name}</span>
                              <span className="text-[13px] text-[#78756E] leading-none">{item.handle}</span>
                            </div>
                            <span className="text-[13px] text-[#78756E]">{item.followers}</span>
                          </div>
                        </div>
                        {/* 상태 + 금액 */}
                        <div className="flex flex-col items-end gap-[5px] shrink-0">
                          {item.statusText && (
                            <div className="bg-stone-100 px-[10px] pt-[4px] pb-[6px] rounded-full shrink-0">
                              <span className="text-[13px] font-semibold text-stone-600 leading-none whitespace-nowrap">{item.statusText}</span>
                            </div>
                          )}
                          {item.amount && (
                            <span className="text-[18px] font-extrabold text-[#1C1A17] pr-[3px]">{item.amount}</span>
                          )}
                        </div>
                      </div>
                      {/* 하단: 액션 칩 (시안확인 단계) */}
                      {item.bottomTags && item.bottomTags.length > 0 && (
                        <div className="flex items-center gap-1">
                          {item.bottomTags.map((tag, ti) => (
                            <span key={ti} className={`${tag.bg} ${tag.text} text-[13px] font-medium px-[8px] pt-[4px] pb-[6px] rounded-full leading-none`}>
                              {tag.label}
                            </span>
                          ))}
                        </div>
                      )}
                    </button>
                  ) : (
                    <InfluencerCard key={item.id + i} data={item} onPress={() => router.push('/board/' + item.id)} />
                  )
                )
              )}
              {activeTab === 'list-up' && (
                <button
                  onClick={() => router.push('/board/add')}
                  className="w-full h-[68px] flex items-center justify-center gap-1 rounded-[14px] active:opacity-70 mt-[20px]"
                  style={{ backgroundColor: 'rgba(221, 223, 253, 0.3)' }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7.5" stroke="#8486F3"/>
                    <path d="M8 5v6M5 8h6" stroke="#8486F3" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  <span className="text-[16px] font-medium text-[#8486F3]">인플루언서 추가</span>
                </button>
              )}
            </>
          ) : (
            /* ── 리스트 뷰 ── */
            <div className="flex flex-col">
              {TAB_IDS.map((tab, tabIdx) => {
                const stageCards = boardData[tab.id] ?? [];
                if (stageCards.length === 0) return null;
                const STAGE_STYLES: Record<string, { bg: string; text: string }> = {
                  'list-up':    { bg: 'bg-[#f5f5f3]', text: 'text-stone-600' },
                  'contacting': { bg: 'bg-[#eef2ff]', text: 'text-iris-600' },
                  'negotiated': { bg: 'bg-[#fef6f1]', text: 'text-[#d96430]' },
                  'inProgress': { bg: 'bg-[#f0fdf4]', text: 'text-[#22c55e]' },
                  'uploaded':   { bg: 'bg-[#f0fdf4]', text: 'text-[#166534]' },
                };
                const stageStyle = STAGE_STYLES[tab.id];
                return (
                  <div key={tab.id} className={tabIdx > 0 ? 'mt-2' : ''}>
                    {/* 단계 헤더 */}
                    <div className="flex items-center gap-2 mb-[10px]">
                      <span className={`${stageStyle.bg} ${stageStyle.text} text-[13px] font-semibold px-[10px] pt-[4px] pb-[6px] rounded-full leading-none`}>
                        {tab.label}
                      </span>
                      <span className="text-[13px] font-medium text-[#9BA1AA]">{stageCards.length}명</span>
                    </div>
                    {/* 카드 */}
                    {stageCards.map((item, i) =>
                      tab.id === 'negotiated' || tab.id === 'inProgress' || tab.id === 'uploaded' ? (
                        <button
                          key={item.id + i}
                          onClick={() => router.push('/board/' + item.id)}
                          className="bg-white rounded-2xl px-[22px] py-[22px] mb-[10px] border border-[#ebeef7] flex flex-col gap-1.5 w-full text-left active:opacity-80 transition-opacity"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="relative shrink-0">
                                <div className="w-10 h-10 rounded-full bg-stone-200 overflow-hidden">
                                  {item.profileImg && <img src={item.profileImg} alt={item.name} className="w-full h-full object-cover" />}
                                </div>
                                <img src="/skill-icons_instagram.svg" alt="ig" className="absolute w-4 h-4 bottom-0 -right-[1px]" />
                              </div>
                              <div className="flex flex-col gap-1">
                                <div className="flex items-end gap-1">
                                  <span className="text-[16px] font-semibold text-black leading-none">{item.name}</span>
                                  <span className="text-[13px] text-[#78756E] leading-none">{item.handle}</span>
                                </div>
                                <span className="text-[13px] text-[#78756E]">{item.followers}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-[5px] shrink-0">
                              {item.statusText && (
                                <span className="bg-stone-100 text-stone-600 text-[13px] font-semibold px-[10px] pt-[4px] pb-[6px] rounded-full leading-none whitespace-nowrap">
                                  {item.statusText}
                                </span>
                              )}
                              {item.amount && (
                                <span className="text-[18px] font-extrabold text-[#1C1A17] pr-[3px]">{item.amount}</span>
                              )}
                            </div>
                          </div>
                        </button>
                      ) : (
                        <InfluencerCard key={item.id + i} data={{ ...item, categories: [] }} onPress={() => router.push('/board/' + item.id)} />
                      )
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>

      {/* ── Bottom navigation ── */}
      <div className="absolute bottom-0 w-full h-[95px] flex items-start pt-[2px] bg-white border-t border-[#F5F5F3] z-20">
        {[
          { Icon: HomeDisabledIcon,   label: '홈',        active: false, onClick: () => router.push('/home') },
          { Icon: BriefDisabledIcon,  label: '캠페인',    active: false, onClick: () => router.push('/campaign') },
          { Icon: BoardSelectedIcon,  label: '보드',      active: true,  onClick: () => {} },
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

      {/* ── Campaign selector bottom sheet ── */}
      {showCampaignSheet && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end max-w-[430px] mx-auto">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowCampaignSheet(false)} />
          <div className="relative bg-white rounded-t-[20px] px-5 pt-5 pb-10">
            <div className="flex items-center justify-between mb-5">
              <span className="text-[16px] font-bold text-[#1C1A17]">캠페인 선택</span>
              <button onClick={() => setShowCampaignSheet(false)} className="active:opacity-60">
                <X size={22} className="text-stone-500" />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {CAMPAIGNS.map(campaign => {
                const isSelected = campaign.id === selectedCampaignId;
                const style = STATUS_STYLES[campaign.status];
                return (
                  <button
                    key={campaign.id}
                    onClick={() => {
                      setSelectedCampaignId(campaign.id);
                      setActiveTab('list-up');
                      setShowCampaignSheet(false);
                    }}
                    className={`flex items-center justify-between px-4 py-4 rounded-[12px] active:opacity-70 transition-colors
                      ${isSelected ? 'bg-[#f0f0fd]' : 'bg-[#fafbfe]'}`}
                  >
                    <div className="flex flex-col gap-[6px] text-left flex-1 pr-3">
                      <span className="text-[16px] font-medium text-[#1C1A17] leading-snug">{campaign.title}</span>
                      <span className={`${style.bg} ${style.text} text-[13px] font-semibold px-[10px] py-[5px] rounded-full w-fit`}>
                        {campaign.status}
                      </span>
                    </div>
                    {isSelected && <Check size={18} className="text-iris-500 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
