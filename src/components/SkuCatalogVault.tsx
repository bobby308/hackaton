import React, { useState } from 'react';
import { 
  Box, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  Crosshair, 
  CheckCircle2, 
  AlertTriangle, 
  FileSpreadsheet, 
  ArrowRight, 
  Maximize2, 
  Tag, 
  Scale, 
  Droplet, 
  Flame, 
  Zap, 
  Sliders,
  RotateCw
} from 'lucide-react';
import { TEST_SCENARIOS } from '../data/scenarios';
import { TestScenario } from '../types/receiving';
import { cinematicAudio } from '../utils/audioFx';

interface SkuCatalogVaultProps {
  onSelectAndInspect: (scenario: TestScenario) => void;
}

interface CatalogProduct {
  sku: string;
  asin: string;
  name: string;
  category: string;
  variant: string;
  hexColor: string;
  unitCost: number;
  expectedUnitsPerCarton: number;
  cartonWeightKg: number;
  dimensionsCm: { l: number; w: number; h: number };
  cartonECT: string;
  moistureThresholdPct: number;
  components: { name: string; required: boolean; critical: boolean; spec: string }[];
  scenariosLinked: string[];
  description: string;
}

const CATALOG_ITEMS: CatalogProduct[] = [
  {
    sku: 'BLUE-BOTTLE-001',
    asin: 'B09XYZ841A',
    name: 'Hydro-V Insulated Stainless Bottle (750ml)',
    category: 'Drinkware & Thermal Vessels',
    variant: 'Royal Blue (Hex #2563eb)',
    hexColor: '#2563eb',
    unitCost: 24.50,
    expectedUnitsPerCarton: 24,
    cartonWeightKg: 11.4,
    dimensionsCm: { l: 48, w: 32, h: 28 },
    cartonECT: '44 ECT / 275# Burst Strength',
    moistureThresholdPct: 12.0,
    components: [
      { name: '750ml Double-Wall Vacuum Vessel', required: true, critical: true, spec: 'SUS 304 Food-Grade Stainless Steel' },
      { name: 'Leakproof Spout Cap', required: true, critical: true, spec: 'BPA-Free Polypropylene with threaded latch' },
      { name: 'Silicone O-Ring Gasket', required: true, critical: true, spec: 'Food-grade silicone, Shore A 50 durometer' },
      { name: 'Carabiner Clip Ring', required: true, critical: false, spec: 'Anodized aluminum alloy, 50kg load limit' }
    ],
    scenariosLinked: ['scenario-01-correct', 'scenario-02-short', 'scenario-03-extra', 'scenario-06-crushed', 'scenario-07-water', 'scenario-08-torn', 'scenario-09-missing-comp'],
    description: 'Flagship vacuum-insulated beverage container engineered for 24-hr cold retention. Strict chromatic tolerance (ΔE < 1.8).'
  },
  {
    sku: 'BLACK-BOTTLE-001',
    asin: 'B09XYZ842B',
    name: 'Hydro-V Insulated Stainless Bottle (750ml)',
    category: 'Drinkware & Thermal Vessels',
    variant: 'Matte Stealth Black (Hex #1e293b)',
    hexColor: '#1e293b',
    unitCost: 24.50,
    expectedUnitsPerCarton: 24,
    cartonWeightKg: 11.4,
    dimensionsCm: { l: 48, w: 32, h: 28 },
    cartonECT: '44 ECT / 275# Burst Strength',
    moistureThresholdPct: 12.0,
    components: [
      { name: '750ml Double-Wall Vacuum Vessel', required: true, critical: true, spec: 'Powder-coated Matte Black SUS 304' },
      { name: 'Leakproof Spout Cap', required: true, critical: true, spec: 'BPA-Free Polypropylene' },
      { name: 'Silicone O-Ring Gasket', required: true, critical: true, spec: 'Food-grade silicone gasket' },
      { name: 'Carabiner Clip Ring', required: true, critical: false, spec: 'Anodized black aluminum alloy' }
    ],
    scenariosLinked: ['scenario-05-wrong-variant'],
    description: 'Matte Stealth variant. Frequent subject of supplier SKU transposition or color-swap exceptions during line sorting.'
  },
  {
    sku: 'THERMO-MUG-002',
    asin: 'B09XYZ999X',
    name: 'ThermoPro Travel Mug with Handle (500ml)',
    category: 'Drinkware & Thermal Vessels',
    variant: 'Brushed Steel Silver (Hex #94a3b8)',
    hexColor: '#94a3b8',
    unitCost: 19.80,
    expectedUnitsPerCarton: 18,
    cartonWeightKg: 8.6,
    dimensionsCm: { l: 42, w: 30, h: 24 },
    cartonECT: '32 ECT / 200# Burst Strength',
    moistureThresholdPct: 12.0,
    components: [
      { name: '500ml Insulated Body with Handle', required: true, critical: true, spec: 'Welded stainless ergonomic grip' },
      { name: 'Slider Sip Lid', required: true, critical: true, spec: 'Tritan copolyester with magnetic slider' },
      { name: 'Anti-Slip Silicone Base Pad', required: true, critical: false, spec: 'Overmolded rubberized damper' }
    ],
    scenariosLinked: ['scenario-04-wrong-sku'],
    description: 'Secondary line item. High risk of incorrect substitution when supplier warehouse fulfills bulk POs without barcode verification.'
  }
];

