export type Verdict = 'PASS' | 'FAIL' | 'UNCERTAIN';
export type Decision = 'ACCEPT' | 'EXCEPTION' | 'UNCERTAIN';

export type DefectType = 
  | 'crushing'
  | 'water_damage'
  | 'tear'
  | 'puncture'
  | 'tape_tampered'
  | 'missing_component'
  | 'label_scuffed'
  | 'wrong_color'
  | 'other';

export type DefectSeverity = 'CRITICAL' | 'MAJOR' | 'MINOR';

export interface BoundingBox {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number; // percentage 0-100
  height: number; // percentage 0-100
}

export interface DefectItem {
  id: string;
  type: DefectType;
  severity: DefectSeverity;
  location: string;
  description: string;
  boundingBox: BoundingBox;
  confidence: number;
  claimImpact?: string;
}

export interface DimensionCheck<T = any> {
  verdict: Verdict;
  expected: T;
  observed: T;
  delta?: number | string;
  confidence: number; // 0.0 to 1.0
  explanation: string;
  details?: Record<string, any>;
}

export interface EvidentialCertainty {
  score: number; // 0.0 to 1.0
  isSufficient: boolean; // false triggers UNCERTAIN outcome
  threshold: number; // standard 0.70
  missingEvidence: string[];
  secondaryCaptureDirective: string;
  uncertaintyFactors: {
    labelLegibility: number; // 0.0 to 1.0
    lightingQuality: number;
    angleCompleteness: number;
    occlusionLevel: number;
  };
}

export interface PurchaseOrder {
  poNumber: string;
  supplierName: string;
  supplierId: string;
  orderDate: string;
  deliveryDate: string;
  carrier: string;
  trackingNumber: string;
  dockBay: string;
  sku: string;
  asin?: string;
  productName: string;
  category: string;
  variant: string;
  expectedQuantity: number;
  cartonsExpected: number;
  unitsPerCarton: number;
  unitCost: number;
  totalCost: number;
  packagingSpec: {
    cartonType: string;
    dimensionsCm: { l: number; w: number; h: number };
    grossWeightKg: number;
    tamperEvidentTape: boolean;
  };
  tolerancePct: number;
  includedComponents: string[];
}

export interface InspectionImage {
  id: string;
  label: string;
  role: 'carton_exterior' | 'barcode_label' | 'opened_units' | 'product_detail';
  url: string;
  dataUrl?: string;
  description: string;
  resolution?: string;
  defects?: DefectItem[];
}

export interface PipelineStageTrace {
  stageNumber: number;
  stageName: string;
  status: 'COMPLETED' | 'WARNING' | 'FLAGGED';
  durationMs: number;
  outputSummary: string;
  internalMetrics?: Record<string, any>;
}

export interface DiscrepancyDossier {
  claimCode: string;
  financialDiscrepancyAmount: number;
  summary: string;
  actionRecommended: 'RECEIVE_INTO_INVENTORY' | 'QUARANTINE_AND_RMA' | 'DISPUTE_SHORTAGE' | 'REQUEST_SECONDARY_PHOTOS' | 'SUPPLIER_CHARGEBACK';
  inspectionHash: string;
  inspectorId: string;
  timestamp: string;
  carrierBol: string;
}

export interface InspectionRecord {
  id: string;
  po: PurchaseOrder;
  decision: Decision;
  skuCheck: DimensionCheck<string>;
  quantityCheck: DimensionCheck<number> & {
    cartonsObserved: number;
    unitsPerCartonObserved: number;
  };
  variantCheck: DimensionCheck<string>;
  damageCheck: DimensionCheck<string> & {
    defects: DefectItem[];
  };
  packagingIntegrity: DimensionCheck<string>;
  evidentialCertainty: EvidentialCertainty;
  discrepancyDossier: DiscrepancyDossier;
  pipelineTrace: PipelineStageTrace[];
  images: InspectionImage[];
  activeImageIndex: number;
  executionTimeMs: number;
  engine: string;
  operatorNotes?: string;
  supervisorSignOff?: {
    approved: boolean;
    name: string;
    signedAt: string;
    comments: string;
  };
}

export interface TestScenario {
  id: string;
  title: string;
  badge: string;
  badgeType: 'pass' | 'fail' | 'uncertain';
  description: string;
  expectedVerdict: {
    sku: Verdict;
    quantity: Verdict;
    variant: Verdict;
    damage: Verdict;
    overall: Decision;
  };
  po: PurchaseOrder;
  images: InspectionImage[];
  simulatedIssue: string;
  keyLearning: string;
}
