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
  DollarSign, 
  Barcode, 
  Layers, 
  Palette, 
  Box,
  Scale,
  Sparkles,
  Info
} from 'lucide-react';

interface InspectionResultsProps {
  record: InspectionRecord;
  onRequestSecondaryCapture: () => void;
  onOpenDossier: () => void;
  onViewArchitecture?: () => void;
}

export const InspectionResults: React.FC<InspectionResultsProps> = ({
  record,
  onRequestSecondaryCapture,
  onOpenDossier,
  onViewArchitecture,
}) => {
  const { decision, skuCheck, quantityCheck, variantCheck, damageCheck, evidentialCertainty, discrepancyDossier } = record;

  // Master Decision Colors & Status Text
  let bannerBg = 'bg-gradient-to-r from-emerald-950/80 via-[#0a1f18]/90 to-[#081512] border-emerald-500/50 text-emerald-200 glow-emerald';
  let bannerIcon = <ShieldCheck className="h-8 w-8 text-emerald-400 shrink-0" />;
  let decisionBadgeBg = 'bg-emerald-500 text-slate-950 font-black';
  let decisionTitle = 'ACCEPT SHIPMENT';
  let decisionSubtitle = 'All inbound SKU identity, quantity, and packaging parameters fully verified against PO manifest.';

  if (decision === 'EXCEPTION') {
    bannerBg = 'bg-gradient-to-r from-rose-950/80 via-[#260e16]/90 to-[#18090d] border-rose-500/50 text-rose-200 glow-rose';
    bannerIcon = <ShieldAlert className="h-8 w-8 text-rose-400 shrink-0" />;
    decisionBadgeBg = 'bg-rose-500 text-slate-950 font-black';
    decisionTitle = 'SHIPMENT EXCEPTION';
    decisionSubtitle = 'Definitive variance or structural defects detected. Quarantine stock and initiate supplier claim.';
  } else if (decision === 'UNCERTAIN') {
    bannerBg = 'bg-gradient-to-r from-amber-950/80 via-[#2a1b0c]/90 to-[#191107] border-amber-500/50 text-amber-200 glow-amber';
    bannerIcon = <HelpCircle className="h-8 w-8 text-amber-400 shrink-0" />;
    decisionBadgeBg = 'bg-amber-500 text-slate-950 font-black';
    decisionTitle = 'DECISION UNCERTAIN';
    decisionSubtitle = 'Visual evidence SNR does not satisfy 70% threshold. Per policy, decision is not forced.';
  }

  const renderVerdictBadge = (verdict: Verdict) => {
    if (verdict === 'PASS') {
      return (
        <span className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold text-xs bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-500/30">
          <CheckCircle2 className="h-3.5 w-3.5" /> PASS
        </span>
      );
    }
    if (verdict === 'FAIL') {
      return (
        <span className="flex items-center gap-1.5 text-rose-400 font-mono font-bold text-xs bg-rose-950/50 px-2 py-0.5 rounded-md border border-rose-500/30">
          <AlertTriangle className="h-3.5 w-3.5" /> FAIL
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 text-amber-400 font-mono font-bold text-xs bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-500/30">
        <HelpCircle className="h-3.5 w-3.5" /> UNCERTAIN
      </span>
    );
  };

  return (
    <div className="space-y-4">
      
      {/* 1. Master Disposition Banner */}
      <div className={`border rounded-2xl p-4.5 transition-all shadow-xl ${bannerBg}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          <div className="flex items-center gap-3.5">
            <div className="p-2 rounded-xl bg-black/30 border border-white/10 shrink-0">
              {bannerIcon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black font-sans tracking-tight text-white uppercase">
                  {decisionTitle}
                </span>
                <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full uppercase tracking-wider ${decisionBadgeBg}`}>
                  {decision}
                </span>
              </div>
              <div className="text-xs text-slate-300 mt-1 font-sans">
                {decisionSubtitle}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0 flex-wrap">
            {onViewArchitecture && (
              <button
                onClick={onViewArchitecture}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-950/60 hover:bg-violet-900/60 text-violet-300 border border-violet-500/30 text-xs font-mono transition-all"
                title="Inspect multi-stage agent pipeline and decision algorithms"
              >
                <span>Pipeline Logic</span>
              </button>
            )}
            {decision === 'UNCERTAIN' ? (
              <button
                onClick={onRequestSecondaryCapture}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs shadow-lg transition-transform active:scale-95"
              >
                <Camera className="h-4 w-4" />
                <span>Simulate 2nd Capture</span>
              </button>
            ) : (
              <button
                onClick={onOpenDossier}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-500/40 font-semibold text-xs shadow-md transition-all hover:border-cyan-400 group"
              >
                <span>Audit Dossier</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            )}
          </div>

        </div>

        {/* Claim / Financial Impact Strip if Exception */}
        {decision === 'EXCEPTION' && discrepancyDossier.financialDiscrepancyAmount > 0 && (
          <div className="mt-3.5 pt-3.5 border-t border-rose-500/20 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 font-mono text-rose-300">
              <DollarSign className="h-4 w-4 text-rose-400" />
              <span>Calculated Discrepancy Debit:</span>
              <span className="font-black text-white text-base">
                ${discrepancyDossier.financialDiscrepancyAmount.toFixed(2)}
              </span>
              <span className="text-slate-400 text-[11px]">({discrepancyDossier.claimCode})</span>
            </div>
            <div className="font-mono text-[11px] text-slate-300">
              Recommended Protocol: <span className="text-rose-400 font-bold">{discrepancyDossier.actionRecommended.replace(/_/g, ' ')}</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. Four Dimensional Check Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-200">
        
        {/* Dimension 1: SKU Identity Check */}
        <div className={`p-4 rounded-xl border transition-all ${
          skuCheck.verdict === 'PASS' 
            ? 'glass-panel-subtle border-white/10' 
            : skuCheck.verdict === 'FAIL' 
            ? 'bg-rose-950/30 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.15)]' 
            : 'bg-amber-950/30 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
        }`}>
          <div className="flex items-center justify-between pb-2.5 border-b border-white/5 mb-2.5">
            <div className="flex items-center gap-2">
              <Barcode className="h-4 w-4 text-sky-400" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                1. Product / SKU Identity
              </span>
            </div>
            {renderVerdictBadge(skuCheck.verdict)}
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center font-mono">
              <span className="text-slate-400">PO Expected:</span>
              <span className="text-slate-200 font-semibold">{skuCheck.expected}</span>
            </div>
            <div className="flex justify-between items-center font-mono">
              <span className="text-slate-400">Optical Decoded:</span>
              <span className={skuCheck.verdict === 'FAIL' ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                {skuCheck.observed}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 pt-1.5 border-t border-white/5 leading-relaxed">
              {skuCheck.explanation}
            </div>
          </div>
        </div>

        {/* Dimension 2: Quantity Reconciliation */}
        <div className={`p-4 rounded-xl border transition-all ${
          quantityCheck.verdict === 'PASS' 
            ? 'glass-panel-subtle border-white/10' 
            : quantityCheck.verdict === 'FAIL' 
            ? 'bg-rose-950/30 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.15)]' 
            : 'bg-amber-950/30 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
        }`}>
          <div className="flex items-center justify-between pb-2.5 border-b border-white/5 mb-2.5">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-emerald-400" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                2. Quantity Reconciliation
              </span>
            </div>
            {renderVerdictBadge(quantityCheck.verdict)}
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center font-mono">
              <span className="text-slate-400">Expected vs Count:</span>
              <span className="text-slate-200 font-semibold">
                {quantityCheck.expected} vs{' '}
                <span className={quantityCheck.verdict === 'FAIL' ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
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
              <span>Carton Breakdown:</span>
              <span className="text-slate-300">
                {quantityCheck.cartonsObserved} ctn × {quantityCheck.unitsPerCartonObserved} u/ctn
              </span>
            </div>
            <div className="text-[11px] text-slate-400 pt-1.5 border-t border-white/5 leading-relaxed">
              {quantityCheck.explanation}
            </div>
          </div>
        </div>

        {/* Dimension 3: Variant & Attribute Check */}
        <div className={`p-4 rounded-xl border transition-all ${
          variantCheck.verdict === 'PASS' 
            ? 'glass-panel-subtle border-white/10' 
            : variantCheck.verdict === 'FAIL' 
            ? 'bg-rose-950/30 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.15)]' 
            : 'bg-amber-950/30 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
        }`}>
          <div className="flex items-center justify-between pb-2.5 border-b border-white/5 mb-2.5">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4 text-purple-400" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                3. Variant &amp; Chromameter
              </span>
            </div>
            {renderVerdictBadge(variantCheck.verdict)}
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center font-mono">
              <span className="text-slate-400">PO Specified:</span>
              <span className="text-slate-200 font-semibold">{variantCheck.expected}</span>
            </div>
            <div className="flex justify-between items-center font-mono">
              <span className="text-slate-400">Observed Finish:</span>
              <span className={variantCheck.verdict === 'FAIL' ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                {variantCheck.observed}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 pt-1.5 border-t border-white/5 leading-relaxed">
              {variantCheck.explanation}
            </div>
          </div>
        </div>

        {/* Dimension 4: Damage & Structural Integrity Check */}
        <div className={`p-4 rounded-xl border transition-all ${
          damageCheck.verdict === 'PASS' 
            ? 'glass-panel-subtle border-white/10' 
            : damageCheck.verdict === 'FAIL' 
            ? 'bg-rose-950/30 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.15)]' 
            : 'bg-amber-950/30 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
        }`}>
          <div className="flex items-center justify-between pb-2.5 border-b border-white/5 mb-2.5">
            <div className="flex items-center gap-2">
              <Box className="h-4 w-4 text-amber-400" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-200">
                4. ASTM D642 Integrity
              </span>
            </div>
            {renderVerdictBadge(damageCheck.verdict)}
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center font-mono">
              <span className="text-slate-400">Integrity State:</span>
              <span className={damageCheck.verdict === 'FAIL' ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                {damageCheck.observed}
              </span>
            </div>
            <div className="flex justify-between items-center font-mono text-[11px] text-slate-400">
              <span>Defects Logged:</span>
              <span className="text-slate-300 font-medium">{damageCheck.defects.length} defect item(s)</span>
            </div>
            <div className="text-[11px] text-slate-400 pt-1.5 border-t border-white/5 leading-relaxed">
              {damageCheck.explanation}
            </div>
          </div>
        </div>

      </div>

      {/* 3. Evidential Certainty & Non-Forced Decision Governance */}
      <div className="glass-panel rounded-2xl p-4 text-slate-200 shadow-xl border border-white/10">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Scale className="h-3.5 w-3.5" />
            </div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
              Evidential Certainty &amp; Anti-Hallucination Guardrail
            </h3>
          </div>
          <div className="font-mono text-xs">
            <span className="text-slate-400">Certainty Score Ce: </span>
            <span className={`font-black text-sm ${evidentialCertainty.score >= evidentialCertainty.threshold ? 'text-emerald-400' : 'text-amber-400'}`}>
              {(evidentialCertainty.score * 100).toFixed(0)}%
            </span>
            <span className="text-slate-500 text-[11px]"> / 70% Cutoff</span>
          </div>
        </div>

        {/* Confidence Bar */}
        <div className="w-full bg-[#080d1a] h-3 rounded-full overflow-hidden relative mb-3 border border-white/10 shadow-inner">
          <div 
            style={{ width: `${Math.min(100, evidentialCertainty.score * 100)}%` }}
            className={`h-full transition-all duration-500 ${
              evidentialCertainty.score >= evidentialCertainty.threshold
                ? 'bg-gradient-to-r from-emerald-600 to-teal-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                : 'bg-gradient-to-r from-amber-600 to-orange-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
            }`}
          />
          {/* Threshold Pin marker at 70% */}
          <div 
            style={{ left: '70%' }} 
            className="absolute top-0 bottom-0 w-0.5 bg-rose-400 shadow-sm z-10" 
            title="Operational Certainty Threshold (70%)"
          />
        </div>

        {/* Directed Secondary Capture Directive if Uncertain */}
        {!evidentialCertainty.isSufficient ? (
          <div className="bg-amber-950/40 border border-amber-500/40 rounded-xl p-3.5 text-xs text-amber-200 space-y-2.5">
            <div className="flex items-center gap-2 font-mono font-bold text-amber-300">
              <AlertTriangle className="h-4 w-4" />
              <span>DIRECTED SECONDARY CAPTURE PROTOCOL (UNCERTAIN DISPOSITION):</span>
            </div>
            <p className="text-slate-200 leading-relaxed">
              {evidentialCertainty.secondaryCaptureDirective}
            </p>
            {evidentialCertainty.missingEvidence && evidentialCertainty.missingEvidence.length > 0 && (
              <div className="text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">Degraded evidence parameters:</span>
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
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>Evidence quality satisfies contrast, illumination, and dimensional thresholds.</span>
            </span>
            <span className="font-mono text-emerald-400 text-[11px] font-semibold">ERP Ready</span>
          </div>
        )}
      </div>

    </div>
  );
};
