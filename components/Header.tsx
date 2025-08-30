
import React, { useState } from 'react';
import { BackIcon } from './icons/BackIcon';
import { CartIcon } from './icons/CartIcon';
import { AccountIcon } from './icons/AccountIcon';
import { SearchIcon } from './icons/SearchIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { HeartIcon } from './icons/HeartIcon';
import { User } from '../types';

interface HeaderProps {
  view: 'form' | 'loading' | 'results' | 'gallery' | 'cart' | 'auth' | 'profile' | 'wishlist';
  cartItemCount: number;
  wishlistItemCount: number;
  searchQuery: string;
  onBack: () => void;
  onHome: () => void;
  onShowCart: () => void;
  onShowWishlist: () => void;
  onAccountClick: () => void;
  onSearchChange: (query: string) => void;
  onCategorySelect: (category: string) => void;
  currentUser: User | null;
}

const PRODUCT_CATEGORIES = ["Home Decor", "Accessories", "Leather Goods", "Sarees", "Pottery"];

export const Header: React.FC<HeaderProps> = ({ 
  view, 
  cartItemCount, 
  wishlistItemCount,
  searchQuery, 
  onBack, 
  onHome,
  onShowCart, 
  onShowWishlist,
  onAccountClick, 
  onSearchChange,
  onCategorySelect,
  currentUser
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const showBackButton = view !== 'gallery';
  
  const Logo = () => (
     <button onClick={onHome} className="flex items-center space-x-2 flex-shrink-0" aria-label="Artisan AI Home">
        <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707"></path></svg>
        <h1 className="text-xl font-bold text-stone-800 tracking-tight font-serif hidden sm:block">
            Artisan AI
        </h1>
    </button>
  );

  return (
    <header className="bg-white shadow-md sticky top-0 z-20">
      <div className="max-w-4xl mx-auto py-3 px-4 sm:px-6 md:px-8 flex items-center justify-between gap-4">
        
        {/* Left section: Back button or Logo/Nav */}
        <div className="flex items-center gap-4">
            {showBackButton ? (
              <button
                onClick={onBack}
                className="p-2 rounded-full text-stone-600 hover:bg-stone-100 transition-colors"
                aria-label="Go back"
              >
                <BackIcon className="w-6 h-6" />
              </button>
            ) : (
                <div className="flex items-center gap-6">
                    <Logo />
                    <nav className="hidden md:flex items-center gap-4">
                        <button onClick={onHome} className="text-sm font-semibold text-stone-600 hover:text-amber-600 transition-colors">Home</button>
                         <div 
                            className="relative group"
                            onMouseEnter={() => setIsDropdownOpen(true)}
                            onMouseLeave={() => setIsDropdownOpen(false)}
                         >
                            <button className="flex items-center gap-1 text-sm font-semibold text-stone-600 hover:text-amber-600 transition-colors">
                                <span>Products</span>
                                <ChevronDownIcon className={`w-4 h-4 transition-transform group-hover:rotate-180`} />
                            </button>
                            <div className={`absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-stone-200 py-1 animate-fade-in transition-opacity duration-200 ${isDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                                {PRODUCT_CATEGORIES.map(category => (
                                    <a 
                                        key={category}
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onCategorySelect(category);
                                            setIsDropdownOpen(false);
                                        }}
                                        className="block px-4 py-2 text-sm text-stone-700 hover:bg-amber-50"
                                    >
                                        {category}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </nav>
                </div>
            )}
        </div>
        
        {/* Right section: Search & Icons */}
        <div className="flex items-center gap-2 sm:gap-4">
           {view === 'gallery' && (
              <div className="relative hidden sm:block w-full max-w-xs">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="w-5 h-5 text-stone-400" />
                  </div>
                  <input 
                    type="text"
                    placeholder="Search for crafts..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-stone-300 rounded-full bg-stone-50 text-stone-900 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition"
                  />
              </div>
           )}
           <div className="flex items-center space-x-1 sm:space-x-2">
             <button
                onClick={onAccountClick}
                className="flex items-center gap-2 p-2 rounded-full text-stone-600 hover:bg-stone-100 transition-colors"
                aria-label="Account"
            >
                <AccountIcon className="w-6 h-6" />
                 {currentUser && (
                    <span className="text-sm font-semibold hidden md:block">{currentUser.name.split(' ')[0]}</span>
                 )}
            </button>
             <button
                onClick={onShowWishlist}
                className="relative p-2 rounded-full text-stone-600 hover:bg-stone-100 transition-colors"
                aria-label={`View wishlist with ${wishlistItemCount} items`}
            >
                <HeartIcon isFilled={false} className="w-6 h-6" />
                {wishlistItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
                        {wishlistItemCount}
                    </span>
                )}
            </button>
             <button
                onClick={onShowCart}
                className="relative p-2 rounded-full text-stone-600 hover:bg-stone-100 transition-colors"
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
      </div>
    </header>
  );
};
