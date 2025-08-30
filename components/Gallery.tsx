
import React from 'react';
import { SavedKit, User } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { HeartIcon } from './icons/HeartIcon';

interface GalleryProps {
  kits: SavedKit[];
  onSelectKit: (kitId: string) => void;
  onCreateNew: () => void;
  searchQuery: string;
  currentUser: User | null;
  wishlistItemIds: string[];
  onToggleWishlist: (kitId: string) => void;
}

export const Gallery: React.FC<GalleryProps> = ({ kits, onSelectKit, onCreateNew, searchQuery, currentUser, wishlistItemIds, onToggleWishlist }) => {
  const showCreateButton = currentUser?.role === 'artisan';

  if (kits.length === 0 && !searchQuery) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <h2 className="text-2xl font-bold text-stone-700">Welcome to Artisan AI!</h2>
        <p className="mt-2 text-stone-500 max-w-xl mx-auto">
          {showCreateButton 
            ? "You haven't created any marketing kits yet. Let's make your first one."
            : "Explore beautiful crafts from talented artisans."
          }
        </p>
        {showCreateButton && (
            <div className="mt-8">
            <button
                onClick={onCreateNew}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-600 text-white font-bold rounded-lg shadow-lg hover:bg-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-300 transition-all duration-300 ease-in-out transform hover:scale-105"
            >
                <PlusIcon />
                Create Your First Kit
            </button>
            </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="text-left">
            <h2 className="text-3xl font-bold text-stone-800">Artisan Marketplace</h2>
            <p className="mt-2 text-stone-600">Discover unique, handcrafted goods and the stories behind them.</p>
        </div>
        {showCreateButton && (
             <button
                onClick={onCreateNew}
                className="hidden sm:inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-600 text-white font-bold rounded-lg shadow hover:bg-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-300 transition-all transform hover:scale-105"
            >
                <PlusIcon />
                Add Product
            </button>
        )}
      </div>
       
       {kits.length === 0 && searchQuery && (
         <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-stone-700">No Results Found</h2>
            <p className="mt-2 text-stone-500 max-w-xl mx-auto">
                Your search for "<span className="font-semibold text-stone-600">{searchQuery}</span>" did not match any products.
            </p>
        </div>
       )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {kits.map((kit) => (
          <div
            key={kit.id}
            className="group relative block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border border-stone-200 overflow-hidden text-left"
          >
            <div onClick={() => onSelectKit(kit.id)} className="cursor-pointer">
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
                <p className="text-lg font-bold text-stone-800 mt-2">
                  {`₹${kit.userInput.price.toFixed(2)}`}
                </p>
                <p className="text-xs text-stone-400 mt-1">
                  Created: {new Date(kit.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
             <button
                onClick={(e) => { e.stopPropagation(); onToggleWishlist(kit.id); }}
                className="absolute top-2 right-2 z-10 p-1.5 bg-white/70 backdrop-blur-sm rounded-full text-red-500 hover:scale-110 transition-transform"
                aria-label={wishlistItemIds.includes(kit.id) ? 'Remove from wishlist' : 'Add to wishlist'}
             >
                <HeartIcon isFilled={wishlistItemIds.includes(kit.id)} className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
