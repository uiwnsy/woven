'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, ChevronRight } from 'lucide-react';
import {
  HomeDisabledIcon, BriefDisabledIcon,
  BoardDisabledIcon, ReportDisabledIcon,
  MySelectedIcon,
} from '@/components/Icons';

type SettingItem = {
  title: string;
  subtitle: string;
  value?: string;
  toggle?: boolean;
  chevron?: boolean;
};

type Section = {
  heading: string;
  items: SettingItem[];
};

const SECTIONS: Section[] = [
  {
    heading: '브랜드 · AI 설정',
    items: [
      { title: '브랜드 관리',        subtitle: '브랜드 정보, 로고, AI 설정',       value: '루미에르', chevron: true },
      { title: '브랜드별 AI 브리프 설정', subtitle: '브랜드 소개, 기본 금지 사항',  chevron: true },
      { title: 'UTM 설정',           subtitle: '기본 도메인, 파라미터 규칙',        value: 'lumiere.com', chevron: true },
    ],
  },
  {
    heading: '팀',
    items: [
      { title: '팀원 관리', subtitle: '팀 초대 및 역할 설정', value: '3명', chevron: true },
    ],
  },
  {
    heading: '구독 · 결제',
    items: [
      { title: '구독 플랜',  subtitle: '플랜 변경 및 업그레이드',  value: 'Plus',      chevron: true },
      { title: '결제 수단',  subtitle: '카드 및 결제 정보 관리',   value: '···· 4231', chevron: true },
    ],
  },
  {
    heading: '알림',
    items: [
      { title: '푸시 알림',      subtitle: '마감·미응답·시안 접수 알림', toggle: true },
      { title: '알림 상세 설정', subtitle: '항목별 알림 on/off',           chevron: true },
    ],
  },
  {
    heading: '데이터',
    items: [
      { title: '데이터 내보내기', subtitle: 'CSV 내보내기 기본 설정', chevron: true },
    ],
  },
  {
    heading: '기타',
    items: [
      { title: '도움말 · FAQ',               subtitle: '', chevron: true },
      { title: '이용약관 · 개인정보처리방침', subtitle: '', chevron: true },
    ],
  },
];

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-[51px] h-[31px] rounded-full transition-colors shrink-0
        ${on ? 'bg-iris-500' : 'bg-stone-300'}`}
    >
      <div
        className={`absolute top-[2px] w-[27px] h-[27px] bg-white rounded-full shadow transition-transform
          ${on ? 'translate-x-[22px]' : 'translate-x-[2px]'}`}
      />
    </button>
  );
}

export default function MyPage() {
  const router = useRouter();
  const [pushEnabled, setPushEnabled] = useState(true);

  return (
    <div className="flex flex-col h-screen bg-white max-w-[430px] mx-auto relative overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 h-[65px] border-b border-[#f0f2f8] bg-white shrink-0">
        <span className="text-[20px] font-bold text-stone-900 tracking-[-0.4px]">마이페이지</span>
        <button className="active:opacity-60">
          <Pencil size={22} className="text-stone-700" />
        </button>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto bg-white pb-[95px]">

        {/* Profile */}
        <div className="px-5 pt-5 pb-5 flex items-center gap-4">
          <div className="w-[56px] h-[56px] rounded-full bg-[#f7b898] flex items-center justify-center shrink-0 overflow-hidden">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="14" r="7" fill="rgba(255,255,255,0.8)"/>
              <ellipse cx="18" cy="30" rx="12" ry="8" fill="rgba(255,255,255,0.8)"/>
            </svg>
          </div>
          <div>
            <p className="text-[16px] font-bold text-stone-900">김지은</p>
            <p className="text-[14px] text-stone-500 mt-0.5">jieun@lumiere.co.kr</p>
          </div>
        </div>

        {/* Plan card */}
        <div className="mx-5 mb-6 bg-stone-900 rounded-2xl px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-[16px] font-bold text-white mb-1">Woven Plus Plan</p>
            <p className="text-[14px] text-stone-400">다음 결제일 5월 18일</p>
          </div>
          <div className="bg-iris-500 px-[10px] pt-[4px] pb-[6px] rounded-full shrink-0 ml-3">
            <span className="text-white text-[14px] font-semibold whitespace-nowrap leading-none">멤버십 124 일째 이용 중</span>
          </div>
        </div>

        {/* Settings sections */}
        {SECTIONS.map((section, si) => (
          <div key={section.heading}>
            {si > 0 && <div className="h-[10px] bg-[#F5F5F3]" />}
            <div className="px-5 py-6">
              <h2 className="text-[20px] font-bold text-stone-900 mb-3">{section.heading}</h2>
              {section.items.map((item, ii) => (
                <div
                  key={item.title}
                  className={`flex items-center justify-between py-[14px]
                    ${ii < section.items.length - 1 ? 'border-b border-[#f0f2f8]' : ''}`}
                >
                  <div className="flex-1 min-w-0 mr-3">
                    <p className="text-[16px] font-medium text-stone-900">{item.title}</p>
                    {item.subtitle && (
                      <p className="text-[14px] text-stone-400 mt-0.5">{item.subtitle}</p>
                    )}
                  </div>

                  {item.toggle !== undefined ? (
                    <Toggle
                      on={item.title === '푸시 알림' ? pushEnabled : false}
                      onToggle={() => item.title === '푸시 알림' && setPushEnabled(p => !p)}
                    />
                  ) : (
                    <div className="flex items-center gap-1 shrink-0">
                      {item.value && (
                        <span className="text-[14px] text-stone-500">{item.value}</span>
                      )}
                      {item.chevron && (
                        <ChevronRight size={18} className="text-stone-400" />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Logout */}
        <div className="h-[10px] bg-[#F5F5F3]" />
        <button className="w-full py-5 bg-[#F5F5F3] active:opacity-60">
          <span className="text-[16px] text-stone-500">로그아웃</span>
        </button>

      </div>

      {/* ── Bottom navigation ── */}
      <div className="absolute bottom-0 w-full h-[95px] flex items-start pt-[2px] bg-white border-t border-[#F5F5F3] z-20">
        {[
          { Icon: HomeDisabledIcon,   label: '홈',        active: false, onClick: () => router.push('/home') },
          { Icon: BriefDisabledIcon,  label: '캠페인',    active: false, onClick: () => router.push('/campaign') },
          { Icon: BoardDisabledIcon,  label: '보드',      active: false, onClick: () => router.push('/board') },
          { Icon: ReportDisabledIcon, label: '성과',      active: false, onClick: () => router.push('/performance') },
          { Icon: MySelectedIcon,     label: '마이페이지', active: true,  onClick: () => {} },
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
