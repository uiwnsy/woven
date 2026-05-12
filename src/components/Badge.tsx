type BadgeProps = {
  status: 'candidate' | 'contacting' | 'negotiated' | 'inProgress' | 'uploaded' | 'settled' | 'warning';
  label: string;
};

export default function Badge({ status, label }: BadgeProps) {
  const styleMap: Record<BadgeProps['status'], { bg: string; text: string }> = {
    candidate:  { bg: 'bg-stone-100',    text: 'text-stone-600'   },
    contacting: { bg: 'bg-blue-50',      text: 'text-blue-800'    },
    negotiated: { bg: 'bg-iris-50',      text: 'text-iris-900'    },
    inProgress: { bg: 'bg-peach-50',     text: 'text-peach-500'   },
    uploaded:   { bg: 'bg-warning-bg',   text: 'text-warning-text'},
    settled:    { bg: 'bg-success-bg',   text: 'text-success-text'},
    warning:    { bg: 'bg-red-50',       text: 'text-red-700'     },
  };

  const { bg, text } = styleMap[status];

  return (
    <span className={`px-2 py-1 rounded-md inline-block text-xs font-semibold ${bg} ${text}`}>
      {label}
    </span>
  );
}
