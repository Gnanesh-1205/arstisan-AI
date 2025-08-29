
import React from 'react';
import { SavedKit } from '../types';
import { PlusIcon } from './icons/PlusIcon';

interface GalleryProps {
  kits: SavedKit[];
  onSelectKit: (kitId: string) => void;
  onCreateNew: () => void;
}

export const Gallery: React.FC<GalleryProps> = ({ kits, onSelectKit, onCreateNew }) => {
  if (kits.length === 0) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <h2 className="text-2xl font-bold text-stone-700">Welcome to Artisan AI!</h2>
        <p className="mt-2 text-stone-500 max-w-xl mx-auto">You haven't created any marketing kits yet. Let's make your first one.</p>
        <div className="mt-8">
          <button
            onClick={onCreateNew}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-600 text-white font-bold rounded-lg shadow-lg hover:bg-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-300 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            <PlusIcon />
            Create Your First Kit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-stone-800">Artisan Marketplace</h2>
        <p className="mt-2 text-stone-600">Discover unique, handcrafted goods and the stories behind them.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {kits.map((kit) => (
          <button
            key={kit.id}
            onClick={() => onSelectKit(kit.id)}
            className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border border-stone-200 overflow-hidden text-left"
          >
            <div className="w-full h-48 overflow-hidden">
              <img 
                src={kit.userInput.imageFile} 
                alt={kit.generatedAssets.english.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <p className="font-semibold text-stone-700 truncate group-hover:text-amber-600 transition-colors">
                {kit.generatedAssets.english.title}
              </p>
              <p className="text-xs text-stone-400 mt-1">
                Created: {new Date(kit.createdAt).toLocaleDateString()}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
