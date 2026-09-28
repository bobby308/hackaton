import React from 'react';
import { PurchaseOrder } from '../types/receiving';
import { 
  FileSpreadsheet, 
  Box, 
  Tag, 
  DollarSign, 
  ShieldCheck, 
  Barcode,
  Truck,
  Check,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface PoManifestCardProps {
  po: PurchaseOrder;
  onViewCatalog?: () => void;
}

export const PoManifestCard: React.FC<PoManifestCardProps> = ({ po, onViewCatalog }) => {
  return (
    <div className="glass-panel rounded-2xl p-4 text-slate-200 shadow-xl border border-cyan-500/20">
      
      {/* Title & PO Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/5 mb-3.5 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <FileSpreadsheet className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
              Purchase Order &amp; Manifest Baseline
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">EDI 850</span>
            </h2>
            <div className="text-[11px] text-slate-400 flex items-center gap-2">
              <span>Supplier ID: <span className="text-slate-300 font-mono">{po.supplierId}</span></span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Dock: <span className="text-emerald-400 font-mono">{po.dockBay}</span></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onViewCatalog && (
            <button
              onClick={onViewCatalog}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 text-[11px] font-mono transition-colors"
              title="Open golden 3D specifications and tolerances in SKU Vault"
            >
              <Sparkles className="h-3 w-3 text-cyan-400" />
              <span>SKU Vault 3D</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#070e1c] border border-cyan-500/30 font-mono text-xs shadow-inner">
            <Barcode className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-slate-400 text-[11px]">PO:</span>
            <span className="text-cyan-300 font-bold tracking-wide">{po.poNumber}</span>
          </div>
        </div>
      </div>

      {/* PO Data Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-3.5">
        <div className="bg-[#070e1b]/80 p-2.5 rounded-xl border border-white/5">
          <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-0.5">SUPPLIER / VENDOR</div>
          <div className="font-bold text-slate-100 truncate">{po.supplierName}</div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">Facility: APAC-HUB-04</div>
        </div>

        <div className="bg-[#070e1b]/80 p-2.5 rounded-xl border border-white/5">
          <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-0.5">EXPECTED SKU / ASIN</div>
          <div className="font-mono font-bold text-cyan-300 truncate">{po.sku}</div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">{po.asin || 'ASIN: PENDING'}</div>
        </div>

        <div className="bg-[#070e1b]/80 p-2.5 rounded-xl border border-white/5">
          <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-0.5">ORDERED UNITS</div>
          <div className="font-mono font-black text-white text-sm">
            {po.expectedQuantity} <span className="text-xs font-normal text-slate-400">units</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">
            {po.cartonsExpected} ctn × {po.unitsPerCarton} u/ctn
          </div>
        </div>

        <div className="bg-[#070e1b]/80 p-2.5 rounded-xl border border-white/5">
          <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider mb-0.5">VARIANT SPEC</div>
          <div className="font-bold text-slate-100 truncate">{po.variant}</div>
          <div className="text-[11px] text-slate-400 font-mono mt-0.5">Tolerance: ±{po.tolerancePct}%</div>
        </div>
      </div>

      {/* Logistics & Packaging Spec Sub-bar */}
      <div className="bg-[#050a16]/90 rounded-xl p-3 border border-white/5 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          
          <div className="flex items-start gap-2">
            <Box className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-400 text-[11px] block">Carton Spec:</span>
              <span className="text-slate-200 font-mono font-medium">
                {po.packagingSpec.dimensionsCm.l}×{po.packagingSpec.dimensionsCm.w}×{po.packagingSpec.dimensionsCm.h}cm · {po.packagingSpec.grossWeightKg}kg
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <DollarSign className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-400 text-[11px] block">PO Unit / Total Valuation:</span>
              <span className="text-slate-200 font-mono font-semibold">
                ${po.unitCost.toFixed(2)} ea · <span className="text-emerald-400">${po.totalCost.toFixed(2)}</span>
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Truck className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="truncate">
              <span className="text-slate-400 text-[11px] block">Carrier Logistics:</span>
              <span className="text-slate-200 font-mono font-medium truncate block">
                {po.carrier} · {po.trackingNumber}
              </span>
            </div>
          </div>

        </div>

        {/* Sub-assembly BOM requirements */}
        {po.includedComponents && po.includedComponents.length > 0 && (
          <div className="mt-2.5 pt-2.5 border-t border-white/5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px]">
            <span className="font-mono text-cyan-400 font-bold uppercase text-[10px] tracking-wider">
              Mandatory BOM Components:
            </span>
            {po.includedComponents.map((comp, idx) => (
              <span key={idx} className="flex items-center gap-1.5 text-slate-300 font-medium">
                <Check className="h-3 w-3 text-emerald-400" />
                {comp}
              </span>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
