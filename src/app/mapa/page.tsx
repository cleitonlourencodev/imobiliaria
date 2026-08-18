'use client';

import React, { Suspense } from 'react';
import { MapPin, Navigation, Sparkles } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InteractiveModernMap from '@/components/InteractiveModernMap';

export default function MapaInterativoPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />

      {/* Page Header */}
      <section className="bg-slate-900/80 border-b border-slate-800 py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-2">
          <span className="text-amber-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
            <Navigation className="w-4 h-4" /> Mapa Interativo Completo
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Explore Todos os Imóveis no Mapa
          </h1>
          <p className="text-sm text-slate-400 max-w-xl">
            Use os filtros de venda, aluguel, terrenos e categorias para explorar todos os imóveis disponíveis no mapa interativo moderno da Prime Imóveis.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full flex-1">
        <Suspense fallback={<div className="h-[600px] bg-slate-900 rounded-3xl animate-pulse" />}>
          <InteractiveModernMap />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
