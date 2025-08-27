
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { Loader } from './components/Loader';
import { generateMarketingAssets } from './services/geminiService';
import { GeneratedAssets } from './types';
import { LANGUAGES } from './constants';
import { ResetIcon } from './components/icons/ResetIcon';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [productDescription, setProductDescription] = useState<string>('');
  const [targetLanguage, setTargetLanguage] = useState<string>('hi');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [generatedAssets, setGeneratedAssets] = useState<GeneratedAssets | null>(null);

  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    setGeneratedAssets(null);
    setError(null);
  };

  const handleFormSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile || !productDescription) {
      setError('Please provide both an image and a description.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setGeneratedAssets(null);
    setProgress(0);

    const onProgress = (newProgress: number, message: string) => {
      setProgress(newProgress);
      setLoadingMessage(message);
    };

    try {
      onProgress(5, 'Preparing your image...');
      const base64String = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(imageFile);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = (error) => reject(new Error('Failed to read the image file.'));
      });
      
      const mimeType = imageFile.type;

      const assets = await generateMarketingAssets(
        base64String,
        mimeType,
        productDescription,
        targetLanguage,
        onProgress
      );
      
      onProgress(100, 'Done!');
      setGeneratedAssets(assets);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [imageFile, productDescription, targetLanguage]);

  const handleReset = () => {
    setImageFile(null);
    setProductDescription('');
    setTargetLanguage('hi');
    setGeneratedAssets(null);
    setError(null);
    setIsLoading(false);
    setProgress(0);
  };

  const isSubmitDisabled = !imageFile || !productDescription || isLoading;

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <main className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
        {isLoading ? (
          <Loader message={loadingMessage} progress={progress} />
        ) : generatedAssets ? (
          <ResultDisplay assets={generatedAssets} onReset={handleReset} />
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-stone-700">Create Your Marketing Kit</h2>
            <p className="text-center text-stone-500 max-w-2xl mx-auto">
              Upload a photo of your craft, tell us about it, and let our AI generate a complete marketing kit to help you shine online.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-stone-600 border-b-2 border-amber-500 pb-2">1. Upload Your Craft</h3>
                <ImageUploader onImageChange={handleImageChange} />
              </div>

              <div className="space-y-4">
                 <h3 className="text-xl font-semibold text-stone-600 border-b-2 border-amber-500 pb-2">2. Describe Your Product</h3>
                 <textarea
                   value={productDescription}
                   onChange={(e) => setProductDescription(e.target.value)}
                   placeholder="e.g., 'Hand-carved wooden elephant, made from sustainably sourced mango wood. Each piece is unique and tells a story...'"
                   rows={6}
                   className="w-full p-3 bg-white border border-stone-300 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-150 ease-in-out"
                   aria-label="Product Description"
                 />
                 
                 <h3 className="text-xl font-semibold text-stone-600 border-b-2 border-amber-500 pb-2 pt-4">3. Select Language</h3>
                 <select
                   value={targetLanguage}
                   onChange={(e) => setTargetLanguage(e.target.value)}
                   className="w-full p-3 bg-white border border-stone-300 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-150 ease-in-out"
                   aria-label="Target Language"
                 >
                   {LANGUAGES.map((lang) => (
                     <option key={lang.code} value={lang.code}>{lang.name}</option>
                   ))}
                 </select>
              </div>
            </div>

            {error && <p className="text-center text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitDisabled}
                className="w-full sm:w-auto px-8 py-4 bg-amber-600 text-white font-bold rounded-lg shadow-lg hover:bg-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-300 transition-all duration-300 ease-in-out disabled:bg-stone-400 disabled:cursor-not-allowed disabled:shadow-none transform hover:scale-105 disabled:transform-none"
              >
                {isLoading ? 'Generating...' : '✨ Generate Marketing Kit'}
              </button>
               {(imageFile || productDescription) && !isLoading && (
                 <button
                   type="button"
                   onClick={handleReset}
                   className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-stone-200 text-stone-700 font-semibold rounded-lg hover:bg-stone-300 focus:outline-none focus:ring-4 focus:ring-stone-300 transition-all duration-300"
                 >
                   <ResetIcon />
                   Start Over
                 </button>
              )}
            </div>
          </form>
        )}
      </main>
    </div>
  );
};

export default App;
