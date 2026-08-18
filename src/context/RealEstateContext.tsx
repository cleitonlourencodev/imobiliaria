'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface PropertyItem {
  id: string;
  code: string;
  title: string;
  slug: string;
  description: string;
  type: string;
  category: string;
  price: string;
  condoFee: string;
  iptu: string;
  bedrooms: number;
  suites: number;
  bathrooms: number;
  parkingSpaces: number;
  totalArea: number;
  builtArea: number;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode?: string;
  status: string;
  featured: boolean;
  whatsappDirectEnabled: boolean;
  brokerId?: string | null;
  coverImage: string;
  images: string[];
  videoUrl?: string | null;
  virtualTourUrl?: string | null;
  amenities: string[];
  viewsCount: number;
  broker?: {
    id: string;
    name: string;
    creci: string;
    email: string;
    phone: string;
    whatsapp: string;
    photoUrl: string;
    specialties?: string[];
  } | null;
}

interface RealEstateContextType {
  favorites: string[];
  toggleFavorite: (propertyId: string) => void;
  isFavorite: (propertyId: string) => boolean;
  comparedProperties: PropertyItem[];
  addToCompare: (property: PropertyItem) => void;
  removeFromCompare: (propertyId: string) => void;
  isInCompare: (propertyId: string) => boolean;
  clearCompare: () => void;
  toast: { message: string; type?: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const RealEstateContext = createContext<RealEstateContextType | undefined>(undefined);

export function RealEstateProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [comparedProperties, setComparedProperties] = useState<PropertyItem[]>([]);
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'info' | 'error' } | null>(null);

  // Load favorites from localStorage on mount
  useEffect(() => {
    let cancelled = false;

    function loadFavorites() {
      try {
        const savedFavs = localStorage.getItem('prime_favorites');
        if (savedFavs && !cancelled) {
          setFavorites(JSON.parse(savedFavs));
        }
      } catch (e) {
        if (!cancelled) console.error(e);
      }
    }

    loadFavorites();

    return () => {
      cancelled = true;
    };
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const toggleFavorite = (propertyId: string) => {
    setFavorites(prev => {
      const exists = prev.includes(propertyId);
      const next = exists ? prev.filter(id => id !== propertyId) : [...prev, propertyId];
      try {
        localStorage.setItem('prime_favorites', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      showToast(exists ? 'Removido dos favoritos' : 'Adicionado aos favoritos!', 'info');
      return next;
    });
  };

  const isFavorite = (propertyId: string) => favorites.includes(propertyId);

  const addToCompare = (property: PropertyItem) => {
    if (comparedProperties.some(p => p.id === property.id)) {
      showToast('Este imóvel já está na comparação.', 'info');
      return;
    }
    if (comparedProperties.length >= 3) {
      showToast('Você pode comparar até 3 imóveis simultaneamente.', 'error');
      return;
    }
    setComparedProperties(prev => [...prev, property]);
    showToast(`"${property.title}" adicionado para comparação!`, 'success');
  };

  const removeFromCompare = (propertyId: string) => {
    setComparedProperties(prev => prev.filter(p => p.id !== propertyId));
    showToast('Imóvel removido da comparação.', 'info');
  };

  const isInCompare = (propertyId: string) => comparedProperties.some(p => p.id === propertyId);

  const clearCompare = () => setComparedProperties([]);

  return (
    <RealEstateContext.Provider
      value={{
        favorites,
        toggleFavorite,
        isFavorite,
        comparedProperties,
        addToCompare,
        removeFromCompare,
        isInCompare,
        clearCompare,
        toast,
        showToast
      }}
    >
      {children}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 transition-all duration-300 transform translate-y-0">
          <div className={`px-5 py-3.5 rounded-xl shadow-2xl text-white font-medium flex items-center gap-3 backdrop-blur-md border ${
            toast.type === 'error' ? 'bg-red-600/90 border-red-400' :
            toast.type === 'info' ? 'bg-slate-900/90 border-slate-700' : 'bg-emerald-600/90 border-emerald-400'
          }`}>
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
            {toast.message}
          </div>
        </div>
      )}
    </RealEstateContext.Provider>
  );
}

export function useRealEstate() {
  const context = useContext(RealEstateContext);
  if (!context) {
    throw new Error('useRealEstate must be used within a RealEstateProvider');
  }
  return context;
}
