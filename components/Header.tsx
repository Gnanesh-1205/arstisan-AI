
import React from 'react';
import { BackIcon } from './icons/BackIcon';
import { PlusIcon } from './icons/PlusIcon';
import { CartIcon } from './icons/CartIcon';

interface HeaderProps {
  view: 'form' | 'loading' | 'results' | 'gallery' | 'cart';
  cartItemCount: number;
  onBack: () => void;
  onShowCart: () => void;
  onCreateNew: () => void;
}

export const Header: React.FC<HeaderProps> = ({ view, cartItemCount, onBack, onShowCart, onCreateNew }) => {
  const showBackButton = view === 'results' || view === 'cart' || view === 'form';
  const showCreateNewButton = view === 'gallery';
  
  return (
    <header className="bg-white shadow-md sticky top-0 z-10">
      <div className="max-w-4xl mx-auto py-4 px-4 sm:px-6 md:px-8 flex items-center justify-between">
        <div className="flex-1 flex justify-start">
            {showBackButton && (
              <button
                onClick={onBack}
                className="p-2 rounded-full text-stone-600 hover:bg-stone-100 transition-colors"
                aria-label="Go back"
              >
                <BackIcon className="w-6 h-6" />
              </button>
            )}
        </div>
        
        <div className="flex items-center space-x-3">
          <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707"></path></svg>
          <h1 className="text-2xl font-bold text-stone-800 tracking-tight font-serif">
            Artisan AI
          </h1>
        </div>
        
        <div className="flex-1 flex justify-end items-center">
            {showCreateNewButton && (
                 <button
                    onClick={onCreateNew}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-stone-600 bg-stone-100 hover:bg-stone-200 transition-colors"
                    aria-label="Create new kit"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span className="hidden sm:inline text-sm font-semibold">Create New</span>
                </button>
            )}
             <button
                onClick={onShowCart}
                className="relative p-2 rounded-full text-stone-600 hover:bg-stone-100 transition-colors ml-2"
                aria-label={`View cart with ${cartItemCount} items`}
            >
                <CartIcon className="w-6 h-6" />
                {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
                        {cartItemCount}
                    </span>
                )}
            </button>
        </div>
      </div>
    </header>
  );
};
