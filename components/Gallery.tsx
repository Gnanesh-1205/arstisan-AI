
import React from 'react';
import { SavedKit, User } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { HeartIcon } from './icons/HeartIcon';

interface GalleryProps {
  kits: SavedKit[];
  onSelectKit: (kitId: string) => void;
  searchQuery: string;
  selectedCategory: string;
  onClearFilter: () => void;
  currentUser: User | null;
  wishlistItemIds: string[];
  onToggleWishlist: (kitId: string) => void;
}

export const Gallery: React.FC<GalleryProps> = ({ kits, onSelectKit, searchQuery, selectedCategory, onClearFilter, currentUser, wishlistItemIds, onToggleWishlist }) => {
  const isFilterActive = !!searchQuery || !!selectedCategory;

  if (kits.length === 0 && !isFilterActive) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <h2 className="text-2xl font-bold text-stone-700">Welcome to the Marketplace!</h2>
        <p className="mt-2 text-stone-500 max-w-xl mx-auto">
          There are currently no products listed. Artisans can add products from their profile page.
        </p>
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
      </div>
       
       {isFilterActive && (
         <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between">
           <p className="text-sm text-amber-800">
             Showing results for: <span className="font-semibold">{searchQuery || selectedCategory}</span>
           </p>
           <button onClick={onClearFilter} className="text-sm font-semibold text-amber-700 hover:text-amber-900">
             Clear filter
           </button>
         </div>
       )}

       {kits.length === 0 && isFilterActive && (
         <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-stone-700">No Results Found</h2>
            <p className="mt-2 text-stone-500 max-w-xl mx-auto">
                Your search for "<span className="font-semibold text-stone-600">{searchQuery || selectedCategory}</span>" did not match any products.
            </p>
        </div>
       )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {kits.map((kit) => (
          <div
            key={kit.id}
            className="group relative block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border border-stone-200 overflow-hidden text-left flex flex-col"
          >
            <div onClick={() => onSelectKit(kit.id)} className="cursor-pointer">
              <div className="w-full h-48 overflow-hidden bg-stone-100">
                <img 
                  src={kit.userInput.imageFile} 
                  alt={kit.generatedAssets.english.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
             <div className="p-4 flex flex-col flex-grow">
                 <p className="text-xs text-stone-500 font-medium uppercase tracking-wider">{kit.userInput.category}</p>
                <p className="font-semibold text-stone-700 group-hover:text-amber-600 transition-colors mt-1 flex-grow">
                  {kit.generatedAssets.english.title}
                </p>
                <div className="mt-2">
                    <p className="text-lg font-bold text-stone-800">
                      {`₹${kit.userInput.price.toFixed(2)}`}
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
