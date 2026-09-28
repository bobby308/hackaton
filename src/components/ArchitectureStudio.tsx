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
  ArrowRight,
  Shield,
  Eye,
  Sliders,
  Terminal
} from 'lucide-react';

interface ArchitectureStudioProps {
  currentRecord: InspectionRecord | null;
}

export const ArchitectureStudio: React.FC<ArchitectureStudioProps> = ({ currentRecord }) => {
  const [selectedPipelineStage, setSelectedPipelineStage] = useState<number>(4);
  const [selectedCodeTab, setSelectedCodeTab] = useState<'uncertainty' | 'reconciliation' | 'defects' | 'disposition'>('uncertainty');

  const pipelineStages = [
    {
      num: 1,
      name: 'Manifest & PO Ingestion',
      subtitle: 'Document Parsing & Spec Normalization',
      color: 'text-sky-400',
      border: 'border-sky-500/40',
      bg: 'bg-sky-500/10',
      description: 'Ingests electronic Purchase Order (EDI 850), extracts SKU/ASIN, expected quantity, carton packaging hierarchy (Cartons × Units/Carton), dimensional tolerances, and sub-assembly Bill of Materials (BOM) checklist.',
      mathEquation: '\\mathcal{PO} = \\langle \\text{SKU}, Q_{\\text{exp}}, N_c, U_c, \\text{Variant}, \\text{BOM}, \\tau_{\\text{tol}} \\rangle',
      inputs: 'PO Number, Supplier Master Data, Catalog Specs',
      outputs: 'Normalized Inbound Target Vector \\(\\vec{T}\\)',
      edgeCases: 'Handles unit-of-measure conversions (e.g. dozens to eaches), catalog alias mapping, and tolerance percentages.'
    },
    {
      num: 2,
      name: 'Vision Decomposition',
      subtitle: 'Multimodal Feature Extraction',
      color: 'text-emerald-400',
      border: 'border-emerald-500/40',
      bg: 'bg-emerald-500/10',
      description: 'Executes parallel multimodal vision pipelines on inbound carton photographs: OCR & Code-128/EAN-13 barcode decoding, cell divider unit grid count detection, colorimetric delta-E variant classification, and corrugated flute defect localization.',
      mathEquation: '\\vec{F}_{\\text{vis}} = \\{ \\mathcal{D}_{\\text{barcode}}, Q_{\\text{obs}}, \\vec{C}_{\\text{color}}, \\text{BBox}_{\\text{defects}} \\}',
      inputs: 'Inbound Carton Photos (Exterior, Label, Opened Grid, Product Detail)',
      outputs: 'Observed Feature Vector \\(\\vec{O}\\) + Defect Heatmap Bounding Boxes',
      edgeCases: 'Compensates for lens distortion, low warehouse ambient lux, and perspective skew via homographic rectification.'
    },
    {
      num: 3,
      name: 'Discrepancy Engine',
      subtitle: 'Cross-Reference & Tolerance Delta',
      color: 'text-purple-400',
      border: 'border-purple-500/40',
      bg: 'bg-purple-500/10',
      description: 'Reconciles observed features \\(\\vec{O}\\) against expected target \\(\\vec{T}\\). Computes quantity delta \\(\\Delta Q = Q_{\\text{obs}} - Q_{\\text{exp}}\\), validates SKU string identity, and audits sub-component BOM completeness.',
      mathEquation: '\\Delta Q = Q_{\\text{obs}} - Q_{\\text{exp}}, \\quad \\text{Score}_{\\text{SKU}} = 1 - \\frac{\\text{Lev}(\\text{SKU}_{\\text{exp}}, \\text{SKU}_{\\text{obs}})}{\\max(|\\text{SKU}|)}',
      inputs: 'Target \\(\\vec{T}\\), Observed \\(\\vec{O}\\)',
      outputs: 'Dimension Check Verdicts: SKU, Quantity, Variant, Packaging Integrity',
      edgeCases: 'Differentiates permissible packaging variations from unauthorized variant substitutions (e.g., color shift vs wrong model).'
    },
    {
      num: 4,
      name: 'Evidential Certainty',
      subtitle: 'Anti-Hallucination & Non-Forced Guardrail',
      color: 'text-amber-400',
      border: 'border-amber-500/40',
      bg: 'bg-amber-500/10',
      description: 'CORE INNOVATION: Evaluates whether available visual evidence is scientifically sufficient to render a definitive decision. If certainty falls below threshold \\(\\tau_{\\text{cert}} = 0.70\\), forces verdict to UNCERTAIN rather than guessing, and generates directed capture directives.',
      mathEquation: 'C_e = \\sqrt[4]{S_{\\text{OCR}} \\times S_{\\text{Lux}} \\times S_{\\theta} \\times (1 - O_c)} \\ge \\tau_{\\text{cert}} \\quad (0.70)',
      inputs: 'Barcode SNR, Illumination Uniformity, Camera Orthogonality, Occlusion Ratio',
      outputs: 'Certainty Score \\(C_e \\in [0, 1]\\), Insufficiency Flags, Secondary Capture Directive',
      edgeCases: 'Prevents false passes on crushed corners hidden in shadow or barcodes degraded by specular warehouse glare.'
    },
    {
      num: 5,
      name: 'Disposition Synthesis',
      subtitle: 'Decision Machine & Claim Dossier',
      color: 'text-rose-400',
      border: 'border-rose-500/40',
      bg: 'bg-rose-500/10',
      description: 'Synthesizes final tri-state disposition: ACCEPT (Put-away), EXCEPTION (Quarantine/RMA), or UNCERTAIN (Hold for Re-capture). Generates audit-ready evidence package, cryptographic hash, and EDI 861 supplier debit memo.',
      mathEquation: '\\text{Decision} = \\begin{cases} \\text{UNCERTAIN} & \\text{if } C_e < 0.70 \\lor \\exists \\text{Check} = \\text{UNCERTAIN} \\\\ \\text{EXCEPTION} & \\text{if } \\exists \\text{Check} = \\text{FAIL} \\\\ \\text{ACCEPT} & \\text{if } \\forall \\text{Check} = \\text{PASS} \\end{cases}',
      inputs: 'All Dimension Verdicts + Certainty Score',
      outputs: 'Final Disposition, Discrepancy Amount (\\$), Cryptographic Audit Hash, EDI 861 Payload',
      edgeCases: 'Calculates exact financial liability (shortage delta \\(\\times\\) unit cost vs full carton replacement).'
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
// Structural and cosmetic defect classifier with bounding-box severity

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
// State machine that generates final dock verdict and financial claim memo

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

  const activeStage = pipelineStages.find(s => s.num === selectedPipelineStage) || pipelineStages[3];

  return (
    <div className="space-y-6 text-slate-200">
      
      {/* Studio Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-amber-400" />
              <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-100">
                Agent Architecture, Mathematical Models &amp; Pipeline Engine
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              Technical breakdown of the 5-stage multimodal receiving agent: manifest ingestion, computer vision decomposition, discrepancy reconciliation, evidential uncertainty quantification, and decision synthesis.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-emerald-400 font-bold">
              ENGINE: GEMINI 3.8 FLASH VISION + DETERMINISTIC INFERENCE
            </span>
          </div>
        </div>
      </div>

      {/* Interactive 5-Stage Agent Pipeline Diagram */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-emerald-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              5-Stage Receiving Agent Pipeline Flow
            </h3>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">
            Click any stage to inspect algorithm details
          </span>
        </div>

        {/* Pipeline Stepper Nodes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {pipelineStages.map((stage) => {
            const isSelected = stage.num === selectedPipelineStage;
            return (
              <button
                key={stage.num}
                onClick={() => setSelectedPipelineStage(stage.num)}
                className={`p-3 rounded border text-left transition-all relative ${
                  isSelected
                    ? `${stage.bg} ${stage.border} shadow-lg ring-1 ring-emerald-400/30`
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${stage.bg} ${stage.color}`}>
                    STAGE {stage.num}
                  </span>
                  <div className="h-2 w-2 rounded-full bg-emerald-400" />
                </div>
                <div className="font-mono text-xs font-bold text-slate-100 truncate">
                  {stage.name}
                </div>
                <div className="text-[11px] text-slate-400 truncate mt-0.5">
                  {stage.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Deep-Dive Card */}
        <div className="mt-4 p-4 rounded-lg bg-slate-950 border border-slate-800">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-3 border-b border-slate-800 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-mono text-sm font-bold ${activeStage.color}`}>
                  Stage {activeStage.num}: {activeStage.name}
                </span>
                <span className="text-slate-600">·</span>
                <span className="text-xs text-slate-400">{activeStage.subtitle}</span>
              </div>
            </div>
            <div className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
              Formula: <span className="text-emerald-400">{activeStage.mathEquation}</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed mb-3">
            {activeStage.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-900/60 rounded p-3 border border-slate-800/80">
            <div>
              <span className="font-mono text-[10px] text-slate-500 uppercase font-bold block mb-0.5">
                Inputs:
              </span>
              <span className="text-slate-300 font-mono text-[11px]">{activeStage.inputs}</span>
            </div>
            <div>
              <span className="font-mono text-[10px] text-slate-500 uppercase font-bold block mb-0.5">
                Outputs:
              </span>
              <span className="text-slate-300 font-mono text-[11px]">{activeStage.outputs}</span>
            </div>
            <div>
              <span className="font-mono text-[10px] text-slate-500 uppercase font-bold block mb-0.5">
                Edge Case Handling:
              </span>
              <span className="text-slate-300 text-[11px]">{activeStage.edgeCases}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Code Logic & Algorithms Deep Dive */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-sky-400" />
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Core Algorithmic Code Logic (TypeScript Implementation)
            </h3>
          </div>
          
          {/* Tab Selector */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded border border-slate-800">
            <button
              onClick={() => setSelectedCodeTab('uncertainty')}
              className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                selectedCodeTab === 'uncertainty' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              evidentialCertainty.ts
            </button>
            <button
              onClick={() => setSelectedCodeTab('reconciliation')}
              className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                selectedCodeTab === 'reconciliation' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              quantityReconciliation.ts
            </button>
            <button
              onClick={() => setSelectedCodeTab('defects')}
              className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                selectedCodeTab === 'defects' ? 'bg-rose-500/20 text-rose-300 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              defectTriage.ts
            </button>
            <button
              onClick={() => setSelectedCodeTab('disposition')}
              className={`px-2.5 py-1 text-xs font-mono rounded transition-colors ${
                selectedCodeTab === 'disposition' ? 'bg-blue-500/20 text-blue-300 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              dispositionSynthesizer.ts
            </button>
          </div>
        </div>

        {/* Syntax Highlighted Code Viewer */}
        <div className="bg-slate-950 rounded-lg p-4 font-mono text-xs overflow-x-auto border border-slate-800 max-h-[380px] leading-relaxed text-slate-300">
          <pre>{codeSnippets[selectedCodeTab]}</pre>
        </div>
      </div>

      {/* Real-Time Telemetry & Execution Trace of Current Inspection */}
      {currentRecord && (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-400" />
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                Live Execution Trace &amp; Agent Latency Profile
              </h3>
            </div>
            <div className="text-xs font-mono text-slate-400">
              Total Latency: <span className="text-emerald-400 font-bold">{currentRecord.executionTimeMs} ms</span>
            </div>
          </div>

          <div className="space-y-2">
            {currentRecord.pipelineTrace.map((trace, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-2.5 rounded bg-slate-950 border border-slate-800/80 text-xs"
              >
                <div className="flex items-center gap-2.5">
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
