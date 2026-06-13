import { useState, useRef } from 'react';
import {
  Database, Zap, ShoppingBag, Shield, ChevronRight,
  Sparkles, Clock, Trash2, RotateCcw, ArrowRight,
  Terminal, GitBranch, Activity,
} from 'lucide-react';
import clsx from 'clsx';
import { useGenerate } from './hooks/useGenerate.js';
import { useSession } from './hooks/useSession.js';
import { SkeletonCard, EmptyState } from './components/ui.jsx';
import TablesResult from './components/TablesResult.jsx';
import FlowsResult from './components/FlowsResult.jsx';
import CatalogResult from './components/CatalogResult.jsx';
import AclResult from './components/AclResult.jsx';

// ── Config ───────────────────────────────────────────────────
const TABS = [
  {
    id: 'tables',
    label: 'Tables',
    shortLabel: 'Tables',
    icon: Database,
    color: 'indigo',
    description: 'Generate table schemas with fields, types, indexes, and roles.',
    example: 'We need to track IT equipment requests. Each request has equipment type (laptop/monitor/keyboard/mouse), quantity, requested by employee, department, approval status, priority level, and expected delivery date. Employees can only see their own requests, while IT managers see all.',
  },
  {
    id: 'flows',
    label: 'Flows',
    shortLabel: 'Flows',
    icon: Zap,
    color: 'yellow',
    description: 'Build Flow Designer automations with triggers, steps, and error handling.',
    example: 'When a new equipment request is submitted, immediately notify the IT manager via email. If the total cost exceeds $500, escalate to the director for approval. After approval, auto-create a procurement task assigned to the purchasing team. Send status email updates when the request moves to each stage. Handle rejections by notifying the employee with a reason.',
  },
  {
    id: 'catalog',
    label: 'Catalog',
    shortLabel: 'Catalog',
    icon: ShoppingBag,
    color: 'emerald',
    description: 'Create service catalog items with variables, SLAs, and approval rules.',
    example: 'Create a catalog item for employees to request IT equipment. They should select equipment type from a dropdown, specify quantity, choose urgency (standard 3-day / express 1-day / emergency same-day), provide a business justification, and attach a manager approval email if needed. Show the delivery time field only for express/emergency urgency.',
  },
  {
    id: 'acl',
    label: 'ACLs',
    shortLabel: 'ACLs',
    icon: Shield,
    color: 'red',
    description: 'Design role-based access control rules with security recommendations.',
    example: 'IT managers can read, write, and create all equipment requests. Regular employees can only read and create their own requests—they cannot see others. Directors can approve high-value requests over $500. Nobody should be able to delete records once approved. The equipment cost field should be hidden from regular employees. Admins can do everything.',
  },
];

const EXAMPLES_BY_TAB = Object.fromEntries(TABS.map(t => [t.id, t.example]));

const COLOR_MAP = {
  indigo: {
    tab: 'border-indigo-500 text-indigo-400 bg-indigo-950/30',
    dot: 'bg-indigo-400',
    icon: 'text-indigo-400',
    glow: 'shadow-[0_0_20px_rgba(99,102,241,0.15)]',
  },
  yellow: {
    tab: 'border-yellow-500 text-yellow-400 bg-yellow-950/30',
    dot: 'bg-yellow-400',
    icon: 'text-yellow-400',
    glow: 'shadow-[0_0_20px_rgba(234,179,8,0.15)]',
  },
  emerald: {
    tab: 'border-emerald-500 text-emerald-400 bg-emerald-950/30',
    dot: 'bg-emerald-400',
    icon: 'text-emerald-400',
    glow: 'shadow-[0_0_20px_rgba(52,211,153,0.15)]',
  },
  red: {
    tab: 'border-red-500 text-red-400 bg-red-950/30',
    dot: 'bg-red-400',
    icon: 'text-red-400',
    glow: 'shadow-[0_0_20px_rgba(248,113,113,0.15)]',
  },
};

