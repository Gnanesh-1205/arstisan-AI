
const WISHLIST_KEY = 'artisanAiUserWishlists';

// The data structure will be: { [userId: string]: string[] }
// Where string[] is an array of kit IDs.

type Wishlists = Record<string, string[]>;

const getAllWishlists = (): Wishlists => {
  try {
    const wishlistsJson = localStorage.getItem(WISHLIST_KEY);
    return wishlistsJson ? JSON.parse(wishlistsJson) : {};
  } catch (error) {
    console.error("Failed to retrieve wishlists:", error);
    return {};
  }
};

const saveAllWishlists = (wishlists: Wishlists): void => {
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlists));
  } catch (error) {
    console.error("Failed to save wishlists:", error);
  }
};

export const getWishlistItems = (userId: string): string[] => {
  const allWishlists = getAllWishlists();
  return allWishlists[userId] || [];
};

export const toggleWishlistItem = (kitId: string, userId: string): string[] => {
  const allWishlists = getAllWishlists();
  const userWishlist = allWishlists[userId] || [];

  let updatedWishlist;
  if (userWishlist.includes(kitId)) {
    updatedWishlist = userWishlist.filter(id => id !== kitId);
  } else {
    updatedWishlist = [...userWishlist, kitId];
  }

  const updatedAllWishlists = { ...allWishlists, [userId]: updatedWishlist };
  saveAllWishlists(updatedAllWishlists);
  
  return updatedWishlist;
};
