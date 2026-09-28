import React, { useState, useEffect } from 'react';
import { InspectionImage, DefectItem, InspectionRecord } from '../types/receiving';
import { 
  X, 
  Crosshair, 
  ZoomIn, 
  Eye, 
  EyeOff, 
  Sliders, 
  Camera, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  ShieldAlert, 
  HelpCircle,
  Scan,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { cinematicAudio } from '../utils/audioFx';

interface CinematicTheaterModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: InspectionRecord | null;
  images: InspectionImage[];
  activeImageIndex: number;
  onSelectImage: (index: number) => void;
  defects: DefectItem[];
  selectedDefectId: string | null;
  onSelectDefect: (id: string | null) => void;
}

export const CinematicTheaterModal: React.FC<CinematicTheaterModalProps> = ({
  isOpen,
  onClose,
  record,
  images,
  activeImageIndex,
  onSelectImage,
  defects,
  selectedDefectId,
  onSelectDefect,
}) => {
  const [filterMode, setFilterMode] = useState<'normal' | 'night_vision' | 'infrared' | 'high_contrast' | 'edge'>('normal');
  const [showHud, setShowHud] = useState(true);
  const [isLaserSweepOn, setIsLaserSweepOn] = useState(true);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      cinematicAudio.playScanBeep();
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const activeImage = images[activeImageIndex] || images[0];

  let filterCss = '';
  if (filterMode === 'night_vision') {
    filterCss = 'brightness(1.1) contrast(1.4) sepia(1) hue-rotate(85deg) saturate(2.5)';
  } else if (filterMode === 'infrared') {
    filterCss = 'invert(0.9) hue-rotate(180deg) saturate(3) contrast(1.3)';
  } else if (filterMode === 'high_contrast') {
    filterCss = 'contrast(2.2) brightness(0.9) grayscale(1)';
  } else if (filterMode === 'edge') {
    filterCss = 'contrast(3) invert(0.8) grayscale(0.8)';
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between overflow-hidden select-none animate-in fade-in duration-200">
      
      {/* Top Cinematic Letterbox Bar */}
      <div className="bg-[#050811] border-b border-white/10 px-6 py-3.5 flex items-center justify-between text-xs font-mono z-30">
        
        {/* Left Telemetry */}
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Scan className="h-4 w-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-sm text-white tracking-widest uppercase">
                CINEMATIC THEATER HUD · DOCK BAY 07
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold">
                2.39:1 ANAMORPHIC
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
              <span>ACTIVE VANTAGE: {activeImageIndex + 1}/{images.length}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-300 font-semibold">{activeImage?.label}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-emerald-400">HOMOGRAPHY: RECTIFIED</span>
            </div>
          </div>
        </div>

        {/* Center Optical Shaders / Filters */}
        <div className="hidden lg:flex items-center gap-1 bg-[#090d18] p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setFilterMode('normal')}
            className={`px-2.5 py-1 text-[11px] rounded-lg transition-colors ${
              filterMode === 'normal' ? 'bg-cyan-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Normal (RGB)
          </button>
          <button
            onClick={() => setFilterMode('night_vision')}
            className={`px-2.5 py-1 text-[11px] rounded-lg transition-colors ${
              filterMode === 'night_vision' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-emerald-400'
            }`}
          >
            Night Vision
          </button>
          <button
            onClick={() => setFilterMode('infrared')}
            className={`px-2.5 py-1 text-[11px] rounded-lg transition-colors ${
              filterMode === 'infrared' ? 'bg-rose-600 text-white font-bold' : 'text-slate-400 hover:text-rose-400'
            }`}
          >
            Infrared Thermal
          </button>
          <button
            onClick={() => setFilterMode('high_contrast')}
            className={`px-2.5 py-1 text-[11px] rounded-lg transition-colors ${
              filterMode === 'high_contrast' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-amber-400'
            }`}
          >
            B&amp;W High Contrast
          </button>
        </div>

        {/* Right Tools & Exit */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsLaserSweepOn(!isLaserSweepOn)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              isLaserSweepOn
                ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300'
                : 'bg-slate-900 border-white/10 text-slate-400'
            }`}
          >
            Laser Reticle {isLaserSweepOn ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={() => setShowHud(!showHud)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              showHud
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-900 border-white/10 text-slate-400'
            }`}
          >
            HUD {showHud ? 'ON' : 'OFF'}
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-white/10 hover:text-white transition-colors"
            title="Exit theater mode (ESC)"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

      </div>

      {/* Main Viewport Stage */}
      <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
        
        {/* Subtle Cyber Grid Background */}
        <div className="absolute inset-0 bg-grid-cyber opacity-20 pointer-events-none" />

        {/* The Image under inspection */}
        {activeImage ? (
          <img
            src={activeImage.dataUrl || activeImage.url}
            alt={activeImage.label}
            referrerPolicy="no-referrer"
            style={{ filter: filterCss }}
            className="w-full h-full object-contain max-h-[82vh] transition-all duration-300 z-10"
          />
        ) : (
          <div className="text-slate-500 font-mono text-sm">No image available</div>
        )}

        {/* Animated Laser Reticle Sweep Line */}
        {isLaserSweepOn && (
          <div className="absolute inset-x-0 h-[2px] bg-cyan-400/90 scanline-sweep pointer-events-none shadow-[0_0_20px_#00f0ff] z-20" />
        )}

        {/* Film Grain & Vignette Overlay */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_120px_rgba(0,0,0,0.8)] z-20" />

        {/* HUD Reticle Target Crosshairs */}
        {showHud && (
          <div className="absolute inset-8 border border-cyan-500/20 rounded-2xl pointer-events-none z-20">
            <div className="absolute top-2 left-2 text-[10px] font-mono text-cyan-400/80">
              OPTICAL AXIS: 0.00° / HOMOGRAPHY: 1.0
            </div>
            <div className="absolute bottom-2 right-2 text-[10px] font-mono text-cyan-400/80">
              FRAME BUFFER: 4096×2160 · 60 FPS
            </div>

            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400" />
            
            {/* Center target crosshair */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <Crosshair className="h-16 w-16 text-cyan-400" />
            </div>
          </div>
        )}

        {/* Defect Bounding Boxes */}
        {showHud && defects.map((defect) => {
          const isSelected = selectedDefectId === defect.id;
          const { x, y, width, height } = defect.boundingBox;

          let borderColor = 'border-rose-500 bg-rose-500/20 text-rose-300';
          let tagBg = 'bg-rose-600';
          if (defect.severity === 'MAJOR') {
            borderColor = 'border-amber-500 bg-amber-500/20 text-amber-300';
            tagBg = 'bg-amber-600';
          }

          return (
            <div
              key={defect.id}
              onClick={(e) => {
                e.stopPropagation();
                onSelectDefect(isSelected ? null : defect.id);
                cinematicAudio.playAlertTone();
              }}
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: `${width}%`,
                height: `${height}%`,
              }}
              className={`absolute border-2 rounded-lg cursor-pointer z-30 transition-all ${borderColor} ${
                isSelected 
                  ? 'ring-4 ring-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.6)] scale-[1.02]' 
                  : 'hover:scale-[1.01]'
              }`}
            >
              <div className={`absolute -top-7 left-0 px-2 py-0.5 rounded text-[11px] font-mono font-black text-white shadow-xl ${tagBg}`}>
                {defect.type.toUpperCase().replace('_', ' ')} · {defect.severity}
              </div>
            </div>
          );
        })}

        {/* Verdict Floating Watermark if record exists */}
        {record && showHud && (
          <div className="absolute bottom-6 left-8 bg-[#090d18]/90 backdrop-blur-md border border-white/10 p-3.5 rounded-xl font-mono text-xs z-30 shadow-2xl">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-slate-400 text-[10px] uppercase">Automated Verdict:</span>
              <span className={`font-black text-sm ${
                record.decision === 'ACCEPT' ? 'text-emerald-400' : record.decision === 'EXCEPTION' ? 'text-rose-400' : 'text-amber-400'
              }`}>
                {record.decision}
              </span>
            </div>
            <div className="text-[11px] text-slate-300">
              Certainty Score: <span className="text-cyan-300 font-bold">{(record.evidentialCertainty.score * 100).toFixed(0)}%</span>
            </div>
          </div>
        )}

      </div>

      {/* Bottom Cinematic Letterbox Bar: Vantage Point Thumbnails Strip */}
      <div className="bg-[#050811] border-t border-white/10 px-6 py-3 flex items-center justify-between z-30">
        
        <div className="flex items-center gap-3 overflow-x-auto">
          {images.map((img, idx) => {
            const isSelected = idx === activeImageIndex;
            return (
              <button
                key={img.id}
                onClick={() => {
                  onSelectImage(idx);
                  cinematicAudio.playChirp(600 + idx * 80, 0.06);
                }}
                className={`flex items-center gap-3 px-3 py-1.5 rounded-xl border text-left text-xs transition-all ${
                  isSelected
                    ? 'bg-[#121c32] border-cyan-400 text-white shadow-lg shadow-cyan-950/60 ring-2 ring-cyan-400/50'
                    : 'bg-[#090d18] border-white/10 text-slate-400 hover:text-white hover:border-white/30'
                }`}
              >
                <div className="w-12 h-8 rounded-lg bg-black overflow-hidden border border-white/10 shrink-0">
                  <img 
                    src={img.dataUrl || img.url} 
                    alt="" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div>
                  <div className="font-mono text-[11px] font-bold text-slate-200 truncate max-w-[130px]">
                    {img.label}
                  </div>
                  <div className="text-[9px] text-cyan-400 font-mono uppercase">
                    {img.role.replace('_', ' ')}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-right font-mono text-[11px] text-slate-400 hidden sm:block shrink-0 pl-4">
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-white/10">ESC</kbd> to exit Theater Mode
        </div>

      </div>

    </div>
  );
};
