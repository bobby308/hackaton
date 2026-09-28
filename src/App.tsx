import React, { useState, useEffect } from 'react';
import { Header, NavTabId } from './components/Header';
import { ScenarioSelector } from './components/ScenarioSelector';
import { PoManifestCard } from './components/PoManifestCard';
import { EvidenceCanvas } from './components/EvidenceCanvas';
import { InspectionResults } from './components/InspectionResults';
import { ArchitectureStudio } from './components/ArchitectureStudio';
import { DossierModal } from './components/DossierModal';
import { LiveCaptureModal } from './components/LiveCaptureModal';
import { CinematicHeroBanner } from './components/CinematicHeroBanner';
import { CinematicTheaterModal } from './components/CinematicTheaterModal';
import { ManifestScheduleView } from './components/ManifestScheduleView';
import { AnalyticsIntelligenceView } from './components/AnalyticsIntelligenceView';
import { SkuCatalogVault } from './components/SkuCatalogVault';
import { TEST_SCENARIOS } from './data/scenarios';
import { TestScenario, InspectionRecord, PurchaseOrder, InspectionImage } from './types/receiving';
import { runReceivingInspection } from './services/agentPipeline';
import { createLabelBarcodeSvg } from './data/mockImages';
import { cinematicAudio } from './utils/audioFx';
import { 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  ArrowRight, 
  Activity, 
  Truck, 
  BarChart3, 
  Box, 
  Cpu, 
  Crosshair 
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTabId>('inspector');
  const [activeScenario, setActiveScenario] = useState<TestScenario>(TEST_SCENARIOS[0]);
  const [currentRecord, setCurrentRecord] = useState<InspectionRecord | null>(null);
  const [isInspecting, setIsInspecting] = useState<boolean>(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [selectedDefectId, setSelectedDefectId] = useState<string | null>(null);

  const [isLiveCaptureOpen, setIsLiveCaptureOpen] = useState<boolean>(false);
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);
  const [isTheaterOpen, setIsTheaterOpen] = useState<boolean>(false);
  const [isAudioOn, setIsAudioOn] = useState<boolean>(false);

  // Run inspection on initial mount and whenever scenario changes
  useEffect(() => {
    executeInspectionForScenario(activeScenario);
  }, [activeScenario]);

  const executeInspectionForScenario = async (scenario: TestScenario) => {
    setIsInspecting(true);
    setSelectedDefectId(null);
    setActiveImageIndex(0);

    try {
      const result = await runReceivingInspection({
        po: scenario.po,
        images: scenario.images,
        scenarioKey: scenario.id,
        simulatedIssue: scenario.simulatedIssue,
      });
      setCurrentRecord(result);

      // Cinematic audio cues if enabled
      if (result.decision === 'ACCEPT') {
        cinematicAudio.playPassChime();
      } else if (result.decision === 'EXCEPTION') {
        cinematicAudio.playAlertTone();
      } else if (result.decision === 'UNCERTAIN') {
        cinematicAudio.playChirp(440, 0.15, 'triangle');
      }
    } catch (err) {
      console.error('Inspection error:', err);
    } finally {
      setIsInspecting(false);
    }
  };

  const handleSelectScenario = (scenario: TestScenario) => {
    setActiveScenario(scenario);
    cinematicAudio.playScanBeep();
  };

  const handleSelectScenarioAndSwitchToInspector = (scenario: TestScenario) => {
    setActiveScenario(scenario);
    setActiveTab('inspector');
    cinematicAudio.playScanBeep();
  };

  const handleOpenDossierForScenario = (scenario: TestScenario) => {
    setActiveScenario(scenario);
    setIsDossierOpen(true);
  };

  const handleRunManualInspection = () => {
    if (activeScenario) {
      executeInspectionForScenario(activeScenario);
    }
  };

  const handleReset = () => {
    setActiveScenario(TEST_SCENARIOS[0]);
    setActiveTab('inspector');
  };

  const handleToggleAudio = () => {
    const newState = cinematicAudio.toggle();
    setIsAudioOn(newState);
  };

  // Secondary capture simulation when in UNCERTAIN state
  const handleRequestSecondaryCapture = async () => {
    if (!currentRecord) return;
    setIsInspecting(true);

    // Operator provides clean high-contrast perpendicular re-photograph
    const correctedLabelSvg = createLabelBarcodeSvg({
      sku: currentRecord.po.sku,
      variant: currentRecord.po.variant,
      expectedQty: currentRecord.po.expectedQuantity,
      barcodeStatus: 'clean',
    });

    const secondaryImage: InspectionImage = {
      id: `img-secondary-re-capture-${Date.now()}`,
      label: 'Secondary Capture (Perpendicular + Fill Flash)',
      role: 'barcode_label',
      url: correctedLabelSvg,
      description: 'Directed secondary capture per operator prompt: 0° tilt with active fill flash.',
    };

    const updatedImages = [secondaryImage, ...currentRecord.images];

    try {
      // Re-run with clean evidence
      const reResult = await runReceivingInspection({
        po: currentRecord.po,
        images: updatedImages,
        customNotes: 'Secondary capture provided by operator. Barcode SNR verified at 99.2%.',
        scenarioKey: 'scenario-01-correct',
        simulatedIssue: 'none',
      });
      setCurrentRecord(reResult);
      setActiveImageIndex(0);
      cinematicAudio.playPassChime();
    } catch (err) {
      console.error('Secondary capture analysis error:', err);
    } finally {
      setIsInspecting(false);
    }
  };

  const handleCustomInspectionSubmit = async (po: PurchaseOrder, images: InspectionImage[], customNotes: string) => {
    setIsInspecting(true);
    setActiveImageIndex(0);
    setSelectedDefectId(null);

    const customScenario: TestScenario = {
      id: `custom-${Date.now()}`,
      title: `Custom: ${po.sku}`,
      badge: 'Live Upload',
      badgeType: 'pass',
      description: `Custom receiving inspection for PO ${po.poNumber}.`,
      expectedVerdict: {
        sku: 'PASS',
        quantity: 'PASS',
        variant: 'PASS',
        damage: 'PASS',
        overall: 'ACCEPT',
      },
      po,
      images,
      simulatedIssue: 'none',
      keyLearning: 'Real-time custom multimodal receiving inspection.',
    };

    setActiveScenario(customScenario);
    setActiveTab('inspector');

    try {
      const result = await runReceivingInspection({
        po,
        images,
        customNotes,
        scenarioKey: 'custom',
      });
      setCurrentRecord(result);
      if (result.decision === 'ACCEPT') {
        cinematicAudio.playPassChime();
      } else {
        cinematicAudio.playAlertTone();
      }
    } catch (err) {
      console.error('Custom inspection failure:', err);
    } finally {
      setIsInspecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030611] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 relative overflow-x-hidden">
      
      {/* Engineered Cinematic Background Glows & Holographic Grid */}
      <div className="fixed inset-0 bg-grid-cyber pointer-events-none opacity-40 z-0" />
      <div className="fixed inset-0 bg-radial-glow pointer-events-none z-0" />

      {/* Top Warehouse Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenLiveCapture={() => setIsLiveCaptureOpen(true)}
        onReset={handleReset}
        isInspecting={isInspecting}
        onRunInspection={handleRunManualInspection}
        isAudioOn={isAudioOn}
        onToggleAudio={handleToggleAudio}
      />

      {/* Main Body with Connected Views */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 relative z-10">
        
        {/* VIEW 1: DOCK INSPECTOR */}
        {activeTab === 'inspector' && (
          <div className="space-y-4">
            
            {/* Cinematic Hero Panoramic Banner */}
            <CinematicHeroBanner
              onOpenTheater={() => setIsTheaterOpen(true)}
              isAudioOn={isAudioOn}
              onToggleAudio={handleToggleAudio}
              scenarioTitle={activeScenario.title}
              isInspecting={isInspecting}
            />

            {/* 10 Test Scenarios Selector Bar */}
            <ScenarioSelector
              activeScenarioId={activeScenario.id}
              onSelectScenario={handleSelectScenario}
              isInspecting={isInspecting}
            />

            {/* Inspection Workspace (Two-Column Layout) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* Left Column: PO Manifest + Visual Evidence Canvas */}
              <div className="lg:col-span-7 space-y-4">
                <PoManifestCard 
                  po={activeScenario.po} 
                  onViewCatalog={() => setActiveTab('catalog')}
                />

                <div className="h-[490px]">
                  <EvidenceCanvas
                    images={activeScenario.images}
                    activeImageIndex={activeImageIndex}
                    onSelectImage={setActiveImageIndex}
                    defects={currentRecord?.damageCheck?.defects || []}
                    selectedDefectId={selectedDefectId}
                    onSelectDefect={setSelectedDefectId}
                    uncertaintyActive={currentRecord?.decision === 'UNCERTAIN'}
                    onOpenTheater={() => setIsTheaterOpen(true)}
                  />
                </div>
              </div>

              {/* Right Column: Inspection Results, Verdicts & Evidence Record */}
              <div className="lg:col-span-5">
                {currentRecord ? (
                  <InspectionResults
                    record={currentRecord}
                    onRequestSecondaryCapture={handleRequestSecondaryCapture}
                    onOpenDossier={() => setIsDossierOpen(true)}
                    onViewArchitecture={() => setActiveTab('architecture')}
                  />
                ) : (
                  <div className="h-full min-h-[300px] flex flex-col items-center justify-center glass-panel rounded-2xl p-8 text-slate-400 font-mono text-xs gap-3">
                    <div className="h-8 w-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    <span>Executing multimodal inspection pipeline...</span>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* VIEW 2: INBOUND MANIFEST & BAY SCHEDULE */}
        {activeTab === 'manifest' && (
          <ManifestScheduleView
            onSelectAndInspect={handleSelectScenarioAndSwitchToInspector}
            onOpenDossierForScenario={handleOpenDossierForScenario}
          />
        )}

        {/* VIEW 3: DEFECT INTELLIGENCE & PPM ANALYTICS */}
        {activeTab === 'analytics' && (
          <AnalyticsIntelligenceView
            onSelectAndInspect={handleSelectScenarioAndSwitchToInspector}
          />
        )}

        {/* VIEW 4: HOLOGRAPHIC SKU & CATALOG VAULT */}
        {activeTab === 'catalog' && (
          <SkuCatalogVault
            onSelectAndInspect={handleSelectScenarioAndSwitchToInspector}
          />
        )}

        {/* VIEW 5: AGENT ARCHITECTURE & PIPELINES */}
        {activeTab === 'architecture' && (
          <ArchitectureStudio currentRecord={currentRecord} />
        )}

        {/* VIEW 6: EVIDENCE DOSSIER / RMA PREVIEW */}
        {activeTab === 'dossier' && (
          <div className="glass-panel rounded-2xl p-6 shadow-2xl border border-cyan-500/20">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-white/5 mb-6 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-emerald-400" />
                  <h2 className="font-extrabold text-base text-white uppercase tracking-tight font-sans">
                    Receiving Evidence Record &amp; Supplier Non-Conformance Dossier
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Audit-ready EDI 861 Receiving Advice format with cryptographic SHA-256 seal, photographic proof, and automated debit memo calculations.
                </p>
              </div>

              <button
                onClick={() => setIsDossierOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 font-sans text-xs font-black text-slate-950 shadow-lg shadow-emerald-500/30 transition-transform active:scale-95 self-start sm:self-center shrink-0"
              >
                Launch Printable Dossier
              </button>
            </div>

            {currentRecord && (
              <div className="space-y-4 text-xs font-mono">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#060a14] p-4 rounded-xl border border-white/5">
                  <div>
                    <span className="text-slate-400 uppercase block text-[10px] tracking-wider">Record ID</span>
                    <span className="font-bold text-slate-200">{currentRecord.id}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase block text-[10px] tracking-wider">PO Reference</span>
                    <span className="font-bold text-cyan-300">{currentRecord.po.poNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase block text-[10px] tracking-wider">Decision Verdict</span>
                    <span className={`font-black text-sm ${
                      currentRecord.decision === 'ACCEPT' ? 'text-emerald-400' : currentRecord.decision === 'EXCEPTION' ? 'text-rose-400' : 'text-amber-400'
                    }`}>{currentRecord.decision}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase block text-[10px] tracking-wider">Financial Claim</span>
                    <span className="font-black text-sm text-rose-300">
                      ${currentRecord.discrepancyDossier.financialDiscrepancyAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#060a14] border border-white/5 space-y-2.5">
                  <div className="text-slate-300 text-xs leading-relaxed font-sans">
                    <span className="text-slate-400 font-semibold">Root Cause Audit Summary: </span>
                    {currentRecord.discrepancyDossier.summary}
                  </div>
                  <div className="text-slate-300 text-xs font-sans">
                    <span className="text-slate-400 font-semibold">Recommended Protocol: </span>
                    <span className="text-emerald-400 font-bold font-mono">{currentRecord.discrepancyDossier.actionRecommended}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono pt-2 border-t border-white/5 flex items-center justify-between flex-wrap gap-2">
                    <div>
                      Cryptographic Proof Hash: <span className="text-cyan-300 font-bold">{currentRecord.discrepancyDossier.inspectionHash}</span>
                    </div>
                    <button
                      onClick={() => setActiveTab('inspector')}
                      className="text-xs text-cyan-400 hover:text-cyan-300 underline font-sans"
                    >
                      Return to Inbound Dock Inspector →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Cinematic Theater Modal (Full Screen 2.39:1 HUD Inspection) */}
      {isTheaterOpen && (
        <CinematicTheaterModal
          isOpen={isTheaterOpen}
          onClose={() => setIsTheaterOpen(false)}
          record={currentRecord}
          images={activeScenario.images}
          activeImageIndex={activeImageIndex}
          onSelectImage={setActiveImageIndex}
          defects={currentRecord?.damageCheck?.defects || []}
          selectedDefectId={selectedDefectId}
          onSelectDefect={setSelectedDefectId}
        />
      )}

      {/* Dossier Modal */}
      {isDossierOpen && (
        <DossierModal
          record={currentRecord}
          onClose={() => setIsDossierOpen(false)}
        />
      )}

      {/* Live Capture / Upload Modal */}
      {isLiveCaptureOpen && (
        <LiveCaptureModal
          isOpen={isLiveCaptureOpen}
          onClose={() => setIsLiveCaptureOpen(false)}
          defaultPo={activeScenario.po}
          onSubmitInspection={handleCustomInspectionSubmit}
        />
      )}

      {/* Dock Footer Status */}
      <footer className="border-t border-cyan-500/20 bg-[#02050e]/95 backdrop-blur-md py-4 text-slate-400 text-xs font-mono relative z-10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-semibold">
              Receiving Manager AI · Multimodal Point-of-Receipt Visual Inspection Engine
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-500 text-[11px]">
            <span>Active Bay: 07 (Robotic Vision)</span>
            <span aria-hidden="true">·</span>
            <span>Shift: ALPHA-01</span>
            <span aria-hidden="true">·</span>
            <span className="text-cyan-400">ASTM D642 / ISO 9001</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
