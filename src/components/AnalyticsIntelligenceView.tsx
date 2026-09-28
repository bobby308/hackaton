import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  ShieldCheck, 
  ShieldAlert, 
  Scale, 
  Activity, 
  Sparkles, 
  AlertTriangle, 
  ArrowRight,
  Boxes,
  Zap
} from 'lucide-react';
import { TEST_SCENARIOS } from '../data/scenarios';
import { TestScenario } from '../types/receiving';

interface AnalyticsIntelligenceViewProps {
  onSelectAndInspect: (scenario: TestScenario) => void;
}

export const AnalyticsIntelligenceView: React.FC<AnalyticsIntelligenceViewProps> = ({
  onSelectAndInspect,
}) => {
  return (
    <div className="space-y-5 text-slate-200">
      
      {/* Top Panoramic Analytics Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-cyan-500/20 shadow-2xl group select-none">
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-black">
          <img
            src="/src/assets/images/futuristic_dock_terminal_1790617266170.jpg"
            alt="Futuristic Logistics Terminal Analytics and Automated AGVs"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#02040a] via-[#02040a]/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#02040a]/95 via-transparent to-[#02040a]/85" />
          <div className="absolute inset-0 bg-grid-cyber opacity-25 pointer-events-none" />
          <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent scanline-sweep pointer-events-none" />
        </div>

        <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-300 drop-shadow">
                OPTICAL INTELLIGENCE · ISO 9001 INBOUND AUDIT SUITE
              </span>
            </div>

            <div className="flex items-center gap-2 bg-black/60 px-3 py-1 rounded-xl border border-white/10 text-xs font-mono text-slate-300 backdrop-blur-md">
              <Activity className="h-3.5 w-3.5 text-cyan-400" />
              <span>SAMPLING RATE: 100% POINT-OF-RECEIPT</span>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-semibold">
              Quality Assurance &amp; Vendor Risk Telemetry
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
              Warehouse Inbound Optical Intelligence
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl mt-1 line-clamp-1">
              Real-time statistical aggregation of computer vision verdicts, defect frequencies, supplier conformance ratings, and financial debit memo accruals.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Core KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        <div className="glass-cyber-panel rounded-2xl p-4 border border-emerald-500/20 shadow-lg">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase mb-1">
            <span>Inbound First-Pass Yield</span>
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">92.4%</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-sans">
            <TrendingUp className="h-3 w-3 text-emerald-400" />
            <span>+3.2% vs last operating cycle</span>
          </div>
        </div>

        <div className="glass-cyber-panel rounded-2xl p-4 border border-cyan-500/20 shadow-lg">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase mb-1">
            <span>Mean Evidential Certainty</span>
            <Scale className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-300 font-mono">89.6%</div>
          <div className="text-[11px] text-slate-400 mt-1 font-sans">
            Threshold: 70.0% · Zero forced guesses
          </div>
        </div>

        <div className="glass-cyber-panel rounded-2xl p-4 border border-rose-500/20 shadow-lg">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase mb-1">
            <span>Recovered Debit Claims</span>
            <ShieldAlert className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400 font-mono">$1,834.00</div>
          <div className="text-[11px] text-slate-400 mt-1 font-sans">
            EDI 861 Automated Debit Memos
          </div>
        </div>

        <div className="glass-cyber-panel rounded-2xl p-4 border border-violet-500/20 shadow-lg">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase mb-1">
            <span>Vision Decision Latency</span>
            <Zap className="h-4 w-4 text-violet-400" />
          </div>
          <div className="text-2xl font-black text-violet-300 font-mono">1.18 s</div>
          <div className="text-[11px] text-slate-400 mt-1 font-sans">
            Gemini 3.8 Flash Vision Pipeline
          </div>
        </div>

      </div>

      {/* Two Column Visual Analytics Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left: Defect Categorization by ASTM D642 Standard */}
        <div className="lg:col-span-7 glass-cyber-panel rounded-2xl p-5 border border-cyan-500/15">
          <div className="flex items-center justify-between pb-3.5 border-b border-white/5 mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-cyan-400" />
              <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-slate-200">
                Point-of-Receipt Defect Breakdown (ASTM D642)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Total Defects: 48 Events</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Crushing &amp; Corner Deflection (&gt;45mm)</span>
                <span className="text-rose-400 font-bold">42% (20 cases)</span>
              </div>
              <div className="w-full bg-[#050a18] h-2.5 rounded-full overflow-hidden border border-white/5">
                <div className="bg-rose-500 h-full rounded-full" style={{ width: '42%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Water Damage &amp; Corrugated Staining</span>
                <span className="text-amber-400 font-bold">28% (13 cases)</span>
              </div>
              <div className="w-full bg-[#050a18] h-2.5 rounded-full overflow-hidden border border-white/5">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '28%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Physical Unit Shortage (ΔQ &lt; 0)</span>
                <span className="text-sky-400 font-bold">18% (9 cases)</span>
              </div>
              <div className="w-full bg-[#050a18] h-2.5 rounded-full overflow-hidden border border-white/5">
                <div className="bg-sky-500 h-full rounded-full" style={{ width: '18%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Variant Mismatch &amp; Color Incongruence</span>
                <span className="text-purple-400 font-bold">12% (6 cases)</span>
              </div>
              <div className="w-full bg-[#050a18] h-2.5 rounded-full overflow-hidden border border-white/5">
                <div className="bg-purple-500 h-full rounded-full" style={{ width: '12%' }} />
              </div>
            </div>
          </div>

          <div className="mt-5 p-3 rounded-xl bg-[#040816] border border-white/5 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-sans">
              Test case 6 (Crushed Carton) demonstrates ASTM D642 corner compression detection.
            </span>
            <button
              onClick={() => onSelectAndInspect(TEST_SCENARIOS[5])}
              className="flex items-center gap-1 text-cyan-300 font-mono text-xs font-bold hover:underline shrink-0 ml-2"
            >
              <span>Test Case 6</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Operator Tactile Gear Showcase Card */}
        <div className="lg:col-span-5 glass-cyber-panel rounded-2xl p-5 border border-cyan-500/15 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-slate-200">
                Tactical Operator Vision HUD
              </h3>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-white/10 aspect-video mb-3 bg-black">
              <img
                src="/src/assets/images/futuristic_operator_scanner_1790617285882.jpg"
                alt="Tactical Logistics Operator Scanning Inbound Freight"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-2.5 left-3 text-[10px] font-mono text-cyan-300">
                HANDHELD OPTICAL SCANNER · 0° HOMOGRAPHY
              </div>
            </div>

            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              Equipped with real-time Code-128 OCR, laser distance sensors, and automated evidential certainty assessment to prevent faulty put-aways before carrier departs.
            </p>
          </div>

          <button
            onClick={() => onSelectAndInspect(TEST_SCENARIOS[0])}
            className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-slate-950 font-black font-sans text-xs uppercase tracking-wider transition-all shadow-lg active:scale-98"
          >
            Launch Baseline Inspection
          </button>
        </div>

      </div>

    </div>
  );
};
