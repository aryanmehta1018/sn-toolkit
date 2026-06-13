import { useState, useRef, useEffect } from 'react';
import {
  Database, Zap, ShoppingBag, Shield,
  Sparkles, Trash2, RotateCcw, ArrowRight, Activity,
  ChevronDown, CheckCircle2, Circle,
} from 'lucide-react';
import clsx from 'clsx';
import { useGenerate } from './hooks/useGenerate.js';
import { useSession } from './hooks/useSession.js';
import { SkeletonCard } from './components/ui.jsx';
import TablesResult from './components/TablesResult.jsx';
import FlowsResult from './components/FlowsResult.jsx';
import CatalogResult from './components/CatalogResult.jsx';
import AclResult from './components/AclResult.jsx';

const TABS = [
  {
    id: 'tables', label: 'Tables', icon: Database, color: '#6366F1',
    description: 'Schema, fields, types & indexes',
    example: 'We need to track IT equipment requests. Each request has equipment type (laptop/monitor/keyboard/mouse), quantity, requested by employee, department, approval status, priority level, and expected delivery date. Employees can only see their own requests, while IT managers see all.',
  },
  {
    id: 'flows', label: 'Flows', icon: Zap, color: '#F59E0B',
    description: 'Triggers, steps & automations',
    example: 'When a new equipment request is submitted, immediately notify the IT manager via email. If the total cost exceeds $500, escalate to the director for approval. After approval, auto-create a procurement task assigned to the purchasing team. Send status email updates when the request moves to each stage.',
  },
  {
    id: 'catalog', label: 'Catalog', icon: ShoppingBag, color: '#10B981',
    description: 'Variables, SLAs & approvals',
    example: 'Create a catalog item for employees to request IT equipment. They should select equipment type from a dropdown, specify quantity, choose urgency (standard 3-day / express 1-day / emergency same-day), provide a business justification, and attach a manager approval email if needed.',
  },
  {
    id: 'acl', label: 'ACLs', icon: Shield, color: '#EF4444',
    description: 'Roles, rules & security',
    example: 'IT managers can read, write, and create all equipment requests. Regular employees can only read and create their own requests. Directors can approve high-value requests over $500. Nobody can delete approved records. The equipment cost field should be hidden from regular employees.',
  },
];

// Animated background orbs
function Orbs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <div style={{
        position: 'absolute', top: '-20%', left: '10%',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
        animation: 'float1 12s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', top: '30%', right: '-10%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)',
        animation: 'float2 15s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', bottom: '-10%', left: '30%',
        width: 700, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)',
        animation: 'float3 18s ease-in-out infinite',
      }} />
    </div>
  );
}

// Animated grid
function Grid() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.025 }}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
}

// Typewriter hook
function useTypewriter(words, speed = 80, pause = 2000) {
  const [display, setDisplay] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[wordIndex % words.length];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplay(current.slice(0, charIndex + 1));
        if (charIndex + 1 === current.length) {
          setTimeout(() => setDeleting(true), pause);
        } else {
          setCharIndex(c => c + 1);
        }
      } else {
        setDisplay(current.slice(0, charIndex - 1));
        if (charIndex - 1 === 0) {
          setDeleting(false);
          setWordIndex(w => w + 1);
          setCharIndex(0);
        } else {
          setCharIndex(c => c - 1);
        }
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, wordIndex, words, speed, pause]);

  return display;
}

// Step indicator
function StepBadge({ num, done }) {
  return (
    <div className={clsx(
      'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 shrink-0',
      done ? 'bg-[#6366F1] text-white' : 'bg-[#1A1C26] text-[#4D5168] border border-[#2A2D3E]'
    )}>
      {done ? <CheckCircle2 size={13} /> : num}
    </div>
  );
}

