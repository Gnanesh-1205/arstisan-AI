
import { SavedKit } from '../types';

const STORAGE_KEY = 'artisanAiMarketingKits';

export const saveMarketingKit = (kit: SavedKit): void => {
  try {
    const existingKits = getAllMarketingKits();
    // Prevent duplicates
    if (existingKits.some(k => k.id === kit.id)) {
      return;
    }
    const updatedKits = [kit, ...existingKits];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedKits));
  } catch (error) {
    console.error("Failed to save marketing kit:", error);
    alert("Could not save the kit. Your browser's storage might be full.");
  }
};

export const getAllMarketingKits = (): SavedKit[] => {
  try {
    const kitsJson = localStorage.getItem(STORAGE_KEY);
    return kitsJson ? JSON.parse(kitsJson) : [];
  } catch (error) {
    console.error("Failed to retrieve marketing kits:", error);
    return [];
  }
};

export const getKitsByArtisan = (artisanId: string): SavedKit[] => {
  const allKits = getAllMarketingKits();
  return allKits.filter(kit => kit.artisanId === artisanId);
};
