
import React, { useState, useMemo, useCallback } from 'react';
import { SavedKit, MarketingContent } from '../types';
import { DownloadIcon } from './icons/DownloadIcon';
import { AssetCard } from './AssetCard';
import { LANGUAGES } from '../constants';
import { ShareButtons } from './ShareButtons';
import { translateContent } from '../services/geminiService';
import { CartIcon } from './icons/CartIcon';
import { CheckIcon } from './icons/CheckIcon';

interface ResultDisplayProps {
  initialKit: SavedKit;
  onAddToCart: () => void;
  isItemInCart: boolean;
}

const TranslationLoader: React.FC = () => (
    <div className="flex flex-col items-center justify-center p-6 bg-stone-50/50 rounded-lg border border-dashed">
        <div className="w-8 h-8 border-2 border-t-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-3 text-sm font-semibold text-stone-600">Translating...</p>
    </div>
);


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ initialKit, onAddToCart, isItemInCart }) => {
  const [activeTab, setActiveTab] = useState<'english' | 'translated'>('english');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [translatedContent, setTranslatedContent] = useState<MarketingContent | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [translationError, setTranslationError] = useState<string | null>(null);

  const assets = initialKit.generatedAssets;
  
  const targetLanguageName = useMemo(() => {
    return LANGUAGES.find(l => l.code === selectedLanguage)?.name;
  }, [selectedLanguage]);

  const handleLanguageChange = useCallback(async (languageCode: string) => {
    if (!languageCode) return;
    
    setActiveTab('translated');
    setIsTranslating(true);
    setTranslatedContent(null);
    setSelectedLanguage(languageCode);
    setTranslationError(null);

    try {
      const translation = await translateContent(assets.english, languageCode);
      setTranslatedContent(translation);
    } catch (err) {
      console.error(err);
      setTranslationError(err instanceof Error ? err.message : 'Failed to translate content.');
    } finally {
      setIsTranslating(false);
    }
  }, [assets.english]);


  const content = activeTab === 'english' ? assets.english : translatedContent;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = assets.posterImageUrls[selectedImageIndex];
    link.download = `${assets.english.title.replace(/\s+/g, '_')}_poster_${selectedImageIndex + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Poster Column */}
        <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-lg border border-stone-200">
                <img src={assets.posterImageUrls[selectedImageIndex]} alt={`Generated marketing poster ${selectedImageIndex + 1}`} className="w-full h-auto object-cover rounded-md aspect-[3/4]" />
            </div>
            <div className="grid grid-cols-5 gap-2">
                {assets.posterImageUrls.map((url, index) => (
                    <button key={index} onClick={() => setSelectedImageIndex(index)} className={`rounded-md overflow-hidden border-2 ${selectedImageIndex === index ? 'border-amber-500 ring-2 ring-amber-500' : 'border-transparent hover:border-amber-400'}`}>
                        <img src={url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover aspect-[3/4]" />
                    </button>
                ))}
            </div>
             <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-stone-200 text-stone-700 font-semibold rounded-lg hover:bg-stone-300 focus:outline-none focus:ring-4 focus:ring-stone-300 transition-all"
              >
                <DownloadIcon />
                Download Poster {selectedImageIndex + 1}
            </button>
            <details className="pt-2">
                <summary className="cursor-pointer text-sm text-stone-500 hover:text-stone-800">View AI Prompt for Poster {selectedImageIndex + 1}</summary>
                <p className="mt-2 text-xs p-3 bg-stone-100 rounded-md text-stone-600">{assets.posterPrompts[selectedImageIndex]}</p>
            </details>
        </div>

        {/* Text Assets Column */}
        <div className="space-y-6">
            <div className="space-y-3">
                <h2 className="text-3xl font-bold text-stone-800">{assets.english.title}</h2>
                <p className="text-stone-600">{assets.english.description}</p>
            </div>

            <button
                onClick={onAddToCart}
                disabled={isItemInCart}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-amber-600 text-white font-bold rounded-lg shadow-md hover:bg-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-300 transition-all disabled:bg-stone-400 disabled:cursor-not-allowed"
                >
                {isItemInCart ? <><CheckIcon className="w-5 h-5" /> In Cart</> : <><CartIcon className="w-5 h-5"/> Add to Cart</>}
            </button>

            <div className="pt-4 space-y-4">
              <h3 className="text-2xl font-semibold text-stone-700 border-b-2 border-amber-500 pb-2">The Story & Marketing Kit</h3>

              <div className="p-4 bg-white border border-stone-200 rounded-lg shadow-sm">
                  <label htmlFor="language-select" className="block text-sm font-medium text-stone-600 mb-2">
                      Translate to another language:
                  </label>
                  <select
                      id="language-select"
                      value={selectedLanguage}
                      onChange={(e) => handleLanguageChange(e.target.value)}
                      disabled={isTranslating}
                      className="w-full p-3 bg-white border border-stone-300 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-150 ease-in-out disabled:bg-stone-100 disabled:cursor-wait"
                      >
                      <option value="" disabled>Select a language...</option>
                      {LANGUAGES.map((lang) => (
                          <option key={lang.code} value={lang.code}>{lang.name}</option>
                      ))}
                  </select>
              </div>

              <div className="flex border-b border-stone-200">
                  <button
                      onClick={() => setActiveTab('english')}
                      className={`px-4 py-2 font-semibold transition-colors duration-200 ${activeTab === 'english' ? 'border-b-2 border-amber-600 text-amber-600' : 'text-stone-500 hover:text-stone-800'}`}
                  >
                      English
                  </button>
                  {targetLanguageName && (
                      <button
                          onClick={() => setActiveTab('translated')}
                          className={`px-4 py-2 font-semibold transition-colors duration-200 ${activeTab === 'translated' ? 'border-b-2 border-amber-600 text-amber-600' : 'text-stone-500 hover:text-stone-800'}`}
                      >
                          {targetLanguageName}
                      </button>
                  )}
              </div>
            
              <div className="space-y-4 pt-2">
                  {activeTab === 'translated' && isTranslating && <TranslationLoader />}
                  {activeTab === 'translated' && translationError && !isTranslating && (
                      <p className="text-center text-red-600 bg-red-100 p-3 rounded-lg">{translationError}</p>
                  )}
                  {content && !isTranslating && (
                      <>
                          <AssetCard title="Artisan's Story" content={content.story} />
                          <AssetCard title="Social Media Hashtags" content={content.hashtags} />
                          <div className="pt-4">
                            <h4 className="font-bold text-stone-700 mb-3 text-lg">Share Your Kit</h4>
                            <ShareButtons content={content} />
                          </div>
                      </>
                  )}
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};
