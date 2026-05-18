'use client';

import { useRouter } from 'next/navigation';

const MANROPE: React.CSSProperties = { fontFamily: 'Manrope, sans-serif' };

const UPLOADED: {
  rank: number;
  name: string;
  handle: string;
  followers: string;
  profile: string;
  roas: string;
  clicks: string;
  conversions: string;
  cvr: string;
  cost: string;
  hasUtm: boolean;
}[] = [
  {
    rank: 1, name: 'dearyq', handle: '@dearyq', followers: '10.1만',
    profile: '/profile-dearyq.png',
    roas: '1.4x', clicks: '820', conversions: '5', cvr: '0.61%', cost: '45만',
    hasUtm: true,
  },
  {
    rank: 2, name: 'leeum', handle: '@leeum', followers: '4.6만',
    profile: '/profile-leeum.png',
    roas: '1.1x', clicks: '640', conversions: '3', cvr: '0.47%', cost: '35만',
    hasUtm: true,
  },
  {
    rank: 3, name: 'paooar', handle: '@paooar', followers: '9.2만',
    profile: '/profile-paooar.png',
    roas: '0.8x', clicks: '310', conversions: '2', cvr: '0.65%', cost: '35만',
    hasUtm: false,
  },
];


const RANK_COLORS = ['#FFC800', '#B8BFC9', '#CD7F32'];

function IGBadge() {
  return (
    <img
      src="/skill-icons_instagram.svg"
      alt="ig"
      width={16} height={16}
      className="absolute"
      style={{ bottom: 0, right: -4, width: 16, height: 16 }}
    />
  );
}

export default function InfluencerPerformancePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col h-screen bg-white max-w-[430px] mx-auto relative overflow-hidden">

      {/* ── Header ── */}
      <div className="flex items-center px-5 h-[56px] border-b border-[#E8E7E4] bg-white shrink-0">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center active:opacity-60 mr-3"
          style={{ width: 36, height: 36 }}
        >
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
            <path d="M9 1L1 9L9 17" stroke="#1C1A17" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <span className="text-[18px] font-bold text-black">인플루언서별 성과</span>
      </div>

      {/* ── Scrollable body ── */}
      <div className="flex-1 bg-[#FAFBFE] overflow-y-auto pb-10">

        {/* ── Campaign pill ── */}
        <div className="bg-white px-5 pt-5 pb-5">
          <button className="flex items-center justify-between w-full bg-white rounded-[46px] px-[22px] py-[14px] shadow-[0_0_2px_rgba(99,102,241,0.3)] active:opacity-80">
            <span className="text-[16px] font-medium text-[#1C1A17]">루미에르 봄봄 프로모션</span>
            <img src="/arrow-down-campaign.svg" alt="" width={24} height={24} />
          </button>
        </div>

        <div className="h-2 bg-stone-100" />

        {/* ── 업로드 완료 카드 목록 ── */}
        <div className="bg-white px-5 py-6 flex flex-col gap-4">
          <span className="text-[14px] font-semibold" style={{ color: '#B0ADA7' }}>
            업로드 완료 {UPLOADED.length}명
          </span>
          {UPLOADED.map(inf => (
            <div
              key={inf.handle}
              className="bg-[#F8FAFF] border border-[#F5F5F3] rounded-[14px] p-[22px] flex flex-col gap-[10px]"
            >
              {/* 상단: 랭크 + 프로필 + ROAS */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[14px]">
                  <div className="relative shrink-0" style={{ width: 24, height: 24 }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <polygon
                        points="12,1 21.5,6.5 21.5,17.5 12,23 2.5,17.5 2.5,6.5"
                        fill={RANK_COLORS[inf.rank - 1] ?? '#C0C4CF'}
                        stroke={inf.rank === 1 ? '#ECBF13' : inf.rank === 2 ? '#A0A8B4' : '#B56A22'}
                        strokeWidth="1.5"
                      />
                    </svg>
                    <span
                      className="absolute inset-0 flex items-center justify-center text-white font-extrabold"
                      style={{ ...MANROPE, fontSize: 11, paddingTop: 2 }}
                    >
                      {inf.rank}
                    </span>
                  </div>
                  <div className="relative shrink-0" style={{ width: 40, height: 40 }}>
                    <div className="w-full h-full rounded-full overflow-hidden bg-stone-200">
                      <img src={inf.profile} alt={inf.name} className="w-full h-full object-cover" />
                    </div>
                    <IGBadge />
                  </div>
                  <div className="flex flex-col gap-0">
                    <div className="flex items-end gap-1">
                      <span className="text-[16px] font-semibold text-black" style={MANROPE}>{inf.name}</span>
                      <span className="text-[14px] text-[#78756E]" style={MANROPE}>{inf.handle}</span>
                    </div>
                    <span className="text-[14px] text-[#78756E]">{inf.followers}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-[2px]">
                  <span className="text-[20px] font-extrabold text-[#1C1A17]" style={MANROPE}>{inf.roas}</span>
                  <span className="text-[14px] font-semibold text-[#5C5A54]" style={MANROPE}>ROAS</span>
                </div>
              </div>

              {/* 태그 */}
              <div className="flex items-center gap-1">
                <span className="bg-[#F0FDF4] text-[#22C55E] text-[14px] font-semibold rounded-full px-[10px] py-[5px]">업로드완료</span>
                {inf.hasUtm && (
                  <span className="bg-[#EFF6FF] text-[#3D3FC7] text-[14px] font-semibold rounded-full px-[10px] py-[5px]">UTM 포함</span>
                )}
              </div>

              {/* 지표 */}
              <div className="flex gap-1">
                {[
                  { l: '클릭', v: inf.clicks },
                  { l: '전환', v: inf.conversions },
                  { l: 'CVR', v: inf.cvr },
                  { l: '단가', v: inf.cost },
                ].map(s => (
                  <div key={s.l} className="flex-1 bg-white border border-[#F5F5F3] rounded-[14px] p-[14px] flex flex-col gap-[6px]">
                    <span className="text-[13px] font-medium text-[#78756E]">{s.l}</span>
                    <span className="text-[15px] font-extrabold text-black" style={MANROPE}>{s.v}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
