'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronRight, Download } from 'lucide-react';
import {
  SearchIcon, AlertIcon,
  HomeDisabledIcon, BriefDisabledIcon,
  BoardDisabledIcon, ReportSelectedIcon, MyDisabledIcon,
} from '@/components/Icons';

// ── Bar chart data ──────────────────────────────────────────────
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

function BarChart({ granularity }: { granularity: '일별' | '주별' }) {
  const yLabels = [600, 450, 300, 150, 0];
  return (
    <div className="bg-[#f8faff] rounded-2xl px-4 pt-4 pb-3 mx-0">
      <div className="flex gap-2">
        {/* Y-axis */}
        <div className="flex flex-col justify-between text-[11px] text-[#9aa1a9] w-7 shrink-0 pb-5">
          {yLabels.map(v => <span key={v} className="leading-none">{v}</span>)}
        </div>

        {/* Chart area */}
        <div className="flex-1 flex flex-col">
          {/* Grid + bars */}
          <div className="relative" style={{ height: CHART_H }}>
            {/* Grid lines */}
            {[0, 1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="absolute w-full border-t border-[#e4e8f4]"
                style={{ top: `${(i / 4) * 100}%` }}
              />
            ))}
            {/* Bars */}
            <div className="absolute inset-0 flex items-end justify-between px-0">
              {CHART_DATA.map((d) => {
                const clickH = Math.round((d.clicks / MAX_CLICKS) * CHART_H);
                const convH = Math.max(2, Math.round((d.conversions / MAX_CLICKS) * CHART_H));
                return (
                  <div key={d.date} className="flex items-end gap-[2px]">
                    <div
                      className="w-[14px] rounded-t-sm bg-[#a5a8f5]"
                      style={{ height: clickH }}
                    />
                    <div
                      className="w-[14px] rounded-t-sm bg-iris-500"
                      style={{ height: d.conversions > 0 ? convH : 2, opacity: d.conversions > 0 ? 1 : 0.3 }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* X-axis labels */}
          <div className="flex justify-between mt-2 pb-1">
            {CHART_DATA.map(d => (
              <span key={d.date} className="text-[11px] text-[#9aa1a9] leading-none">{d.date}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-5 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#a5a8f5]" />
          <span className="text-[13px] text-[#9aa1a9]">클릭 수</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-iris-500" />
          <span className="text-[13px] text-[#9aa1a9]">전환 수</span>
        </div>
      </div>
    </div>
  );
}

// ── Influencer data ─────────────────────────────────────────────
const TOP_PERFORMER = {
  name: 'dearyq', handle: '@dearyq', followers: '10.1만',
  profileImg: 'https://i.pravatar.cc/150?img=47',
  roas: '1.4x', clicks: 820, conversions: 5, cvr: '0.61%', cpm: '45만',
};

const UPLOAD_WAITING = [
  { id: '3',  name: 'leeum',  handle: '@leeum',   followers: '4.6만',  profileImg: 'https://i.pravatar.cc/150?img=9',
    stage: { label: '시안확인', bg: 'bg-[#f0fdf4]', text: 'text-[#22c55e]' },
    status: { label: '포스팅 D-1', bg: 'bg-[#f5f5f3]', text: 'text-stone-600' } },
  { id: '4',  name: '이가흔', handle: '@gaaa934', followers: '2.4만',  profileImg: 'https://i.pravatar.cc/150?img=32',
    stage: { label: '시안확인', bg: 'bg-[#f0fdf4]', text: 'text-[#22c55e]' },
    status: { label: '수정본 D-2', bg: 'bg-[#fffbeb]', text: 'text-[#f59e0b]' } },
  { id: '5',  name: '박진이', handle: '@jinstlee', followers: '6.8만', profileImg: 'https://i.pravatar.cc/150?img=25',
    stage: { label: '협의중', bg: 'bg-[#fef6f1]', text: 'text-[#d96430]' },
    status: { label: '보류', bg: 'bg-[#f5f5f3]', text: 'text-stone-600' } },
  { id: '6',  name: 'haye0',  handle: '@haye0',   followers: '10.4만', profileImg: 'https://i.pravatar.cc/150?img=1',
    stage: { label: '컨택', bg: 'bg-[#eef2ff]', text: 'text-iris-600' },
    status: { label: '미응답', bg: 'bg-[#fef2f2]', text: 'text-red-500' } },
  { id: '7',  name: 'zigoo',  handle: '@zigoo',   followers: '2만',    profileImg: 'https://i.pravatar.cc/150?img=5',
    stage: { label: '컨택', bg: 'bg-[#eef2ff]', text: 'text-iris-600' },
    status: { label: '미응답', bg: 'bg-[#fef2f2]', text: 'text-red-500' } },
  { id: '8',  name: '김지영', handle: '@jijizero', followers: '21만',  profileImg: 'https://i.pravatar.cc/150?img=20',
    stage: { label: '컨택', bg: 'bg-[#eef2ff]', text: 'text-iris-600' },
    status: { label: '미응답', bg: 'bg-[#fef2f2]', text: 'text-red-500' } },
  { id: '9',  name: '김민지', handle: '@minj_',   followers: '24.9만', profileImg: 'https://i.pravatar.cc/150?img=16',
    stage: { label: '리스트업', bg: 'bg-[#f5f5f3]', text: 'text-stone-600' } },
  { id: '10', name: '박서연', handle: '@ppseoo',  followers: '4만',    profileImg: 'https://i.pravatar.cc/150?img=36',
    stage: { label: '리스트업', bg: 'bg-[#f5f5f3]', text: 'text-stone-600' } },
  { id: '11', name: 'leezsu', handle: '@leezsu',  followers: '12만',   profileImg: 'https://i.pravatar.cc/150?img=12',
    stage: { label: '리스트업', bg: 'bg-[#f5f5f3]', text: 'text-stone-600' } },
];

const PERIOD_FILTERS = ['전체', '7일', '14일', '30일'] as const;
type Period = typeof PERIOD_FILTERS[number];

export default function PerformancePage() {
  const router = useRouter();
  const [period, setPeriod] = useState<Period>('7일');
  const [chartGranularity, setChartGranularity] = useState<'일별' | '주별'>('일별');

  return (
    <div className="flex flex-col h-screen bg-white max-w-[430px] mx-auto relative overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 h-[65px] border-b border-[#f0f2f8] bg-white shrink-0">
        <span className="text-[22px] font-bold text-stone-900 tracking-[-0.4px]">성과</span>
        <div className="flex items-center gap-3">
          <button className="active:opacity-60"><SearchIcon size={32} className="text-stone-900" /></button>
          <button className="relative active:opacity-60">
            <AlertIcon size={32} className="text-stone-900" />
            <span className="absolute top-0 right-0 w-[10px] h-[10px] bg-iris-500 rounded-full border-2 border-white" />
          </button>
        </div>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 bg-[#fafbfe] overflow-y-auto pb-[95px]">

        {/* Campaign selector + period filters */}
        <div className="bg-white px-5 pt-4 pb-4">
          <button className="flex items-center gap-2 mb-4 active:opacity-70">
            <span className="text-[18px] font-medium text-stone-900">루미에르 · 봄봄 프로모션</span>
            <ChevronDown size={20} className="text-stone-700" />
          </button>

          <div className="flex gap-2">
            {PERIOD_FILTERS.map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`h-8 px-4 rounded-full text-[14px] font-medium transition-all active:opacity-70
                  ${period === p ? 'bg-iris-500 text-white' : 'text-stone-500'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="h-2 bg-[#f5f5f3]" />

        {/* KPI Summary */}
        <div className="bg-white px-5 pt-5 pb-5">
          <div className="bg-[#f7f9fe] rounded-2xl px-5 py-5">
            {/* ROAS */}
            <p className="text-[16px] font-medium text-stone-500 mb-1">평균 ROAS</p>
            <p className="text-[30px] font-extrabold text-black mb-4">1.4x</p>

            {/* Clicks + Conversions */}
            <div className="flex gap-3 mb-3">
              <div className="flex-1 bg-white rounded-xl px-4 pt-4 pb-4">
                <p className="text-[14px] font-medium text-stone-500 mb-1">총 클릭 수</p>
                <p className="text-[22px] font-extrabold text-black mb-3">820</p>
                <div className="bg-[#f0fdf4] px-3 py-1.5 rounded-full inline-flex">
                  <span className="text-[14px] text-[#22c55e]">UTM 추적</span>
                </div>
              </div>
              <div className="flex-1 bg-white rounded-xl px-4 pt-4 pb-4">
                <p className="text-[14px] font-medium text-stone-500 mb-1">추적 전환 수</p>
                <p className="text-[22px] font-extrabold text-black mb-3">5</p>
                <div className="bg-[#f0fdf4] px-3 py-1.5 rounded-full inline-flex">
                  <span className="text-[14px] text-[#22c55e]">UTM 추적</span>
                </div>
              </div>
            </div>

            {/* CVR / CPC / CPA */}
            <div className="flex gap-3">
              {[
                { label: 'CVR',      value: '0.61%' },
                { label: 'Avg. CPC', value: '₩549' },
                { label: 'Avg. CPA', value: '9만원' },
              ].map(kpi => (
                <div key={kpi.label} className="flex-1 bg-white rounded-xl px-4 py-4">
                  <p className="text-[13px] font-medium text-stone-500 mb-1">{kpi.label}</p>
                  <p className="text-[18px] font-extrabold text-black">{kpi.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="h-2 bg-[#f5f5f3]" />

        {/* 성과 추이 */}
        <div className="bg-white px-5 pt-5 pb-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[22px] font-bold text-black">성과 추이</h2>
            <div className="flex bg-[#eaedd5] rounded-full p-1 gap-0">
              {(['일별', '주별'] as const).map(g => (
                <button
                  key={g}
                  onClick={() => setChartGranularity(g)}
                  className={`px-4 py-1.5 rounded-full text-[13px] font-semibold transition-all
                    ${chartGranularity === g ? 'bg-white text-stone-700 shadow-sm' : 'text-[#abb3bd]'}`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          <BarChart granularity={chartGranularity} />
        </div>

        <div className="h-2 bg-[#f5f5f3]" />

        {/* 인플루언서별 성과 */}
        <div className="bg-white px-5 pt-5 pb-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[22px] font-bold text-black">인플루언서별 성과</h2>
            <button className="flex items-center gap-0.5 active:opacity-70">
              <span className="text-[14px] font-semibold text-stone-500">ROAS순</span>
              <ChevronRight size={16} className="text-stone-400" />
            </button>
          </div>

          {/* Top performer card */}
          <div className="bg-[#f8faff] rounded-2xl p-5 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {/* Rank badge */}
                <div className="relative shrink-0">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <polygon points="12,2 15,9 22,9 16,14 18,21 12,17 6,21 8,14 2,9 9,9" fill="#ffc800"/>
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-white text-[11px] font-bold">1</span>
                </div>
                {/* Profile */}
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-stone-200 overflow-hidden">
                    <img src={TOP_PERFORMER.profileImg} alt={TOP_PERFORMER.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-[2px] shadow-sm">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" alt="ig" className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[16px] font-semibold text-black">{TOP_PERFORMER.name}</span>
                    <span className="text-[13px] text-stone-500">{TOP_PERFORMER.handle}</span>
                  </div>
                  <span className="text-[12px] text-stone-500">{TOP_PERFORMER.followers}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[22px] font-extrabold text-stone-900 leading-none">{TOP_PERFORMER.roas}</p>
                <p className="text-[12px] font-semibold text-stone-500 mt-0.5">ROAS</p>
              </div>
            </div>

            {/* Status badges */}
            <div className="flex gap-2 mb-4">
              <span className="bg-iris-50 text-iris-500 text-[13px] font-semibold px-3 py-1 rounded-full">업로드완료</span>
              <span className="bg-[#f0fdf4] text-[#22c55e] text-[13px] font-semibold px-3 py-1 rounded-full">UTM 포함</span>
            </div>

            {/* Stats */}
            <div className="flex gap-0 border-t border-[#ebeef7] pt-4">
              {[
                { label: '클릭',  value: String(TOP_PERFORMER.clicks) },
                { label: '전환',  value: String(TOP_PERFORMER.conversions) },
                { label: 'CVR',   value: TOP_PERFORMER.cvr },
                { label: '단가',  value: TOP_PERFORMER.cpm },
              ].map((stat, i) => (
                <div key={stat.label} className={`flex-1 text-center ${i > 0 ? 'border-l border-[#ebeef7]' : ''}`}>
                  <p className="text-[18px] font-bold text-black leading-none">{stat.value}</p>
                  <p className="text-[12px] text-stone-400 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 업로드 대기 list */}
          <h3 className="text-[16px] font-bold text-stone-900 mb-2">업로드 대기</h3>
          {UPLOAD_WAITING.map((inf, i) => (
            <div
              key={inf.id}
              className={`flex items-center justify-between py-[13px]
                ${i < UPLOAD_WAITING.length - 1 ? 'border-b border-[#f0f2f8]' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <div className="w-9 h-9 rounded-full bg-stone-200 overflow-hidden">
                    <img src={inf.profileImg} alt={inf.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-[1.5px] shadow-sm">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" alt="ig" className="w-3 h-3" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[15px] font-semibold text-black">{inf.name}</span>
                    <span className="text-[12px] text-stone-500">{inf.handle}</span>
                  </div>
                  <span className="text-[12px] text-stone-400">{inf.followers}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {inf.stage && (
                  <span className={`${inf.stage.bg} ${inf.stage.text} text-[13px] font-semibold px-2.5 py-1 rounded-full`}>
                    {inf.stage.label}
                  </span>
                )}
                {(inf as any).status && (
                  <span className={`${(inf as any).status.bg} ${(inf as any).status.text} text-[13px] font-semibold px-2.5 py-1 rounded-full`}>
                    {(inf as any).status.label}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="h-2 bg-[#f5f5f3]" />

        {/* 리포트 내보내기 */}
        <div className="bg-white px-5 pt-5 pb-5">
          <h2 className="text-[20px] font-bold text-black mb-4">리포트 내보내기</h2>
          {[
            { title: '캠페인 전체 요약',     subtitle: '핵심 KPI + 인플루언서 성과 요약' },
            { title: '인플루언서별 성과 데이터', subtitle: '일별 클릭·전환·ROAS 상세 리포트' },
          ].map((item, i) => (
            <button
              key={item.title}
              className={`w-full flex items-center justify-between py-4 active:opacity-70
                ${i < 1 ? 'border-b border-[#f0f2f8]' : ''}`}
            >
              <div className="flex items-center gap-4 text-left">
                <div className="w-10 h-10 bg-iris-50 rounded-xl flex items-center justify-center shrink-0">
                  <Download size={18} className="text-iris-500" />
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-stone-900">{item.title}</p>
                  <p className="text-[13px] text-stone-400 mt-0.5">{item.subtitle}</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-stone-400 shrink-0 ml-2" />
            </button>
          ))}
        </div>

      </div>

      {/* ── Bottom navigation ── */}
      <div className="absolute bottom-0 w-full h-[95px] flex items-start pt-3 bg-white border-t border-[#f0f2f8]">
        {[
          { Icon: HomeDisabledIcon,   label: '홈',        active: false, onClick: () => router.push('/home') },
          { Icon: BriefDisabledIcon,  label: '캠페인',    active: false, onClick: () => router.push('/campaign') },
          { Icon: BoardDisabledIcon,  label: '보드',      active: false, onClick: () => router.push('/board') },
          { Icon: ReportSelectedIcon, label: '성과',      active: true,  onClick: () => {} },
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
