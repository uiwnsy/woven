'use client';

import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, MoreHorizontal, Calendar } from 'lucide-react';

type CampaignDetail = {
  id: number;
  title: string;
  productName: string;
  status: '기획' | '진행중' | '완료';
  dateRange: string;
  platform: string;
  goal: string;
  kpis: { label: string; value: string }[];
  boardStages: { label: string; count: string }[];
  info: { label: string; value: string }[];
  coreMessage: string;
  guidelineUrl?: string;
};

const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  진행중: { bg: 'bg-[#fef6f1]', text: 'text-[#d96430]' },
  기획:   { bg: 'bg-[#fffbeb]', text: 'text-[#92400e]' },
  완료:   { bg: 'bg-[#f0fdf4]', text: 'text-[#26af58]' },
};

const MOCK_DETAILS: Record<number, CampaignDetail> = {
  1: {
    id: 1,
    title: '루미에르 봄봄 프로모션',
    productName: '루미에르 선블럭 크림',
    status: '진행중',
    dateRange: '4.17 - 4.26',
    platform: '인스타그램',
    goal: '구매전환',
    kpis: [
      { label: 'ROAS', value: '데이터 집계 전' },
      { label: 'CTR', value: '데이터 집계 전' },
    ],
    boardStages: [
      { label: '리스트업', count: '-' },
      { label: '컨택', count: '3' },
      { label: '협의중', count: '2' },
      { label: '시안확인', count: '2' },
      { label: '업로드', count: '1' },
    ],
    info: [
      { label: '캠페인명', value: '루미에르 봄봄 프로모션' },
      { label: '기간', value: '4.17 ~ 4.26' },
      { label: '목표', value: '구매전환' },
      { label: '플랫폼', value: '인스타그램' },
    ],
    coreMessage: '자외선 차단은 기본, 피부 장벽 케어까지. 매일 바르고 싶은 선케어를 강조',
    guidelineUrl: 'docs.google.com/fxB2eY1zadeox4dkz',
  },
  2: {
    id: 2,
    title: '수분크림 마이크로 인플루언서',
    productName: '루미에르 수분크림',
    status: '기획',
    dateRange: '5.10 - 5.17',
    platform: '인스타그램',
    goal: '인지도 확대',
    kpis: [
      { label: '클릭수', value: '데이터 집계 전' },
      { label: '업로드 수', value: '데이터 집계 전' },
    ],
    boardStages: [
      { label: '리스트업', count: '-' },
      { label: '컨택', count: '-' },
      { label: '협의중', count: '-' },
      { label: '시안확인', count: '-' },
      { label: '업로드', count: '-' },
    ],
    info: [
      { label: '캠페인명', value: '수분크림 마이크로 인플루언서' },
      { label: '기간', value: '5.10 ~ 5.17' },
      { label: '목표', value: '인지도 확대' },
      { label: '플랫폼', value: '인스타그램' },
    ],
    coreMessage: '',
  },
  3: {
    id: 3,
    title: '선크림 런칭 캠페인',
    productName: '누누비 선크림',
    status: '완료',
    dateRange: '3.23 - 3.29',
    platform: '인스타그램',
    goal: '콘텐츠 수집',
    kpis: [
      { label: '업로드 수', value: '3건' },
      { label: '총 도달', value: '42만' },
    ],
    boardStages: [
      { label: '리스트업', count: '-' },
      { label: '컨택', count: '3' },
      { label: '협의중', count: '3' },
      { label: '시안확인', count: '3' },
      { label: '업로드', count: '3' },
    ],
    info: [
      { label: '캠페인명', value: '선크림 런칭 캠페인' },
      { label: '기간', value: '3.23 ~ 3.29' },
      { label: '목표', value: '콘텐츠 수집' },
      { label: '플랫폼', value: '인스타그램' },
    ],
    coreMessage: '자연스러운 일상 속 선크림 사용을 통해 브랜드 인지도와 UGC 확보',
    guidelineUrl: 'docs.google.com/fxB2eY1zadeox4dkz',
  },
};

