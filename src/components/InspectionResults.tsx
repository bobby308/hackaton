import React from 'react';
import { InspectionRecord, Verdict } from '../types/receiving';
import { 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  ShieldCheck, 
  ShieldAlert, 
  Camera, 
  ArrowRight,
  TrendingDown,
  DollarSign,
  Barcode,
  Layers,
  Palette,
  Box
} from 'lucide-react';

interface InspectionResultsProps {
  record: InspectionRecord;
  onRequestSecondaryCapture: () => void;
  onOpenDossier: () => void;
}

export const InspectionResults: React.FC<InspectionResultsProps> = ({
  record,
  onRequestSecondaryCapture,
  onOpenDossier,
}) => {
  const { decision, skuCheck, quantityCheck, variantCheck, damageCheck, evidentialCertainty, discrepancyDossier } = record;

  // Master Decision Colors & Status Text
  let bannerBg = 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200';
  let bannerIcon = <ShieldCheck className="h-7 w-7 text-emerald-400 shrink-0" />;
  let decisionBadgeBg = 'bg-emerald-600 text-white';
  let decisionTitle = 'ACCEPT SHIPMENT';
  let decisionSubtitle = 'All inbound quality, SKU identity, and quantity parameters verified against PO.';

  if (decision === 'EXCEPTION') {
    bannerBg = 'bg-rose-950/60 border-rose-500/40 text-rose-200';
    bannerIcon = <ShieldAlert className="h-7 w-7 text-rose-400 shrink-0" />;
    decisionBadgeBg = 'bg-rose-600 text-white';
    decisionTitle = 'SHIPMENT EXCEPTION';
    decisionSubtitle = 'Definitive discrepancies or physical defects detected. Hold inventory and execute RMA protocol.';
  } else if (decision === 'UNCERTAIN') {
    bannerBg = 'bg-amber-950/60 border-amber-500/40 text-amber-200';
    bannerIcon = <HelpCircle className="h-7 w-7 text-amber-400 shrink-0" />;
    decisionBadgeBg = 'bg-amber-600 text-white';
    decisionTitle = 'DECISION UNCERTAIN';
    decisionSubtitle = 'Available visual evidence does not satisfy minimum confidence threshold. Do not force decision.';
  }

  const renderVerdictBadge = (verdict: Verdict) => {
    if (verdict === 'PASS') {
      return (
        <span className="flex items-center gap-1 text-emerald-400 font-mono font-bold text-xs">
          <CheckCircle2 className="h-3.5 w-3.5" /> PASS
        </span>
      );
    }
    if (verdict === 'FAIL') {
      return (
        <span className="flex items-center gap-1 text-rose-400 font-mono font-bold text-xs">
          <AlertTriangle className="h-3.5 w-3.5" /> FAIL
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-amber-400 font-mono font-bold text-xs">
        <HelpCircle className="h-3.5 w-3.5" /> UNCERTAIN
      </span>
    );
  };

  return (
    <div className="space-y-4">
      
      {/* 1. Master Disposition Banner */}
      <div className={`border rounded-lg p-4 transition-all shadow-lg ${bannerBg}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            {bannerIcon}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black font-mono tracking-tight text-white">
                  {decisionTitle}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${decisionBadgeBg}`}>
                  VERDICT: {decision}
                </span>
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                {decisionSubtitle}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {decision === 'UNCERTAIN' ? (
              <button
                onClick={onRequestSecondaryCapture}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
              >
                <Camera className="h-3.5 w-3.5" />
                <span>Execute Secondary Capture</span>
              </button>
            ) : (
              <button
                onClick={onOpenDossier}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-medium text-xs shadow-sm transition-colors"
              >
                <span>View Full Audit Dossier</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

        </div>

        {/* Claim / Financial Impact Strip if Exception */}
        {decision === 'EXCEPTION' && discrepancyDossier.financialDiscrepancyAmount > 0 && (
          <div className="mt-3 pt-3 border-t border-rose-500/20 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 font-mono text-rose-300">
              <DollarSign className="h-4 w-4" />
              <span>Estimated Discrepancy Claim:</span>
              <span className="font-bold text-white text-sm">
                ${discrepancyDossier.financialDiscrepancyAmount.toFixed(2)}
              </span>
              <span className="text-slate-400">({discrepancyDossier.claimCode})</span>
            </div>
            <div className="font-mono text-[11px] text-slate-300">
              Recommended Action: <span className="text-rose-400 font-bold">{discrepancyDossier.actionRecommended.replace(/_/g, ' ')}</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Four Dimensional Check Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-200">
        
        {/* Dimension 1: SKU Identity Check */}
        <div className={`p-3.5 rounded-lg border bg-slate-900 transition-all ${
          skuCheck.verdict === 'PASS' ? 'border-slate-800' : skuCheck.verdict === 'FAIL' ? 'border-rose-500/40 bg-rose-950/20' : 'border-amber-500/40 bg-amber-950/20'
        }`}>
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2.5">
            <div className="flex items-center gap-2">
              <Barcode className="h-4 w-4 text-sky-400" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
                1. Product / SKU Identity
              </span>
            </div>
            {renderVerdictBadge(skuCheck.verdict)}
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between items-center font-mono">
              <span className="text-slate-500">Expected SKU:</span>
              <span className="text-slate-200 font-bold">{skuCheck.expected}</span>
            </div>
            <div className="flex justify-between items-center font-mono">
              <span className="text-slate-500">Observed SKU:</span>
              <span className={skuCheck.verdict === 'FAIL' ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                {skuCheck.observed}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
              {skuCheck.explanation}
            </div>
          </div>
        </div>

        {/* Dimension 2: Quantity Reconciliation */}
        <div className={`p-3.5 rounded-lg border bg-slate-900 transition-all ${
          quantityCheck.verdict === 'PASS' ? 'border-slate-800' : quantityCheck.verdict === 'FAIL' ? 'border-rose-500/40 bg-rose-950/20' : 'border-amber-500/40 bg-amber-950/20'
        }`}>
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2.5">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-emerald-400" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
                2. Quantity Reconciliation
              </span>
            </div>
            {renderVerdictBadge(quantityCheck.verdict)}
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between items-center font-mono">
              <span className="text-slate-500">Expected vs Observed:</span>
              <span className="text-slate-200 font-bold">
                {quantityCheck.expected} vs{' '}
                <span className={quantityCheck.verdict === 'FAIL' ? 'text-rose-400' : 'text-emerald-400'}>
                  {quantityCheck.observed} units
                </span>
                {quantityCheck.delta !== 0 && (
                  <span className={`ml-1 text-[11px] font-bold ${Number(quantityCheck.delta) < 0 ? 'text-rose-400' : 'text-amber-400'}`}>
                    ({Number(quantityCheck.delta) > 0 ? `+${quantityCheck.delta}` : quantityCheck.delta})
                  </span>
                )}
              </span>
            </div>
            <div className="flex justify-between items-center font-mono text-[11px] text-slate-400">
              <span>Carton Pack Verification:</span>
              <span>
                {quantityCheck.cartonsObserved} ctn × {quantityCheck.unitsPerCartonObserved} u/ctn
              </span>
            </div>
            <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
              {quantityCheck.explanation}
            </div>
          </div>
        </div>

        {/* Dimension 3: Variant & Attribute Check */}
        <div className={`p-3.5 rounded-lg border bg-slate-900 transition-all ${
          variantCheck.verdict === 'PASS' ? 'border-slate-800' : variantCheck.verdict === 'FAIL' ? 'border-rose-500/40 bg-rose-950/20' : 'border-amber-500/40 bg-amber-950/20'
        }`}>
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2.5">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-purple-400" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
                3. Variant &amp; Specification
              </span>
            </div>
            {renderVerdictBadge(variantCheck.verdict)}
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between items-center font-mono">
              <span className="text-slate-500">Expected Variant:</span>
              <span className="text-slate-200 font-bold">{variantCheck.expected}</span>
            </div>
            <div className="flex justify-between items-center font-mono">
              <span className="text-slate-500">Observed Variant:</span>
              <span className={variantCheck.verdict === 'FAIL' ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                {variantCheck.observed}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
              {variantCheck.explanation}
            </div>
          </div>
        </div>

        {/* Dimension 4: Damage & Structural Integrity Check */}
        <div className={`p-3.5 rounded-lg border bg-slate-900 transition-all ${
          damageCheck.verdict === 'PASS' ? 'border-slate-800' : damageCheck.verdict === 'FAIL' ? 'border-rose-500/40 bg-rose-950/20' : 'border-amber-500/40 bg-amber-950/20'
        }`}>
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2.5">
            <div className="flex items-center gap-2">
              <Box className="h-4 w-4 text-amber-400" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-300">
                4. Damage &amp; Carton Integrity
              </span>
            </div>
            {renderVerdictBadge(damageCheck.verdict)}
          </div>

          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between items-center font-mono">
              <span className="text-slate-500">Integrity Status:</span>
              <span className={damageCheck.verdict === 'FAIL' ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                {damageCheck.observed}
              </span>
            </div>
            <div className="flex justify-between items-center font-mono text-[11px] text-slate-400">
              <span>Defects Logged:</span>
              <span>{damageCheck.defects.length} defect item(s)</span>
            </div>
            <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
              {damageCheck.explanation}
            </div>
          </div>
        </div>

      </div>

      {/* 3. Evidential Certainty & Non-Forced Decision Governance */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 text-slate-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-sky-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Evidential Certainty &amp; Anti-Hallucination Guardrail
            </h3>
          </div>
          <div className="font-mono text-xs">
            <span className="text-slate-400">Certainty Score: </span>
            <span className={`font-bold ${evidentialCertainty.score >= evidentialCertainty.threshold ? 'text-emerald-400' : 'text-amber-400'}`}>
              {(evidentialCertainty.score * 100).toFixed(0)}%
            </span>
            <span className="text-slate-500"> / Threshold: 70%</span>
          </div>
        </div>

        {/* Confidence Bar */}
        <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden relative mb-3 border border-slate-800">
          <div 
            style={{ width: `${Math.min(100, evidentialCertainty.score * 100)}%` }}
            className={`h-full transition-all duration-500 ${
              evidentialCertainty.score >= evidentialCertainty.threshold
                ? 'bg-emerald-500'
                : 'bg-amber-500'
            }`}
          />
          {/* Threshold Pin marker at 70% */}
          <div 
            style={{ left: '70%' }} 
            className="absolute top-0 bottom-0 w-0.5 bg-rose-400 shadow-sm" 
            title="Operational Certainty Threshold (70%)"
          />
        </div>

        {/* Directed Secondary Capture Directive if Uncertain */}
        {!evidentialCertainty.isSufficient ? (
          <div className="bg-amber-950/40 border border-amber-500/40 rounded p-3 text-xs text-amber-200 space-y-2">
            <div className="flex items-center gap-2 font-mono font-bold text-amber-300">
              <AlertTriangle className="h-4 w-4" />
              <span>DIRECTED OPERATOR CAPTURE DIRECTIVE (UNCERTAIN CASE):</span>
            </div>
            <p className="text-slate-300">
              {evidentialCertainty.secondaryCaptureDirective}
            </p>
            {evidentialCertainty.missingEvidence && evidentialCertainty.missingEvidence.length > 0 && (
              <div className="text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">Missing evidence parameters:</span>
                <ul className="list-disc pl-4 mt-1 space-y-0.5">
                  {evidentialCertainty.missingEvidence.map((ev, i) => (
                    <li key={i}>{ev}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="text-xs text-slate-400 flex items-center justify-between">
            <span>Visual evidence satisfies clarity, contrast, and unoccluded dimensional criteria.</span>
            <span className="font-mono text-emerald-400 text-[11px]">Sufficient for ERP Put-Away</span>
          </div>
        )}
      </div>

    </div>
  );
};
