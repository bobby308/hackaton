import React, { useState } from 'react';
import { InspectionRecord } from '../types/receiving';
import { 
  Cpu, 
  GitBranch, 
  FileCode, 
  Binary, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  Layers, 
  Activity, 
  ShieldCheck, 
  Terminal, 
  Copy, 
  Check, 
  Sparkles, 
  Workflow
} from 'lucide-react';

interface ArchitectureStudioProps {
  currentRecord: InspectionRecord | null;
}

export const ArchitectureStudio: React.FC<ArchitectureStudioProps> = ({ currentRecord }) => {
  const [selectedPipelineStage, setSelectedPipelineStage] = useState<number>(4);
  const [selectedCodeTab, setSelectedCodeTab] = useState<'uncertainty' | 'reconciliation' | 'defects' | 'disposition'>('uncertainty');
  const [copiedCode, setCopiedCode] = useState(false);

  const pipelineStages = [
    {
      num: 1,
      name: 'Manifest Ingestion',
      subtitle: 'Document Parsing & Spec Vector',
      color: 'text-sky-400',
      border: 'border-sky-500/50',
      bg: 'bg-sky-500/10',
      glow: 'shadow-[0_0_20px_rgba(14,165,233,0.2)]',
      description: 'Ingests electronic Purchase Order (EDI 850), extracts SKU/ASIN, expected quantity, carton packaging hierarchy (Cartons × Units/Carton), dimensional tolerances, and sub-assembly Bill of Materials (BOM) checklist.',
      mathEquation: 'PO = ⟨SKU, Q_exp, N_c, U_c, Variant, BOM, τ_tol⟩',
      inputs: 'PO Number, Supplier Master Data, Catalog Specs',
      outputs: 'Normalized Inbound Target Vector T',
      edgeCases: 'Handles unit-of-measure conversions (e.g. dozens to eaches), catalog alias mapping, and tolerance percentages.'
    },
    {
      num: 2,
      name: 'Vision Decomposition',
      subtitle: 'Multimodal Feature Extraction',
      color: 'text-emerald-400',
      border: 'border-emerald-500/50',
      bg: 'bg-emerald-500/10',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.2)]',
      description: 'Executes parallel multimodal vision pipelines on inbound carton photographs: OCR & Code-128/EAN-13 barcode decoding, cell divider unit grid count detection, colorimetric delta-E variant classification, and corrugated flute defect localization.',
      mathEquation: 'F_vis = { D_barcode, Q_obs, C_color, BBox_defects }',
      inputs: 'Inbound Carton Photos (Exterior, Label, Opened Grid, Product Detail)',
      outputs: 'Observed Feature Vector O + Defect Heatmap Bounding Boxes',
      edgeCases: 'Compensates for lens distortion, low warehouse ambient lux, and perspective skew via homographic rectification.'
    },
    {
      num: 3,
      name: 'Discrepancy Engine',
      subtitle: 'Cross-Reference & Tolerance Delta',
      color: 'text-purple-400',
      border: 'border-purple-500/50',
      bg: 'bg-purple-500/10',
      glow: 'shadow-[0_0_20px_rgba(168,85,247,0.2)]',
      description: 'Reconciles observed features O against expected target T. Computes quantity delta ΔQ = Q_obs - Q_exp, validates SKU string identity, and audits sub-component BOM completeness.',
      mathEquation: 'ΔQ = Q_obs - Q_exp,  Score_SKU = 1 - [Lev(SKU_exp, SKU_obs) / max(|SKU|)]',
      inputs: 'Target T, Observed O',
      outputs: 'Dimension Check Verdicts: SKU, Quantity, Variant, Packaging Integrity',
      edgeCases: 'Differentiates permissible packaging variations from unauthorized variant substitutions (e.g., color shift vs wrong model).'
    },
    {
      num: 4,
      name: 'Evidential Certainty',
      subtitle: 'Anti-Hallucination & Non-Forced Guardrail',
      color: 'text-amber-400',
      border: 'border-amber-500/50',
      bg: 'bg-amber-500/10',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.2)]',
      description: 'CORE INNOVATION: Evaluates whether available visual evidence is scientifically sufficient to render a definitive decision. If certainty falls below threshold τ_cert = 0.70, forces verdict to UNCERTAIN rather than guessing, and generates directed capture directives.',
      mathEquation: 'C_e = ⁴√(S_OCR × S_Lux × S_θ × (1 - O_c)) ≥ τ_cert (0.70)',
      inputs: 'Barcode SNR, Illumination Uniformity, Camera Orthogonality, Occlusion Ratio',
      outputs: 'Certainty Score C_e ∈ [0, 1], Insufficiency Flags, Secondary Capture Directive',
      edgeCases: 'Prevents false passes on crushed corners hidden in shadow or barcodes degraded by specular warehouse glare.'
    },
    {
      num: 5,
      name: 'Disposition Synthesis',
      subtitle: 'Decision Machine & Claim Dossier',
      color: 'text-rose-400',
      border: 'border-rose-500/50',
      bg: 'bg-rose-500/10',
      glow: 'shadow-[0_0_20px_rgba(244,63,94,0.2)]',
      description: 'Synthesizes final tri-state disposition: ACCEPT (Put-away), EXCEPTION (Quarantine/RMA), or UNCERTAIN (Hold for Re-capture). Generates audit-ready evidence package, cryptographic hash, and EDI 861 supplier debit memo.',
      mathEquation: 'Decision = UNCERTAIN if C_e < 0.70 ∨ ∃ Check=UNCERTAIN; EXCEPTION if ∃ Check=FAIL; else ACCEPT',
      inputs: 'All Dimension Verdicts + Certainty Score',
      outputs: 'Final Disposition, Discrepancy Amount ($), Cryptographic Audit Hash, EDI 861 Payload',
      edgeCases: 'Calculates exact financial liability (shortage delta × unit cost vs full carton replacement).'
    }
  ];

  const codeSnippets = {
    uncertainty: `// File: evidentialCertaintyEvaluator.ts
// Mathematical formulation of Evidential Certainty Guardrail
// PREVENTS FORCED DECISIONS WHEN EVIDENCE IS INSUFFICIENT

export interface EvidenceMetrics {
  barcodeOcrConfidence: number;  // 0.0 to 1.0 (SNR & check digit validation)
  illuminationLuxScore: number;  // 0.0 to 1.0 (evaluates specular glare / shadows)
  cameraOrthogonality: number;   // 0.0 to 1.0 (penalizes oblique angles >30 deg)
  occlusionRatio: number;        // 0.0 to 1.0 (percentage of carton face blocked)
}

export const CERTAINTY_THRESHOLD = 0.70; // Hard operational threshold

export function evaluateEvidentialCertainty(metrics: EvidenceMetrics): {
  certaintyScore: number;
  isSufficient: boolean;
  missingEvidence: string[];
  secondaryCaptureDirective: string;
} {
  // Geometric mean penalizes any single severely degraded dimension
  const rawScore = Math.pow(
    Math.max(0.01, metrics.barcodeOcrConfidence) *
    Math.max(0.01, metrics.illuminationLuxScore) *
    Math.max(0.01, metrics.cameraOrthogonality) *
    Math.max(0.01, 1 - metrics.occlusionRatio),
    0.25
  );

  const isSufficient = rawScore >= CERTAINTY_THRESHOLD;
  const missingEvidence: string[] = [];
  let secondaryDirective = "Visual evidence is sufficient for dock disposition.";

  if (!isSufficient) {
    if (metrics.barcodeOcrConfidence < 0.70) {
      missingEvidence.push("Shipping label barcode OCR confidence below decode threshold.");
    }
    if (metrics.illuminationLuxScore < 0.65) {
      missingEvidence.push("Severe specular glare or excessive underexposure detected.");
    }
    if (metrics.cameraOrthogonality < 0.60) {
      missingEvidence.push("Oblique perspective distortion (>35° angle) impedes corner evaluation.");
    }
    if (metrics.occlusionRatio > 0.15) {
      missingEvidence.push("Partial obstruction (>15%) over carton structural flutes.");
    }

    // Generate directed, actionable instructions for warehouse operator
    secondaryDirective = "DO NOT FORCE DECISION. Hold carton in Staging Bay. " +
      "Re-photograph carton with flash enabled at perpendicular angle (0-15° tilt) " +
      "focusing on the shipping label barcode block.";
  }

  return {
    certaintyScore: Number(rawScore.toFixed(3)),
    isSufficient,
    missingEvidence,
    secondaryCaptureDirective: secondaryDirective
  };
}`,

    reconciliation: `// File: quantityReconciliation.ts
// Algorithmic physical count reconciliation against purchase order

export interface QuantityReconciliationInput {
  expectedUnits: number;
  cartonsExpected: number;
  unitsPerCarton: number;
  observedUnits: number;
  observedCartons: number;
  tolerancePct: number; // e.g. 0.0 for zero-tolerance
}

export function reconcileQuantity(input: QuantityReconciliationInput) {
  const delta = input.observedUnits - input.expectedUnits;
  const allowableDeviation = Math.floor(input.expectedUnits * (input.tolerancePct / 100));

  let verdict: 'PASS' | 'FAIL' = 'PASS';
  let defectType: 'EXACT_MATCH' | 'SHORTAGE' | 'OVERAGE' = 'EXACT_MATCH';
  let explanation = \`Received \${input.observedUnits} of \${input.expectedUnits} ordered units.\`;

  if (delta < -allowableDeviation) {
    verdict = 'FAIL';
    defectType = 'SHORTAGE';
    explanation = \`Short shipment: Received \${input.observedUnits} units vs \${input.expectedUnits} ordered (Deficit: \${Math.abs(delta)} units).\`;
  } else if (delta > allowableDeviation) {
    verdict = 'FAIL';
    defectType = 'OVERAGE';
    explanation = \`Inventory overage: Received \${input.observedUnits} units vs \${input.expectedUnits} ordered (Surplus: +\${delta} units).\`;
  }

  // Carton packaging factor verification
  const expectedTotalCalculated = input.cartonsExpected * input.unitsPerCarton;
  const packagingCongruent = expectedTotalCalculated === input.expectedUnits;

  return {
    verdict,
    defectType,
    delta,
    packagingCongruent,
    explanation,
    confidence: 0.98
  };
}`,

    defects: `// File: defectTriageEngine.ts
// Structural and cosmetic defect classifier with ASTM D642 classification

export type DefectSeverity = 'CRITICAL' | 'MAJOR' | 'MINOR';

export interface RawDefectObservation {
  type: 'crushing' | 'water_damage' | 'tear' | 'puncture' | 'tape_tampered' | 'missing_component';
  deflectionMm?: number;
  stainedAreaPct?: number;
  tearLengthCm?: number;
  missingBomItemCount?: number;
}

export function triageDefect(obs: RawDefectObservation): { severity: DefectSeverity; claimImpact: string } {
  switch (obs.type) {
    case 'crushing':
      // ASTM D642 Compression Failure Threshold (>45mm deflection = structural failure)
      if ((obs.deflectionMm ?? 50) > 45) {
        return { severity: 'CRITICAL', claimImpact: 'Reject master carton; contents damaged' };
      }
      return { severity: 'MAJOR', claimImpact: 'Quarantine and perform 100% unit inspection' };

    case 'water_damage':
      // Capillary absorption threshold
      if ((obs.stainedAreaPct ?? 40) > 25) {
        return { severity: 'CRITICAL', claimImpact: 'Reject carton; moisture ingress / mold risk' };
      }
      return { severity: 'MAJOR', claimImpact: 'Repackage into fresh corrugated carton' };

    case 'missing_component':
      return { severity: 'CRITICAL', claimImpact: 'Sub-assembly incomplete; issue supplier RMA' };

    case 'tear':
    case 'puncture':
      if ((obs.tearLengthCm ?? 15) > 10) {
        return { severity: 'MAJOR', claimImpact: 'Barrier breached; inspect for missing items' };
      }
      return { severity: 'MINOR', claimImpact: 'Accept with tape reinforcement' };

    default:
      return { severity: 'MINOR', claimImpact: 'Log remark in ERP put-away' };
  }
}`,

    disposition: `// File: dispositionSynthesizer.ts
// Tri-state disposition synthesizer & claim ledger generator

export function synthesizeDisposition(checks: {
  sku: 'PASS' | 'FAIL' | 'UNCERTAIN';
  quantity: 'PASS' | 'FAIL' | 'UNCERTAIN';
  variant: 'PASS' | 'FAIL' | 'UNCERTAIN';
  damage: 'PASS' | 'FAIL' | 'UNCERTAIN';
  certaintyScore: number;
  unitCost: number;
  quantityDelta: number;
}) {
  // RULE 1: Never force a decision when confidence is below 0.70
  if (checks.certaintyScore < 0.70 || 
      checks.sku === 'UNCERTAIN' || 
      checks.quantity === 'UNCERTAIN' || 
      checks.damage === 'UNCERTAIN') {
    return {
      decision: 'UNCERTAIN',
      action: 'REQUEST_SECONDARY_PHOTOS',
      claimAmount: 0,
      summary: 'Visual evidence threshold not met. Decision held.'
    };
  }

  // RULE 2: Any failure generates an actionable EXCEPTION
  if (checks.sku === 'FAIL' || checks.quantity === 'FAIL' || checks.variant === 'FAIL' || checks.damage === 'FAIL') {
    let claimAmount = 0;
    if (checks.quantityDelta < 0) {
      claimAmount += Math.abs(checks.quantityDelta) * checks.unitCost;
    }
    if (checks.damage === 'FAIL') {
      claimAmount += checks.unitCost * 24; // Master carton value
    }

    return {
      decision: 'EXCEPTION',
      action: 'QUARANTINE_AND_RMA',
      claimAmount,
      summary: 'Non-conformance detected. Issued supplier debit memo.'
    };
  }

  // RULE 3: 100% concordance
  return {
    decision: 'ACCEPT',
    action: 'RECEIVE_INTO_INVENTORY',
    claimAmount: 0,
    summary: 'Full concordance across all parameters. Approved for put-away.'
  };
}`
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippets[selectedCodeTab]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const activeStage = pipelineStages.find(s => s.num === selectedPipelineStage) || pipelineStages[3];

  return (
    <div className="space-y-5 text-slate-200">
      
      {/* Studio Header */}
      <div className="glass-panel rounded-2xl p-5 shadow-xl border border-white/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/30 text-violet-400 shrink-0">
              <Cpu className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold font-sans tracking-tight text-white uppercase">
                  Agent Architecture, Mathematical Models &amp; Logic
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-950/80 text-violet-300 border border-violet-500/30 font-bold">
                  PIPELINE v2.5
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
                Autonomous 5-stage multimodal receiving agent: electronic manifest parsing, multimodal feature extraction, cross-referencing discrepancy logic, geometric evidential certainty guardrail, and tri-state disposition synthesis.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 font-mono text-xs self-start md:self-center shrink-0">
            <div className="px-3 py-1.5 rounded-xl bg-[#080d19] border border-cyan-500/30 text-cyan-300 font-semibold shadow-inner flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>GEMINI 3.8 FLASH VISION + DETERMINISTIC LOGIC</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive 5-Stage Agent Pipeline Diagram */}
      <div className="glass-panel rounded-2xl p-5 shadow-xl border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <GitBranch className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                5-Stage Inbound Receiving Pipeline Flow
              </h3>
              <div className="text-[11px] text-slate-400">
                Click any pipeline stage to inspect mathematical formulation, I/O schemas, and edge case resilience.
              </div>
            </div>
          </div>
        </div>

        {/* Pipeline Stepper Nodes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {pipelineStages.map((stage) => {
            const isSelected = stage.num === selectedPipelineStage;
            return (
              <button
                key={stage.num}
                onClick={() => setSelectedPipelineStage(stage.num)}
                className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden group ${
                  isSelected
                    ? `${stage.bg} ${stage.border} ${stage.glow} text-white`
                    : 'bg-[#090e1a]/80 border-white/5 hover:border-white/20 text-slate-300 hover:bg-[#0e1628]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-md ${stage.bg} ${stage.color} border border-white/10`}>
                    STAGE 0{stage.num}
                  </span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform" />
                </div>
                <div className="font-bold text-xs text-white truncate font-sans">
                  {stage.name}
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5 font-mono">
                  {stage.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Deep-Dive Card */}
        <div className="mt-4 p-4.5 rounded-xl bg-[#070b16] border border-white/10 shadow-inner">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-white/5 mb-3.5">
            <div className="flex items-center gap-2.5">
              <span className={`font-mono text-sm font-bold ${activeStage.color}`}>
                Stage {activeStage.num}: {activeStage.name}
              </span>
              <span className="text-slate-600" aria-hidden="true">·</span>
              <span className="text-xs text-slate-300 font-medium">{activeStage.subtitle}</span>
            </div>
            
            <div className="text-xs font-mono text-slate-300 bg-[#0c1222] px-3 py-1.5 rounded-lg border border-cyan-500/30">
              Formula: <span className="text-cyan-300 font-semibold">{activeStage.mathEquation}</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-4 font-sans">
            {activeStage.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-[#0b101e]/80 rounded-xl p-3.5 border border-white/5">
            <div>
              <span className="font-mono text-[10px] text-cyan-400 uppercase font-bold block mb-1">
                Input Data Contract:
              </span>
              <span className="text-slate-300 font-mono text-[11px]">{activeStage.inputs}</span>
            </div>
            <div>
              <span className="font-mono text-[10px] text-emerald-400 uppercase font-bold block mb-1">
                Output Vectors &amp; Artifacts:
              </span>
              <span className="text-slate-300 font-mono text-[11px]">{activeStage.outputs}</span>
            </div>
            <div>
              <span className="font-mono text-[10px] text-amber-400 uppercase font-bold block mb-1">
                Edge-Case &amp; Ambiguity Handling:
              </span>
              <span className="text-slate-300 font-sans text-[11px] leading-relaxed">{activeStage.edgeCases}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Code Logic & Algorithms Deep Dive */}
      <div className="glass-panel rounded-2xl p-5 shadow-xl border border-white/10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-1 rounded-md bg-sky-500/10 border border-sky-500/30 text-sky-400">
              <Terminal className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                Core Algorithmic Code Logic (Production TypeScript)
              </h3>
              <div className="text-[11px] text-slate-400">
                Executable deterministic routines powering the receiving manager
              </div>
            </div>
          </div>
          
          {/* Tab Selector & Copy Button */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-[#080d19] p-1 rounded-xl border border-white/5">
              <button
                onClick={() => setSelectedCodeTab('uncertainty')}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
                  selectedCodeTab === 'uncertainty' ? 'bg-amber-950/80 text-amber-300 border border-amber-500/40 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                evidentialCertainty.ts
              </button>
              <button
                onClick={() => setSelectedCodeTab('reconciliation')}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
                  selectedCodeTab === 'reconciliation' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                quantityReconciliation.ts
              </button>
              <button
                onClick={() => setSelectedCodeTab('defects')}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
                  selectedCodeTab === 'defects' ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                defectTriage.ts
              </button>
              <button
                onClick={() => setSelectedCodeTab('disposition')}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all ${
                  selectedCodeTab === 'disposition' ? 'bg-blue-950/80 text-blue-300 border border-blue-500/40 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                dispositionSynthesizer.ts
              </button>
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono transition-colors border border-white/10"
              title="Copy code snippet"
            >
              {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
              <span>{copiedCode ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Code Terminal Box with macOS/Linux dots */}
        <div className="rounded-xl overflow-hidden border border-white/10 bg-[#050811] shadow-2xl">
          <div className="flex items-center justify-between px-4 py-2 bg-[#090d18] border-b border-white/5 text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 text-slate-300 font-semibold">{selectedCodeTab}.ts</span>
            </div>
            <span className="text-[10px] text-slate-500">TypeScript 5.x · Strict Mode</span>
          </div>
          <div className="p-4 font-mono text-xs overflow-x-auto max-h-[400px] leading-relaxed text-slate-300 selection:bg-cyan-500/30">
            <pre>{codeSnippets[selectedCodeTab]}</pre>
          </div>
        </div>
      </div>

      {/* Real-Time Telemetry & Execution Trace of Current Inspection */}
      {currentRecord && (
        <div className="glass-panel rounded-2xl p-5 shadow-xl border border-white/10">
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2.5">
              <div className="p-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <Activity className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                Live Execution Trace &amp; Agent Latency Profile
              </h3>
            </div>
            <div className="text-xs font-mono text-slate-400">
              Total End-to-End Pipeline: <span className="text-emerald-400 font-bold">{currentRecord.executionTimeMs} ms</span>
            </div>
          </div>

          <div className="space-y-2">
            {currentRecord.pipelineTrace.map((trace, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-[#070b16] border border-white/5 text-xs hover:border-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {trace.status === 'COMPLETED' ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  ) : trace.status === 'FLAGGED' ? (
                    <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
                  ) : (
                    <HelpCircle className="h-4 w-4 text-amber-400 shrink-0" />
                  )}
                  <div>
                    <span className="font-mono font-bold text-slate-200">{trace.stageName}</span>
                    <div className="text-[11px] text-slate-400 mt-0.5">{trace.outputSummary}</div>
                  </div>
                </div>

                <div className="text-right font-mono shrink-0 ml-3">
                  <span className="text-slate-400">{trace.durationMs} ms</span>
                  <div className={`text-[10px] font-bold ${
                    trace.status === 'COMPLETED' ? 'text-emerald-400' : trace.status === 'FLAGGED' ? 'text-rose-400' : 'text-amber-400'
                  }`}>
                    {trace.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
