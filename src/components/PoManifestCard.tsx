import React from 'react';
import { PurchaseOrder } from '../types/receiving';
import { FileSpreadsheet, Box, Tag, DollarSign, ShieldAlert, Check } from 'lucide-react';

interface PoManifestCardProps {
  po: PurchaseOrder;
}

export const PoManifestCard: React.FC<PoManifestCardProps> = ({ po }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-slate-200">
      
      {/* Title & PO Number */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="h-4 w-4 text-sky-400" />
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
            Purchase Order &amp; Manifest Verification
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">PO Ref:</span>
          <span className="text-sky-300 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            {po.poNumber}
          </span>
        </div>
      </div>

      {/* PO Data Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-3">
        <div>
          <div className="text-[11px] text-slate-500 font-mono">SUPPLIER</div>
          <div className="font-semibold text-slate-200 truncate">{po.supplierName}</div>
          <div className="text-[10px] text-slate-400 font-mono">{po.supplierId}</div>
        </div>

        <div>
          <div className="text-[11px] text-slate-500 font-mono">EXPECTED SKU / ASIN</div>
          <div className="font-mono font-bold text-emerald-400">{po.sku}</div>
          <div className="text-[10px] text-slate-400 font-mono">{po.asin || 'ASIN N/A'}</div>
        </div>

        <div>
          <div className="text-[11px] text-slate-500 font-mono">ORDERED QUANTITY</div>
          <div className="font-mono font-bold text-slate-100 text-sm">
            {po.expectedQuantity} <span className="text-xs font-normal text-slate-400">units</span>
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            {po.cartonsExpected} ctn × {po.unitsPerCarton} u/ctn
          </div>
        </div>

        <div>
          <div className="text-[11px] text-slate-500 font-mono">VARIANT SPEC</div>
          <div className="font-semibold text-slate-200">{po.variant}</div>
          <div className="text-[10px] text-slate-400 font-mono">Tolerance: {po.tolerancePct}%</div>
        </div>
      </div>

      {/* Second Line: Logistics & Packaging Spec */}
      <div className="bg-slate-950/80 rounded p-2.5 border border-slate-800/80 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          
          <div className="flex items-start gap-2">
            <Box className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-400 text-[11px]">Carton Spec: </span>
              <span className="text-slate-300 font-mono">
                {po.packagingSpec.dimensionsCm.l}×{po.packagingSpec.dimensionsCm.w}×{po.packagingSpec.dimensionsCm.h}cm ({po.packagingSpec.grossWeightKg}kg)
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <DollarSign className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-400 text-[11px]">Unit / Total Value: </span>
              <span className="text-slate-300 font-mono font-semibold">
                ${po.unitCost.toFixed(2)} / ${po.totalCost.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Tag className="h-3.5 w-3.5 text-blue-400 shrink-0 mt-0.5" />
            <div className="truncate">
              <span className="text-slate-400 text-[11px]">Carrier / Tracking: </span>
              <span className="text-slate-300 font-mono">
                {po.carrier} · {po.trackingNumber}
              </span>
            </div>
          </div>

        </div>

        {/* Sub-assembly BOM requirements */}
        {po.includedComponents && po.includedComponents.length > 0 && (
          <div className="mt-2 pt-2 border-t border-slate-900 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
            <span className="font-mono text-slate-500 font-bold uppercase text-[10px]">
              Mandatory BOM Components:
            </span>
            {po.includedComponents.map((comp, idx) => (
              <span key={idx} className="flex items-center gap-1 text-slate-300">
                <Check className="h-3 w-3 text-emerald-500" />
                {comp}
              </span>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
