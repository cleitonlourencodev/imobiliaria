'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Building2, 
  Search, 
  Filter, 
  SlidersHorizontal, 
  MapPin, 
  Bed, 
  Bath, 
  Car, 
  DollarSign, 
  Grid, 
  Map, 
  X,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import InteractiveMap from '@/components/InteractiveMap';
import { PropertyItem } from '@/context/RealEstateContext';

function PropertyListContent() {
  const searchParams = useSearchParams();

  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  // Filter states
  const [type, setType] = useState<string>(searchParams.get('type') || 'todos');
  const [category, setCategory] = useState<string>(searchParams.get('category') || 'todos');
  const [q, setQ] = useState<string>(searchParams.get('q') || '');
  const [bedrooms, setBedrooms] = useState<string>(searchParams.get('bedrooms') || 'todos');
  const [bathrooms, setBathrooms] = useState<string>('todos');
  const [parkingSpaces, setParkingSpaces] = useState<string>('todos');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState<string>('newest');

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  useEffect(() => {
    async function fetchProperties() {
      try {
        setLoading(true);
        const params = new URLSearchParams();

        if (type !== 'todos') params.set('type', type);
        if (category !== 'todos') params.set('category', category);
        if (q.trim()) params.set('q', q.trim());
        if (bedrooms !== 'todos') params.set('bedrooms', bedrooms);
        if (bathrooms !== 'todos') params.set('bathrooms', bathrooms);
        if (parkingSpaces !== 'todos') params.set('parkingSpaces', parkingSpaces);
        if (minPrice) params.set('minPrice', minPrice);
        if (maxPrice) params.set('maxPrice', maxPrice);
        if (sort) params.set('sort', sort);

        const res = await fetch(`/api/properties?${params.toString()}`);
        const data = await res.json();
        if (data.success) {
          setProperties(data.data);
        }
      } catch (e) {
        console.error('Error fetching property list:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchProperties();
  }, [type, category, q, bedrooms, bathrooms, parkingSpaces, minPrice, maxPrice, sort]);

  const clearFilters = () => {
    setType('todos');
    setCategory('todos');
    setQ('');
    setBedrooms('todos');
    setBathrooms('todos');
    setParkingSpaces('todos');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />

      {/* Page Title Header */}
      <section className="bg-slate-900/80 border-b border-slate-800 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Building2 className="w-4 h-4" /> Imobiliária Prime
            </span>
            <h1 className="text-3xl font-black text-white tracking-tight mt-1">
              Catálogo de Imóveis
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Encontre o imóvel perfeito entre Vendas de Casas, Terrenos e Aluguéis.
            </p>
          </div>

          {/* Quick Stats & View Mode Toggle */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-950 p-1 rounded-2xl border border-slate-800 flex items-center gap-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  viewMode === 'grid' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Grid className="w-4 h-4" />
                <span>Grade</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                  viewMode === 'map' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Map className="w-4 h-4" />
                <span>Mapa</span>
              </button>
            </div>

            <button
              onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
              className="lg:hidden px-4 py-2.5 rounded-2xl bg-amber-500 text-slate-950 text-xs font-bold flex items-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filtros</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Filter & Listings Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Filters (Desktop & Drawer) */}
        <aside className={`lg:col-span-3 space-y-6 ${
          filterDrawerOpen ? 'fixed inset-0 z-50 bg-slate-950/95 p-6 overflow-y-auto block' : 'hidden lg:block'
        }`}>
          {filterDrawerOpen && (
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 lg:hidden">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-400" /> Filtros Avançados
              </h3>
              <button onClick={() => setFilterDrawerOpen(false)} className="p-2 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
          )}

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-5 sticky top-24 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-amber-400" /> Filtrar Imóveis
              </span>
              <button
                onClick={clearFilters}
                className="text-[11px] text-amber-400 font-semibold hover:underline"
              >
                Limpar
              </button>
            </div>

            {/* Query Search */}
            <div className="space-y-1.5">
              <label htmlFor="filter-q" className="text-xs font-semibold text-slate-300">Buscar por Nome / Código</label>
              <div className="relative">
                <input
                  id="filter-q"
                  name="q"
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Ex: IMV-2001, Alphaville..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none"
                />
              </div>
            </div>

            {/* Type */}
            <div className="space-y-1.5">
              <label htmlFor="filter-type" className="text-xs font-semibold text-slate-300">Modalidade</label>
              <select
                id="filter-type"
                name="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none"
              >
                <option value="todos">Todas (Venda e Aluguel)</option>
                <option value="venda">Venda</option>
                <option value="aluguel">Aluguel</option>
              </select>
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label htmlFor="filter-category" className="text-xs font-semibold text-slate-300">Categoria</label>
              <select
                id="filter-category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none"
              >
                <option value="todos">Todas as categorias</option>
                <option value="casa">Casa / Sobrado</option>
                <option value="terreno">Terreno / Lote</option>
                <option value="apartamento">Apartamento</option>
                <option value="cobertura">Cobertura</option>
                <option value="comercial">Comercial</option>
              </select>
            </div>

            {/* Bedrooms */}
            <div className="space-y-1.5">
              <label htmlFor="filter-bedrooms" className="text-xs font-semibold text-slate-300">Dormitórios Mínimos</label>
              <select
                id="filter-bedrooms"
                name="bedrooms"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none"
              >
                <option value="todos">Qualquer quantidade</option>
                <option value="1">1+ Dormitório</option>
                <option value="2">2+ Dormitórios</option>
                <option value="3">3+ Dormitórios</option>
                <option value="4">4+ Dormitórios</option>
              </select>
            </div>

            {/* Parking Spaces */}
            <div className="space-y-1.5">
              <label htmlFor="filter-parking" className="text-xs font-semibold text-slate-300">Vagas de Garagem</label>
              <select
                id="filter-parking"
                name="parkingSpaces"
                value={parkingSpaces}
                onChange={(e) => setParkingSpaces(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-white text-xs rounded-xl px-3.5 py-2.5 focus:outline-none"
              >
                <option value="todos">Qualquer quantidade</option>
                <option value="1">1+ Vaga</option>
                <option value="2">2+ Vagas</option>
                <option value="3">3+ Vagas</option>
                <option value="4">4+ Vagas</option>
              </select>
            </div>

            {/* Price Limits */}
            <div className="space-y-1.5">
              <label htmlFor="filter-minPrice" className="text-xs font-semibold text-slate-300">Faixa de Preço (R$)</label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  id="filter-minPrice"
                  name="minPrice"
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Mínimo"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-white text-xs rounded-xl px-3 py-2 focus:outline-none"
                />
                <input
                  id="filter-maxPrice"
                  name="maxPrice"
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Máximo"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-white text-xs rounded-xl px-3 py-2 focus:outline-none"
                />
              </div>
            </div>

            {filterDrawerOpen && (
              <button
                onClick={() => setFilterDrawerOpen(false)}
                className="w-full py-3 bg-amber-500 text-slate-950 text-xs font-bold rounded-2xl"
              >
                Aplicar Filtros
              </button>
            )}
          </div>
        </aside>

        {/* Listings Body */}
        <main className="lg:col-span-9 space-y-6">
          {/* Top Sort & Count Bar */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs font-semibold text-slate-300 font-mono">
              Exibindo <span className="text-amber-400 font-bold">{properties.length}</span> imóveis encontrados
            </span>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs text-slate-400">Ordenar por:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3 py-1.5 focus:outline-none font-medium"
              >
                <option value="newest">Mais Recentes</option>
                <option value="price_asc">Menor Preço</option>
                <option value="price_desc">Maior Preço</option>
                <option value="views">Mais Vistos</option>
              </select>
            </div>
          </div>

          {/* Render Map or Grid */}
          {viewMode === 'map' ? (
            <InteractiveMap properties={properties} />
          ) : loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-96 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
              ))}
            </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((prop) => (
                <PropertyCard key={prop.id} property={prop} featuredMode={prop.featured} />
              ))}
            </div>
          ) : (
            <div className="p-16 text-center bg-slate-900/40 rounded-3xl border border-slate-800 space-y-4">
              <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white">Nenhum imóvel encontrado</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Tente ajustar seus critérios de busca ou remover alguns filtros aplicados.
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl"
              >
                Limpar Todos os Filtros
              </button>
            </div>
          )}
        </main>

      </div>

      <Footer />
    </div>
  );
}

export default function PropertyListingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center font-bold">Carregando catálogo...</div>}>
      <PropertyListContent />
    </Suspense>
  );
}
