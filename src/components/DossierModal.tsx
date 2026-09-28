import React, { useState } from 'react';
import { InspectionRecord } from '../types/receiving';
import { 
  FileText, 
  Download, 
  Printer, 
  X, 
  ShieldCheck, 
  ShieldAlert, 
  Check, 
  Hash, 
  Calendar, 
  Truck, 
  Building,
  DollarSign,
  Barcode,
  Layers,
  Sparkles
} from 'lucide-react';

interface DossierModalProps {
  record: InspectionRecord | null;
  onClose: () => void;
}

export const DossierModal: React.FC<DossierModalProps> = ({ record, onClose }) => {
  const [supervisorName, setSupervisorName] = useState('Alex Vance (Inbound Dock Lead)');
  const [isSigned, setIsSigned] = useState(false);

  if (!record) return null;

  const { po, decision, skuCheck, quantityCheck, variantCheck, damageCheck, discrepancyDossier, images } = record;

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(record, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `EDI861_RECEIVING_${record.id}_${po.poNumber}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#090e1a] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#060a14] border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white uppercase tracking-tight font-sans">
                Receiving Evidence Record &amp; Supplier Claim Dossier
              </h2>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                Audit Record ID: <span className="text-cyan-300 font-semibold">{record.id}</span> · EDI 861 Receiving Advice Protocol
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadJson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111a2e] hover:bg-[#16223d] text-cyan-300 border border-cyan-500/30 text-xs font-mono transition-colors shadow-sm"
            >
              <Download className="h-3.5 w-3.5 text-cyan-400" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111a2e] hover:bg-[#16223d] text-slate-200 border border-white/10 text-xs font-mono transition-colors shadow-sm"
            >
              <Printer className="h-3.5 w-3.5 text-sky-400" />
              <span>Print PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors ml-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs bg-[#090e1a]">
          
          {/* Document Header & Big Disposition Stamp */}
          <div className="border border-white/10 rounded-2xl p-5 bg-[#060a14] flex flex-col sm:flex-row justify-between gap-4 shadow-inner">
            <div>
              <div className="font-black text-lg text-white tracking-tight font-sans uppercase">
                Inbound Receiving Quality Discrepancy Record
              </div>
              <div className="text-slate-400 text-xs mt-1">
                Logistics Automated Dock Bay 07 · Facility #04 APAC
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono mt-2.5">
                <span>Cryptographic Proof Hash:</span>
                <span className="text-cyan-300 bg-[#0c1222] px-2 py-0.5 rounded-md border border-white/10 font-bold">
                  {discrepancyDossier.inspectionHash}
                </span>
              </div>
            </div>

            <div className="text-right sm:self-center shrink-0">
              <div className="font-mono text-xs text-slate-400 mb-1">FINAL DISPOSITION:</div>
              <div className={`font-black text-sm px-4 py-1.5 rounded-xl inline-block uppercase tracking-wider ${
                decision === 'ACCEPT' 
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-950/50' 
                  : decision === 'EXCEPTION' 
                  ? 'bg-rose-500 text-slate-950 font-black shadow-lg shadow-rose-950/50' 
                  : 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-950/50'
              }`}>
                {decision}
              </div>
            </div>
          </div>

          {/* PO & Carrier Meta Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#070b16] p-4 rounded-xl border border-white/5">
            <div>
              <span className="text-slate-400 font-mono text-[10px] uppercase block">Purchase Order</span>
              <span className="font-mono font-bold text-slate-200 text-sm">{po.poNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 font-mono text-[10px] uppercase block">Supplier / Vendor</span>
              <span className="font-bold text-slate-200">{po.supplierName}</span>
              <span className="text-[10px] text-slate-400 block font-mono">({po.supplierId})</span>
            </div>
            <div>
              <span className="text-slate-400 font-mono text-[10px] uppercase block">Carrier Logistics</span>
              <span className="font-medium text-slate-200">{po.carrier}</span>
              <span className="text-[10px] text-slate-400 block font-mono">{po.trackingNumber}</span>
            </div>
            <div>
              <span className="text-slate-400 font-mono text-[10px] uppercase block">Timestamp (Receipt)</span>
              <span className="font-mono text-slate-200">{new Date(record.discrepancyDossier.timestamp).toLocaleString()}</span>
            </div>
          </div>

          {/* Audit Check Matrix Summary */}
          <div className="border border-white/10 rounded-xl overflow-hidden bg-[#070b16]">
            <div className="bg-[#0b101e] px-4 py-2.5 font-mono font-bold text-xs uppercase tracking-wider text-slate-300 border-b border-white/5 flex items-center justify-between">
              <span>Point-of-Receipt Automated Audit Verification Matrix</span>
              <span className="text-[10px] text-slate-400">4 Core Dimensions</span>
            </div>
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#060913] text-slate-400 border-b border-white/5 text-[11px]">
                <tr>
                  <th className="p-3">Inspection Dimension</th>
                  <th className="p-3">PO Target / Baseline</th>
                  <th className="p-3">Observed / Decoded</th>
                  <th className="p-3 text-center">Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                <tr>
                  <td className="p-3 font-semibold text-slate-200">1. Product SKU Identity</td>
                  <td className="p-3 text-slate-400">{skuCheck.expected}</td>
                  <td className="p-3 font-bold text-slate-200">{skuCheck.observed}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      skuCheck.verdict === 'PASS' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : skuCheck.verdict === 'FAIL' ? 'bg-rose-950 text-rose-400 border border-rose-500/30' : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                    }`}>
                      {skuCheck.verdict}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-200">2. Unit Quantity Reconciliation</td>
                  <td className="p-3 text-slate-400">{quantityCheck.expected} units</td>
                  <td className="p-3 font-bold text-slate-200">
                    {quantityCheck.observed} units {quantityCheck.delta !== 0 && `(Δ: ${quantityCheck.delta})`}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      quantityCheck.verdict === 'PASS' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : quantityCheck.verdict === 'FAIL' ? 'bg-rose-950 text-rose-400 border border-rose-500/30' : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                    }`}>
                      {quantityCheck.verdict}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-200">3. Variant &amp; Spec Check</td>
                  <td className="p-3 text-slate-400">{variantCheck.expected}</td>
                  <td className="p-3 font-bold text-slate-200">{variantCheck.observed}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      variantCheck.verdict === 'PASS' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : variantCheck.verdict === 'FAIL' ? 'bg-rose-950 text-rose-400 border border-rose-500/30' : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                    }`}>
                      {variantCheck.verdict}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-200">4. ASTM D642 Packaging Integrity</td>
                  <td className="p-3 text-slate-400">{damageCheck.expected}</td>
                  <td className="p-3 font-bold text-slate-200">{damageCheck.observed}</td>
                  <td className="p-3 text-center">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      damageCheck.verdict === 'PASS' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : damageCheck.verdict === 'FAIL' ? 'bg-rose-950 text-rose-400 border border-rose-500/30' : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                    }`}>
                      {damageCheck.verdict}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Photographic Evidence Attachment Strip */}
          <div>
            <div className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
              Attached Photographic Evidence Records ({images.length} Vantages)
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((img, i) => (
                <div key={i} className="border border-white/10 rounded-xl overflow-hidden bg-[#070b16] p-2">
                  <div className="h-28 rounded-lg overflow-hidden bg-black mb-1.5">
                    <img src={img.dataUrl || img.url} alt="" className="w-full h-full object-contain" />
                  </div>
                  <div className="font-mono text-[11px] font-bold text-slate-200 truncate">{img.label}</div>
                  <div className="font-mono text-[9px] text-slate-400 uppercase">{img.role.replace('_', ' ')}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Claim & Debit Memo Calculation */}
          {discrepancyDossier.financialDiscrepancyAmount > 0 && (
            <div className="bg-rose-950/30 border border-rose-500/40 rounded-xl p-4 text-xs">
              <div className="flex items-center justify-between font-mono pb-2 border-b border-rose-500/20 mb-2 text-rose-300">
                <span className="font-bold uppercase tracking-wider">SUPPLIER DEBIT MEMO LIABILITY</span>
                <span className="text-base font-black text-white">
                  ${discrepancyDossier.financialDiscrepancyAmount.toFixed(2)} USD
                </span>
              </div>
              <div className="text-slate-300 leading-relaxed">
                <span className="font-semibold text-rose-300">Summary: </span>
                {discrepancyDossier.summary}
              </div>
              <div className="mt-2 text-slate-400 font-mono text-[11px]">
                Recommended Resolution: <span className="text-white font-bold">{discrepancyDossier.actionRecommended}</span>
              </div>
            </div>
          )}

          {/* Supervisor Sign-Off & Verification Block */}
          <div className="border border-white/10 rounded-xl p-4 bg-[#070b16] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="sign-check"
                checked={isSigned}
                onChange={(e) => setIsSigned(e.target.checked)}
                className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500/50"
              />
              <label htmlFor="sign-check" className="text-xs text-slate-300 select-none cursor-pointer">
                I hereby certify that this physical inventory condition was captured at point-of-receipt in accordance with receiving SOP-04.
              </label>
            </div>

            <div className="font-mono text-xs text-right shrink-0">
              <div className="text-slate-400 text-[10px]">VERIFIED LEAD:</div>
              <div className="text-cyan-300 font-bold">{supervisorName}</div>
              <div className="text-[10px] text-slate-500">{isSigned ? 'Digitally Signed & Locked' : 'Pending Signature'}</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