export default function CampaignDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const campaign = MOCK_DETAILS[id] ?? MOCK_DETAILS[1];
  const statusStyle = STATUS_STYLES[campaign.status];
  const boardEmpty = campaign.boardStages.every(s => s.count === '-');

  return (
    <div className="flex flex-col h-screen bg-[#F9FAFB] max-w-[430px] mx-auto relative overflow-hidden">

      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-4 h-[56px] border-b shrink-0 bg-white"
        style={{ borderColor: 'rgba(203, 213, 225, 0.2)' }}
      >
        <button
          onClick={() => router.back()}
          className="w-[42px] h-[42px] flex items-center justify-center active:opacity-60"
        >
          <ChevronLeft size={24} className="text-stone-900" />
        </button>
        <span className="text-[16px] font-bold text-black">캠페인 상세</span>
        <button className="w-[42px] h-[42px] flex items-center justify-center active:opacity-60">
          <MoreHorizontal size={24} className="text-stone-900" />
        </button>
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto pb-10">
        <div className="flex flex-col gap-[10px]">

          {/* ── 1. Campaign header card ── */}
          <div className="bg-white px-5 pt-[30px] pb-[30px] flex flex-col gap-[14px]">
            {/* Title + status */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-[10px] flex-1">
                <span className="text-[20px] font-bold text-black leading-[1.3]">
                  {campaign.title}
                </span>
                <span className="text-[16px] font-medium text-[#78756E]">
                  {campaign.productName}
                </span>
              </div>
              <span className={`${statusStyle.bg} ${statusStyle.text} text-[13px] font-bold px-[8px] py-[3px] rounded-full shrink-0 mt-1`}>
                {campaign.status}
              </span>
            </div>

            {/* Tag chips */}
            <div className="flex flex-wrap gap-[6px]">
              <span className="flex items-center gap-1 border border-[#E8E7E4] rounded-full px-[8px] py-[3px] text-[13px] font-bold text-[#1C1A17]">
                <Calendar size={14} className="text-[#78756E] shrink-0" />
                {campaign.dateRange}
              </span>
              <span className="border border-[#E8E7E4] rounded-full px-[8px] py-[3px] text-[13px] font-bold text-[#1C1A17]">
                {campaign.platform}
              </span>
              <span className="border border-[#E8E7E4] rounded-full px-[8px] py-[3px] text-[13px] font-bold text-[#1C1A17]">
                {campaign.goal}
              </span>
            </div>
          </div>

          {/* ── 2. 보드 현황 ── */}
          <div className="bg-white py-[30px] flex flex-col items-center gap-[18px]">
            {/* Title + board stages */}
            <div className="w-full px-5 flex flex-col gap-5">
              <span className="text-[20px] font-semibold text-black">보드 현황</span>
              {/* Stage cells */}
              <div className="flex w-full">
                {campaign.boardStages.map((stage, i) => (
                  <div
                    key={stage.label}
                    className={`flex-1 flex flex-col items-center gap-[10px] py-[10px] bg-white
                      ${i === 0
                        ? 'border border-[#E8E7E4] rounded-l-[10px]'
                        : 'border-t border-r border-b border-[#E8E7E4]'}
                      ${i === campaign.boardStages.length - 1 ? 'rounded-r-[10px]' : ''}`}
                  >
                    <span className="text-[20px] font-extrabold text-[#1C1A17] leading-[20px] font-manrope">
                      {stage.count}
                    </span>
                    <span className="text-[16px] font-medium text-[#1C1A17] text-center leading-none">
                      {stage.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Warning banner (when board is empty) */}
            {boardEmpty && (
              <div className="flex items-start gap-2 bg-[#EEF7FF] rounded-[10px] p-5 w-full mx-5" style={{ width: 'calc(100% - 40px)' }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0 mt-[1px]">
                  <path d="M9 1.5L16.5 15H1.5L9 1.5Z" stroke="#2D92FE" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M9 7v3.5" stroke="#2D92FE" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="9" cy="12.5" r="0.75" fill="#2D92FE"/>
                </svg>
                <p className="text-[13px] font-medium text-[#2D92FE] leading-[135%]">
                  보드 현황이 비어있어요.{'\n'}보드에서 인플루언서를 추가하여 관리하세요.
                </p>
              </div>
            )}

            {/* Board nav card */}
            <button
              onClick={() => router.push('/board')}
              className="flex items-center justify-between bg-white border border-[#E8E7E4] rounded-[10px] p-5 active:opacity-70 mx-5"
              style={{ width: 'calc(100% - 40px)' }}
            >
              <div className="flex items-center gap-[14px]">
                <img src="/board-icon.svg" alt="" className="w-[52px] h-[52px] shrink-0" />
                <div className="flex flex-col text-left">
                  <span className="text-[16px] font-medium text-[#1C1A17]">보드에서 인플루언서 관리하기</span>
                  <span className="text-[13px] font-medium text-[#B0ADA7]">단계 이동 · 브리프 발송 · 전체 현황</span>
                </div>
              </div>
              <img src="/arrow-right.svg" alt="" className="w-6 h-6 shrink-0" />
            </button>
          </div>

          {/* ── 3. AI 브리프 ── */}
          <div className="bg-white py-[30px] flex flex-col gap-[18px]">
            <div className="px-5">
              <span className="text-[20px] font-semibold text-black">AI 브리프</span>
            </div>
            <div className="flex items-center justify-between px-5 py-[18px]">
              <div className="flex flex-col gap-1">
                <span className="text-[16px] font-medium text-[#1C1A17]">AI 브리프 보기</span>
                <span className="text-[13px] font-normal text-[#B0ADA7]">브리프 편집 · 재생성</span>
              </div>
              <img src="/arrow-right.svg" alt="" className="w-6 h-6 shrink-0" />
            </div>
          </div>

          {/* ── 4. KPI 현황 ── */}
          <div className="bg-white py-[30px] flex flex-col items-center gap-[18px]">
            {/* Title + KPI cards */}
            <div className="w-full px-5 flex flex-col gap-5">
              <span className="text-[20px] font-semibold text-black">KPI 현황</span>
              <div className="flex gap-4">
                {campaign.kpis.map(kpi => (
                  <div
                    key={kpi.label}
                    className="flex-1 flex flex-col gap-[10px] border border-[#E8E7E4] rounded-[10px] px-[18px] py-[15px]"
                  >
                    <span className="text-[13px] font-semibold text-[#1C1A17] leading-[20px] font-manrope">
                      {kpi.label}
                    </span>
                    <span className={`text-[20px] font-semibold leading-[20px] ${kpi.value === '데이터 집계 전' ? 'text-[#D4D2CE]' : 'text-[#1C1A17]'}`}>
                      {kpi.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance nav card */}
            <button
              onClick={() => router.push('/performance')}
              className="flex items-center justify-between bg-white border border-[#E8E7E4] rounded-[10px] p-5 active:opacity-70 mx-5"
              style={{ width: 'calc(100% - 40px)' }}
            >
              <div className="flex items-center gap-[14px]">
                <img src="/report-icon.svg" alt="" className="w-[52px] h-[52px] shrink-0" />
                <div className="flex flex-col text-left">
                  <span className="text-[16px] font-medium text-[#1C1A17]">성과 탭에서 자세히 보기</span>
                  <span className="text-[13px] font-medium text-[#B0ADA7]">캠페인 성과 · 인플루언서 성과 비교</span>
                </div>
              </div>
              <img src="/arrow-right.svg" alt="" className="w-6 h-6 shrink-0" />
            </button>
          </div>

          {/* ── 5. 캠페인 정보 ── */}
          <div className="bg-white py-[30px] flex flex-col items-center gap-5">
            <div className="w-full px-5">
              <span className="text-[20px] font-semibold text-black">캠페인 정보</span>
            </div>
            <div className="w-full px-5">
              {/* container has px-5 (20px), rows have py-4 only — matches Figma padding: 0px 20px on container, 16px 0px on rows */}
              <div className="bg-[#F8FAFF] rounded-[14px] px-5">
                {campaign.info.map((row, i) => (
                  <div
                    key={row.label}
                    className={`flex items-center justify-between py-4 ${i < campaign.info.length - 1 ? 'border-b border-[#F0F2F8]' : ''}`}
                  >
                    <span className="text-[16px] font-medium text-[#8995A2]">{row.label}</span>
                    <span className="text-[16px] font-medium text-[#1C1A17]">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── 6. 콘텐츠 가이드라인 ── */}
          {campaign.guidelineUrl && (
            <div className="bg-white py-[30px] flex flex-col gap-5">
              <div className="px-5">
                <span className="text-[20px] font-semibold text-black">콘텐츠 가이드라인</span>
              </div>
              <a
                href={`https://${campaign.guidelineUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-5 flex items-center justify-between bg-white border border-[#E8E7E4] rounded-[10px] px-5 py-[18px] active:opacity-70"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="shrink-0 w-9 h-9 rounded-[10px] bg-[#F0F2F8] flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M7.5 9.75a3.375 3.375 0 0 0 5.032.329l1.5-1.5a3.375 3.375 0 0 0-4.773-4.773l-.86.853" stroke="#6366F1" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10.5 8.25a3.375 3.375 0 0 0-5.032-.329l-1.5 1.5a3.375 3.375 0 0 0 4.773 4.773l.854-.853" stroke="#6366F1" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="text-[15px] font-medium text-[#4B5969] truncate">{campaign.guidelineUrl}</span>
                </div>
                <img src="/arrow-right.svg" alt="" className="w-5 h-5 shrink-0 ml-3" />
              </a>
            </div>
          )}

          {/* ── 7. 핵심 메시지 ── */}
          {campaign.coreMessage && (
            <div className="bg-white py-[30px] pb-[70px] flex flex-col items-center gap-5">
              <div className="w-full px-5">
                <span className="text-[20px] font-semibold text-black">핵심 메시지</span>
              </div>
              <div
                className="bg-white border border-[#E8E7E4] rounded-[10px] p-5 mx-5"
                style={{ width: 'calc(100% - 40px)' }}
              >
                <p className="text-[16px] font-medium text-[#1C1A17] leading-[150%]">
                  {campaign.coreMessage}
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
