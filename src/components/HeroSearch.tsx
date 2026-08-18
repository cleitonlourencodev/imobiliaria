'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  MapPin, 
  Building2, 
  DollarSign, 
  Bed, 
  Sparkles,
  Filter
} from 'lucide-react';

export default function HeroSearch() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'todos' | 'venda' | 'aluguel' | 'terreno'>('todos');
  const [category, setCategory] = useState<string>('todos');
  const [q, setQ] = useState<string>('');
  const [bedrooms, setBedrooms] = useState<string>('todos');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [code, setCode] = useState<string>('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (activeTab === 'terreno') {
      params.set('category', 'terreno');
    } else if (activeTab !== 'todos') {
      params.set('type', activeTab);
    }

    if (category !== 'todos') {
      params.set('category', category);
    }

    if (q.trim()) {
      params.set('q', q.trim());
    }

    if (bedrooms !== 'todos') {
      params.set('bedrooms', bedrooms);
    }

    if (maxPrice.trim()) {
      params.set('maxPrice', maxPrice.trim());
    }

    if (code.trim()) {
      params.set('q', code.trim());
    }

    router.push(`/imoveis?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Search Header Tabs */}
      <div className="flex items-center gap-1 bg-slate-950/80 p-1.5 rounded-t-3xl border-t border-x border-slate-800 backdrop-blur-md w-full">
        <button
          type="button"
          onClick={() => setActiveTab('todos')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'todos' 
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' 
              : 'text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
        >
          Todos os Imóveis
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('venda')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'venda' 
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' 
              : 'text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
        >
          Comprar (Venda)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('aluguel')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'aluguel' 
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' 
              : 'text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
        >
          Alugar
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('terreno')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'terreno' 
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' 
              : 'text-slate-300 hover:text-white hover:bg-slate-900'
          }`}
        >
          Terrenos & Lotes
        </button>
      </div>

      {/* Main Filter Form Box */}
      <form
        onSubmit={handleSearch}
        className="bg-slate-950/90 border-x border-b border-slate-800 p-4 sm:p-6 rounded-b-3xl shadow-2xl backdrop-blur-xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end"
      >
        {/* Field 1: Localização / Bairro / Cidade */}
        <div className="space-y-1.5 lg:col-span-1">
          <label htmlFor="search-q" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Localização / Bairro</span>
          </label>
          <div className="relative">
            <input
              id="search-q"
              name="q"
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ex: Alphaville, Itaim, Pinheiros..."
              className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-all placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Field 2: Tipo de Imóvel */}
        <div className="space-y-1.5 lg:col-span-1">
          <label htmlFor="search-category" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Tipo de Imóvel</span>
          </label>
          <select
            id="search-category"
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-all"
          >
            <option value="todos">Todos os Tipos</option>
            <option value="casa">Casa / Sobrado</option>
            <option value="terreno">Terreno / Lote</option>
            <option value="apartamento">Apartamento</option>
            <option value="cobertura">Cobertura Duplex</option>
            <option value="comercial">Comercial / Conjunto</option>
            <option value="chacara">Sítio / Chácara</option>
          </select>
        </div>

        {/* Field 3: Quartos */}
        <div className="space-y-1.5 lg:col-span-1">
          <label htmlFor="search-bedrooms" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Bed className="w-3.5 h-3.5 text-amber-400" />
            <span>Dormitórios</span>
          </label>
          <select
            id="search-bedrooms"
            name="bedrooms"
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-all"
          >
            <option value="todos">Qualquer quantidade</option>
            <option value="1">1+ Dormitório</option>
            <option value="2">2+ Dormitórios</option>
            <option value="3">3+ Dormitórios</option>
            <option value="4">4+ Dormitórios (Luxo)</option>
          </select>
        </div>

        {/* Field 4: Valor Máximo ou Código */}
        <div className="space-y-1.5 lg:col-span-1">
          <label htmlFor="search-maxPrice" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-amber-400" />
            <span>Valor Máximo (R$)</span>
          </label>
          <input
            id="search-maxPrice"
            name="maxPrice"
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Ex: 2500000"
            className="w-full bg-slate-900 border border-slate-800 focus:border-amber-500 text-white rounded-xl px-3.5 py-2.5 text-xs focus:outline-none transition-all placeholder:text-slate-500"
          />
        </div>

        {/* Submit CTA Button */}
        <div className="lg:col-span-1">
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-2.5 px-4 rounded-xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all active:scale-98 text-xs uppercase tracking-wider"
          >
            <Search className="w-4 h-4 stroke-[2.5]" />
            <span>Buscar Imóveis</span>
          </button>
        </div>
      </form>

      {/* Quick Search Tag Shortcuts */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3 text-xs text-slate-400 px-2">
        <span className="font-semibold text-slate-300 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" /> Buscas Frequentes:
        </span>
        <button
          onClick={() => router.push('/imoveis?category=casa&q=Alphaville')}
          className="px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 hover:text-white transition-all text-[11px]"
        >
          Casas em Alphaville
        </button>
        <button
          onClick={() => router.push('/imoveis?category=cobertura&q=Itaim')}
          className="px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 hover:text-white transition-all text-[11px]"
        >
          Coberturas no Itaim
        </button>
        <button
          onClick={() => router.push('/imoveis?category=terreno')}
          className="px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 hover:text-white transition-all text-[11px]"
        >
          Terrenos em Condomínio
        </button>
        <button
          onClick={() => router.push('/imoveis?type=aluguel')}
          className="px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 hover:text-white transition-all text-[11px]"
        >
          Aluguel Residencial
        </button>
      </div>
    </div>
  );
}
