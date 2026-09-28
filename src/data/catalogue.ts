export interface CatalogItem {
  sku: string;
  asin: string;
  productName: string;
  category: string;
  primaryVariant: string;
  allowedVariants: string[];
  unitCost: number;
  expectedCartonPack: number; // units per master carton
  tolerancePct: number;
  dimensionsCm: { l: number; w: number; h: number };
  grossWeightKg: number;
  colorHex: Record<string, string>;
  mandatoryComponents: string[];
  packagingChecklist: string[];
}

export const PRODUCT_CATALOGUE: Record<string, CatalogItem> = {
  'BLUE-BOTTLE-001': {
    sku: 'BLUE-BOTTLE-001',
    asin: 'B09XYZ841A',
    productName: 'Hydro-V Insulated Stainless Bottle (750ml)',
    category: 'Drinkware & Hydration',
    primaryVariant: 'Blue',
    allowedVariants: ['Blue', 'Matte Black', 'Brushed Steel', 'Forest Green'],
    unitCost: 24.50,
    expectedCartonPack: 24,
    tolerancePct: 0.0, // 0 tolerance for shortages
    dimensionsCm: { l: 48, w: 32, h: 28 },
    grossWeightKg: 11.4,
    colorHex: {
      'Blue': '#2563eb',
      'Matte Black': '#1e293b',
      'Brushed Steel': '#94a3b8',
      'Forest Green': '#15803d',
    },
    mandatoryComponents: [
      '750ml Vacuum Vessel',
      'Leakproof Spout Cap',
      'Silicone O-Ring Gasket',
      'Carabiner Clip Ring',
      'Instruction & Warranty Leaflet'
    ],
    packagingChecklist: [
      'High-grade double-wall corrugation',
      'Custom slotted cell dividers (24 count)',
      'Tamper-evident reinforced fiberglass tape',
      'Code 128 compliant barcode label'
    ]
  },
  'RED-FLASK-009': {
    sku: 'RED-FLASK-009',
    asin: 'B08ABC992K',
    productName: 'ThermoMax Wide-Mouth Flask (1000ml)',
    category: 'Drinkware & Hydration',
    primaryVariant: 'Crimson Red',
    allowedVariants: ['Crimson Red', 'Graphite'],
    unitCost: 28.00,
    expectedCartonPack: 16,
    tolerancePct: 0.0,
    dimensionsCm: { l: 50, w: 35, h: 30 },
    grossWeightKg: 12.0,
    colorHex: {
      'Crimson Red': '#dc2626',
      'Graphite': '#334155'
    },
    mandatoryComponents: [
      '1000ml Flask',
      'Screw-on Insulated Lid Cup',
      'Pour-through Stopper'
    ],
    packagingChecklist: [
      'Corrugated carton 16 pack',
      'EAN-13 shipping barcode'
    ]
  },
  'PRO-TOOL-KIT-04': {
    sku: 'PRO-TOOL-KIT-04',
    asin: 'B07KLM110P',
    productName: 'Precision Torque Screwdriver & Bit Kit (48-Piece)',
    category: 'Industrial Hardware',
    primaryVariant: 'Standard Aluminum',
    allowedVariants: ['Standard Aluminum'],
    unitCost: 45.00,
    expectedCartonPack: 12,
    tolerancePct: 0.0,
    dimensionsCm: { l: 42, w: 28, h: 22 },
    grossWeightKg: 8.5,
    colorHex: {
      'Standard Aluminum': '#64748b'
    },
    mandatoryComponents: [
      'Aluminum Torque Driver',
      '48 Magnetic S2 Steel Bits',
      'USB-C Fast Charging Cable',
      'Micro-Calibration Nozzle',
      'Molded EVA Storage Case'
    ],
    packagingChecklist: [
      'Molded foam insert cavities',
      'Security holographic seal intact'
    ]
  }
};
