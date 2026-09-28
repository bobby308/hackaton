import React, { useState } from 'react';
import { TEST_SCENARIOS } from '../data/scenarios';
import { TestScenario } from '../types/receiving';
import { 
  FileSpreadsheet, 
  Truck, 
  Box, 
  ShieldCheck, 
  ShieldAlert, 
  HelpCircle, 
  ArrowRight, 
  Search, 
  Filter, 
  Calendar, 
  DollarSign, 
  Barcode, 
  Eye, 
  CheckCircle2, 
  Clock, 
  Sparkles 
} from 'lucide-react';
import { cinematicAudio } from '../utils/audioFx';

interface ManifestScheduleViewProps {
  onSelectAndInspect: (scenario: TestScenario) => void;
  onOpenDossierForScenario: (scenario: TestScenario) => void;
}

export const ManifestScheduleView: React.FC<ManifestScheduleViewProps> = ({
  onSelectAndInspect,
  onOpenDossierForScenario,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [carrierFilter, setCarrierFilter] = useState<string>('all');

  const filteredScenarios = TEST_SCENARIOS.filter((sc) => {
    const matchesSearch = 
      sc.po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sc.po.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sc.po.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sc.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCarrier = carrierFilter === 'all' || sc.po.carrier.includes(carrierFilter);
    return matchesSearch && matchesCarrier;
  });

  return (
    <div className="space-y-5 text-slate-200">
      
      {/* Top Panoramic Inbound Freight Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-cyan-500/20 shadow-2xl group select-none">
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-black">
          <img
            src="/src/assets/images/pallet_cargo_shipment_1790617299945.jpg"
            alt="Futuristic Logistics Cargo Pallets & Inbound Conveyors"
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
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
              </span>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-300 drop-shadow">
                INBOUND FREIGHT MANIFEST · EDI 850 / 861 DISPATCH
              </span>
            </div>

            <div className="flex items-center gap-2 bg-black/60 px-3 py-1 rounded-xl border border-white/10 text-xs font-mono text-slate-300 backdrop-blur-md">
              <Clock className="h-3.5 w-3.5 text-cyan-400" />
              <span>DOCK BERTHS: 12 TOTAL · 8 ACTIVE</span>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-semibold">
              Logistics ERP Integration &amp; Linehaul Tracker
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
              Electronic Bill of Lading &amp; Manifest Schedule
            </h1>
            <p className="text-xs text-slate-300 max-w-2xl mt-1 line-clamp-1">
              Connect purchase orders directly with the autonomous visual inspection pipeline. Select any manifest row to initiate point-of-receipt computer vision verification.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-cyber-panel rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-cyan-400" />
          <input
            type="text"
            placeholder="Search PO#, SKU, Supplier, or Variant..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#050a18] border border-cyan-500/20 rounded-xl pl-10 pr-4 py-2 text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 shadow-inner"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-mono text-slate-400 shrink-0">Carrier Filter:</span>
          {['all', 'FreightStar', 'TransNational', 'PacificAir'].map((c) => (
            <button
              key={c}
              onClick={() => setCarrierFilter(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all shrink-0 ${
                carrierFilter === c
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                  : 'bg-[#050a18] text-slate-400 border border-white/5 hover:text-white'
              }`}
            >
              {c === 'all' ? 'All Carriers' : c}
            </button>
          ))}
        </div>
      </div>

      {/* Manifest Table */}
      <div className="glass-cyber-panel rounded-2xl overflow-hidden border border-cyan-500/15 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead className="bg-[#040816] text-slate-400 border-b border-white/5 text-[11px] tracking-wider uppercase">
              <tr>
                <th className="p-3.5">PO &amp; Tracking</th>
                <th className="p-3.5">Expected SKU / Variant</th>
                <th className="p-3.5">Order Quantity</th>
                <th className="p-3.5">Carrier Linehaul</th>
                <th className="p-3.5">Valuation</th>
                <th className="p-3.5 text-center">Benchmark Verdict</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-300">
              {filteredScenarios.map((sc) => {
                const isAccept = sc.expectedVerdict.overall === 'ACCEPT';
                const isException = sc.expectedVerdict.overall === 'EXCEPTION';

                return (
                  <tr key={sc.id} className="hover:bg-[#071026] transition-colors group">
                    
                    {/* PO & Tracking */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <Barcode className="h-4 w-4 text-cyan-400 shrink-0" />
                        <div>
                          <div className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {sc.po.poNumber}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {sc.po.supplierName} ({sc.po.supplierId})
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* SKU & Variant */}
                    <td className="p-3.5">
                      <div className="font-bold text-cyan-300">{sc.po.sku}</div>
                      <div className="text-[10px] text-slate-400 font-sans">{sc.po.variant} · {sc.po.productName.slice(0, 24)}...</div>
                    </td>

                    {/* Ordered Quantity */}
                    <td className="p-3.5">
                      <div className="font-bold text-slate-100">
                        {sc.po.expectedQuantity} units
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {sc.po.cartonsExpected} ctn × {sc.po.unitsPerCarton} u/ctn
                      </div>
                    </td>

                    {/* Carrier Linehaul */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5 text-slate-200">
                        <Truck className="h-3.5 w-3.5 text-slate-400" />
                        <span>{sc.po.carrier}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">{sc.po.trackingNumber}</div>
                    </td>

                    {/* Valuation */}
                    <td className="p-3.5">
                      <div className="font-bold text-emerald-400">
                        ${sc.po.totalCost.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-slate-400">${sc.po.unitCost.toFixed(2)} / ea</div>
                    </td>

                    {/* Expected Benchmark */}
                    <td className="p-3.5 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        isAccept 
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40' 
                          : isException 
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40' 
                          : 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                      }`}>
                        {isAccept ? <CheckCircle2 className="h-3 w-3" /> : isException ? <ShieldAlert className="h-3 w-3" /> : <HelpCircle className="h-3 w-3" />}
                        {sc.expectedVerdict.overall}
                      </span>
                    </td>

                    {/* Action Buttons */}
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            cinematicAudio.playScanBeep();
                            onSelectAndInspect(sc);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-950/50 transition-all active:scale-95"
                          title="Open Inbound Visual Inspector with this shipment"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>Inspect</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
