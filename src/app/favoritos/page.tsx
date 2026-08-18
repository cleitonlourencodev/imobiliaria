'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, Building2, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import { PropertyItem, useRealEstate } from '@/context/RealEstateContext';

export default function FavoritesPage() {
  const { favorites } = useRealEstate();
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFavorites() {
      try {
        setLoading(true);
        const res = await fetch('/api/properties');
        const data = await res.json();
        if (data.success) {
          const favProps = data.data.filter((p: PropertyItem) => favorites.includes(p.id));
          setProperties(favProps);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadFavorites();
  }, [favorites]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />

      <section className="bg-slate-900/80 border-b border-slate-800 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="text-rose-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Heart className="w-4 h-4 fill-rose-500" /> Salvos
            </span>
            <h1 className="text-3xl font-black text-white tracking-tight mt-1">
              Meus Imóveis Favoritos
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {favorites.length} imóveis salvos na sua lista de desejos.
            </p>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10 w-full flex-1">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-slate-900 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        ) : (
          <div className="p-16 text-center bg-slate-900/40 rounded-3xl border border-slate-800 space-y-4 max-w-md mx-auto my-12">
            <Heart className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">Sua lista de favoritos está vazia</h3>
            <p className="text-xs text-slate-400">
              Clique no coração nos cartões dos imóveis que gostar para adicioná-los aqui.
            </p>
            <Link
              href="/imoveis"
              className="px-5 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl inline-flex items-center gap-2"
            >
              <span>Explorar Imóveis</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
