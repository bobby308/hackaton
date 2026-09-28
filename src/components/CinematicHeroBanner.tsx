import React, { useState } from 'react';
import { 
  Sparkles, 
  Maximize2, 
  Scan, 
  Radio, 
  Activity, 
  Volume2, 
  VolumeX, 
  Layers, 
  Camera,
  Compass,
  Video
} from 'lucide-react';
import { cinematicAudio } from '../utils/audioFx';

interface CinematicHeroBannerProps {
  onOpenTheater: () => void;
  isAudioOn: boolean;
  onToggleAudio: () => void;
  scenarioTitle: string;
  isInspecting: boolean;
}

interface CameraFeed {
  id: string;
  name: string;
  sublabel: string;
  imgUrl: string;
}

const CAMERA_FEEDS: CameraFeed[] = [
  {
    id: 'cam-01',
    name: 'CAM 01: ROBOT SCANNER',
    sublabel: 'Optical Laser Conveyor',
    imgUrl: '/src/assets/images/futuristic_robotic_scanner_1790617437140.jpg',
  },
  {
    id: 'cam-02',
    name: 'CAM 02: DOCK BAY 07',
    sublabel: 'Wide Inbound Terminal',
    imgUrl: '/src/assets/images/cinematic_dock_bay_1790616921898.jpg',
  },
  {
    id: 'cam-03',
    name: 'CAM 03: AGV TERMINAL',
    sublabel: 'Automated Transport Bay',
    imgUrl: '/src/assets/images/futuristic_dock_terminal_1790617266170.jpg',
  },
  {
    id: 'cam-04',
    name: 'CAM 04: PALLET LINE',
    sublabel: 'High-Density Staging',
    imgUrl: '/src/assets/images/pallet_cargo_shipment_1790617299945.jpg',
  }
];

export const CinematicHeroBanner: React.FC<CinematicHeroBannerProps> = ({
  onOpenTheater,
  isAudioOn,
  onToggleAudio,
  scenarioTitle,
  isInspecting,
}) => {
  const [selectedCamIndex, setSelectedCamIndex] = useState<number>(0);
  const activeFeed = CAMERA_FEEDS[selectedCamIndex];

  const handleSelectCam = (idx: number) => {
    setSelectedCamIndex(idx);
    cinematicAudio.playScanBeep();
  };

  return (
    <div className="relative rounded-2xl overflow-hidden border border-cyan-500/25 shadow-[0_0_35px_rgba(0,240,255,0.15)] mb-4 group select-none">
      
      {/* Background Cinematic Panoramic Image */}
      <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-black">
        <img
          key={activeFeed.imgUrl}
          src={activeFeed.imgUrl}
          alt={activeFeed.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out animate-fadeIn"
        />

        {/* Cinematic Anamorphic Vignette & Color Grading Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030611] via-[#030611]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#030611]/95 via-transparent to-[#030611]/85" />
        
        {/* Subtle Cyber Reticle & Laser Sweep Animation */}
        <div className="absolute inset-0 bg-grid-cyber opacity-20 pointer-events-none" />
        
        {/* Moving Laser Sweep Line */}
        <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-85 scanline-sweep pointer-events-none shadow-[0_0_15px_#38bdf8]" />
      </div>

      {/* Floating HUD Content */}
      <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-between z-10">
        
        {/* Top Telemetry Strip & Camera Angle Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-300 drop-shadow-md">
              {activeFeed.name}
            </span>
            <span className="text-white/40 hidden sm:inline" aria-hidden="true">·</span>
            <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-500/30 hidden sm:inline-block">
              {activeFeed.sublabel}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Camera Angle Switcher Pills */}
            <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10 backdrop-blur-md">
              <Video className="h-3 w-3 text-cyan-400 ml-1.5 mr-0.5" />
              {CAMERA_FEEDS.map((feed, idx) => (
                <button
                  key={feed.id}
                  onClick={() => handleSelectCam(idx)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-mono transition-all ${
                    selectedCamIndex === idx
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title={feed.sublabel}
                >
                  CAM {idx + 1}
                </button>
              ))}
            </div>

            {/* Audio Toggle */}
            <button
              onClick={onToggleAudio}
              className={`p-1.5 rounded-lg border text-xs font-mono transition-all flex items-center gap-1.5 backdrop-blur-md ${
                isAudioOn
                  ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'bg-black/60 border-white/10 text-slate-400 hover:text-white'
              }`}
              title="Toggle cinematic sound effects"
            >
              {isAudioOn ? (
                <>
                  <Volume2 className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-[10px] hidden md:inline">AUDIO ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="h-3.5 w-3.5" />
                  <span className="text-[10px] hidden md:inline">AUDIO MUTE</span>
                </>
              )}
            </button>

            {/* Launch Cinematic Theater Button */}
            <button
              onClick={onOpenTheater}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs font-mono transition-all shadow-[0_0_20px_rgba(14,165,233,0.4)] active:scale-95"
            >
              <Maximize2 className="h-3.5 w-3.5" />
              <span>THEATER MODE</span>
            </button>
          </div>
        </div>

        {/* Bottom Banner Title & Real-time Dock Telemetry */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-semibold">
                Autonomous Point-of-Receipt Verification
              </span>
              <span className="h-1 w-1 rounded-full bg-cyan-400" />
              <span className="text-[10px] font-mono text-slate-300">
                {isInspecting ? 'ANALYZING LIVE FEED...' : 'LIVE RECEPTOR ACTIVE'}
              </span>
            </div>

            <h1 className="text-lg sm:text-2xl font-black font-sans tracking-tight text-white uppercase drop-shadow-lg">
              Cinematic Logistics <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400">Receiving Command</span>
            </h1>
            
            <p className="text-xs text-slate-300 font-sans max-w-xl line-clamp-1 drop-shadow mt-0.5">
              Active Scenario: <span className="text-white font-semibold font-mono">{scenarioTitle}</span>
            </p>
          </div>

          {/* Quick HUD Metrics */}
          <div className="flex items-center gap-3 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-cyan-500/20 text-[11px] font-mono text-slate-300 self-start sm:self-auto shadow-lg">
            <div>
              <span className="text-slate-500 text-[9px] block uppercase">Optical Lux</span>
              <span className="text-emerald-400 font-bold">540 lx (Optimal)</span>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div>
              <span className="text-slate-500 text-[9px] block uppercase">Scan Reticle</span>
              <span className="text-cyan-400 font-bold">24 Hz Sweep</span>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div>
              <span className="text-slate-500 text-[9px] block uppercase">Tolerance</span>
              <span className="text-amber-400 font-bold">ASTM D642</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
