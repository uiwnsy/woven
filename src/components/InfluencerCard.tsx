export type Influencer = {
  id: string;
  name: string;
  handle: string;
  followers: string;
  categories: string[];
  profileImg?: string;
  statusText?: string;
  amount?: string;
};

type CardProps = {
  data: Influencer;
  onPress?: () => void;
};

export default function InfluencerCard({ data, onPress }: CardProps) {
  const getCategoryStyle = (category: string) => {
    switch (category) {
      case '뷰티':      return { bg: 'bg-[#fdf2fe]', text: 'text-[#87588a]' };
      case '패션':      return { bg: 'bg-[#eef2ff]', text: 'text-[#3e37c3]' };
      case '연애/결혼': return { bg: 'bg-[#fffbeb]', text: 'text-[#92400e]' };
      case '일상':      return { bg: 'bg-[#fef6f1]', text: 'text-[#d96430]' };
      default:          return { bg: 'bg-stone-100',  text: 'text-stone-600'  };
    }
  };

  return (
    <button
      onClick={onPress}
      className="bg-white rounded-2xl px-[22px] py-[22px] mb-[10px] border border-[#ebeef7] flex flex-col w-full text-left active:opacity-80 transition-opacity"
    >
      {/* Top row: profile + name/followers + status */}
      <div className="flex flex-row items-center justify-between mb-[10px]">
        <div className="flex flex-row items-center flex-1 min-w-0">
          {/* Profile image */}
          <div className="relative mr-3 shrink-0">
            <div className="w-10 h-10 rounded-full bg-stone-200 overflow-hidden flex items-center justify-center">
              {data.profileImg ? (
                <img src={data.profileImg} alt={data.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-stone-500 font-bold text-sm">{data.name.charAt(0)}</span>
              )}
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-[2px] shadow-sm">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg"
                alt="Instagram"
                className="w-4 h-4"
              />
            </div>
          </div>

          {/* Name + followers */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-row items-baseline gap-1.5 mb-1">
              <span className="text-[16px] font-semibold text-stone-900 leading-4">{data.name}</span>
              <span className="text-[13px] text-stone-500 leading-4">{data.handle}</span>
            </div>
            <p className="text-[13px] text-stone-500 leading-4">{data.followers}</p>
          </div>
        </div>

        {/* Status pill */}
        {data.statusText && (
          <div className="bg-stone-100 px-[10px] pt-[4px] pb-[6px] rounded-full shrink-0 ml-3">
            <span className="text-[13px] font-semibold text-stone-600 leading-none">{data.statusText}</span>
          </div>
        )}
      </div>

      {/* Categories row */}
      <div className="flex flex-row gap-1.5 flex-wrap">
        {(data.categories || []).map((cat, idx) => {
          const { bg, text } = getCategoryStyle(cat);
          return (
            <span key={idx} className={`px-[10px] pt-[4px] pb-[6px] rounded-full text-[13px] font-semibold leading-none ${bg} ${text}`}>
              {cat}
            </span>
          );
        })}
      </div>
    </button>
  );
}
