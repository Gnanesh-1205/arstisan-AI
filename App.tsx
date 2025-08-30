
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { Loader } from './components/Loader';
import { Gallery } from './components/Gallery';
import { Cart } from './components/Cart';
import { Auth } from './components/Auth';
import { Profile } from './components/Profile';
import { Chatbot } from './components/Chatbot';
import { Wishlist } from './components/Wishlist';
import { generateInitialAssets } from './services/geminiService';
import { getAllMarketingKits, saveMarketingKit, getKitsByArtisan } from './services/storageService';
import { getCartItems, addToCart, removeFromCart } from './services/cartService';
import * as authService from './services/authService';
import * as wishlistService from './services/wishlistService';
import { SavedKit, User } from './types';
import { ResetIcon } from './components/icons/ResetIcon';
import { MicrophoneIcon } from './components/icons/MicrophoneIcon';
import { StopIcon } from './components/icons/StopIcon';

type View = 'gallery' | 'form' | 'loading' | 'results' | 'cart' | 'auth' | 'profile' | 'wishlist';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageBase64, setImageBase64] = useState<string>('');
  const [productDescription, setProductDescription] = useState<string>('');
  const [productPrice, setProductPrice] = useState<string>('');
  
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  
  const [kits, setKits] = useState<SavedKit[]>([]);
  const [cartItems, setCartItems] = useState<SavedKit[]>([]);
  const [wishlistItemIds, setWishlistItemIds] = useState<string[]>([]);
  const [selectedKit, setSelectedKit] = useState<SavedKit | null>(null);
  const [view, setView] = useState<View>('gallery');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const savedKits = getAllMarketingKits();
    const savedCartItems = getCartItems();
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setWishlistItemIds(wishlistService.getWishlistItems(user.id));
    }
    setKits(savedKits);
    setCartItems(savedCartItems);
  }, []);


  const handleImageChange = (file: File | null) => {
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => setImageBase64((reader.result as string).split(',')[1]);
      reader.onerror = () => setError('Failed to read the image file.');
    } else {
      setImageBase64('');
    }
    setError(null);
  };

  const handleToggleRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Voice recognition is not supported by your browser. Please use a compatible browser like Chrome.');
      return;
    }

    if (isRecording) {
      recognitionRef.current?.stop();
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = (event: any) => {
      setError(`Voice recognition error: ${event.error}`);
      setIsRecording(false);
    };
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setProductDescription(prev => (prev ? prev + ' ' : '') + transcript);
    };
    recognition.start();
  };

  const handleFormSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || currentUser.role !== 'artisan') {
      setError('You must be logged in as an artisan to create a product.');
      return;
    }
    if (!imageFile || !productDescription || !imageBase64 || !productPrice) {
      setError('Please provide an image, description, and price.');
      return;
    }
    setError(null);
    setView('loading');
    setProgress(0);

    try {
      const assets = await generateInitialAssets(
        imageBase64,
        imageFile.type,
        productDescription,
        (p, m) => { setProgress(p); setLoadingMessage(m); }
      );
      
      const newKit: SavedKit = {
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        artisanId: currentUser.id,
        userInput: {
          imageFile: `data:${imageFile.type};base64,${imageBase64}`,
          description: productDescription,
          price: parseFloat(productPrice),
        },
        generatedAssets: assets,
      };

      saveMarketingKit(newKit);
      setKits(prev => [newKit, ...prev]);
      setSelectedKit(newKit);
      setView('results');
      resetFormFields();

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setView('form'); // Go back to form on error
    }
  }, [imageFile, productDescription, imageBase64, productPrice, currentUser]);

  const handleSelectKit = (kitId: string) => {
    const kit = kits.find(k => k.id === kitId);
    if (kit) {
      setSelectedKit(kit);
      setView('results');
    }
  };
  
  const resetFormFields = () => {
    setImageFile(null);
    setImageBase64('');
    setProductDescription('');
    setProductPrice('');
    setError(null);
    setProgress(0);
  };
  
  const handleCreateNew = () => {
    if (currentUser?.role !== 'artisan') {
      setView('auth');
      return;
    }
    resetFormFields();
    setSelectedKit(null);
    setView('form');
  }

  const handleAddToCart = (kit: SavedKit) => {
    const newCart = addToCart(kit);
    setCartItems(newCart);
  };
  
  const handleRemoveFromCart = (kitId: string) => {
    const newCart = removeFromCart(kitId);
    setCartItems(newCart);
  };
  
  const handleToggleWishlist = (kitId: string) => {
    if (!currentUser) {
      setView('auth');
      return;
    }
    const newIds = wishlistService.toggleWishlistItem(kitId, currentUser.id);
    setWishlistItemIds(newIds);
  };

  const handleBack = () => {
    if (view === 'auth' || view === 'profile' || view === 'wishlist') {
        setView('gallery');
        return;
    }
    if (view === 'results' || view === 'cart' || view === 'form') {
      setView('gallery');
    }
  }

  const handleHome = () => {
    setSearchQuery('');
    setView('gallery');
  };

  const handleCategorySelect = (category: string) => {
    setSearchQuery(category);
    setView('gallery');
  };

  const handleAccountClick = () => {
    if (currentUser) {
      setView('profile');
    } else {
      setView('auth');
    }
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setWishlistItemIds(wishlistService.getWishlistItems(user.id));
    setView('profile');
  };

  const handleRegister = (user: User) => {
    setCurrentUser(user);
    setWishlistItemIds(wishlistService.getWishlistItems(user.id));
    setView('profile');
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setWishlistItemIds([]);
    setView('gallery');
  };
  
  const handleUpdateUser = (updatedUser: User) => {
    try {
      const user = authService.updateUser(updatedUser);
      setCurrentUser(user);
    } catch (error) {
      console.error("Failed to update user:", error);
      // Optionally set an error state to show in the UI
    }
  };

  const isSubmitDisabled = !imageFile || !productDescription || !productPrice || view === 'loading';
  
  const filteredKits = kits.filter(kit => {
    const searchText = searchQuery.toLowerCase();
    if (!searchText) return true;
    const title = kit.generatedAssets.english.title.toLowerCase();
    const description = kit.generatedAssets.english.description.toLowerCase();
    return title.includes(searchText) || description.includes(searchText);
  });

  const renderContent = () => {
    switch (view) {
      case 'loading':
        return <Loader message={loadingMessage} progress={progress} />;
      case 'results':
        const isItemInCart = selectedKit ? cartItems.some(item => item.id === selectedKit.id) : false;
        const isItemInWishlist = selectedKit ? wishlistItemIds.includes(selectedKit.id) : false;
        return selectedKit ? <ResultDisplay key={selectedKit.id} initialKit={selectedKit} onAddToCart={() => handleAddToCart(selectedKit)} isItemInCart={isItemInCart} isItemInWishlist={isItemInWishlist} onToggleWishlist={() => handleToggleWishlist(selectedKit.id)} /> : <p>No kit selected.</p>;
      case 'gallery':
        return <Gallery kits={filteredKits} onSelectKit={handleSelectKit} onCreateNew={handleCreateNew} searchQuery={searchQuery} currentUser={currentUser} wishlistItemIds={wishlistItemIds} onToggleWishlist={handleToggleWishlist} />;
      case 'cart':
        return <Cart cartItems={cartItems} onRemoveItem={handleRemoveFromCart} onBackToShop={() => setView('gallery')} />;
      case 'wishlist':
        const wishlistKits = kits.filter(kit => wishlistItemIds.includes(kit.id));
        return <Wishlist wishlistItems={wishlistKits} onRemoveItem={handleToggleWishlist} onSelectKit={handleSelectKit} onBackToShop={() => setView('gallery')} />;
      case 'auth':
        return <Auth onLogin={handleLogin} onRegister={handleRegister} onExit={() => setView('gallery')} />;
      case 'profile':
        return currentUser ? <Profile user={currentUser} onLogout={handleLogout} getArtisanKits={(id) => getKitsByArtisan(id)} onSelectKit={handleSelectKit} onUpdateUser={handleUpdateUser} onCreateNew={handleCreateNew} /> : <p>Not logged in.</p>;
      case 'form':
      default:
        if (currentUser?.role !== 'artisan') {
           return (
             <div className="text-center py-16">
               <h2 className="text-2xl font-bold text-stone-700">Access Denied</h2>
               <p className="mt-2 text-stone-500">You must be logged in as an artisan to add a product.</p>
               <button onClick={() => setView('auth')} className="mt-6 px-6 py-2 bg-amber-600 text-white font-bold rounded-lg shadow hover:bg-amber-700">Login as Artisan</button>
             </div>
           );
        }
        return (
          <form onSubmit={handleFormSubmit} className="space-y-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-stone-700">Add Your Product</h2>
            <p className="text-center text-stone-500 max-w-2xl mx-auto">
              Upload a photo of your craft, describe it, and set a price. We'll generate a beautiful product page for you.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-stone-600 border-b-2 border-amber-500 pb-2">1. Upload Your Craft</h3>
                <ImageUploader onImageChange={handleImageChange} />
              </div>
              <div className="space-y-6">
                 <div className="flex justify-between items-center border-b-2 border-amber-500 pb-2">
                   <h3 className="text-xl font-semibold text-stone-600">2. Describe Your Product</h3>
                   <button type="button" onClick={handleToggleRecording} className={`p-2 rounded-full text-stone-500 hover:bg-stone-100 transition-colors ${isRecording ? 'text-red-600' : 'hover:text-amber-600'}`} aria-label={isRecording ? 'Stop recording' : 'Start recording'} title={isRecording ? 'Stop recording' : 'Record voice'}>
                     {isRecording ? <StopIcon className="w-5 h-5" /> : <MicrophoneIcon className="w-5 h-5" />}
                   </button>
                 </div>
                 <textarea value={productDescription} onChange={(e) => setProductDescription(e.target.value)} placeholder="Type, paste, or record a description... e.g., 'Hand-carved wooden elephant...'" rows={6} className="w-full p-3 bg-white border border-stone-300 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 transition" aria-label="Product Description" />
                  <div>
                    <h3 className="text-xl font-semibold text-stone-600 border-b-2 border-amber-500 pb-2 mb-4">3. Set Your Price (₹)</h3>
                    <input 
                      type="number" 
                      value={productPrice} 
                      onChange={(e) => setProductPrice(e.target.value)} 
                      placeholder="e.g., 1299" 
                      min="0" 
                      step="1" 
                      className="w-full p-3 bg-white border border-stone-300 rounded-lg shadow-sm focus:ring-2 focus:ring-amber-500 transition" 
                      aria-label="Product Price in INR" 
                      required 
                    />
                  </div>
              </div>
            </div>
            {error && <p className="text-center text-red-600 bg-red-100 p-3 rounded-lg">{error}</p>}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button type="submit" disabled={isSubmitDisabled} className="w-full sm:w-auto px-8 py-4 bg-amber-600 text-white font-bold rounded-lg shadow-lg hover:bg-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-300 transition-all transform hover:scale-105 disabled:bg-stone-400 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none">
                {'Generate Product Page'}
              </button>
               {(imageFile || productDescription) && (
                 <button type="button" onClick={resetFormFields} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-stone-200 text-stone-700 font-semibold rounded-lg hover:bg-stone-300 focus:outline-none focus:ring-4 focus:ring-stone-300 transition-all">
                   <ResetIcon />
                   Reset Fields
                 </button>
              )}
            </div>
          </form>
        );
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <Header 
        view={view} 
        onBack={handleBack} 
        onHome={handleHome}
        onShowCart={() => setView('cart')}
        cartItemCount={cartItems.length}
        onShowWishlist={() => setView('wishlist')}
        wishlistItemCount={wishlistItemIds.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onAccountClick={handleAccountClick}
        onCategorySelect={handleCategorySelect}
        currentUser={currentUser}
      />
      <main className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
        {renderContent()}
      </main>
      <Chatbot />
    </div>
  );
};

export default App;