export const SkuCatalogVault: React.FC<SkuCatalogVaultProps> = ({ onSelectAndInspect }) => {
  const [selectedSku, setSelectedSku] = useState<string>('BLUE-BOTTLE-001');
  const [activeViewMode, setActiveViewMode] = useState<'3d_hologram' | 'bom_components' | 'packaging_tolerances'>('3d_hologram');
  const [rotationAngle, setRotationAngle] = useState<number>(15);

  const activeProduct = CATALOG_ITEMS.find(p => p.sku === selectedSku) || CATALOG_ITEMS[0];

  const handleSelectProduct = (sku: string) => {
    setSelectedSku(sku);
    cinematicAudio.playScanBeep();
  };

  const handleLaunchFirstScenario = () => {
    const linkedScenarioId = activeProduct.scenariosLinked[0];
    const scenario = TEST_SCENARIOS.find(s => s.id === linkedScenarioId) || TEST_SCENARIOS[0];
    cinematicAudio.playPassChime();
    onSelectAndInspect(scenario);
  };

  return (
    <div className="space-y-5 text-slate-200">
      
      {/* Top Futuristic Panoramic Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-cyan-500/25 shadow-[0_0_35px_rgba(0,240,255,0.15)] group select-none">
        <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-black">
          <img
            src="/src/assets/images/holographic_product_inspection_1790617453299.jpg"
            alt="Cinematic Holographic 3D Product Inspection Lab"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#02050e] via-[#02050e]/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#02050e]/95 via-transparent to-[#02050e]/85" />
          <div className="absolute inset-0 bg-grid-cyber opacity-25 pointer-events-none" />
          <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent scanline-sweep pointer-events-none" />
        </div>

        <div className="absolute inset-0 p-5 flex flex-col justify-between z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-400"></span>
              </span>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-300 drop-shadow">
                HOLOGRAPHIC PRODUCT VAULT · SKU TOLERANCE ENGINE
              </span>
            </div>

            <div className="flex items-center gap-2 bg-black/60 px-3 py-1 rounded-xl border border-white/10 text-xs font-mono text-slate-300 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>3D CAD / CHROMAMETER CALIBRATION ACTIVE</span>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
              Golden Unit Master Catalogue
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5 font-sans">
              Autonomous Receiving Ground Truth &amp; Component BOM
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed hidden sm:block">
              Every incoming carton is matched against optical golden references: chromatic spectro coordinates, dimensional calipers, inner divider cavity geometry, and component bills of materials.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: SKU Picker + Holographic 3D Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column: SKU Selector Cards */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5 text-cyan-400" /> Master SKU Catalogue ({CATALOG_ITEMS.length})
            </span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
              ACTIVE POs
            </span>
          </div>

          <div className="space-y-2.5">
            {CATALOG_ITEMS.map((item) => {
              const isSelected = item.sku === selectedSku;
              return (
                <button
                  key={item.sku}
                  onClick={() => handleSelectProduct(item.sku)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs font-mono relative overflow-hidden group ${
                    isSelected
                      ? 'bg-gradient-to-r from-cyan-950/70 to-blue-950/40 border-cyan-400/60 shadow-[0_0_20px_rgba(0,240,255,0.15)] ring-1 ring-cyan-400/40'
                      : 'glass-panel border-white/5 hover:border-white/20 hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full`} style={{ backgroundColor: item.hexColor }} />
                        <span className="font-extrabold text-white text-xs">{item.sku}</span>
                      </div>
                      <div className="text-[11px] text-slate-300 font-sans font-medium mt-1">
                        {item.name}
                      </div>
                    </div>
                    <span className="text-cyan-300 font-bold shrink-0">${item.unitCost.toFixed(2)}</span>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 border-t border-white/5 pt-2">
                    <span>{item.variant}</span>
                    <span className="text-slate-500">{item.expectedUnitsPerCarton} units/ctn</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Info Box */}
          <div className="p-4 rounded-xl glass-panel border border-cyan-500/20 text-xs font-mono space-y-2">
            <div className="flex items-center gap-2 text-cyan-300 font-bold">
              <Crosshair className="h-4 w-4" /> Optical Verification Rule
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px] font-sans">
              When inspecting inbound shipments, the agent compares physical photography against this Master SKU record. A mismatch in variant color, barcode checksum, or missing component generates an immediate non-conformance flag.
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Holographic Workbench & Spec Inspector */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Product Header & View Mode Switcher */}
          <div className="glass-panel p-5 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold">
                  {activeProduct.category}
                </span>
                <span className="text-xs font-mono text-slate-400">ASIN: {activeProduct.asin}</span>
              </div>
              <h2 className="text-lg font-black text-white font-sans mt-1">
                {activeProduct.name}
              </h2>
              <p className="text-xs text-slate-300 font-sans mt-0.5">
                {activeProduct.description}
              </p>
            </div>

            {/* View Mode Buttons */}
            <div className="flex items-center gap-1.5 bg-[#070b16] p-1 rounded-xl border border-white/10 self-start md:self-center shrink-0">
              <button
                onClick={() => setActiveViewMode('3d_hologram')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                  activeViewMode === '3d_hologram'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" /> 3D Hologram
              </button>
              <button
                onClick={() => setActiveViewMode('bom_components')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                  activeViewMode === 'bom_components'
                    ? 'bg-violet-600 text-white font-bold shadow-md shadow-violet-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="h-3.5 w-3.5" /> BOM ({activeProduct.components.length})
              </button>
              <button
                onClick={() => setActiveViewMode('packaging_tolerances')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                  activeViewMode === 'packaging_tolerances'
                    ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="h-3.5 w-3.5" /> Tolerances
              </button>
            </div>
          </div>

          {/* Hologram / 3D Visualization Tab */}
          {activeViewMode === '3d_hologram' && (
            <div className="glass-panel p-6 rounded-2xl border border-white/10 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-3 border-b border-white/5">
                <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
                  <Crosshair className="h-3.5 w-3.5 animate-spin" /> INTERACTIVE HOLOGRAPHIC WIREFRAME
                </span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setRotationAngle(r => (r + 45) % 360)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 text-[11px]"
                  >
                    <RotateCw className="h-3 w-3" /> Rotate ({rotationAngle}°)
                  </button>
                  <span className="text-slate-500">SCALE: 1:1 CALIBRATED</span>
                </div>
              </div>

              {/* Holographic Bottle Canvas / SVG Projection */}
              <div className="h-80 sm:h-96 w-full flex items-center justify-center relative mt-3 bg-[#030612]/90 rounded-xl border border-cyan-500/20 overflow-hidden">
                {/* Background Tech Grid */}
                <div className="absolute inset-0 bg-grid-cyber opacity-30 pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.12),transparent_70%)]" />

                {/* Caliper HUD Overlay */}
                <div className="absolute top-4 left-4 font-mono text-[10px] text-cyan-400/80 space-y-1">
                  <div>// CALIPER METRICS</div>
                  <div>DIAMETER: Ø 78.4 mm ± 0.3mm</div>
                  <div>HEIGHT: 278.2 mm ± 0.5mm</div>
                  <div>VOLUME: 750 mL NOMINAL</div>
                  <div>COATING: ELECTRO-STATIC POWDER</div>
                </div>

                <div className="absolute bottom-4 right-4 font-mono text-[10px] text-emerald-400/80 space-y-1 text-right">
                  <div>SPECTROCHROMATIC ANALYSIS //</div>
                  <div>L* = 34.2 | a* = 8.1 | b* = -32.6</div>
                  <div>DELTA E &lt; 0.85 [CONCORDANT]</div>
                </div>

                {/* Stylized Vector Holographic Bottle */}
                <div 
                  className="relative transition-transform duration-500 ease-out flex items-center justify-center"
                  style={{ transform: `rotate(${rotationAngle}deg)` }}
                >
                  <svg width="240" height="340" viewBox="0 0 240 340" className="drop-shadow-[0_0_25px_rgba(0,240,255,0.4)]">
                    <defs>
                      <linearGradient id="vesselGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#0f172a" />
                        <stop offset="35%" stopColor={activeProduct.hexColor} />
                        <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#0f172a" />
                      </linearGradient>
                      <pattern id="laserLines" width="10" height="10" patternUnits="userSpaceOnUse">
                        <line x1="0" y1="5" x2="10" y2="5" stroke="#38bdf8" strokeWidth="0.5" strokeOpacity="0.4" />
                      </pattern>
                    </defs>

                    {/* Bottle Body */}
                    <rect x="70" y="90" width="100" height="210" rx="20" fill="url(#vesselGrad)" stroke="#38bdf8" strokeWidth="1.5" />
                    <rect x="70" y="90" width="100" height="210" rx="20" fill="url(#laserLines)" />

                    {/* Cap & Neck */}
                    <rect x="90" y="55" width="60" height="35" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
                    <rect x="100" y="30" width="40" height="25" rx="4" fill="#334155" stroke="#38bdf8" strokeWidth="1.5" />

                    {/* Carabiner Ring */}
                    <circle cx="145" cy="42" r="14" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="3 2" />

                    {/* Laser Caliper Scanning Crosshairs */}
                    <line x1="20" y1="195" x2="220" y2="195" stroke="#00f0ff" strokeWidth="1" strokeDasharray="4 4" />
                    <circle cx="120" cy="195" r="4" fill="#00f0ff" />
                    
                    {/* Measurement brackets */}
                    <line x1="60" y1="90" x2="60" y2="300" stroke="#00f0ff" strokeWidth="1" />
                    <line x1="55" y1="90" x2="65" y2="90" stroke="#00f0ff" strokeWidth="1" />
                    <line x1="55" y1="300" x2="65" y2="300" stroke="#00f0ff" strokeWidth="1" />
                    <text x="45" y="198" fill="#00f0ff" fontSize="10" fontFamily="monospace" transform="rotate(-90 45 198)" textAnchor="middle">278.2 mm</text>
                  </svg>
                </div>
              </div>

              {/* Bottom Launch Button */}
              <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/5">
                <span className="text-xs text-slate-400 font-sans">
                  Linked to {activeProduct.scenariosLinked.length} receiving benchmark scenarios.
                </span>
                <button
                  onClick={handleLaunchFirstScenario}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 font-sans text-xs font-black text-slate-950 shadow-lg shadow-cyan-500/20 flex items-center gap-2 active:scale-95 transition-transform"
                >
                  <span>Test Inspect This SKU at Dock Bay</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* BOM Components Tab */}
          {activeViewMode === 'bom_components' && (
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm font-sans">Mandatory Component Bill of Materials</h3>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">
                    Failure to detect all critical components triggers automatic "Missing Component" exception.
                  </p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-violet-950 text-violet-300 border border-violet-500/30">
                  {activeProduct.components.length} AUDITED PARTS
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeProduct.components.map((comp, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#060a14] border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-white text-xs font-sans">{comp.name}</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        comp.critical ? 'bg-rose-950/80 text-rose-300 border border-rose-500/30' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {comp.critical ? 'CRITICAL' : 'OPTIONAL'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      SPEC: <span className="text-slate-300">{comp.spec}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Packaging Tolerances Tab */}
          {activeViewMode === 'packaging_tolerances' && (
            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-white text-sm font-sans">Packaging &amp; Defect Acceptance Tolerances</h3>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">
                    Governed by ASTM D642 (compression) and ASTM D5276 (drop impacts).
                  </p>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                  ISO 9001 TOLERANCES
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-4 rounded-xl bg-[#060a14] border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase text-slate-500 tracking-wider">Carton Strength</span>
                  <div className="text-emerald-400 font-bold text-sm">{activeProduct.cartonECT}</div>
                  <span className="text-[10px] text-slate-400 font-sans block mt-1">Crush deflection limit: 12mm max.</span>
                </div>

                <div className="p-4 rounded-xl bg-[#060a14] border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase text-slate-500 tracking-wider">Moisture Ingress Limit</span>
                  <div className="text-cyan-400 font-bold text-sm">&lt; {activeProduct.moistureThresholdPct}% RH</div>
                  <span className="text-[10px] text-slate-400 font-sans block mt-1">Tide stains &gt; 50cm² trigger quarantine.</span>
                </div>

                <div className="p-4 rounded-xl bg-[#060a14] border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase text-slate-500 tracking-wider">Master Carton Tare</span>
                  <div className="text-amber-400 font-bold text-sm">{activeProduct.cartonWeightKg} kg ± 2%</div>
                  <span className="text-[10px] text-slate-400 font-sans block mt-1">Gross carton weight validation.</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
