import React, { useState } from 'react';
import { TEST_SCENARIOS } from '../data/scenarios';
import { TestScenario } from '../types/receiving';
import { 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Layers,
  Sparkles,
  Boxes,
  ShieldCheck,
  Scale
} from 'lucide-react';

interface ScenarioSelectorProps {
  activeScenarioId: string;
  onSelectScenario: (scenario: TestScenario) => void;
  isInspecting: boolean;
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  activeScenarioId,
  onSelectScenario,
  isInspecting,
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'pass' | 'fail' | 'uncertain'>('all');

  const filteredScenarios = TEST_SCENARIOS.filter(sc => {
    if (filterCategory === 'all') return true;
    return sc.badgeType === filterCategory;
  });

  return (
    <div className="glass-panel rounded-2xl p-4 text-slate-200 shadow-xl border border-white/10">
      
      {/* Top Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3 pb-3 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Layers className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              <span>Dock Inbound Test Scenarios</span>
              <span className="text-[10px] text-cyan-400 font-normal">10 Verification Benchmarks</span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Select any benchmark condition to evaluate multimodal identity, quantity, damage, and uncertainty.
            </p>
          </div>
        </div>

        {/* Category filter tabs */}
        <div className="flex items-center gap-1 bg-[#090d18] p-1 rounded-xl border border-white/5 self-start sm:self-center">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-colors ${
              filterCategory === 'all'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All (10)
          </button>
          <button
            onClick={() => setFilterCategory('pass')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-colors ${
              filterCategory === 'pass'
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-emerald-400'
            }`}
          >
            Accept (1)
          </button>
          <button
            onClick={() => setFilterCategory('fail')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-colors ${
              filterCategory === 'fail'
                ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40 shadow-sm'
                : 'text-slate-400 hover:text-rose-400'
            }`}
          >
            Exceptions (8)
          </button>
          <button
            onClick={() => setFilterCategory('uncertain')}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-colors ${
              filterCategory === 'uncertain'
                ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-amber-400'
            }`}
          >
            Uncertain (1)
          </button>
        </div>
      </div>

      {/* Grid of Test Scenarios */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
        {filteredScenarios.map((sc) => {
          const isSelected = sc.id === activeScenarioId;

          let icon = <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />;
          let statusColor = 'text-emerald-400';
          let borderHighlight = isSelected 
            ? 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)] bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900' 
            : 'border-white/5 hover:border-emerald-500/30 hover:bg-[#111a2e]';

          if (sc.badgeType === 'fail') {
            icon = <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />;
            statusColor = 'text-rose-400';
            borderHighlight = isSelected
              ? 'border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.2)] bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-900'
              : 'border-white/5 hover:border-rose-500/30 hover:bg-[#1a1424]';
          } else if (sc.badgeType === 'uncertain') {
            icon = <HelpCircle className="h-4 w-4 text-amber-400 shrink-0" />;
            statusColor = 'text-amber-400';
            borderHighlight = isSelected
              ? 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)] bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900'
              : 'border-white/5 hover:border-amber-500/30 hover:bg-[#201914]';
          }

          return (
            <button
              key={sc.id}
              disabled={isInspecting}
              onClick={() => onSelectScenario(sc)}
              className={`text-left p-3 rounded-xl border transition-all relative overflow-hidden group ${
                isSelected
                  ? borderHighlight + ' text-white'
                  : 'bg-[#0d1424]/70 ' + borderHighlight + ' text-slate-300'
              } ${isInspecting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-98'}`}
            >
              {/* Active corner indicator glow */}
              {isSelected && (
                <div className="absolute top-0 right-0 w-8 h-8 overflow-hidden pointer-events-none">
                  <div className={`w-12 h-2 -rotate-45 translate-x-2 -translate-y-1 ${
                    sc.badgeType === 'pass' ? 'bg-emerald-500' : sc.badgeType === 'fail' ? 'bg-rose-500' : 'bg-amber-500'
                  }`} />
                </div>
              )}

              <div className="flex items-center justify-between gap-1.5 mb-1.5">
                <span className="font-bold text-xs tracking-tight truncate group-hover:text-white transition-colors">
                  {sc.title.split('.')[1]?.trim() || sc.title}
                </span>
                {icon}
              </div>

              {/* Clean unboxed metadata row */}
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                <span className={`font-semibold ${statusColor}`}>
                  {sc.badge}
                </span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-slate-300 font-medium">
                  {sc.expectedVerdict.overall}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
