import React, { useState } from 'react';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';
import { SpeakerIcon } from './icons/SpeakerIcon';
import { SpeakerOffIcon } from './icons/SpeakerOffIcon';

interface AssetCardProps {
  title: string;
  content: string | string[];
  isSpeaking?: boolean;
  onSpeak?: (content: string) => void;
}

export const AssetCard: React.FC<AssetCardProps> = ({ title, content, isSpeaking, onSpeak }) => {
  const [copied, setCopied] = useState(false);
  
  const contentString = Array.isArray(content) ? content.join(' ') : content;

  const handleCopy = () => {
    navigator.clipboard.writeText(contentString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-stone-200 relative">
      <h4 className="font-bold text-stone-700 mb-2">{title}</h4>
      {Array.isArray(content) ? (
        <div className="flex flex-wrap gap-2">
            {content.map((item, index) => (
                <span key={index} className="bg-amber-100 text-amber-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                    {item}
                </span>
            ))}
        </div>
      ) : (
        <p className="text-stone-600 whitespace-pre-wrap">{content}</p>
      )}
      <div className="absolute top-3 right-3 flex items-center gap-2">
        {onSpeak && (
            <button 
                onClick={() => onSpeak(contentString)}
                className="p-1.5 rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                aria-label={isSpeaking ? 'Stop reading' : `Read ${title} aloud`}
            >
                {isSpeaking ? <SpeakerOffIcon /> : <SpeakerIcon />}
            </button>
        )}
        <button 
            onClick={handleCopy}
            className="p-1.5 rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
            aria-label={`Copy ${title}`}
        >
            {copied ? <CheckIcon className="text-green-500" /> : <CopyIcon />}
        </button>
      </div>
    </div>
  );
};