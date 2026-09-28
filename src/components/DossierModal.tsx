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
  Building
} from 'lucide-react';

interface DossierModalProps {
  record: InspectionRecord | null;
  onClose: () => void;
}

export const DossierModal: React.FC<DossierModalProps> = ({ record, onClose }) => {
  const [supervisorName, setSupervisorName] = useState('Alex Vance (Dock Lead)');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <FileText className="h-5 w-5 text-sky-400" />
            <div>
              <h2 className="font-mono text-sm font-bold text-slate-100 uppercase">
                Receiving Evidence Record &amp; Supplier Claim Dossier
              </h2>
              <div className="text-[11px] text-slate-400 font-mono">
                Audit Record ID: {record.id} · EDI 861 Receiving Advice Format
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadJson}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-emerald-400" />
              <span>Export JSON</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono transition-colors"
            >
              <Printer className="h-3.5 w-3.5 text-sky-400" />
              <span>Print Form</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors ml-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs bg-slate-900">
          
          {/* Document Header */}
          <div className="border border-slate-800 rounded-lg p-4 bg-slate-950/90 flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <div className="font-mono font-black text-base text-slate-100 tracking-tight">
                INBOUND RECEIVING DISCREPANCY REPORT
              </div>
              <div className="text-slate-400 text-xs mt-0.5">
                Warehouse Logistics Facility #04 · Receiving Dock Bay 07
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono mt-2">
                <span>Inspection Hash:</span>
                <span className="text-slate-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                  {discrepancyDossier.inspectionHash}
                </span>
              </div>
            </div>

            <div className="text-right sm:self-center">
              <div className="font-mono text-xs text-slate-400">DISPOSITION:</div>
              <div className={`font-mono text-base font-black px-3 py-1 rounded inline-block mt-0.5 ${
                decision === 'ACCEPT' ? 'bg-emerald-600 text-white' : decision === 'EXCEPTION' ? 'bg-rose-600 text-white' : 'bg-amber-600 text-white'
              }`}>
                {decision}
              </div>
            </div>
          </div>

          {/* PO & Carrier Meta Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-lg border border-slate-800">
            <div>
              <span className="text-slate-500 font-mono text-[10px] uppercase block">Purchase Order</span>
              <span className="font-mono font-bold text-slate-200">{po.poNumber}</span>
            </div>
            <div>
              <span className="text-slate-500 font-mono text-[10px] uppercase block">Supplier / Vendor</span>
              <span className="font-bold text-slate-200">{po.supplierName}</span>
              <span className="text-[10px] text-slate-400 block font-mono">({po.supplierId})</span>
            </div>
            <div>
              <span className="text-slate-500 font-mono text-[10px] uppercase block">Carrier &amp; Tracking</span>
              <span className="text-slate-200">{po.carrier}</span>
              <span className="text-[10px] text-slate-400 block font-mono">{po.trackingNumber}</span>
            </div>
            <div>
              <span className="text-slate-500 font-mono text-[10px] uppercase block">Receipt Date / Shift</span>
              <span className="text-slate-200">{po.deliveryDate}</span>
              <span className="text-[10px] text-slate-400 block font-mono">Shift A · Dock 07</span>
            </div>
          </div>

          {/* Reconciled Item Table */}
          <div className="border border-slate-800 rounded-lg overflow-hidden">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="p-3">SKU / ASIN</th>
                  <th className="p-3">Variant</th>
                  <th className="p-3 text-right">Expected</th>
                  <th className="p-3 text-right">Observed</th>
                  <th className="p-3 text-right">Delta (ΔQ)</th>
                  <th className="p-3 text-right">Unit Cost</th>
                  <th className="p-3 text-right">Claim Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-900/60">
                <tr>
                  <td className="p-3 font-bold text-slate-200">
                    <div>{po.sku}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{po.productName}</div>
                  </td>
                  <td className="p-3 text-slate-300">{po.variant}</td>
                  <td className="p-3 text-right text-slate-300">{po.expectedQuantity}</td>
                  <td className="p-3 text-right font-bold text-slate-100">{quantityCheck.observed}</td>
                  <td className={`p-3 text-right font-bold ${Number(quantityCheck.delta) < 0 ? 'text-rose-400' : Number(quantityCheck.delta) > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {Number(quantityCheck.delta) > 0 ? `+${quantityCheck.delta}` : quantityCheck.delta}
                  </td>
                  <td className="p-3 text-right text-slate-300">${po.unitCost.toFixed(2)}</td>
                  <td className="p-3 text-right font-bold text-rose-300">
                    ${discrepancyDossier.financialDiscrepancyAmount.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Dimension Audit Checks Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
              <span className="font-mono text-[11px] font-bold text-slate-300 uppercase block border-b border-slate-800 pb-1">
                Dimensional Check Summary
              </span>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-mono">1. SKU Identity Check:</span>
                <span className={`font-mono font-bold ${skuCheck.verdict === 'PASS' ? 'text-emerald-400' : 'text-rose-400'}`}>{skuCheck.verdict}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-mono">2. Quantity Check:</span>
                <span className={`font-mono font-bold ${quantityCheck.verdict === 'PASS' ? 'text-emerald-400' : 'text-rose-400'}`}>{quantityCheck.verdict}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-mono">3. Variant Specification:</span>
                <span className={`font-mono font-bold ${variantCheck.verdict === 'PASS' ? 'text-emerald-400' : 'text-rose-400'}`}>{variantCheck.verdict}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-mono">4. Structural Damage:</span>
                <span className={`font-mono font-bold ${damageCheck.verdict === 'PASS' ? 'text-emerald-400' : 'text-rose-400'}`}>{damageCheck.verdict}</span>
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
              <span className="font-mono text-[11px] font-bold text-slate-300 uppercase block border-b border-slate-800 pb-1">
                Actionable Claim Instructions
              </span>
              <div className="text-slate-300">
                <span className="font-mono text-slate-500 font-bold block mb-0.5">Recommended Disposition:</span>
                <span className="font-mono text-emerald-400 font-semibold">{discrepancyDossier.actionRecommended.replace(/_/g, ' ')}</span>
              </div>
              <div className="text-slate-400 text-[11px] mt-1">
                {discrepancyDossier.summary}
              </div>
            </div>
          </div>

          {/* Photographic Evidence Gallery */}
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
            <span className="font-mono text-[11px] font-bold text-slate-300 uppercase block mb-3">
              Photographic Evidence Log ({images.length} Captures)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {images.map((img, i) => (
                <div key={i} className="border border-slate-800 rounded bg-slate-900 overflow-hidden">
                  <div className="h-28 overflow-hidden bg-black flex items-center justify-center">
                    <img src={img.dataUrl || img.url} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="p-2">
                    <div className="font-mono text-[10px] font-bold text-slate-200 truncate">{img.label}</div>
                    <div className="text-[9px] text-slate-500 font-mono">{img.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sign-off & Audit Chain */}
          <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-[11px] text-slate-500 font-mono">
              <div>Automated Agent: SYS-AGENT-VISION-01 (Inference verified)</div>
              <div>Timestamp: {discrepancyDossier.timestamp}</div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[10px] text-slate-500 font-mono uppercase">Dock Supervisor Sign-Off</div>
                <input
                  type="text"
                  value={supervisorName}
                  onChange={(e) => setSupervisorName(e.target.value)}
                  className="bg-slate-950 border border-slate-700 px-2.5 py-1 rounded text-xs font-mono text-slate-200"
                />
              </div>

              <button
                onClick={() => setIsSigned(!isSigned)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-mono text-xs font-bold transition-colors ${
                  isSigned
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                <Check className="h-3.5 w-3.5" />
                <span>{isSigned ? 'SIGNED & LOCKED' : 'SIGN DOSSIER'}</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
