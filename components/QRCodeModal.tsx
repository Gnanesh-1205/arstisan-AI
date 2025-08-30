
import React, { useEffect, useRef } from 'react';

declare var QRCode: any; // From the script in index.html

interface QRCodeModalProps {
  url: string;
  onClose: () => void;
  title: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ url, onClose, title }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && url && typeof QRCode !== 'undefined') {
      QRCode.toCanvas(canvasRef.current, url, { width: 256 }, (error: any) => {
        if (error) console.error('QR Code generation error:', error);
      });
    }
  }, [url]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg p-6 max-w-sm w-full relative text-center shadow-2xl"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <h3 className="text-xl font-bold mb-2 text-stone-700">Scan to Review</h3>
        <p className="text-stone-500 mb-4 text-sm">Scan this QR code with your phone to leave a review for "{title}".</p>
        <div className="flex justify-center p-4 bg-stone-50 rounded-md">
            <canvas ref={canvasRef} />
        </div>
        <p className="text-xs text-stone-400 mt-4 break-words">{url}</p>
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-stone-500 bg-white bg-opacity-80 rounded-full p-2 hover:bg-stone-100 transition-colors"
          aria-label="Close QR Code Modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
    </div>
  );
};
