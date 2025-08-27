import React, { useState, useRef, useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageChange: (file: File | null) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
        <label htmlFor="image-upload" className="flex flex-col items-center justify-center cursor-pointer w-full h-full">
            <UploadIcon className="w-10 h-10 text-stone-400 mb-2"/>
            <p className="text-stone-500">
                <span className="font-semibold text-amber-600 hover:underline" onClick={onButtonClick}>Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-stone-400 mt-1">PNG, JPG, WEBP, etc.</p>
        </label>
      )}
    </div>
  );
};
