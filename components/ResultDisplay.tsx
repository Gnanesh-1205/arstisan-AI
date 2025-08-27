import React from 'react';
import { GeneratedAssets } from '../types';
import { ResetIcon } from './icons/ResetIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { AssetCard } from './AssetCard';

interface ResultDisplayProps {
  assets: GeneratedAssets;
  onReset: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ assets, onReset }) => {
  const [activeTab, setActiveTab] = React.useState<'english' | 'translated'>('english');
  const content = assets[activeTab];

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = assets.posterImageUrl;
    link.download = `${assets.english.title.replace(/\s+/g, '_')}_poster.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-stone-800">Your Marketing Kit is Ready!</h2>
        <p className="mt-2 text-stone-600">Here are the generated assets to help you sell your craft.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Poster Column */}
        <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-stone-700 border-b-2 border-amber-500 pb-2">Marketing Poster</h3>
            <div className="bg-white p-4 rounded-lg shadow-lg border border-stone-200">
                <img src={assets.posterImageUrl} alt="Generated marketing poster" className="w-full h-auto object-cover rounded-md" />
            </div>
             <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 text-white font-bold rounded-lg shadow-md hover:bg-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-300 transition-all duration-300"
              >
                <DownloadIcon />
                Download Poster
            </button>
            <details className="pt-2">
                <summary className="cursor-pointer text-sm text-stone-500 hover:text-stone-800">View AI Prompt</summary>
                <p className="mt-2 text-xs p-3 bg-stone-100 rounded-md text-stone-600">{assets.posterPrompt}</p>
            </details>
        </div>

        {/* Text Assets Column */}
        <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-stone-700 border-b-2 border-amber-500 pb-2">Marketing Text</h3>
             <div className="flex border-b border-stone-200">
                <button
                    onClick={() => setActiveTab('english')}
                    className={`px-4 py-2 font-semibold transition-colors duration-200 ${activeTab === 'english' ? 'border-b-2 border-amber-600 text-amber-600' : 'text-stone-500 hover:text-stone-800'}`}
                >
                    English
                </button>
                <button
                    onClick={() => setActiveTab('translated')}
                    className={`px-4 py-2 font-semibold transition-colors duration-200 ${activeTab === 'translated' ? 'border-b-2 border-amber-600 text-amber-600' : 'text-stone-500 hover:text-stone-800'}`}
                >
                    {assets.targetLanguageName}
                </button>
            </div>
            
            <div className="space-y-4 pt-2">
                <AssetCard title="Product Title" content={content.title} />
                <AssetCard title="Product Description" content={content.description} />
                <AssetCard title="Artisan's Story" content={content.story} />
                <AssetCard title="Social Media Hashtags" content={content.hashtags} />
            </div>
        </div>
      </div>

      <div className="pt-8 text-center">
        <button
          type="button"
          onClick={onReset}
          className="flex items-center justify-center gap-2 mx-auto px-8 py-3 bg-stone-200 text-stone-700 font-semibold rounded-lg hover:bg-stone-300 focus:outline-none focus:ring-4 focus:ring-stone-300 transition-all duration-300"
        >
          <ResetIcon />
          Create Another Kit
        </button>
      </div>
    </div>
  );
};
