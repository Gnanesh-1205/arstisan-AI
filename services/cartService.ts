
import { SavedKit } from '../types';

const CART_STORAGE_KEY = 'artisanAiCartItems';

export const getCartItems = (): SavedKit[] => {
  try {
    const itemsJson = localStorage.getItem(CART_STORAGE_KEY);
    return itemsJson ? JSON.parse(itemsJson) : [];
  } catch (error) {
    console.error("Failed to retrieve cart items:", error);
    return [];
  }
};

const saveCartItems = (items: SavedKit[]): void => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save cart items:", error);
  }
};

export const addToCart = (kit: SavedKit): SavedKit[] => {
  const currentItems = getCartItems();
  if (!currentItems.some(item => item.id === kit.id)) {
    const updatedItems = [...currentItems, kit];
    saveCartItems(updatedItems);
    return updatedItems;
  }
  return currentItems;
};

export const removeFromCart = (kitId: string): SavedKit[] => {
  const currentItems = getCartItems();
  const updatedItems = currentItems.filter(item => item.id !== kitId);
  saveCartItems(updatedItems);
  return updatedItems;
};
