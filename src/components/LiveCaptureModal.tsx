import React, { useState, useRef } from 'react';
import { PurchaseOrder, InspectionImage } from '../types/receiving';
import { 
  Camera, 
  Upload, 
  X, 
  Check, 
  AlertCircle, 
  Trash2, 
  Cpu, 
  Sparkles,
  Crosshair,
  Image as ImageIcon
} from 'lucide-react';
import { 
  createCartonExteriorSvg, 
  createLabelBarcodeSvg
} from '../data/mockImages';

interface LiveCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultPo: PurchaseOrder;
  onSubmitInspection: (po: PurchaseOrder, images: InspectionImage[], customNotes: string) => void;
}

export const LiveCaptureModal: React.FC<LiveCaptureModalProps> = ({
  isOpen,
  onClose,
  defaultPo,
  onSubmitInspection,
}) => {
  const [poNumber, setPoNumber] = useState(defaultPo.poNumber);
  const [sku, setSku] = useState(defaultPo.sku);
  const [expectedQty, setExpectedQty] = useState(defaultPo.expectedQuantity);
  const [variant, setVariant] = useState(defaultPo.variant);
  const [supplierName, setSupplierName] = useState(defaultPo.supplierName);
  const [customNotes, setCustomNotes] = useState('');

  const [uploadedImages, setUploadedImages] = useState<InspectionImage[]>([]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError('Camera access unavailable or permission denied. Please use photo upload or sample presets.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const captureCameraSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

    const newImage: InspectionImage = {
      id: `img-live-${Date.now()}`,
      label: `Dock Camera Capture #${uploadedImages.length + 1}`,
      role: uploadedImages.length === 0 ? 'carton_exterior' : 'opened_units',
      url: dataUrl,
      dataUrl,
      description: 'Live webcam snapshot at warehouse receiving dock.',
    };

    setUploadedImages([...uploadedImages, newImage]);
    stopCamera();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const newImg: InspectionImage = {
          id: `img-upload-${Date.now()}-${idx}`,
          label: file.name.slice(0, 24),
          role: idx === 0 ? 'carton_exterior' : idx === 1 ? 'barcode_label' : 'opened_units',
          url: dataUrl,
          dataUrl,
          description: `Uploaded inspection photo: ${file.name}`,
        };
        setUploadedImages(prev => [...prev, newImg]);
      };
      reader.readAsDataURL(file);
    });
  };

  const loadSampleCrushedPreset = () => {
    const labelImg: InspectionImage = {
      id: `sample-label-${Date.now()}`,
      label: 'Sample Shipping Label',
      role: 'barcode_label',
      url: createLabelBarcodeSvg({ sku, variant, expectedQty, barcodeStatus: 'clean' }),
      description: 'Simulated label barcode image',
    };
    const crushedImg: InspectionImage = {
      id: `sample-crushed-${Date.now()}`,
      label: 'Sample Crushed Corner',
      role: 'carton_exterior',
      url: createCartonExteriorSvg({ condition: 'crushed', sku }),
      description: 'Simulated crushed carton corner',
    };
    setUploadedImages([labelImg, crushedImg]);
    setCustomNotes('Simulated ASTM D642 corner compression damage test.');
  };

  const loadSampleWaterDamagePreset = () => {
    const labelImg: InspectionImage = {
      id: `sample-label-${Date.now()}`,
      label: 'Sample Shipping Label',
      role: 'barcode_label',
      url: createLabelBarcodeSvg({ sku, variant, expectedQty, barcodeStatus: 'clean' }),
      description: 'Simulated label barcode image',
    };
    const waterImg: InspectionImage = {
      id: `sample-water-${Date.now()}`,
      label: 'Sample Water Damaged Carton',
      role: 'carton_exterior',
      url: createCartonExteriorSvg({ condition: 'water_damaged', sku }),
      description: 'Simulated moisture tide stain along corrugation',
    };
    setUploadedImages([labelImg, waterImg]);
    setCustomNotes('Simulated water capillary absorption damage test.');
  };

  const removeImage = (id: string) => {
    setUploadedImages(uploadedImages.filter(img => img.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadedImages.length === 0) {
      alert('Please upload, capture, or select at least one photograph of the incoming shipment.');
      return;
    }

    const updatedPo: PurchaseOrder = {
      ...defaultPo,
      poNumber,
      sku,
      expectedQuantity: Number(expectedQty),
      variant,
      supplierName,
      totalCost: Number(expectedQty) * defaultPo.unitCost,
    };

    stopCamera();
    onSubmitInspection(updatedPo, uploadedImages, customNotes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#090e1a] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#060a14] border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white uppercase tracking-tight font-sans">
                Custom Inbound Inspection (Live Camera / Photo Upload)
              </h2>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                Multimodal Gemini 3.8 Flash Vision Agent Ready
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Purchase Order Inputs */}
          <div className="bg-[#060a14] p-4 rounded-xl border border-white/5 space-y-3">
            <span className="font-mono font-bold text-slate-300 uppercase text-[11px] block">
              Inbound Purchase Order (PO) Baseline
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1">PO NUMBER</label>
                <input
                  type="text"
                  value={poNumber}
                  onChange={(e) => setPoNumber(e.target.value)}
                  className="w-full bg-[#0d1424] border border-white/10 rounded-lg px-3 py-1.5 font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1">EXPECTED SKU</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full bg-[#0d1424] border border-white/10 rounded-lg px-3 py-1.5 font-mono text-cyan-300 font-bold focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1">ORDERED UNITS</label>
                <input
                  type="number"
                  min="1"
                  value={expectedQty}
                  onChange={(e) => setExpectedQty(Number(e.target.value))}
                  className="w-full bg-[#0d1424] border border-white/10 rounded-lg px-3 py-1.5 font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1">VARIANT (COLOR/SPEC)</label>
                <input
                  type="text"
                  value={variant}
                  onChange={(e) => setVariant(e.target.value)}
                  className="w-full bg-[#0d1424] border border-white/10 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] text-slate-400 font-mono block mb-1">SUPPLIER NAME</label>
                <input
                  type="text"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  className="w-full bg-[#0d1424] border border-white/10 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-mono block mb-1">OPERATOR DOCK REMARKS (OPTIONAL)</label>
              <input
                type="text"
                placeholder="e.g. Master carton dropped during offloading, verify corner integrity..."
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                className="w-full bg-[#0d1424] border border-white/10 rounded-lg px-3 py-1.5 text-slate-300 text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Photo Capture & Upload Box */}
          <div className="bg-[#060a14] p-4 rounded-xl border border-white/5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="font-mono font-bold text-slate-300 uppercase text-[11px]">
                Inbound Visual Evidence ({uploadedImages.length} attached)
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111a2e] hover:bg-[#16223d] text-cyan-300 border border-cyan-500/30 text-xs font-mono transition-colors"
                >
                  <Upload className="h-3.5 w-3.5" />
                  <span>Upload Files</span>
                </button>

                {!isCameraActive ? (
                  <button
                    type="button"
                    onClick={startCamera}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111a2e] hover:bg-[#16223d] text-emerald-300 border border-emerald-500/30 text-xs font-mono transition-colors"
                  >
                    <Camera className="h-3.5 w-3.5" />
                    <span>Open Camera</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={captureCameraSnapshot}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-xs transition-colors shadow-lg"
                  >
                    <Camera className="h-3.5 w-3.5" />
                    <span>Snap Photo</span>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Demo Presets */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] font-mono text-slate-500">Quick Test Presets:</span>
              <button
                type="button"
                onClick={loadSampleCrushedPreset}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-amber-300 border border-white/10"
              >
                + Preset: Crushed Corner
              </button>
              <button
                type="button"
                onClick={loadSampleWaterDamagePreset}
                className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-cyan-300 border border-white/10"
              >
                + Preset: Water Stain
              </button>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Camera Viewfinder if active */}
            {isCameraActive && (
              <div className="relative rounded-xl overflow-hidden border-2 border-emerald-500/50 bg-black aspect-video flex items-center justify-center shadow-2xl">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                
                {/* HUD alignment reticle */}
                <div className="absolute inset-8 border border-emerald-400/30 rounded-lg pointer-events-none flex items-center justify-center">
                  <Crosshair className="h-10 w-10 text-emerald-400/40" />
                </div>

                <div className="absolute top-2 right-2">
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="p-1.5 rounded-full bg-black/70 text-white hover:bg-black"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                  <button
                    type="button"
                    onClick={captureCameraSnapshot}
                    className="px-5 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black font-mono text-xs shadow-xl tracking-wide"
                  >
                    CAPTURE INSPECTION PHOTO
                  </button>
                </div>
              </div>
            )}

            {cameraError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{cameraError}</span>
              </div>
            )}

            {/* Attached Thumbnails Strip */}
            {uploadedImages.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-2">
                {uploadedImages.map((img) => (
                  <div key={img.id} className="relative rounded-xl border border-white/10 bg-[#0d1424] p-2 flex items-center gap-2.5">
                    <div className="w-12 h-10 rounded-lg bg-black overflow-hidden shrink-0 border border-white/10">
                      <img src={img.dataUrl || img.url} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="truncate flex-1">
                      <div className="font-mono text-[10px] text-slate-200 truncate font-bold">{img.label}</div>
                      <select
                        value={img.role}
                        onChange={(e) => {
                          const updated = uploadedImages.map(i => i.id === img.id ? { ...i, role: e.target.value as any } : i);
                          setUploadedImages(updated);
                        }}
                        className="bg-[#060a14] border border-white/10 text-[9px] font-mono text-slate-300 rounded px-1.5 py-0.5 mt-1 focus:outline-none"
                      >
                        <option value="carton_exterior">Carton Exterior</option>
                        <option value="barcode_label">Barcode Label</option>
                        <option value="opened_units">Opened Grid</option>
                        <option value="product_detail">Product Detail</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(img.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
                      title="Remove image"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-white/10 rounded-xl p-6 text-center text-slate-400 font-mono text-xs flex flex-col items-center justify-center gap-1.5">
                <ImageIcon className="h-6 w-6 text-slate-500 mb-1" />
                <span>No photographs attached yet.</span>
                <span className="text-[11px] text-slate-500">Upload photos or click a preset above to test the vision agent.</span>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10">
            <span className="text-[11px] text-slate-500 font-mono">
              Server API: <span className="text-slate-400">POST /api/analyze-receiving</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  onClose();
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={uploadedImages.length === 0}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black font-sans text-xs transition-all shadow-lg active:scale-95"
              >
                <Cpu className="h-4 w-4" />
                <span>Launch Multimodal Inspection</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
