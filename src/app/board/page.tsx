'use client';

import { useState } from 'react';
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

const MOCK_DATA: Influencer[] = [
  {
    id: '1', name: 'haye0', handle: '@haye0', followers: '10.4만',
    categories: ['뷰티', '패션'], statusText: '전송 D+26',
    profileImg: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: '2', name: 'zigoo', handle: '@zigoo', followers: '8만',
    categories: ['뷰티', '패션'], statusText: '전송 D+26',
    profileImg: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: '3', name: '김지영', handle: '@jijizero', followers: '21만',
    categories: ['뷰티', '연애/결혼', '일상'], statusText: '전송 D+26',
    profileImg: 'https://i.pravatar.cc/150?img=9',
  },
];

export default function BoardPage() {
  const [activeTab, setActiveTab] = useState('contacting');
  const [activeView, setActiveView] = useState<'grid' | 'list'>('grid');

  return (
    <div className="flex flex-col h-screen bg-white max-w-[430px] mx-auto relative overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 h-[65px] border-b border-[#f0f2f8] bg-white shrink-0">
        <span className="text-[24px] font-bold text-stone-900 tracking-[-0.4px]">보드</span>
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
            {MOCK_DATA.map(item => (
              <InfluencerCard key={item.id} data={item} onPress={() => {}} />
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom navigation ── */}
      <div className="absolute bottom-0 w-full h-[95px] flex items-start pt-3 bg-white border-t border-[#f0f2f8]">
        {[
          { Icon: HomeDisabledIcon,   label: '홈',        active: false },
          { Icon: BriefDisabledIcon,  label: '캠페인',    active: false },
          { Icon: BoardSelectedIcon,  label: '보드',      active: true  },
          { Icon: ReportDisabledIcon, label: '성과',      active: false },
          { Icon: MyDisabledIcon,     label: '마이페이지', active: false },
        ].map(({ Icon, label, active }) => (
          <button
            key={label}
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
