// Helper to create realistic SVG Data URLs for carton, label, grid, and product inspections

export function createCartonExteriorSvg(opts: {
  cartonText?: string;
  sku?: string;
  condition: 'pristine' | 'crushed' | 'water_damaged' | 'torn' | 'ambiguous';
  highlightBox?: { x: number; y: number; w: number; h: number; label: string; color: string };
}): string {
  const { cartonText = 'MASTER CARTON 1/1', sku = 'BLUE-BOTTLE-001', condition, highlightBox } = opts;

  let conditionOverlay = '';
  if (condition === 'crushed') {
    conditionOverlay = `
      <!-- Crushed corner deformity and stress wrinkles -->
      <path d="M 440,110 Q 400,160 430,220 Q 480,260 520,200 Z" fill="#8d5b32" opacity="0.6" />
      <path d="M 450,115 L 420,180 L 460,210 L 515,190" stroke="#3e230f" stroke-width="4" fill="none" stroke-linejoin="round" />
      <path d="M 430,140 L 390,160 M 440,170 L 380,185 M 460,195 L 410,230" stroke="#2c1608" stroke-width="2.5" />
      <text x="410" y="270" font-family="monospace" font-size="12" fill="#ef4444" font-weight="bold">CRUSH COMPRESSION &gt;45mm</text>
    `;
  } else if (condition === 'water_damaged') {
    conditionOverlay = `
      <!-- Water damage liquid tide line -->
      <path d="M 80,310 Q 180,260 280,290 T 480,270 L 520,380 L 80,380 Z" fill="#785332" opacity="0.75" />
      <path d="M 80,310 Q 180,260 280,290 T 480,270" stroke="#4a3118" stroke-width="3" fill="none" />
      <ellipse cx="220" cy="330" rx="60" ry="20" fill="#583c20" opacity="0.5" />
      <text x="120" y="360" font-family="monospace" font-size="12" fill="#38bdf8" font-weight="bold">WET BOTTOM CORRUGATION / WATER INGRESS</text>
    `;
  } else if (condition === 'torn') {
    conditionOverlay = `
      <!-- Puncture wound and torn flap -->
      <polygon points="260,180 340,165 370,210 320,245 270,220" fill="#2d1d11" />
      <path d="M 250,180 L 340,165 L 380,210 L 315,250 L 260,220 Z" stroke="#ef4444" stroke-width="2" fill="none" />
      <path d="M 230,170 L 260,180 M 370,210 L 400,225" stroke="#ef4444" stroke-width="2" />
      <text x="240" y="270" font-family="monospace" font-size="12" fill="#f87171" font-weight="bold">PENETRATING TEAR (14cm)</text>
    `;
  } else if (condition === 'ambiguous') {
    conditionOverlay = `
      <!-- Glare, low lighting artifact, blur filter -->
      <radialGradient id="glare" cx="60%" cy="40%" r="50%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.85" />
        <stop offset="50%" stop-color="#ffffff" stop-opacity="0.2" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0.4" />
      </radialGradient>
      <rect x="0" y="0" width="600" height="400" fill="url(#glare)" />
      <text x="50" y="380" font-family="monospace" font-size="12" fill="#fbbf24" font-weight="bold">WARNING: HIGH GLARE &amp; OBLIQUE ANGLE (EVIDENCE UNCERTAIN)</text>
    `;
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
      <defs>
        <linearGradient id="cardboard" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#c99f6f" />
          <stop offset="50%" stop-color="#b68958" />
          <stop offset="100%" stop-color="#9a6e40" />
        </linearGradient>
        <pattern id="corrugation" width="10" height="10" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="10" y2="10" stroke="#a37648" stroke-width="0.7" opacity="0.3"/>
        </pattern>
      </defs>

      <!-- Warehouse concrete floor background -->
      <rect width="600" height="400" fill="#1e242b" />
      <line x1="0" y1="360" x2="600" y2="360" stroke="#334155" stroke-width="1.5" />
      <polygon points="120,400 180,360 220,360 160,400" fill="#eab308" opacity="0.15" />
      <polygon points="320,400 380,360 420,360 360,400" fill="#eab308" opacity="0.15" />

      <!-- Shadow -->
      <ellipse cx="300" cy="365" rx="230" ry="24" fill="#0b0f14" opacity="0.8" />

      <!-- Main Corrugated Carton (Isometric Perspective) -->
      <!-- Left side face -->
      <polygon points="80,180 280,220 280,360 80,310" fill="#996c3f" />
      <polygon points="80,180 280,220 280,360 80,310" fill="url(#corrugation)" />
      
      <!-- Right side face -->
      <polygon points="280,220 520,160 520,290 280,360" fill="#b68958" />
      <polygon points="280,220 520,160 520,290 280,360" fill="url(#corrugation)" />

      <!-- Top face -->
      <polygon points="80,180 300,120 520,160 280,220" fill="#c99f6f" />
      
      <!-- Sealing tape down center -->
      <path d="M 185,150 L 398,190 L 398,325 L 388,328 L 388,193 L 175,153 Z" fill="#d97706" opacity="0.85" />
      <text x="270" y="180" font-family="monospace" font-size="9" fill="#78350f" font-weight="bold" transform="rotate(10, 270, 180)">SECURITY SEALED - QC PASS</text>

      <!-- Shipping label on right face -->
      <polygon points="320,220 480,180 480,260 320,305" fill="#f8fafc" />
      <rect x="335" y="235" width="60" height="25" fill="#0f172a" transform="skewY(-14)" />
      
      <!-- Barcode simulation on label -->
      <g transform="translate(340, 240) skewY(-14)" stroke="#ffffff" stroke-width="1.8">
        <line x1="0" y1="0" x2="0" y2="18" />
        <line x1="4" y1="0" x2="4" y2="18" stroke-width="3" />
        <line x1="9" y1="0" x2="9" y2="18" stroke-width="1" />
        <line x1="13" y1="0" x2="13" y2="18" stroke-width="2.5" />
        <line x1="18" y1="0" x2="18" y2="18" stroke-width="1" />
        <line x1="22" y1="0" x2="22" y2="18" stroke-width="3.5" />
        <line x1="28" y1="0" x2="28" y2="18" stroke-width="1" />
        <line x1="33" y1="0" x2="33" y2="18" stroke-width="2" />
        <line x1="38" y1="0" x2="38" y2="18" stroke-width="1.5" />
        <line x1="44" y1="0" x2="44" y2="18" stroke-width="3" />
      </g>
      <text x="335" y="275" font-family="monospace" font-size="9" fill="#0f172a" font-weight="bold" transform="skewY(-14)">${sku}</text>
      <text x="335" y="287" font-family="sans-serif" font-size="7" fill="#475569" transform="skewY(-14)">INBOUND LOT #84920</text>

      <!-- Carton Markings on Left Face -->
      <g transform="translate(100, 230) skewY(11)">
        <text x="0" y="0" font-family="monospace" font-size="12" fill="#382313" font-weight="bold">${cartonText}</text>
        <text x="0" y="16" font-family="monospace" font-size="9" fill="#4a2e19">FRAGILE - HANDLE WITH CARE</text>
        <path d="M 0,25 L 8,25 L 8,45 L 0,45 Z M 4,25 L 4,20" stroke="#382313" stroke-width="1.5" fill="none" />
        <path d="M 16,35 L 24,35 M 20,25 L 20,45" stroke="#382313" stroke-width="1.5" />
      </g>

      ${conditionOverlay}

      <!-- Optional dynamic highlight bounding box -->
      ${highlightBox ? `
        <rect x="${highlightBox.x}" y="${highlightBox.y}" width="${highlightBox.w}" height="${highlightBox.h}" 
              fill="${highlightBox.color}" fill-opacity="0.2" stroke="${highlightBox.color}" stroke-width="2.5" stroke-dasharray="6,4" />
        <rect x="${highlightBox.x}" y="${highlightBox.y - 20}" width="160" height="20" fill="${highlightBox.color}" />
        <text x="${highlightBox.x + 6}" y="${highlightBox.y - 6}" font-family="monospace" font-size="11" fill="#ffffff" font-weight="bold">${highlightBox.label}</text>
      ` : ''}

      <!-- HUD Watermark -->
      <text x="15" y="25" font-family="monospace" font-size="11" fill="#64748b" font-weight="bold">DOCK-CAM 03 · DOCK BAY 07 · INBOUND INSPECTION</text>
    </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function createLabelBarcodeSvg(opts: {
  sku: string;
  variant: string;
  expectedQty: number;
  barcodeStatus: 'clean' | 'mislabeled' | 'scuffed_uncertain';
}): string {
  const { sku, variant, expectedQty, barcodeStatus } = opts;

  let barcodeDisplaySku = sku;
  let barcodeLines = `
    <line x1="20" y1="0" x2="20" y2="70" stroke="#000" stroke-width="3" />
    <line x1="26" y1="0" x2="26" y2="70" stroke="#000" stroke-width="1.5" />
    <line x1="32" y1="0" x2="32" y2="70" stroke="#000" stroke-width="5" />
    <line x1="42" y1="0" x2="42" y2="70" stroke="#000" stroke-width="2" />
    <line x1="50" y1="0" x2="50" y2="70" stroke="#000" stroke-width="4" />
    <line x1="60" y1="0" x2="60" y2="70" stroke="#000" stroke-width="2" />
    <line x1="68" y1="0" x2="68" y2="70" stroke="#000" stroke-width="6" />
    <line x1="80" y1="0" x2="80" y2="70" stroke="#000" stroke-width="2" />
    <line x1="88" y1="0" x2="88" y2="70" stroke="#000" stroke-width="4" />
    <line x1="98" y1="0" x2="98" y2="70" stroke="#000" stroke-width="1.5" />
    <line x1="106" y1="0" x2="106" y2="70" stroke="#000" stroke-width="5" />
    <line x1="116" y1="0" x2="116" y2="70" stroke="#000" stroke-width="2" />
    <line x1="124" y1="0" x2="124" y2="70" stroke="#000" stroke-width="4" />
    <line x1="134" y1="0" x2="134" y2="70" stroke="#000" stroke-width="2" />
    <line x1="142" y1="0" x2="142" y2="70" stroke="#000" stroke-width="5" />
    <line x1="154" y1="0" x2="154" y2="70" stroke="#000" stroke-width="1.5" />
    <line x1="162" y1="0" x2="162" y2="70" stroke="#000" stroke-width="6" />
    <line x1="174" y1="0" x2="174" y2="70" stroke="#000" stroke-width="2" />
    <line x1="184" y1="0" x2="184" y2="70" stroke="#000" stroke-width="3" />
    <line x1="194" y1="0" x2="194" y2="70" stroke="#000" stroke-width="4" />
    <line x1="204" y1="0" x2="204" y2="70" stroke="#000" stroke-width="2" />
    <line x1="214" y1="0" x2="214" y2="70" stroke="#000" stroke-width="5" />
  `;

  if (barcodeStatus === 'mislabeled') {
    barcodeDisplaySku = 'RED-FLASK-009';
  } else if (barcodeStatus === 'scuffed_uncertain') {
    barcodeLines += `
      <!-- Scratches, glare, barcode unreadable -->
      <path d="M 10,20 Q 120,45 220,15" stroke="#ffffff" stroke-width="14" fill="none" opacity="0.9" />
      <path d="M 30,50 L 190,40" stroke="#e2e8f0" stroke-width="12" opacity="0.85" />
      <path d="M 80,10 L 110,65" stroke="#475569" stroke-width="8" />
    `;
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
      <rect width="600" height="400" fill="#0f172a" />
      
      <!-- Label Paper Container -->
      <rect x="70" y="40" width="460" height="320" rx="4" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" />
      
      <!-- Header Banner -->
      <rect x="70" y="40" width="460" height="44" fill="#0284c7" />
      <text x="90" y="68" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" fill="#ffffff" font-weight="800">GLOBAL LOGISTICS INBOUND MANIFEST</text>
      
      <!-- Metadata Grid -->
      <line x1="70" y1="125" x2="530" y2="125" stroke="#e2e8f0" stroke-width="1.5" />
      <line x1="300" y1="84" x2="300" y2="200" stroke="#e2e8f0" stroke-width="1.5" />
      
      <text x="90" y="102" font-family="sans-serif" font-size="10" fill="#64748b" font-weight="bold">ITEM / SKU NUMBER</text>
      <text x="90" y="120" font-family="'JetBrains Mono', monospace" font-size="14" fill="#0f172a" font-weight="800">${barcodeDisplaySku}</text>

      <text x="320" y="102" font-family="sans-serif" font-size="10" fill="#64748b" font-weight="bold">VARIANT SPECIFICATION</text>
      <text x="320" y="120" font-family="'JetBrains Mono', monospace" font-size="14" fill="#0f172a" font-weight="800">${variant}</text>

      <text x="90" y="145" font-family="sans-serif" font-size="10" fill="#64748b" font-weight="bold">PACKAGE QUANTITY</text>
      <text x="90" y="165" font-family="'JetBrains Mono', monospace" font-size="16" fill="#0f172a" font-weight="800">${expectedQty} UNITS</text>

      <text x="320" y="145" font-family="sans-serif" font-size="10" fill="#64748b" font-weight="bold">SUPPLIER ASIN / SERIAL</text>
      <text x="320" y="165" font-family="'JetBrains Mono', monospace" font-size="13" fill="#0f172a" font-weight="bold">B09XYZ841A · REV 3.2</text>

      <!-- Barcode Graphic Box -->
      <rect x="90" y="195" width="420" height="135" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1" />
      <g transform="translate(180, 215)">
        ${barcodeLines}
      </g>
      <text x="300" y="315" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-size="13" fill="#1e293b" font-weight="bold">
        ${barcodeStatus === 'scuffed_uncertain' ? '* UNREADABLE CHECKSUM *' : `* ${barcodeDisplaySku} *`}
      </text>

      ${barcodeStatus === 'mislabeled' ? `
        <rect x="75" y="325" width="450" height="30" fill="#fee2e2" stroke="#ef4444" stroke-width="1.5" />
        <text x="90" y="345" font-family="monospace" font-size="12" fill="#b91c1c" font-weight="bold">OCR DETECTED: SKU 'RED-FLASK-009' != PO '${sku}'</text>
      ` : ''}

      ${barcodeStatus === 'scuffed_uncertain' ? `
        <rect x="75" y="325" width="450" height="30" fill="#fef3c7" stroke="#f59e0b" stroke-width="1.5" />
        <text x="90" y="345" font-family="monospace" font-size="11" fill="#b45309" font-weight="bold">OCR DECODE FAILURE (CONFIDENCE 42% &lt; THRESHOLD 70%)</text>
      ` : ''}
    </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function createOpenedCartonGridSvg(opts: {
  expectedCount: number;
  actualCount: number;
  variantColor: string; // e.g. '#2563eb' for blue, '#1e293b' for black, '#dc2626' for red
  isDamaged?: boolean;
}): string {
  const { expectedCount, actualCount, variantColor, isDamaged } = opts;

  // Render a 6x4 = 24 grid slot box
  const rows = 4;
  const cols = 6;
  const cellW = 60;
  const cellH = 55;
  const startX = 115;
  const startY = 85;

  let cellsSvg = '';
  let unitIndex = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      unitIndex++;
      const x = startX + c * cellW;
      const y = startY + r * cellH;
      const isPresent = unitIndex <= actualCount;

      if (isPresent) {
        cellsSvg += `
          <!-- Bottle Unit ${unitIndex} -->
          <rect x="${x + 6}" y="${y + 5}" width="${cellW - 12}" height="${cellH - 10}" rx="14" fill="${variantColor}" stroke="#ffffff" stroke-width="1" />
          <ellipse cx="${x + cellW / 2}" cy="${y + 14}" rx="${cellW / 4}" ry="6" fill="#ffffff" opacity="0.3" />
          <!-- Cap -->
          <circle cx="${x + cellW / 2}" cy="${y + cellH / 2}" r="8" fill="#0f172a" stroke="#94a3b8" stroke-width="1" />
          <text x="${x + cellW / 2}" y="${y + cellH / 2 + 3}" text-anchor="middle" font-family="monospace" font-size="7" fill="#ffffff">${unitIndex}</text>
        `;
      } else {
        cellsSvg += `
          <!-- Missing Slot ${unitIndex} -->
          <rect x="${x + 6}" y="${y + 5}" width="${cellW - 12}" height="${cellH - 10}" rx="6" fill="#334155" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,3" fill-opacity="0.2" />
          <line x1="${x + 10}" y1="${y + 10}" x2="${x + cellW - 10}" y2="${y + cellH - 10}" stroke="#ef4444" stroke-width="1.5" />
          <line x1="${x + cellW - 10}" y1="${y + 10}" x2="${x + 10}" y2="${y + cellH - 10}" stroke="#ef4444" stroke-width="1.5" />
          <text x="${x + cellW / 2}" y="${y + cellH / 2 + 4}" text-anchor="middle" font-family="monospace" font-size="8" fill="#ef4444" font-weight="bold">EMPTY</text>
        `;
      }
    }
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
      <rect width="600" height="400" fill="#18202a" />
      
      <!-- Carton Flap Rim Perspective -->
      <polygon points="90,60 510,60 535,335 65,335" fill="#a47545" stroke="#875629" stroke-width="3" />
      <polygon points="105,75 495,75 515,320 85,320" fill="#3b2311" />

      <!-- Flaps Folded Back -->
      <!-- Top flap -->
      <polygon points="90,60 510,60 550,15 50,15" fill="#c99f6f" stroke="#a47545" stroke-width="1.5" />
      <!-- Bottom flap -->
      <polygon points="65,335 535,335 570,385 30,385" fill="#b68958" stroke="#875629" stroke-width="1.5" />

      <!-- Corrugated Grid Divider Slots -->
      ${cellsSvg}

      <!-- Status Header -->
      <rect x="20" y="10" width="340" height="30" rx="4" fill="#0f172a" fill-opacity="0.9" />
      <text x="32" y="30" font-family="'JetBrains Mono', monospace" font-size="12" fill="#f8fafc" font-weight="bold">
        COUNT: ${actualCount} / ${expectedCount} UNITS ${actualCount < expectedCount ? `(SHORT -${expectedCount - actualCount})` : actualCount > expectedCount ? `(OVERAGE +${actualCount - expectedCount})` : '(MATCH)'}
      </text>

      ${isDamaged ? `
        <rect x="420" y="10" width="160" height="30" rx="4" fill="#7f1d1d" />
        <text x="430" y="30" font-family="'JetBrains Mono', monospace" font-size="11" fill="#fecaca" font-weight="bold">DAMAGE DETECTED</text>
      ` : ''}
    </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function createProductDetailSvg(opts: {
  sku: string;
  variantName: string;
  colorHex: string;
  hasMissingComponent?: boolean;
  isWrongVariant?: boolean;
}): string {
  const { sku, variantName, colorHex, hasMissingComponent, isWrongVariant } = opts;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="100%" height="100%">
      <rect width="600" height="400" fill="#0b1120" />
      
      <!-- Inspection stage platform -->
      <ellipse cx="300" cy="330" rx="220" ry="40" fill="#1e293b" stroke="#334155" stroke-width="2" />
      <ellipse cx="300" cy="330" rx="170" ry="25" fill="#0f172a" />

      <!-- Retail Packaging Box & Inserts -->
      <rect x="80" y="90" width="220" height="230" rx="6" fill="#1e293b" stroke="#475569" stroke-width="2" />
      <rect x="95" y="105" width="190" height="200" rx="4" fill="#0f172a" />

      <!-- Molded Inner Tray Bay 1 (Main Product Compartment) -->
      <rect x="110" y="120" width="80" height="170" rx="10" fill="#1e2433" stroke="#3b82f6" stroke-width="1" />
      <text x="150" y="140" text-anchor="middle" font-family="monospace" font-size="8" fill="#64748b">UNIT TRAY</text>

      <!-- Molded Inner Tray Bay 2 (Accessory 1: Power Cable) -->
      <rect x="205" y="120" width="65" height="75" rx="6" fill="#1e2433" stroke="#3b82f6" stroke-width="1" />
      ${hasMissingComponent ? `
        <!-- MISSING CABLE -->
        <rect x="208" y="123" width="59" height="69" rx="4" fill="#7f1d1d" fill-opacity="0.3" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,2" />
        <text x="237" y="160" text-anchor="middle" font-family="monospace" font-size="9" fill="#ef4444" font-weight="bold">MISSING</text>
        <text x="237" y="174" text-anchor="middle" font-family="monospace" font-size="7" fill="#fca5a5">USB-C CABLE</text>
      ` : `
        <ellipse cx="237" cy="155" rx="20" ry="18" fill="#334155" stroke="#94a3b8" stroke-width="1.5" />
        <text x="237" y="160" text-anchor="middle" font-family="monospace" font-size="7" fill="#cbd5e1">CABLE INC.</text>
      `}

      <!-- Molded Inner Tray Bay 3 (Accessory 2: Nozzle / Manual) -->
      <rect x="205" y="210" width="65" height="80" rx="6" fill="#1e2433" stroke="#3b82f6" stroke-width="1" />
      ${hasMissingComponent ? `
        <!-- MISSING NOZZLE -->
        <rect x="208" y="213" width="59" height="74" rx="4" fill="#7f1d1d" fill-opacity="0.3" stroke="#ef4444" stroke-width="2" stroke-dasharray="4,2" />
        <text x="237" y="250" text-anchor="middle" font-family="monospace" font-size="9" fill="#ef4444" font-weight="bold">MISSING</text>
        <text x="237" y="264" text-anchor="middle" font-family="monospace" font-size="7" fill="#fca5a5">CALIBRATION NOZZLE</text>
      ` : `
        <rect x="215" y="225" width="45" height="50" rx="2" fill="#475569" />
        <text x="237" y="255" text-anchor="middle" font-family="monospace" font-size="7" fill="#e2e8f0">MANUAL</text>
      `}

      <!-- The Product Itself Displayed Outside Box -->
      <!-- Shadow -->
      <ellipse cx="420" cy="320" rx="50" ry="14" fill="#020617" opacity="0.9" />

      <!-- Bottle/Unit Body -->
      <rect x="370" y="110" width="100" height="200" rx="22" fill="${colorHex}" stroke="#ffffff" stroke-width="1.5" />
      <!-- Specular Highlight Strip -->
      <path d="M 385,130 L 385,290" stroke="#ffffff" stroke-width="6" stroke-linecap="round" opacity="0.25" />
      
      <!-- Bottle Neck & Cap -->
      <rect x="400" y="70" width="40" height="40" rx="4" fill="#0f172a" stroke="#cbd5e1" stroke-width="1" />
      <circle cx="420" cy="65" r="16" fill="#334155" stroke="#94a3b8" stroke-width="2" />

      <!-- Engraved Logo / Branding -->
      <rect x="390" y="180" width="60" height="30" rx="2" fill="#000000" fill-opacity="0.2" />
      <text x="420" y="200" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" fill="#ffffff" font-weight="800">HYDRO-V</text>

      <!-- Color Swatch & Specification Panel -->
      <rect x="330" y="20" width="250" height="55" rx="6" fill="#1e293b" stroke="#334155" stroke-width="1" />
      <rect x="345" y="32" width="30" height="30" rx="4" fill="${colorHex}" stroke="#ffffff" stroke-width="1.5" />
      <text x="385" y="44" font-family="sans-serif" font-size="10" fill="#94a3b8">OBSERVED COLOR / VARIANT</text>
      <text x="385" y="60" font-family="'JetBrains Mono', monospace" font-size="13" fill="#ffffff" font-weight="bold">${variantName} (${colorHex})</text>

      ${isWrongVariant ? `
        <rect x="330" y="85" width="250" height="28" rx="4" fill="#7f1d1d" />
        <text x="345" y="103" font-family="monospace" font-size="10" fill="#fecaca" font-weight="bold">MISMATCH: EXPECTED BLUE (#2563eb)</text>
      ` : ''}

      <text x="20" y="25" font-family="'JetBrains Mono', monospace" font-size="11" fill="#64748b" font-weight="bold">SPECTRO-PHOTOMETRIC &amp; BOM SUB-ASSEMBLY AUDIT</text>
    </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
