import React, { useState, useRef } from 'react';
import { InspectionImage, DefectItem } from '../types/receiving';
import { 
  ZoomIn, 
  Eye, 
  EyeOff, 
  Crosshair, 
  AlertCircle, 
  Maximize2,
  Scan,
  Compass,
  Sparkles
} from 'lucide-react';

interface EvidenceCanvasProps {
  images: InspectionImage[];
  activeImageIndex: number;
  onSelectImage: (index: number) => void;
  defects: DefectItem[];
  selectedDefectId: string | null;
  onSelectDefect: (defectId: string | null) => void;
  uncertaintyActive?: boolean;
  onOpenTheater?: () => void;
}

export const EvidenceCanvas: React.FC<EvidenceCanvasProps> = ({
  images,
  activeImageIndex,
  onSelectImage,
  defects,
  selectedDefectId,
  onSelectDefect,
  uncertaintyActive = false,
  onOpenTheater,
}) => {
  const [showOverlays, setShowOverlays] = useState(true);
  const [isMagnifierActive, setIsMagnifierActive] = useState(false);
  const [magnifierPos, setMagnifierPos] = useState({ x: 0, y: 0, relX: 0, relY: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const activeImage = images[activeImageIndex] || images[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const relX = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const relY = Math.max(0, Math.min(100, (y / rect.height) * 100));
    setMagnifierPos({ x, y, relX, relY });
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden flex flex-col h-full text-slate-200 shadow-xl border border-white/10">
      
      {/* Canvas Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#080d19]/90 border-b border-white/5 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Scan className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-slate-200 uppercase tracking-wide">
                Evidence Feed · Vantage {activeImageIndex + 1} of {images.length}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-cyan-300 border border-white/10 uppercase">
                {activeImage?.role.replace('_', ' ')}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5 truncate max-w-sm">
              {activeImage?.label}: {activeImage?.description}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Overlay Toggle Button */}
          <button
            onClick={() => setShowOverlays(!showOverlays)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              showOverlays
                ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-slate-900/80 text-slate-400 border border-white/10 hover:text-slate-200'
            }`}
            title="Toggle defect bounding boxes & HUD"
          >
            {showOverlays ? <Eye className="h-3.5 w-3.5 text-cyan-400" /> : <EyeOff className="h-3.5 w-3.5" />}
            <span>Overlays {showOverlays ? 'ON' : 'OFF'}</span>
          </button>

          {/* Magnifier 2.5x Button */}
          <button
            onClick={() => setIsMagnifierActive(!isMagnifierActive)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isMagnifierActive
                ? 'bg-blue-600 text-white border border-blue-400 shadow-md shadow-blue-900/40'
                : 'bg-slate-900/80 text-slate-400 border border-white/10 hover:text-slate-200'
            }`}
            title="Toggle 2.5x Inspection Loupe"
          >
            <ZoomIn className="h-3.5 w-3.5 text-blue-300" />
            <span>2.5x Loupe</span>
          </button>

          {/* Fullscreen Theater Button */}
          {onOpenTheater && (
            <button
              onClick={onOpenTheater}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-[#111a2e] hover:bg-[#182542] text-cyan-300 border border-cyan-500/40 shadow-sm transition-all"
              title="Open Fullscreen Cinematic HUD"
            >
              <Maximize2 className="h-3.5 w-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Theater</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Image Display Area */}
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative flex-1 min-h-[350px] bg-[#050811] flex items-center justify-center overflow-hidden cursor-crosshair select-none group"
      >
        {/* Optical Bench Grid Overlay */}
        <div className="absolute inset-0 bg-grid-cyber pointer-events-none opacity-40" />

        {/* Ambient Laser Scanline Sweep */}
        <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent scanline-sweep pointer-events-none shadow-[0_0_12px_#38bdf8] z-10" />

        {activeImage ? (
          <img
            src={activeImage.dataUrl || activeImage.url}
            alt={activeImage.label}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain max-h-[460px] relative z-0 transition-transform duration-300"
          />
        ) : (
          <div className="text-slate-500 text-xs font-mono">No visual evidence photograph attached</div>
        )}

        {/* Bounding Box Defect Overlays */}
        {showOverlays && defects && defects.map((defect) => {
          const isSelected = selectedDefectId === defect.id;
          const { x, y, width, height } = defect.boundingBox;

          let borderColor = 'border-rose-500 bg-rose-500/15 text-rose-300';
          let badgeBg = 'bg-rose-600 text-white';
          if (defect.severity === 'MAJOR') {
            borderColor = 'border-amber-500 bg-amber-500/15 text-amber-300';
            badgeBg = 'bg-amber-600 text-white';
          } else if (defect.severity === 'MINOR') {
            borderColor = 'border-sky-500 bg-sky-500/15 text-sky-300';
            badgeBg = 'bg-sky-600 text-white';
          }

          return (
            <div
              key={defect.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelectDefect(isSelected ? null : defect.id);
              }}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: `${width}%`,
                height: `${height}%`,
              }}
              className={`absolute border-2 rounded-lg transition-all cursor-pointer ${borderColor} ${
                isSelected 
                  ? 'ring-4 ring-rose-400/50 scale-[1.02] z-30 shadow-[0_0_20px_rgba(244,63,94,0.4)]' 
                  : 'hover:scale-[1.01] z-10 hover:border-white'
              }`}
            >
              {/* Defect Tag Header Badge */}
              <div 
                className={`absolute -top-6 left-0 flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold shadow-lg ${badgeBg}`}
              >
                <span>{defect.type.toUpperCase().replace('_', ' ')}</span>
                <span className="opacity-75">·</span>
                <span>{defect.severity}</span>
              </div>
            </div>
          );
        })}

        {/* UNCERTAIN Glare / Low confidence alert overlay */}
        {uncertaintyActive && (
          <div className="absolute inset-0 pointer-events-none border-2 border-amber-500/40 bg-amber-500/5 flex flex-col justify-end p-4 z-20">
            <div className="bg-[#0f172a]/95 border border-amber-500/50 p-3 rounded-xl text-xs text-amber-300 font-mono flex items-center gap-3 max-w-lg shadow-2xl backdrop-blur-md">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="font-bold text-amber-200">EVIDENTIAL UNCERTAINTY ACTIVE</div>
                <div className="text-[11px] text-slate-300 mt-0.5">
                  Specular glare &amp; oblique optical perspective degrade barcode decode SNR. Decision not forced.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2.5x Magnifier Lens Loupe */}
        {isMagnifierActive && (
          <div
            style={{
              left: `${magnifierPos.x - 80}px`,
              top: `${magnifierPos.y - 80}px`,
              backgroundImage: `url(${activeImage?.dataUrl || activeImage?.url})`,
              backgroundPosition: `${magnifierPos.relX}% ${magnifierPos.relY}%`,
              backgroundSize: '250%',
            }}
            className="absolute w-40 h-40 rounded-full border-2 border-cyan-400 shadow-2xl pointer-events-none z-40 ring-4 ring-black/70 bg-no-repeat bg-[#090d18]"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <Crosshair className="h-5 w-5 text-cyan-400/70" />
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-slate-900/90 text-cyan-300 text-[9px] font-mono border border-cyan-500/40 font-bold">
              2.5X LOUPE
            </div>
          </div>
        )}

      </div>

      {/* Selected Defect Detail Floating Drawer */}
      {selectedDefectId && (
        <div className="px-4 py-3 bg-[#080d1a] border-t border-white/10 text-xs">
          {(() => {
            const def = defects.find(d => d.id === selectedDefectId);
            if (!def) return null;
            return (
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 shrink-0 mt-0.5 border border-rose-500/30">
                    <AlertCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-rose-300">
                        {def.id}: {def.type.toUpperCase().replace('_', ' ')}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold">
                        {def.severity}
                      </span>
                      <span className="text-slate-400 font-mono text-[11px]">
                        AI Vision Conf: {(def.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="text-slate-200 mt-1">{def.description}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-1">
                      Defect Location: <span className="text-slate-300 font-medium">{def.location}</span>
                      {def.claimImpact ? ` · Claim Impact: ${def.claimImpact}` : ''}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onSelectDefect(null)}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition-colors"
                >
                  Dismiss
                </button>
              </div>
            );
          })()}
        </div>
      )}

      {/* Vantage Point Thumbnails Strip */}
      <div className="px-4 py-3 bg-[#080d19]/90 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2.5 overflow-x-auto py-0.5">
          {images.map((img, idx) => {
            const isSelected = idx === activeImageIndex;
            return (
              <button
                key={img.id}
                onClick={() => onSelectImage(idx)}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border text-left text-xs transition-all ${
                  isSelected
                    ? 'bg-[#121c32] border-cyan-400 text-white shadow-md shadow-cyan-950/50 ring-1 ring-cyan-400/40'
                    : 'bg-[#0a0f1d] border-white/5 hover:border-cyan-500/30 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="w-9 h-7 rounded-lg bg-black overflow-hidden border border-white/10 shrink-0">
                  <img 
                    src={img.dataUrl || img.url} 
                    alt="" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="truncate max-w-[140px]">
                  <div className="font-mono text-[11px] font-bold text-slate-200 truncate">
                    {img.label}
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono uppercase">
                    {img.role.replace('_', ' ')}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-[11px] text-slate-400 font-mono hidden md:block shrink-0 pl-3">
          Click defect boxes to inspect telemetry
        </div>
      </div>

    </div>
  );
};