// Tab card
function ArtifactTab({ tab, isActive, hasResult, isGenerating, onClick }) {
  const Icon = tab.icon;
  return (
    <button
      onClick={onClick}
      className={clsx(
        'group relative flex-1 min-w-[120px] flex flex-col items-start gap-1.5 px-4 py-3.5 rounded-2xl border transition-all duration-200 text-left overflow-hidden',
        isActive
          ? 'border-transparent text-white'
          : 'border-[#2A2D3E] bg-[#13141C] text-[#8B8FA8] hover:border-[#3A3D52] hover:text-[#D0D1DC]'
      )}
      style={isActive ? {
        background: `linear-gradient(135deg, ${tab.color}18 0%, ${tab.color}08 100%)`,
        borderColor: `${tab.color}50`,
        boxShadow: `0 0 20px ${tab.color}15, inset 0 0 20px ${tab.color}05`,
      } : {}}
    >
      {/* Active glow line */}
      {isActive && (
        <div className="absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl" style={{ background: `linear-gradient(90deg, transparent, ${tab.color}, transparent)` }} />
      )}

      <div className="flex items-center justify-between w-full">
        <Icon size={16} style={{ color: isActive ? tab.color : undefined }} className={!isActive ? 'text-[#4D5168]' : ''} />
        {hasResult && !isGenerating && (
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: tab.color }} />
        )}
        {isGenerating && (
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        )}
      </div>
      <div>
        <div className="text-sm font-semibold">{tab.label}</div>
        <div className={clsx('text-xs mt-0.5 transition-colors', isActive ? 'text-white/50' : 'text-[#4D5168]')}>
          {tab.description}
        </div>
      </div>
    </button>
  );
}