// ── Tab Button ───────────────────────────────────────────────
function TabButton({ tab, isActive, hasResult, isGenerating, onClick }) {
  const Icon = tab.icon;
  const colors = COLOR_MAP[tab.color];

  return (
    <button
      onClick={onClick}
      className={clsx(
        'relative flex items-center gap-2.5 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200',
        isActive
          ? clsx(colors.tab, 'border-opacity-100')
          : 'border-[#2A2D3E] text-[#8B8FA8] bg-[#13141C] hover:border-[#3A3D52] hover:text-[#F0F1F6]',
      )}
    >
      <Icon size={15} className={isActive ? colors.icon : 'text-[#4D5168]'} />
      <span className="hidden sm:inline">{tab.label}</span>
      <span className="sm:hidden">{tab.shortLabel}</span>

      {/* Status dot */}
      {hasResult && !isGenerating && (
        <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', colors.dot)} />
      )}
      {isGenerating && (
        <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-[#6366F1] animate-pulse" />
      )}
    </button>
  );
}

// ── Requirements Panel ───────────────────────────────────────
function RequirementsPanel({ activeTab, requirements, setRequirements, onGenerate, loading, activeType }) {
  const tab = TABS.find(t => t.id === activeTab);
  const isThisGenerating = loading && activeType === activeTab;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-[#F0F1F6]">
          Business Requirements
        </label>
        <button
          onClick={() => setRequirements(EXAMPLES_BY_TAB[activeTab])}
          className="text-xs text-[#6366F1] hover:text-[#818CF8] transition-colors flex items-center gap-1"
        >
          Load example <ArrowRight size={10} />
        </button>
      </div>

      <div className="relative">
        <textarea
          value={requirements}
          onChange={e => setRequirements(e.target.value)}
          placeholder={`Describe what your ServiceNow app needs to do…\n\nBe specific about:\n• Data you need to store\n• User roles and permissions\n• Business processes to automate`}
          rows={9}
          className="input-field resize-none leading-relaxed"
        />
        <div className="absolute bottom-3 right-3 text-xs text-[#4D5168] pointer-events-none">
          {requirements.length}/4000
        </div>
      </div>

      <p className="text-xs text-[#4D5168]">{tab?.description}</p>

      <button
        onClick={onGenerate}
        disabled={loading || requirements.trim().length < 20}
        className="btn-primary w-full py-3 text-sm"
      >
        {isThisGenerating ? (
          <><Activity size={15} className="animate-pulse" /> Generating {tab?.label}…</>
        ) : (
          <><Sparkles size={15} /> Generate {tab?.label}</>
        )}
      </button>
    </div>
  );
}

// ── History Sidebar ──────────────────────────────────────────
function HistorySidebar({ results, activeTab, setActiveTab, clearResult }) {
  const generated = TABS.filter(t => results[t.id]);

  if (generated.length === 0) return null;

  return (
    <div className="bg-[#13141C] border border-[#2A2D3E] rounded-2xl p-4">
      <p className="text-xs text-[#4D5168] uppercase tracking-wider font-medium mb-3 flex items-center gap-2">
        <Clock size={11} /> Generated
      </p>
      <div className="space-y-1">
        {generated.map(tab => {
          const Icon = tab.icon;
          const colors = COLOR_MAP[tab.color];
          const isActive = activeTab === tab.id;

          return (
            <div
              key={tab.id}
              className={clsx(
                'flex items-center justify-between group rounded-lg px-3 py-2 cursor-pointer transition-colors',
                isActive ? 'bg-[#1A1C26]' : 'hover:bg-[#1A1C26]/60'
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              <div className="flex items-center gap-2">
                <Icon size={13} className={colors.icon} />
                <span className="text-sm text-[#F0F1F6]">{tab.label}</span>
              </div>
              <button
                onClick={e => { e.stopPropagation(); clearResult(tab.id); }}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-[#21232F] text-[#4D5168] hover:text-red-400"
                title="Clear result"
              >
                <Trash2 size={11} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Result Viewer ────────────────────────────────────────────
function ResultViewer({ activeTab, result, loading, activeType, error, onRetry }) {
  if (loading && activeType === activeTab) {
    return (
      <div className="space-y-4">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card border-red-900/40 bg-red-950/10">
        <div className="p-8 text-center">
          <p className="text-red-400 font-medium mb-1">Generation failed</p>
          <p className="text-sm text-[#8B8FA8] mb-4">{error}</p>
          <button onClick={onRetry} className="btn-ghost text-sm">
            <RotateCcw size={13} /> Try again
          </button>
        </div>
      </div>
    );
  }

  if (!result) {
    const tab = TABS.find(t => t.id === activeTab);
    const Icon = tab?.icon;
    return (
      <EmptyState
        icon={Icon ? <Icon size={40} className="text-[#2A2D3E]" /> : '◻'}
        title={`No ${tab?.label} generated yet`}
        description="Enter your business requirements and click Generate to create production-ready ServiceNow artifacts."
      />
    );
  }

  return (
    <div className="animate-fade-up">
      {activeTab === 'tables' && <TablesResult data={result} />}
      {activeTab === 'flows' && <FlowsResult data={result} />}
      {activeTab === 'catalog' && <CatalogResult data={result} />}
      {activeTab === 'acl' && <AclResult data={result} />}
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────────
export default function App() {
  const sessionId = useSession();
  const [activeTab, setActiveTab] = useState('tables');
  const [requirements, setRequirements] = useState('');
  const { loading, activeType, results, errors, generate, clearResult } = useGenerate(sessionId);
  const resultRef = useRef(null);

  const handleGenerate = async () => {
    await generate(activeTab, requirements);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  };

  return (
    <div className="min-h-screen bg-[#0D0E14]">
      {/* Subtle grid background */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Radial glow top */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.06) 0%, transparent 70%)',
        }}
      />

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-[#2A2D3E] bg-[#0D0E14]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6366F1] to-[#4F46E5] flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.4)]">
              <Terminal size={15} className="text-white" />
            </div>
            <div>
              <span className="font-semibold text-[#F0F1F6] text-sm tracking-tight">SN Toolkit</span>
              <span className="hidden sm:inline text-[#4D5168] text-sm"> · ServiceNow Dev Productivity</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-1.5 text-xs text-[#4D5168]">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
              Claude-powered
            </div>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost text-xs py-1.5 hidden sm:flex"
            >
              <GitBranch size={13} />
              GitHub
            </a>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#6366F1]/30 bg-[#6366F1]/10 text-xs text-[#818CF8] mb-5">
            <Sparkles size={11} />
            AI-powered ServiceNow development
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#F0F1F6] leading-tight tracking-tight mb-3">
            Business requirements<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6366F1] to-[#818CF8]">
              to production artifacts.
            </span>
          </h1>
          <p className="text-[#8B8FA8] text-base leading-relaxed">
            Describe what you need to build. Get complete ServiceNow tables, flows,
            catalog items, and ACL rules — ready to deploy.
          </p>
        </div>
      </section>

      {/* ── Main Layout ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">

          {/* ── Left panel ── */}
          <div className="flex flex-col gap-5">
            <RequirementsPanel
              activeTab={activeTab}
              requirements={requirements}
              setRequirements={setRequirements}
              onGenerate={handleGenerate}
              loading={loading}
              activeType={activeType}
            />
            <HistorySidebar
              results={results}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              clearResult={clearResult}
            />
          </div>

          {/* ── Right panel ── */}
          <div ref={resultRef}>
            {/* Tabs */}
            <div className="flex items-center gap-2 flex-wrap mb-5">
              {TABS.map(tab => (
                <TabButton
                  key={tab.id}
                  tab={tab}
                  isActive={activeTab === tab.id}
                  hasResult={!!results[tab.id]}
                  isGenerating={loading && activeType === tab.id}
                  onClick={() => setActiveTab(tab.id)}
                />
              ))}
            </div>

            {/* Result */}
            <ResultViewer
              activeTab={activeTab}
              result={results[activeTab]}
              loading={loading}
              activeType={activeType}
              error={errors[activeTab]}
              onRetry={handleGenerate}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
