import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ScenarioSelector } from './components/ScenarioSelector';
import { PoManifestCard } from './components/PoManifestCard';
import { EvidenceCanvas } from './components/EvidenceCanvas';
import { InspectionResults } from './components/InspectionResults';
import { ArchitectureStudio } from './components/ArchitectureStudio';
import { DossierModal } from './components/DossierModal';
import { LiveCaptureModal } from './components/LiveCaptureModal';
import { TEST_SCENARIOS } from './data/scenarios';
import { TestScenario, InspectionRecord, PurchaseOrder, InspectionImage } from './types/receiving';
import { runReceivingInspection } from './services/agentPipeline';
import { createLabelBarcodeSvg } from './data/mockImages';

export default function App() {
  const [activeTab, setActiveTab] = useState<'inspector' | 'architecture' | 'dossier'>('inspector');
  const [activeScenario, setActiveScenario] = useState<TestScenario>(TEST_SCENARIOS[0]);
  const [currentRecord, setCurrentRecord] = useState<InspectionRecord | null>(null);
  const [isInspecting, setIsInspecting] = useState<boolean>(false);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [selectedDefectId, setSelectedDefectId] = useState<string | null>(null);

  const [isLiveCaptureOpen, setIsLiveCaptureOpen] = useState<boolean>(false);
  const [isDossierOpen, setIsDossierOpen] = useState<boolean>(false);

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
    } catch (err) {
      console.error('Inspection error:', err);
    } finally {
      setIsInspecting(false);
    }
  };

  const handleSelectScenario = (scenario: TestScenario) => {
    setActiveScenario(scenario);
  };

  const handleRunManualInspection = () => {
    if (activeScenario) {
      executeInspectionForScenario(activeScenario);
    }
  };

  const handleReset = () => {
    setActiveScenario(TEST_SCENARIOS[0]);
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
      label: 'Secondary Capture (Perpendicular + Flash)',
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
        customNotes: 'Secondary capture provided by operator. Barcode clear and verified.',
        scenarioKey: 'scenario-01-correct',
        simulatedIssue: 'none',
      });
      setCurrentRecord(reResult);
      setActiveImageIndex(0);
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

    try {
      const result = await runReceivingInspection({
        po,
        images,
        customNotes,
        scenarioKey: 'custom',
      });
      setCurrentRecord(result);
    } catch (err) {
      console.error('Custom inspection failure:', err);
    } finally {
      setIsInspecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30">
      
      {/* Top Warehouse Header */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenLiveCapture={() => setIsLiveCaptureOpen(true)}
        onReset={handleReset}
        isInspecting={isInspecting}
        onRunInspection={handleRunManualInspection}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5">
        
        {/* TAB 1: DOCK INSPECTOR */}
        {activeTab === 'inspector' && (
          <div className="space-y-4">
            
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
                <PoManifestCard po={activeScenario.po} />

                <div className="h-[480px]">
                  <EvidenceCanvas
                    images={activeScenario.images}
                    activeImageIndex={activeImageIndex}
                    onSelectImage={setActiveImageIndex}
                    defects={currentRecord?.damageCheck?.defects || []}
                    selectedDefectId={selectedDefectId}
                    onSelectDefect={setSelectedDefectId}
                    uncertaintyActive={currentRecord?.decision === 'UNCERTAIN'}
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
                  />
                ) : (
                  <div className="h-full flex items-center justify-center bg-slate-900 border border-slate-800 rounded-lg p-8 text-slate-500 font-mono text-xs">
                    Initializing inspection agent pipeline...
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: ARCHITECTURE & METHODOLOGY */}
        {activeTab === 'architecture' && (
          <ArchitectureStudio currentRecord={currentRecord} />
        )}

        {/* TAB 3: EVIDENCE DOSSIER / RMA */}
        {activeTab === 'dossier' && (
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div>
                <h2 className="font-mono text-base font-bold text-slate-100 uppercase">
                  Receiving Evidence Record &amp; Supplier Non-Conformance Dossier
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Audit-ready EDI 861 Receiving Advice format with photographic proof and debit memo calculations.
                </p>
              </div>

              <button
                onClick={() => setIsDossierOpen(true)}
                className="px-3.5 py-2 rounded bg-emerald-600 hover:bg-emerald-500 font-mono text-xs font-bold text-white shadow-md transition-colors"
              >
                Open Full Printable Modal
              </button>
            </div>

            {currentRecord && (
              <div className="space-y-4 text-xs font-mono">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-950 p-4 rounded border border-slate-800">
                  <div>
                    <span className="text-slate-500 uppercase block text-[10px]">Record ID</span>
                    <span className="font-bold text-slate-200">{currentRecord.id}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 uppercase block text-[10px]">PO Reference</span>
                    <span className="font-bold text-slate-200">{currentRecord.po.poNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 uppercase block text-[10px]">Decision Verdict</span>
                    <span className={`font-bold ${
                      currentRecord.decision === 'ACCEPT' ? 'text-emerald-400' : currentRecord.decision === 'EXCEPTION' ? 'text-rose-400' : 'text-amber-400'
                    }`}>{currentRecord.decision}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 uppercase block text-[10px]">Financial Claim</span>
                    <span className="font-bold text-rose-300">
                      ${currentRecord.discrepancyDossier.financialDiscrepancyAmount.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded bg-slate-950 border border-slate-800 space-y-2">
                  <div className="text-slate-400 text-xs">
                    <span className="text-slate-500">Root Cause Summary: </span>
                    {currentRecord.discrepancyDossier.summary}
                  </div>
                  <div className="text-slate-400 text-xs">
                    <span className="text-slate-500">Action Recommended: </span>
                    <span className="text-emerald-400 font-bold">{currentRecord.discrepancyDossier.actionRecommended}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Cryptographic Proof: {currentRecord.discrepancyDossier.inspectionHash}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </main>

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
      <footer className="border-t border-slate-800/80 bg-slate-950 py-3 text-slate-500 text-xs font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span>AI Receiving Manager · Point-of-Receipt Visual Inspection System</span>
          </div>
          <div>
            <span>ISO 9001 / ASTM D642 Standard Inbound Compliance · Dock 07</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
