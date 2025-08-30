
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { SavedKit, MarketingContent } from '../types';
import { DownloadIcon } from './icons/DownloadIcon';
import { AssetCard } from './AssetCard';
import { LANGUAGES } from '../constants';
import { ShareButtons } from './ShareButtons';
import { translateContent } from '../services/geminiService';
import { CartIcon } from './icons/CartIcon';
import { CheckIcon } from './icons/CheckIcon';
import { SpeakerIcon } from './icons/SpeakerIcon';
import { SpeakerOffIcon } from './icons/SpeakerOffIcon';
import { HeartIcon } from './icons/HeartIcon';
import { ZapIcon } from './icons/ZapIcon';

interface ResultDisplayProps {
  initialKit: SavedKit;
  onAddToCart: () => void;
  onBuyNow: () => void;
  isItemInCart: boolean;
  isItemInWishlist: boolean;
  onToggleWishlist: () => void;
}

const TranslationLoader: React.FC = () => (
  <div className="flex items-center justify-center p-4 bg-stone-50 rounded-lg">
    <div className="w-5 h-5 border-2 border-t-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
    <p className="ml-3 text-sm text-stone-500">Translating...</p>
  </div>
);

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ initialKit, onAddToCart, onBuyNow, isItemInCart, isItemInWishlist, onToggleWishlist }) => {
  const [selectedImage, setSelectedImage] = useState(initialKit.userInput.imageFile);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [translatedContent, setTranslatedContent] = useState<Record<string, MarketingContent>>({
    english: initialKit.generatedAssets.english,
  });
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [speakingAsset, setSpeakingAsset] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
      }
    };

    // The voices list is loaded asynchronously.
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices(); // For browsers that load it immediately

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);
  
  const handleSpeak = useCallback((text: string, assetKey: string) => {
    if (!window.speechSynthesis) {
        alert('Your browser does not support text-to-speech.');
        return;
    }
    if (speakingAsset === assetKey) {
        window.speechSynthesis.cancel();
        setSpeakingAsset(null);
        return;
    }
    if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);

    // Map our short codes to BCP 47 language tags for better voice matching
    const langMap: { [key: string]: string } = {
      english: 'en-US',
      hi: 'hi-IN',
      bn: 'bn-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      mr: 'mr-IN',
      gu: 'gu-IN',
      kn: 'kn-IN',
      ml: 'ml-IN',
      pa: 'pa-IN',
      es: 'es-ES',
      fr: 'fr-FR',
      de: 'de-DE',
      ja: 'ja-JP',
    };

    const targetLang = langMap[selectedLanguage] || selectedLanguage;
    utterance.lang = targetLang;

    // Find a specific voice for the target language for more reliable playback
    const voice = voices.find(v => v.lang === targetLang);
    if (voice) {
      utterance.voice = voice;
    } else {
      console.warn(`Speech synthesis voice not found for language: ${targetLang}. Using browser default.`);
    }
    
    utterance.onstart = () => setSpeakingAsset(assetKey);
    utterance.onend = () => setSpeakingAsset(null);
    utterance.onerror = (e: SpeechSynthesisErrorEvent) => {
        // Gracefully handle interruptions, which are not true errors.
        if (e.error === 'interrupted') {
            console.log('Speech was interrupted.');
        } else {
            console.error('Speech synthesis error:', e.error);
        }
        setSpeakingAsset(null);
    };
    window.speechSynthesis.speak(utterance);
  }, [speakingAsset, selectedLanguage, voices]);

  useEffect(() => {
    return () => {
        if (window.speechSynthesis && window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }
    };
  }, []);


  const handleLanguageChange = useCallback(async (langCode: string) => {
    if (langCode === 'english' || translatedContent[langCode]) {
      setSelectedLanguage(langCode);
      return;
    }

    setIsTranslating(true);
    setError(null);
    try {
      const translation = await translateContent(initialKit.generatedAssets.english, langCode);
      setTranslatedContent(prev => ({ ...prev, [langCode]: translation }));
      setSelectedLanguage(langCode);
    } catch (err) {
      console.error("Translation failed:", err);
      setError("Sorry, we couldn't translate the content. Please try again.");
    } finally {
      setIsTranslating(false);
    }
  }, [initialKit.generatedAssets.english, translatedContent]);

  const currentContent = useMemo(() => {
    return translatedContent[selectedLanguage] || initialKit.generatedAssets.english;
  }, [selectedLanguage, translatedContent, initialKit.generatedAssets.english]);

  const allImages = useMemo(() => [
    initialKit.userInput.imageFile,
    ...initialKit.generatedAssets.posterImageUrls,
  ], [initialKit]);
  
  const handleDownload = (imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `artisan-ai-${initialKit.id}-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="space-y-8 animate-fade-in">
        {/* Product Header */}
        <div className="text-center">
            <div className="flex items-center justify-center gap-4">
                <h2 className="text-3xl sm:text-4xl font-bold text-stone-800">{currentContent.title}</h2>
                <button
                    onClick={onToggleWishlist}
                    className="p-2 rounded-full text-red-500 hover:bg-red-50 transition-colors"
                    aria-label={isItemInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    <HeartIcon isFilled={isItemInWishlist} className="w-8 h-8" />
                </button>
            </div>
          <p className="mt-3 text-3xl font-bold text-amber-700">{`₹${initialKit.userInput.price.toFixed(2)}`}</p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-lg shadow-lg border border-stone-200 overflow-hidden">
              <img
                src={selectedImage}
                alt={currentContent.title}
                className="w-full h-auto object-contain transition-all duration-300"
                style={{aspectRatio: '3/4'}}
              />
               <button
                  onClick={() => handleDownload(selectedImage)}
                  className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-2 text-stone-600 hover:bg-white hover:text-amber-600 transition-colors shadow"
                  aria-label="Download image"
                >
                  <DownloadIcon className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(img)}
                  className={`block rounded-md overflow-hidden border-2 ${selectedImage === img ? 'border-amber-500' : 'border-transparent'} hover:border-amber-400 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500`}
                  aria-label={`View image ${index + 1}`}
                >
                  <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" style={{aspectRatio: '1/1'}}/>
                </button>
              ))}
            </div>
          </div>

          {/* Product Details & Actions */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-lg border border-stone-200">
               <h3 className="text-2xl font-semibold text-stone-700 mb-4 border-b pb-3">Product Story &amp; Details</h3>
               
               {/* Language Selector */}
               <div className="mb-4">
                   <label htmlFor="language-select" className="block text-sm font-medium text-stone-600 mb-1">Translate Content:</label>
                   <select
                      id="language-select"
                      value={selectedLanguage}
                      onChange={(e) => handleLanguageChange(e.target.value)}
                      className="w-full p-2 bg-white border border-stone-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500 text-stone-800"
                      disabled={isTranslating}
                   >
                      <option value="english">English (Original)</option>
                      {LANGUAGES.map(lang => (
                          <option key={lang.code} value={lang.code}>{lang.name}</option>
                      ))}
                   </select>
                   {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
               </div>
               
               {isTranslating ? (
                  <TranslationLoader />
               ) : (
                  <div className="space-y-4">
                       <AssetCard
                        title="Description"
                        content={currentContent.description}
                        isSpeaking={speakingAsset === 'description'}
                        onSpeak={(text) => handleSpeak(text, 'description')}
                      />
                      <AssetCard
                        title="The Story"
                        content={currentContent.story}
                        isSpeaking={speakingAsset === 'story'}
                        onSpeak={(text) => handleSpeak(text, 'story')}
                      />
                      <AssetCard title="Hashtags for Social Media" content={currentContent.hashtags} />
                  </div>
               )}
            </div>
            
             <div className="bg-white p-6 rounded-lg shadow-lg border border-stone-200">
               <h3 className="text-2xl font-semibold text-stone-700 mb-4">Engage &amp; Share</h3>
               <ShareButtons content={currentContent} />
             </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={onAddToCart}
                disabled={isItemInCart}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-amber-100 text-amber-800 font-bold rounded-lg shadow hover:bg-amber-200 focus:outline-none focus:ring-4 focus:ring-amber-300 transition-all disabled:bg-green-100 disabled:text-green-800 disabled:shadow-none disabled:cursor-default"
              >
                {isItemInCart ? (
                  <>
                    <CheckIcon className="w-6 h-6" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                   <>
                    <CartIcon className="w-6 h-6" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
              <button
                onClick={onBuyNow}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-amber-600 text-white font-bold rounded-lg shadow-lg hover:bg-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-300 transition-all transform hover:scale-105"
              >
                 <ZapIcon className="w-6 h-6" />
                 <span>Buy Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};