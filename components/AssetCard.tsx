import React, { useState } from 'react';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';

interface AssetCardProps {
  title: string;
  content: string | string[];
}

export const AssetCard: React.FC<AssetCardProps> = ({ title, content }) => {
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
      <button 
        onClick={handleCopy}
        className="absolute top-3 right-3 p-1.5 rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
        aria-label={`Copy ${title}`}
      >
        {copied ? <CheckIcon className="text-green-500" /> : <CopyIcon />}
      </button>
    </div>
  );
};
