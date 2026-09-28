import React from 'react';
import { 
  Package, 
  Cpu, 
  FileText, 
  Camera, 
  RotateCcw, 
  ShieldCheck, 
  Clock
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'inspector' | 'architecture' | 'dossier';
  onSelectTab: (tab: 'inspector' | 'architecture' | 'dossier') => void;
  onOpenLiveCapture: () => void;
  onReset: () => void;
  isInspecting: boolean;
  onRunInspection: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenLiveCapture,
  onReset,
  isInspecting,
  onRunInspection
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950 text-slate-100 sticky top-0 z-40 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand & Warehouse Location */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold tracking-tight text-white uppercase">
                  Receiving Manager
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  AI DOCK-AGENT v2.5
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <span>DOCK BAY 07</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ONLINE
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="h-3 w-3" /> SHIFT A
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Segments */}
          <nav className="flex items-center bg-slate-900 border border-slate-800 rounded p-1">
            <button
              onClick={() => onSelectTab('inspector')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                activeTab === 'inspector'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Dock Inspector
            </button>
            <button
              onClick={() => onSelectTab('architecture')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                activeTab === 'architecture'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="h-3.5 w-3.5 text-amber-400" />
              Agent Architecture &amp; Methodology
            </button>
            <button
              onClick={() => onSelectTab('dossier')}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                activeTab === 'dossier'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="h-3.5 w-3.5 text-blue-400" />
              Evidence Dossier / RMA
            </button>
          </nav>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenLiveCapture}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded transition-colors"
              title="Upload custom receiving photograph or use camera"
            >
              <Camera className="h-3.5 w-3.5 text-sky-400" />
              <span>Capture / Upload</span>
            </button>

            <button
              onClick={onReset}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent hover:border-slate-800 rounded transition-colors"
              title="Reset inspection state"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <button
              onClick={onRunInspection}
              disabled={isInspecting}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded transition-all shadow-sm ${
                isInspecting
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-500'
              }`}
            >
              {isInspecting ? (
                <>
                  <span className="h-3.5 w-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Run Agent Inspection</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
