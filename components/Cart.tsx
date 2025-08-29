
import React from 'react';
import { SavedKit } from '../types';
import { TrashIcon } from './icons/TrashIcon';

interface CartProps {
  cartItems: SavedKit[];
  onRemoveItem: (kitId: string) => void;
  onBackToShop: () => void;
}

export const Cart: React.FC<CartProps> = ({ cartItems, onRemoveItem, onBackToShop }) => {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-stone-800">Your Shopping Cart</h2>
        <p className="mt-2 text-stone-600">{cartItems.length} item(s) in your cart.</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md border">
          <p className="text-stone-500 mb-6">Your cart is currently empty.</p>
          <button
            onClick={onBackToShop}
            className="px-8 py-3 bg-amber-600 text-white font-bold rounded-lg shadow-lg hover:bg-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-300 transition-all transform hover:scale-105"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md border border-stone-200">
              <div className="flex items-center gap-4">
                <img src={item.userInput.imageFile} alt={item.generatedAssets.english.title} className="w-20 h-20 object-cover rounded-md" />
                <div>
                  <h3 className="font-semibold text-stone-700">{item.generatedAssets.english.title}</h3>
                  <p className="text-sm text-stone-500">Product ID: {item.id}</p>
                </div>
              </div>
              <button
                onClick={() => onRemoveItem(item.id)}
                className="p-2 rounded-full text-stone-500 hover:bg-red-100 hover:text-red-600 transition-colors"
                aria-label={`Remove ${item.generatedAssets.english.title} from cart`}
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
