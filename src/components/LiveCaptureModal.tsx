import React, { useState, useRef } from 'react';
import { PurchaseOrder, InspectionImage } from '../types/receiving';
import { 
  Camera, 
  Upload, 
  X, 
  Check, 
  AlertCircle, 
  Layers, 
  Tag, 
  Plus, 
  Trash2,
  Cpu
} from 'lucide-react';

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
      setCameraError('Camera access unavailable or permission denied. Please use photo upload.');
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

  const removeImage = (id: string) => {
    setUploadedImages(uploadedImages.filter(img => img.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadedImages.length === 0) {
      alert('Please upload or capture at least one photograph of the incoming shipment.');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <Camera className="h-5 w-5 text-emerald-400" />
            <div>
              <h2 className="font-mono text-sm font-bold text-slate-100 uppercase">
                Custom Inbound Inspection (Live Camera / Photo Upload)
              </h2>
              <div className="text-[11px] text-slate-400 font-mono">
                Multimodal Gemini 3.8 Flash Vision Agent Ready
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          
          {/* Purchase Order Inputs */}
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
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
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 font-mono text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1">EXPECTED SKU</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 font-mono text-emerald-400 font-bold"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1">ORDERED QTY</label>
                <input
                  type="number"
                  min="1"
                  value={expectedQty}
                  onChange={(e) => setExpectedQty(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 font-mono text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1">VARIANT (COLOR/SPEC)</label>
                <input
                  type="text"
                  value={variant}
                  onChange={(e) => setVariant(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] text-slate-400 font-mono block mb-1">SUPPLIER NAME</label>
                <input
                  type="text"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-mono block mb-1">OPERATOR NOTES / CONTEXT (OPTIONAL)</label>
              <input
                type="text"
                placeholder="e.g. Pallet dropped during unloading, suspect corner damage..."
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-300 text-xs"
              />
            </div>
          </div>

          {/* Photo Capture & Upload Box */}
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-slate-300 uppercase text-[11px]">
                Inbound Photographs ({uploadedImages.length} attached)
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono transition-colors"
                >
                  <Upload className="h-3 w-3 text-sky-400" />
                  <span>Upload Files</span>
                </button>

                {!isCameraActive ? (
                  <button
                    type="button"
                    onClick={startCamera}
                    className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono transition-colors"
                  >
                    <Camera className="h-3 w-3 text-emerald-400" />
                    <span>Open Camera</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={captureCameraSnapshot}
                    className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-colors"
                  >
                    <Camera className="h-3 w-3" />
                    <span>Snap Photo</span>
                  </button>
                )}
              </div>
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
              <div className="relative rounded overflow-hidden border border-emerald-500/50 bg-black aspect-video flex items-center justify-center">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2">
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="p-1 rounded bg-black/60 text-white hover:bg-black/90"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                  <button
                    type="button"
                    onClick={captureCameraSnapshot}
                    className="px-4 py-1.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-mono text-xs shadow-lg"
                  >
                    Capture Snapshot
                  </button>
                </div>
              </div>
            )}

            {cameraError && (
              <div className="p-2.5 rounded bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{cameraError}</span>
              </div>
            )}

            {/* Attached Thumbnails Strip */}
            {uploadedImages.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-2">
                {uploadedImages.map((img) => (
                  <div key={img.id} className="relative rounded border border-slate-800 bg-slate-900 p-1.5 flex items-center gap-2">
                    <div className="w-12 h-10 rounded bg-black overflow-hidden shrink-0">
                      <img src={img.dataUrl || img.url} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="truncate flex-1">
                      <div className="font-mono text-[10px] text-slate-200 truncate">{img.label}</div>
                      <select
                        value={img.role}
                        onChange={(e) => {
                          const updated = uploadedImages.map(i => i.id === img.id ? { ...i, role: e.target.value as any } : i);
                          setUploadedImages(updated);
                        }}
                        className="bg-slate-950 border border-slate-800 text-[9px] font-mono text-slate-400 rounded px-1 py-0.5 mt-0.5"
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
                      className="p-1 text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-slate-800 rounded-lg p-6 text-center text-slate-500 font-mono text-xs">
                No photographs attached yet. Upload photos from your camera roll or take a snapshot.
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <span className="text-[11px] text-slate-500 font-mono">
              Server API: POST /api/analyze-receiving
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  stopCamera();
                  onClose();
                }}
                className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={uploadedImages.length === 0}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-mono font-bold text-xs transition-colors shadow-md"
              >
                <Cpu className="h-3.5 w-3.5" />
                <span>Launch Agent Inspection</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
