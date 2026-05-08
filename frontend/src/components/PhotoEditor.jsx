import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Sliders, Check, RotateCcw } from 'lucide-react';

const PhotoEditor = ({ image, onSave, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [filter, setFilter] = useState('none');

  const [isSaving, setIsSaving] = useState(false);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous'); // needed to avoid cross-origin issues
      image.src = url;
    });

  const getCroppedImg = async (imageSrc, pixelCrop, brightness, contrast, filter) => {
    if (!pixelCrop) return null;
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // Apply filters to canvas
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) ${filter === 'grayscale' ? 'grayscale(100%)' : filter === 'sepia' ? 'sepia(100%)' : ''}`;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        resolve(blob);
      }, 'image/jpeg', 0.95);
    });
  };

  const handleSave = async () => {
    if (!croppedAreaPixels) return alert("Please wait for the image to load...");
    setIsSaving(true);
    try {
      const croppedImageBlob = await getCroppedImg(
        image,
        croppedAreaPixels,
        brightness,
        contrast,
        filter
      );
      if (croppedImageBlob) {
        onSave(croppedImageBlob);
      }
    } catch (e) {
      console.error(e);
      alert("Error processing image.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col md:flex-row">
      {/* Cropper Area */}
      <div className="flex-1 relative bg-[#0a0a0a]">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
        <div className="absolute top-6 left-6 text-white bg-black/50 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest backdrop-blur-md border border-white/10">
          Crop your photo
        </div>
        <button 
          onClick={onCancel}
          className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all"
        >
          <X size={24} />
        </button>
      </div>

      {/* Sidebar Editor */}
      <div className="w-full md:w-80 bg-[#161618] border-l border-white/10 p-8 flex flex-col gap-8">
        <div>
          <h2 className="text-xl font-bold text-white mb-2">Refine Photo</h2>
          <p className="text-sm text-gray-500">Adjust crop and appearance</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-wider">
              <span>Zoom</span>
              <span>{Math.round(zoom * 100)}%</span>
            </div>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-wider">
              <span>Brightness</span>
              <span>{brightness}%</span>
            </div>
            <input
              type="range"
              value={brightness}
              min={50}
              max={150}
              onChange={(e) => setBrightness(e.target.value)}
              className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-wider">
              <span>Contrast</span>
              <span>{contrast}%</span>
            </div>
            <input
              type="range"
              value={contrast}
              min={50}
              max={150}
              onChange={(e) => setContrast(e.target.value)}
              className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Filters</p>
          <div className="grid grid-cols-3 gap-3">
            {['none', 'grayscale', 'sepia'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`py-2 text-[10px] font-bold uppercase rounded-lg border transition-all ${filter === f ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto flex gap-3">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all shadow-lg ${isSaving ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'}`}
          >
            {isSaving ? (
              <>Processing...</>
            ) : (
              <><Check size={18} /> Apply</>
            )}
          </button>
          <button 
            onClick={() => {
              setZoom(1);
              setBrightness(100);
              setContrast(100);
              setFilter('none');
            }}
            className="p-3 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-xl transition-all"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoEditor;
