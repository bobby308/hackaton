import React from 'react';
import { TEST_SCENARIOS } from '../data/scenarios';
import { TestScenario } from '../types/receiving';
import { CheckCircle2, AlertTriangle, HelpCircle, Layers } from 'lucide-react';

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
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-slate-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-emerald-400" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            Dock Inbound Test Scenarios (10 Core Cases)
          </h2>
        </div>
        <div className="text-xs text-slate-500 font-mono">
          <span>Click any case to test multimodal agent</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
        {TEST_SCENARIOS.map((sc) => {
          const isSelected = sc.id === activeScenarioId;

          let icon = <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />;
          let indicatorBg = 'bg-emerald-500/10 border-emerald-500/30';
          if (sc.badgeType === 'fail') {
            icon = <AlertTriangle className="h-3.5 w-3.5 text-rose-400 shrink-0" />;
            indicatorBg = 'bg-rose-500/10 border-rose-500/30';
          } else if (sc.badgeType === 'uncertain') {
            icon = <HelpCircle className="h-3.5 w-3.5 text-amber-400 shrink-0" />;
            indicatorBg = 'bg-amber-500/10 border-amber-500/30';
          }

          return (
            <button
              key={sc.id}
              disabled={isInspecting}
              onClick={() => onSelectScenario(sc)}
              className={`text-left p-2.5 rounded border transition-all relative ${
                isSelected
                  ? 'bg-slate-800 border-emerald-500 text-white shadow-md'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-900'
              } ${isInspecting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-mono text-xs font-bold truncate">
                  {sc.title.split('.')[1] || sc.title}
                </span>
                {icon}
              </div>

              {/* Zero-pill metadata line */}
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                <span className={sc.badgeType === 'pass' ? 'text-emerald-400 font-semibold' : sc.badgeType === 'fail' ? 'text-rose-400 font-semibold' : 'text-amber-400 font-semibold'}>
                  {sc.badge}
                </span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-slate-400">
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