// Requirements input panel
function InputPanel({ activeTab, requirements, setRequirements, onGenerate, loading, activeType, results, setActiveTab, clearResult }) {
  const tab = TABS.find(t => t.id === activeTab);
  const isGenerating = loading && activeType === activeTab;
  const anyResult = Object.values(results).some(Boolean);

  return (
    <div className="flex flex-col gap-4">

      {/* Step 1 */}
      <div className="bg-[#13141C] border border-[#2A2D3E] rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <StepBadge num={1} done={requirements.trim().length >= 20} />
          <span className="text-sm font-semibold text-[#F0F1F6]">Describe your requirements</span>
        </div>

        <div className="relative">
          <textarea
            value={requirements}
            onChange={e => setRequirements(e.target.value)}
            placeholder={"Tell me what you're building in ServiceNow...\n\nInclude:\n• What data needs to be stored\n• Who the users are and their roles\n• What processes need automating"}
            rows={8}
            className="w-full bg-[#0D0E14] border border-[#2A2D3E] rounded-xl px-4 py-3 text-[#F0F1F6] text-sm placeholder-[#2A2D3E] focus:outline-none focus:border-[#6366F1]/60 focus:ring-1 focus:ring-[#6366F1]/20 resize-none leading-relaxed transition-all"
          />
          <div className="absolute bottom-3 right-3 flex items-center gap-3">
            <span className={clsx('text-xs transition-colors', requirements.length > 3500 ? 'text-red-400' : 'text-[#2A2D3E]')}>
              {requirements.length}/4000
            </span>
          </div>
        </div>

        <button
          onClick={() => setRequirements(TABS.find(t => t.id === activeTab)?.example ?? '')}
          className="mt-2 text-xs text-[#6366F1] hover:text-[#818CF8] transition-colors flex items-center gap-1"
        >
          <Sparkles size={10} /> Load example for {tab?.label}
        </button>
      </div>

      {/* Step 2 — pick artifact */}
      <div className="bg-[#13141C] border border-[#2A2D3E] rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <StepBadge num={2} done={false} />
          <span className="text-sm font-semibold text-[#F0F1F6]">Choose what to generate</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {TABS.map(t => (
            <ArtifactTab
              key={t.id}
              tab={t}
              isActive={activeTab === t.id}
              hasResult={!!results[t.id]}
              isGenerating={loading && activeType === t.id}
              onClick={() => setActiveTab(t.id)}
            />
          ))}
        </div>
      </div>

      {/* Generate */}
      <button
        onClick={onGenerate}
        disabled={loading || requirements.trim().length < 20}
        className="w-full py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 relative overflow-hidden"
        style={!(loading || requirements.trim().length < 20) ? {
          background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 50%, #7C3AED 100%)',
          boxShadow: '0 0 30px rgba(99,102,241,0.4), 0 4px 15px rgba(99,102,241,0.2)',
          color: 'white',
        } : {
          background: '#13141C',
          border: '1px solid #2A2D3E',
          color: '#4D5168',
          cursor: 'not-allowed',
        }}
      >
        {/* Shine sweep */}
        {!(loading || requirements.trim().length < 20) && (
          <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
            style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)' }} />
        )}
        {isGenerating
          ? <><Activity size={15} className="animate-spin" /> Generating {tab?.label}…</>
          : <><Sparkles size={15} /> Generate {tab?.label}</>
        }
      </button>

      {/* Generated list */}
      {anyResult && (
        <div className="bg-[#13141C] border border-[#2A2D3E] rounded-2xl p-4">
          <p className="text-xs text-[#4D5168] uppercase tracking-widest font-medium mb-3">Generated</p>
          <div className="space-y-0.5">
            {TABS.filter(t => results[t.id]).map(t => {
              const Icon = t.icon;
              return (
                <div key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={clsx(
                    'flex items-center justify-between group rounded-xl px-3 py-2 cursor-pointer transition-all',
                    activeTab === t.id ? 'bg-[#1A1C26]' : 'hover:bg-[#1A1C26]/60'
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={13} style={{ color: t.color }} />
                    <span className="text-sm text-[#F0F1F6]">{t.label}</span>
                    <CheckCircle2 size={11} className="text-emerald-400" />
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); clearResult(t.id); }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-[#21232F] text-[#4D5168] hover:text-red-400"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Empty state with animated prompt
function EmptyPane({ activeTab }) {
  const tab = TABS.find(t => t.id === activeTab);
  const Icon = tab?.icon;
  const typed = useTypewriter([
    'tables and field schemas',
    'Flow Designer automations',
    'service catalog items',
    'role-based access rules',
  ], 60, 2200);

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[500px] text-center px-8">
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-3xl flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${tab?.color}20, ${tab?.color}08)`,
            border: `1px solid ${tab?.color}30`,
            boxShadow: `0 0 40px ${tab?.color}15`,
          }}>
          {Icon && <Icon size={40} style={{ color: tab?.color, opacity: 0.7 }} />}
        </div>
        <div className="absolute -inset-4 rounded-[40px] animate-pulse-slow"
          style={{ background: `radial-gradient(circle, ${tab?.color}08, transparent 70%)` }} />
      </div>

      <h3 className="text-xl font-bold text-[#F0F1F6] mb-2">Ready to generate</h3>
      <p className="text-[#4D5168] text-sm mb-6 max-w-xs leading-relaxed">
        Describe your requirements on the left, then generate <br />
        <span className="text-[#6366F1] font-medium">{typed}<span className="animate-pulse">|</span></span>
      </p>

      <div className="flex flex-col gap-2 text-left w-full max-w-sm">
        {['Describe your app in plain English', 'Select the artifact type', 'Get production-ready output'].map((s, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#13141C] border border-[#2A2D3E]">
            <div className="w-5 h-5 rounded-full bg-[#6366F1]/20 border border-[#6366F1]/30 flex items-center justify-center text-[10px] text-[#6366F1] font-bold shrink-0">
              {i + 1}
            </div>
            <span className="text-sm text-[#8B8FA8]">{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const sessionId = useSession();
  const [activeTab, setActiveTab] = useState('tables');
  const [requirements, setRequirements] = useState('');
  const { loading, activeType, results, errors, generate, clearResult } = useGenerate(sessionId);
  const resultRef = useRef(null);

  const handleGenerate = async () => {
    await generate(activeTab, requirements);
    setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
  };

  const currentResult = results[activeTab];
  const currentError = errors[activeTab];
  const isGenerating = loading && activeType === activeTab;

  return (
    <div className="min-h-screen bg-[#0D0E14] relative">
      <style>{`
        @keyframes float1 { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-20px) scale(1.05)} 66%{transform:translate(-20px,10px) scale(0.95)} }
        @keyframes float2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-40px,30px)} }
        @keyframes float3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(20px,-15px) scale(1.03)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .animate-fade-up { animation: fadeUp 0.35s ease forwards; }
        .animate-pulse-slow { animation: pulse 4s ease-in-out infinite; }
      `}</style>

      <Grid />
      <Orbs />

      {/* Header */}
      <header className="relative z-20 border-b border-[#1A1C26] bg-[#0D0E14]/80 backdrop-blur-xl sticky top-0">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-sm"
                style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)', boxShadow: '0 0 16px rgba(99,102,241,0.5)' }}>
                SN
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0D0E14] animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-[#F0F1F6] text-sm tracking-tight">SN Toolkit</span>
              <span className="hidden sm:inline text-[#2A2D3E] text-sm"> / </span>
              <span className="hidden sm:inline text-[#4D5168] text-xs">ServiceNow Developer Productivity</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {TABS.map(t => {
              const Icon = t.icon;
              return results[t.id] ? (
                <div key={t.id} className="w-6 h-6 rounded-lg flex items-center justify-center"
                  style={{ background: `${t.color}20`, border: `1px solid ${t.color}40` }}
                  title={`${t.label} generated`}>
                  <Icon size={11} style={{ color: t.color }} />
                </div>
              ) : null;
            })}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-14 pb-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
            style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)', color: '#818CF8' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-[#6366F1] animate-pulse" />
            AI-powered · Instant · Production-ready
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-[#F0F1F6] leading-[1.1] tracking-tight mb-4">
            ServiceNow artifacts,<br />
            <span style={{
              background: 'linear-gradient(135deg, #6366F1 0%, #818CF8 40%, #A78BFA 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              generated instantly.
            </span>
          </h1>
          <p className="text-[#8B8FA8] text-lg leading-relaxed max-w-xl">
            Describe your use case in plain English. Get tables, flows, catalog items, and ACL rules — ready to deploy in ServiceNow.
          </p>
        </div>
      </section>

      {/* Main */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">

          {/* Left */}
          <div className="lg:sticky lg:top-20">
            <InputPanel
              activeTab={activeTab}
              requirements={requirements}
              setRequirements={setRequirements}
              onGenerate={handleGenerate}
              loading={loading}
              activeType={activeType}
              results={results}
              setActiveTab={setActiveTab}
              clearResult={clearResult}
            />
          </div>

          {/* Right */}
          <div ref={resultRef} className="min-h-[600px]">
            {isGenerating && (
              <div className="space-y-4 animate-fade-up">
                <SkeletonCard /><SkeletonCard />
              </div>
            )}

            {!isGenerating && currentError && (
              <div className="animate-fade-up rounded-2xl border border-red-900/50 bg-red-950/10 p-10 text-center">
                <div className="w-12 h-12 rounded-2xl bg-red-950/40 border border-red-900/40 flex items-center justify-center mx-auto mb-4">
                  <Shield size={20} className="text-red-400" />
                </div>
                <p className="text-red-400 font-semibold mb-1">Generation failed</p>
                <p className="text-sm text-[#8B8FA8] mb-5 max-w-sm mx-auto">{currentError}</p>
                <button onClick={handleGenerate}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1A1C26] border border-[#2A2D3E] text-sm text-[#8B8FA8] hover:text-[#F0F1F6] transition-colors">
                  <RotateCcw size={13} /> Try again
                </button>
              </div>
            )}

            {!isGenerating && !currentError && !currentResult && (
              <EmptyPane activeTab={activeTab} />
            )}

            {!isGenerating && !currentError && currentResult && (
              <div className="animate-fade-up">
                {/* Result header */}
                <div className="flex items-center gap-3 mb-5 px-1">
                  {(() => { const t = TABS.find(x => x.id === activeTab); const Icon = t?.icon;
                    return (<>
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                        style={{ background: `${t?.color}20`, border: `1px solid ${t?.color}30` }}>
                        {Icon && <Icon size={15} style={{ color: t?.color }} />}
                      </div>
                      <div>
                        <h2 className="text-[#F0F1F6] font-bold text-sm">{t?.label} Generated</h2>
                        <p className="text-[#4D5168] text-xs">Production-ready ServiceNow configuration</p>
                      </div>
                      <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
                        style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#10B981' }}>
                        <CheckCircle2 size={11} /> Ready
                      </div>
                    </>);
                  })()}
                </div>

                {activeTab === 'tables'  && <TablesResult  data={currentResult} />}
                {activeTab === 'flows'   && <FlowsResult   data={currentResult} />}
                {activeTab === 'catalog' && <CatalogResult data={currentResult} />}
                {activeTab === 'acl'     && <AclResult     data={currentResult} />}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
