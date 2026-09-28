import React, { useState, useRef } from 'react';
import { InspectionImage, DefectItem } from '../types/receiving';
import { 
  ZoomIn, 
  Eye, 
  EyeOff, 
  Maximize2, 
  AlertCircle, 
  Crosshair,
  Info,
  Layers
} from 'lucide-react';

interface EvidenceCanvasProps {
  images: InspectionImage[];
  activeImageIndex: number;
  onSelectImage: (index: number) => void;
  defects: DefectItem[];
  selectedDefectId: string | null;
  onSelectDefect: (defectId: string | null) => void;
  uncertaintyActive?: boolean;
}

export const EvidenceCanvas: React.FC<EvidenceCanvasProps> = ({
  images,
  activeImageIndex,
  onSelectImage,
  defects,
  selectedDefectId,
  onSelectDefect,
  uncertaintyActive = false,
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
    <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex flex-col h-full text-slate-200">
      
      {/* Canvas Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Crosshair className="h-4 w-4 text-emerald-400" />
          <span className="font-mono font-bold text-slate-300 uppercase">
            Visual Evidence Feed ({activeImageIndex + 1}/{images.length})
          </span>
          <span className="text-slate-600" aria-hidden="true">·</span>
          <span className="text-slate-400 font-mono text-[11px] truncate max-w-xs">
            {activeImage?.label}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Overlay Toggle */}
          <button
            onClick={() => setShowOverlays(!showOverlays)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
              showOverlays
                ? 'bg-slate-800 text-emerald-300 border border-slate-700'
                : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
            title="Toggle defect bounding boxes & HUD"
          >
            {showOverlays ? <Eye className="h-3.5 w-3.5 text-emerald-400" /> : <EyeOff className="h-3.5 w-3.5" />}
            <span>Overlays {showOverlays ? 'ON' : 'OFF'}</span>
          </button>

          {/* Magnifier Tool */}
          <button
            onClick={() => setIsMagnifierActive(!isMagnifierActive)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-colors ${
              isMagnifierActive
                ? 'bg-blue-900/60 text-blue-200 border border-blue-600'
                : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
            title="Toggle 2.5x Inspection Loupe"
          >
            <ZoomIn className="h-3.5 w-3.5 text-blue-400" />
            <span>2.5x Loupe</span>
          </button>
        </div>
      </div>

      {/* Main Image Display Area */}
      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative flex-1 min-h-[360px] bg-slate-950 flex items-center justify-center overflow-hidden cursor-crosshair select-none group"
      >
        {activeImage ? (
          <img
            src={activeImage.dataUrl || activeImage.url}
            alt={activeImage.label}
            className="w-full h-full object-contain max-h-[480px]"
          />
        ) : (
          <div className="text-slate-500 text-xs font-mono">No photograph attached</div>
        )}

        {/* Bounding Box Defect Overlays */}
        {showOverlays && defects && defects.map((defect) => {
          const isSelected = selectedDefectId === defect.id;
          const { x, y, width, height } = defect.boundingBox;

          let borderColor = 'border-rose-500 bg-rose-500/15 text-rose-400';
          let badgeBg = 'bg-rose-600';
          if (defect.severity === 'MAJOR') {
            borderColor = 'border-amber-500 bg-amber-500/15 text-amber-400';
            badgeBg = 'bg-amber-600';
          } else if (defect.severity === 'MINOR') {
            borderColor = 'border-sky-500 bg-sky-500/15 text-sky-400';
            badgeBg = 'bg-sky-600';
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
              className={`absolute border-2 rounded transition-all cursor-pointer ${borderColor} ${
                isSelected ? 'ring-4 ring-rose-400/50 scale-[1.01] z-20' : 'hover:scale-[1.01] z-10'
              }`}
            >
              {/* Defect Tag Header */}
              <div 
                className={`absolute -top-6 left-0 flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white shadow-md ${badgeBg}`}
              >
                <span>{defect.type.toUpperCase().replace('_', ' ')}</span>
                <span className="opacity-75">·</span>
                <span>{defect.severity}</span>
              </div>
            </div>
          );
        })}

        {/* UNCERTAIN Glare/Low confidence banner overlay if active */}
        {uncertaintyActive && (
          <div className="absolute inset-0 pointer-events-none border-2 border-amber-500/40 bg-amber-500/5 flex flex-col justify-end p-4">
            <div className="bg-slate-900/90 border border-amber-500/50 p-2.5 rounded text-xs text-amber-300 font-mono flex items-center gap-2 max-w-md shadow-xl">
              <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
              <span>
                EVIDENCE UNCERTAINTY DETECTED: Specular glare and oblique perspective impede verification.
              </span>
            </div>
          </div>
        )}

        {/* 2.5x Magnifier Lens */}
        {isMagnifierActive && (
          <div
            style={{
              left: `${magnifierPos.x - 75}px`,
              top: `${magnifierPos.y - 75}px`,
              backgroundImage: `url(${activeImage?.dataUrl || activeImage?.url})`,
              backgroundPosition: `${magnifierPos.relX}% ${magnifierPos.relY}%`,
              backgroundSize: '250%',
            }}
            className="absolute w-36 h-36 rounded-full border-2 border-emerald-400 shadow-2xl pointer-events-none z-30 ring-4 ring-black/60 bg-no-repeat"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <Crosshair className="h-4 w-4 text-emerald-400/60" />
            </div>
          </div>
        )}

      </div>

      {/* Selected Defect Detail Card if clicked */}
      {selectedDefectId && (
        <div className="px-4 py-2.5 bg-slate-950/90 border-t border-slate-800 text-xs">
          {(() => {
            const def = defects.find(d => d.id === selectedDefectId);
            if (!def) return null;
            return (
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-rose-300">
                        {def.id}: {def.type.toUpperCase().replace('_', ' ')}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
                        {def.severity}
                      </span>
                      <span className="text-slate-500 font-mono text-[11px]">
                        Conf: {(def.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="text-slate-300 mt-0.5">{def.description}</div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      Location: {def.location} {def.claimImpact ? `· Impact: ${def.claimImpact}` : ''}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => onSelectDefect(null)}
                  className="text-slate-500 hover:text-slate-300 text-xs font-mono underline"
                >
                  Close
                </button>
              </div>
            );
          })()}
        </div>
      )}

      {/* Vantage Point Thumbnails Strip */}
      <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto">
          {images.map((img, idx) => {
            const isSelected = idx === activeImageIndex;
            return (
              <button
                key={img.id}
                onClick={() => onSelectImage(idx)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded border text-left text-xs transition-all ${
                  isSelected
                    ? 'bg-slate-800 border-emerald-500 text-white shadow-sm'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400'
                }`}
              >
                <div className="w-8 h-6 rounded bg-slate-950 overflow-hidden border border-slate-700 shrink-0">
                  <img src={img.dataUrl || img.url} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="truncate">
                  <div className="font-mono text-[11px] font-semibold text-slate-200 truncate">
                    {img.label}
                  </div>
                  <div className="text-[9px] text-slate-500 font-mono uppercase">
                    {img.role.replace('_', ' ')}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="text-[11px] text-slate-500 font-mono hidden md:block shrink-0">
          Click defect boxes for telemetry
        </div>
      </div>

    </div>
  );
};
