import React from 'react';
import { 
  PackageCheck, 
  Cpu, 
  FileText, 
  Camera, 
  RotateCcw, 
  ShieldCheck, 
  Sparkles,
  Radio,
  Layers,
  Truck,
  BarChart3,
  Box,
  Volume2,
  VolumeX
} from 'lucide-react';

export type NavTabId = 'inspector' | 'manifest' | 'analytics' | 'catalog' | 'architecture' | 'dossier';

interface HeaderProps {
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  onOpenLiveCapture: () => void;
  onReset: () => void;
  isInspecting: boolean;
  onRunInspection: () => void;
  isAudioOn?: boolean;
  onToggleAudio?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenLiveCapture,
  onReset,
  isInspecting,
  onRunInspection,
  isAudioOn = false,
  onToggleAudio
}) => {
  const navItems: { id: NavTabId; label: string; icon: React.ReactNode; badge?: string; glowColor: string }[] = [
    {
      id: 'inspector',
      label: 'Dock Inspector',
      icon: <ShieldCheck className="h-3.5 w-3.5" />,
      glowColor: 'from-cyan-600 to-blue-600',
      badge: 'LIVE 10'
    },
    {
      id: 'manifest',
      label: 'Inbound Manifest',
      icon: <Truck className="h-3.5 w-3.5" />,
      glowColor: 'from-blue-600 to-indigo-600',
      badge: 'BAYS'
    },
    {
      id: 'analytics',
      label: 'Intelligence & PPM',
      icon: <BarChart3 className="h-3.5 w-3.5" />,
      glowColor: 'from-amber-600 to-orange-600',
    },
    {
      id: 'catalog',
      label: 'SKU Vault',
      icon: <Box className="h-3.5 w-3.5" />,
      glowColor: 'from-fuchsia-600 to-pink-600',
      badge: '3D'
    },
    {
      id: 'architecture',
      label: 'Agent Pipelines',
      icon: <Cpu className="h-3.5 w-3.5" />,
      glowColor: 'from-violet-600 to-purple-600',
    },
    {
      id: 'dossier',
      label: 'Claims Dossier',
      icon: <FileText className="h-3.5 w-3.5" />,
      glowColor: 'from-emerald-600 to-teal-600',
    }
  ];

  return (
    <header className="border-b border-cyan-500/20 bg-[#040814]/90 backdrop-blur-2xl text-slate-100 sticky top-0 z-40 shadow-[0_4px_30px_rgba(0,0,0,0.8)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Brand & Warehouse Status */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500/25 via-blue-500/10 to-transparent border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.25)] relative overflow-hidden group">
              <PackageCheck className="h-5 w-5 text-cyan-300 group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 bg-cyan-400/10 scanline-sweep pointer-events-none" />
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm tracking-tight text-white uppercase font-sans">
                  Receiving<span className="text-cyan-400 ml-1">Manager</span>
                </span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-400/40 tracking-wider">
                  AUTONOMOUS V4
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-0.5">
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                  </span>
                  BAY 07 ACTIVE
                </span>
                <span aria-hidden="true" className="text-slate-700 hidden sm:inline">·</span>
                <span className="text-slate-400 hidden sm:inline text-[11px]">OPTICAL AUDIT SUITE</span>
              </div>
            </div>
          </div>

          {/* Navigation Segments - Connected UX across all pages */}
          <nav className="hidden lg:flex items-center bg-[#070d1d] border border-cyan-500/20 rounded-xl p-1 shadow-inner overflow-x-auto max-w-full">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all relative shrink-0 ${
                    isActive
                      ? `bg-gradient-to-r ${item.glowColor} text-white shadow-lg shadow-cyan-950/50 font-bold`
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`text-[8px] font-mono font-bold px-1 py-0.2 rounded ${
                      isActive ? 'bg-black/40 text-white' : 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Action Tools & Audio Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Audio Toggle */}
            {onToggleAudio && (
              <button
                onClick={onToggleAudio}
                className={`p-2 rounded-lg border text-xs transition-all ${
                  isAudioOn
                    ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                    : 'bg-[#0b1224] border-white/10 text-slate-400 hover:text-white'
                }`}
                title={isAudioOn ? 'Sound Effects Enabled' : 'Muted (Click to enable audio cues)'}
              >
                {isAudioOn ? <Volume2 className="h-4 w-4 text-emerald-400" /> : <VolumeX className="h-4 w-4" />}
              </button>
            )}

            {/* Live Capture / Upload */}
            <button
              onClick={onOpenLiveCapture}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-[#0b1528] hover:bg-[#101d38] text-cyan-300 border border-cyan-500/30 hover:border-cyan-400/60 rounded-lg transition-all shadow-sm group"
              title="Upload photograph or live camera capture"
            >
              <Camera className="h-3.5 w-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline font-mono">Upload / Camera</span>
            </button>

            <button
              onClick={onReset}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-white/10 rounded-lg transition-colors"
              title="Reset to scenario 1"
            >
              <RotateCcw className="h-4 w-4" />
            </button>

            <button
              onClick={onRunInspection}
              disabled={isInspecting}
              className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-lg transition-all shadow-lg ${
                isInspecting
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-white/10'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold shadow-[0_0_20px_rgba(16,185,129,0.35)] active:scale-95'
              }`}
            >
              {isInspecting ? (
                <>
                  <span className="h-3.5 w-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                  <span className="font-mono">Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span className="font-mono font-black">Run Audit</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Mobile / Compact Navigation Bar */}
        <div className="lg:hidden flex items-center pb-2.5 overflow-x-auto gap-1 border-t border-white/5 pt-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all whitespace-nowrap ${
                  isActive
                    ? `bg-gradient-to-r ${item.glowColor} text-white font-bold`
                    : 'text-slate-400 hover:bg-white/5'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
