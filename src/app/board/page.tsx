'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, LayoutGrid, List } from 'lucide-react';
import {
  SearchIcon, AlertIcon,
  HomeDisabledIcon, BriefDisabledIcon,
  BoardSelectedIcon,
  ReportDisabledIcon, MyDisabledIcon,
} from '@/components/Icons';
import InfluencerCard, { Influencer } from '@/components/InfluencerCard';

const TABS = [
  { id: 'list-up',    label: '리스트업',  count: '-' },
  { id: 'contacting', label: '컨택',      count: '3' },
  { id: 'negotiated', label: '협의중',    count: '2' },
  { id: 'inProgress', label: '시안확인',  count: '2' },
  { id: 'uploaded',   label: '업로드완료', count: '1' },
];

const TAB_DATA: Record<string, Influencer[]> = {
  'list-up': [],
  'contacting': [
    { id: '1', name: 'haye0',  handle: '@haye0',    followers: '10.4만', categories: ['뷰티', '패션'],               statusText: '전송 D+26', profileImg: 'https://i.pravatar.cc/150?img=1' },
    { id: '2', name: 'zigoo',  handle: '@zigoo',    followers: '8만',    categories: ['뷰티', '패션'],               statusText: '전송 D+26', profileImg: 'https://i.pravatar.cc/150?img=5' },
    { id: '3', name: '김지영', handle: '@jijizero', followers: '21만',   categories: ['뷰티', '연애/결혼', '일상'],  statusText: '전송 D+26', profileImg: 'https://i.pravatar.cc/150?img=9' },
  ],
  'negotiated': [
    { id: '4', name: 'paooar', handle: '@paooar', followers: '9.2만', categories: ['뷰티', '패션', '일상'], statusText: 'D-8', profileImg: 'https://i.pravatar.cc/150?img=47' },
    { id: '4', name: 'minj_',  handle: '@minj_',  followers: '24.5만', categories: ['뷰티', '패션'],        statusText: 'D-3', profileImg: 'https://i.pravatar.cc/150?img=44' },
  ],
  'inProgress': [
    { id: '5', name: 'paooar', handle: '@paooar', followers: '9.2만', categories: ['뷰티', '패션', '일상'], statusText: '시안 확인 중', profileImg: 'https://i.pravatar.cc/150?img=47' },
    { id: '5', name: 'zigoo',  handle: '@zigoo',  followers: '8만',   categories: ['뷰티', '패션'],         statusText: '시안 확인 중', profileImg: 'https://i.pravatar.cc/150?img=5' },
  ],
  'uploaded': [
    { id: '6', name: 'paooar', handle: '@paooar', followers: '9.2만', categories: ['뷰티', '패션', '일상'], statusText: '업로드 완료', profileImg: 'https://i.pravatar.cc/150?img=47' },
  ],
};

export default function BoardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('contacting');
  const [activeView, setActiveView] = useState<'grid' | 'list'>('grid');

  return (
    <div className="flex flex-col h-screen bg-white max-w-[430px] mx-auto relative overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 h-[65px] border-b border-[#f0f2f8] bg-white shrink-0">
        <span className="text-[22px] font-bold text-stone-900 tracking-[-0.4px]">보드</span>
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

        {/* Campaign selector */}
        <div className="px-5 pt-5 pb-3 flex justify-center">
          <button className="flex items-center justify-between bg-white rounded-full px-5 py-[13px] w-full max-w-[390px] shadow-[0_0_12px_rgba(99,102,241,0.12)] active:opacity-80">
            <span className="text-[18px] font-medium text-stone-900">루미에르 · 봄봄 프로모션</span>
            <ChevronDown size={18} className="text-stone-700 shrink-0" />
          </button>
        </div>

        {/* View toggle */}
        <div className="px-5 mb-4 flex justify-center">
          <div className="flex bg-[#eff1f8] rounded-full p-1 w-full max-w-[390px] h-[50px]">
            <button
              onClick={() => setActiveView('grid')}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-full text-[16px] font-medium transition-all
                ${activeView === 'grid' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-400'}`}
            >
              <LayoutGrid size={14} />
              단계별
            </button>
            <button
              onClick={() => setActiveView('list')}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-full text-[16px] font-medium transition-all
                ${activeView === 'list' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-400'}`}
            >
              <List size={14} />
              리스트
            </button>
          </div>
        </div>

        {/* Board tabs */}
        <div className="border-b border-[#eef0f6]">
          <div className="flex overflow-x-auto px-3 scrollbar-none">
            {TABS.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1 px-3 py-[10px] border-b-2 -mb-px shrink-0 whitespace-nowrap
                    ${isActive ? 'border-iris-500' : 'border-transparent'}`}
                >
                  <span className={`text-[14px] ${isActive ? 'font-bold text-iris-500' : 'font-medium text-stone-800'}`}>
                    {tab.label}
                  </span>
                  <span className={`text-[12px] px-[9px] py-[2px] rounded-full
                    ${isActive ? 'bg-iris-50 font-bold text-iris-500' : 'bg-[#eff1f8] font-medium text-stone-500'}`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Card list */}
        <div className="px-5 pt-5 flex justify-center">
          <div className="w-full max-w-[390px]">
            {(TAB_DATA[activeTab] ?? []).length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-stone-300">
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="mb-3">
                  <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 24h16M24 16v16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <p className="text-[15px]">인플루언서를 추가해보세요</p>
              </div>
            ) : (
              (TAB_DATA[activeTab] ?? []).map((item, i) => (
                <InfluencerCard key={item.id + i} data={item} onPress={() => router.push('/board/' + item.id)} />
              ))
            )}
          </div>
        </div>

        {/* Add influencer button */}
        <button
          onClick={() => router.push('/board/add')}
          className="w-full h-[68px] flex items-center justify-center gap-[4px] rounded-[14px] mt-2 active:opacity-70"
          style={{ backgroundColor: 'rgba(221, 223, 253, 0.3)' }}
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="9" stroke="#8486F3" strokeWidth="1.5"/>
            <path d="M10 6v8M6 10h8" stroke="#8486F3" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <span className="text-[16px] font-medium" style={{ color: '#8486F3' }}>인플루언서 추가</span>
        </button>
      </div>

      {/* ── Bottom navigation ── */}
      <div className="absolute bottom-0 w-full h-[95px] flex items-start pt-3 bg-white border-t border-[#f0f2f8]">
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
