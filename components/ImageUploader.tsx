import React, { useState, useRef, useCallback, useEffect } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { CameraIcon } from './icons/CameraIcon';

interface ImageUploaderProps {
  onImageChange: (file: File | null) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleFileChange = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageChange(file);
    }
  };
  
  // Attach stream to video element when camera is shown
  useEffect(() => {
    if (showCamera && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [showCamera]);

  const openCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        setCameraError(null);
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        streamRef.current = stream;
        setShowCamera(true);
      } catch (err) {
        console.error("Error accessing camera:", err);
        setCameraError("Could not access the camera. Please check permissions and try again.");
      }
    } else {
      setCameraError("Camera access is not supported by your browser.");
    }
  };
  
  const closeCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setShowCamera(false);
  }, []);
  
  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          handleFileChange(dataTransfer.files);
        }
      }, 'image/jpeg');
      
      closeCamera();
    }
  }, [closeCamera]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files);
    }
  }, []);
  
  const onButtonClick = () => {
    inputRef.current?.click();
  };

  const removeImage = () => {
      setImagePreview(null);
      onImageChange(null);
      if(inputRef.current) {
          inputRef.current.value = "";
      }
  }

  return (
    <>
        <div 
            className={`relative w-full h-64 border-2 ${dragActive ? 'border-amber-500' : 'border-dashed border-stone-300'} rounded-lg flex flex-col justify-center items-center text-center p-4 transition-all duration-300 ${dragActive ? 'bg-amber-50' : 'bg-white'}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e.target.files)}
            className="hidden"
            id="image-upload"
          />
          {imagePreview ? (
            <>
              <img src={imagePreview} alt="Preview" className="max-h-full max-w-full object-contain rounded-md" />
              <button 
                onClick={removeImage} 
                className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md text-stone-600 hover:bg-red-100 hover:text-red-600 transition-colors"
                aria-label="Remove image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full">
                <UploadIcon className="w-10 h-10 text-stone-400 mb-2"/>
                <p className="text-stone-500">
                    <button type="button" className="font-semibold text-amber-600 hover:underline bg-transparent border-none p-0 cursor-pointer" onClick={onButtonClick}>Click to upload</button> or drag and drop
                </p>
                <div className="flex items-center my-2 w-3/4">
                    <div className="flex-grow border-t border-stone-300"></div>
                    <span className="flex-shrink mx-2 text-stone-400 text-sm">OR</span>
                    <div className="flex-grow border-t border-stone-300"></div>
                </div>
                 <button 
                    type="button" 
                    onClick={openCamera}
                    className="flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-600 font-semibold rounded-lg hover:bg-stone-200 transition-colors"
                 >
                    <CameraIcon className="w-5 h-5" />
                    Use Camera
                </button>
                <p className="text-xs text-stone-400 mt-2">PNG, JPG, WEBP, etc.</p>
                {cameraError && <p className="text-xs text-red-500 mt-1">{cameraError}</p>}
            </div>
          )}
        </div>

        {showCamera && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in">
                <div className="bg-white rounded-lg p-4 max-w-3xl w-full relative">
                    <h3 className="text-xl font-bold mb-4 text-center">Camera</h3>
                    <div className="relative bg-black rounded overflow-hidden">
                        <video ref={videoRef} autoPlay playsInline className="w-full h-auto" />
                    </div>
                     <button 
                        onClick={closeCamera}
                        className="absolute top-4 right-4 text-stone-500 bg-white bg-opacity-80 rounded-full p-2 hover:bg-stone-100 transition-colors"
                        aria-label="Close camera"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                    <div className="mt-4 flex justify-center items-center">
                        <button 
                            onClick={captureImage}
                            className="w-16 h-16 bg-white rounded-full border-4 border-stone-300 hover:border-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all"
                            aria-label="Capture image"
                        >
                            <div className="w-full h-full rounded-full bg-amber-500 scale-75 group-hover:scale-90 transition-transform"></div>
                        </button>
                    </div>
                </div>
            </div>
        )}
        <canvas ref={canvasRef} className="hidden" />
    </>
  );
};