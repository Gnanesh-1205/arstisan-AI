
import React from 'react';
import { SavedKit } from '../types';
import { HeartIcon } from './icons/HeartIcon';

interface WishlistProps {
  wishlistItems: SavedKit[];
  onRemoveItem: (kitId: string) => void;
  onSelectKit: (kitId: string) => void;
  onBackToShop: () => void;
}

export const Wishlist: React.FC<WishlistProps> = ({ wishlistItems, onRemoveItem, onSelectKit, onBackToShop }) => {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-stone-800">Your Wishlist</h2>
        <p className="mt-2 text-stone-600">{wishlistItems.length} item(s) you love.</p>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md border">
          <p className="text-stone-500 mb-6">Your wishlist is empty. Find something you love!</p>
          <button
            onClick={onBackToShop}
            className="px-8 py-3 bg-amber-600 text-white font-bold rounded-lg shadow-lg hover:bg-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-300 transition-all transform hover:scale-105"
          >
            Explore Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map((kit) => (
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
                  <p className="font-semibold text-stone-700 group-hover:text-amber-600 transition-colors flex-grow">
                    {kit.generatedAssets.english.title}
                  </p>
                  <div className="mt-2">
                    <p className="text-lg font-bold text-stone-800">
                      {`₹${kit.userInput.price.toFixed(2)}`}
                    </p>
                  </div>
              </div>
              <button
                onClick={() => onRemoveItem(kit.id)}
                className="absolute top-2 right-2 z-10 p-1.5 bg-white/70 backdrop-blur-sm rounded-full text-red-500 hover:scale-110 transition-transform"
                aria-label="Remove from wishlist"
              >
                <HeartIcon isFilled={true} className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};