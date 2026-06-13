import clsx from 'clsx';

// ── Badge / Tag ──────────────────────────────────────────────
const BADGE_VARIANTS = {
  blue:   'bg-blue-950/60 text-blue-300 border-blue-800/60',
  indigo: 'bg-indigo-950/60 text-indigo-300 border-indigo-800/60',
  purple: 'bg-purple-950/60 text-purple-300 border-purple-800/60',
  violet: 'bg-violet-950/60 text-violet-300 border-violet-800/60',
  emerald:'bg-emerald-950/60 text-emerald-300 border-emerald-800/60',
  orange: 'bg-orange-950/60 text-orange-300 border-orange-800/60',
  red:    'bg-red-950/60 text-red-300 border-red-800/60',
  yellow: 'bg-yellow-950/60 text-yellow-300 border-yellow-800/60',
  gray:   'bg-[#1A1C26] text-[#8B8FA8] border-[#2A2D3E]',
  cyan:   'bg-cyan-950/60 text-cyan-300 border-cyan-800/60',
};

export function Badge({ text, variant = 'gray', className }) {
  return (
    <span className={clsx('tag', BADGE_VARIANTS[variant], className)}>
      {text}
    </span>
  );
}

// ── Skeleton loader ──────────────────────────────────────────
export function Skeleton({ className }) {
  return (
    <div className={clsx('shimmer-bg rounded-xl', className)} />
  );
}

export function SkeletonCard() {
  return (
    <div className="card animate-pulse">
      <div className="card-header flex items-center gap-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <div className="p-5 space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-3 w-36" />
            <Skeleton className="h-3 flex-1" />
            <Skeleton className="h-5 w-14 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Empty state ──────────────────────────────────────────────
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-5xl mb-4 opacity-30">{icon}</div>
      <p className="text-[#F0F1F6] font-medium mb-1">{title}</p>
      <p className="text-[#4D5168] text-sm max-w-xs">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ── Copy button ──────────────────────────────────────────────
import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function CopyButton({ text, className }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      onClick={copy}
      title="Copy to clipboard"
      className={clsx(
        'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium',
        'text-[#8B8FA8] hover:text-[#F0F1F6] hover:bg-[#21232F]',
        'transition-all duration-150',
        className
      )}
    >
      {copied ? (
        <><Check size={12} className="text-emerald-400" /> Copied</>
      ) : (
        <><Copy size={12} /> Copy</>
      )}
    </button>
  );
}

// ── Section header ───────────────────────────────────────────
export function SectionTitle({ children, meta }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <div className="w-1 h-4 rounded-full bg-[#6366F1]" />
        <h3 className="text-[#F0F1F6] font-semibold text-sm">{children}</h3>
      </div>
      {meta && <span className="text-xs text-[#4D5168]">{meta}</span>}
    </div>
  );
}

// ── Divider ──────────────────────────────────────────────────
export function Divider() {
  return <div className="border-t border-[#2A2D3E]" />;
}
