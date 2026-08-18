'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Sparkles, 
  Zap, 
  MessageSquare, 
  CheckCircle2, 
  ArrowRight, 
  Award, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  MapPin, 
  Calculator, 
  PhoneCall, 
  ChevronRight,
  Layers,
  Search,
  Home as HomeIcon,
  Maximize2
} from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSearch from '@/components/HeroSearch';
import PropertyCard from '@/components/PropertyCard';
import InteractiveModernMap from '@/components/InteractiveModernMap';
import { PropertyItem } from '@/context/RealEstateContext';
import { formatCurrencyBRL } from '@/lib/whatsapp';

export default function HomePage() {
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [brokers, setBrokers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTypeFilter, setActiveTypeFilter] = useState<string>('todos');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [pRes, bRes] = await Promise.all([
          fetch('/api/properties'),
          fetch('/api/brokers')
        ]);
        const pData = await pRes.json();
        const bData = await bRes.json();

        if (pData.success) setProperties(pData.data);
        if (bData.success) setBrokers(bData.data);
      } catch (e) {
        console.error('Error loading homepage data:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredProps = properties.filter(p => {
    if (activeTypeFilter === 'venda') return p.type === 'venda' || p.type === 'ambos';
    if (activeTypeFilter === 'aluguel') return p.type === 'aluguel' || p.type === 'ambos';
    if (activeTypeFilter === 'terreno') return p.category === 'terreno';
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-24 px-4 sm:px-8 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[250px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/90 border border-amber-500/30 text-amber-400 text-xs font-bold shadow-lg shadow-amber-500/10 backdrop-blur-md">
            <Zap className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
            <span>Atendimento WhatsApp Direto ao Corretor Responsável</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Encontre o imóvel dos seus sonhos com <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">agilidade & exclusividade</span>
          </h1>

          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Casas em condomínio, coberturas duplex, terrenos e aluguéis de alto padrão nas localizações mais cobiçadas do mercado.
          </p>

          {/* Search Filter Box Component */}
          <div className="pt-4">
            <HeroSearch />
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="border-y border-slate-800/80 bg-slate-900/60 py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">500+</div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Imóveis Selecionados</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">R$ 240M+</div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Em Negócios Fechados</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">100%</div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Corretores com CRECI</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">15 min</div>
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Tempo Médio Resposta WhatsApp</div>
          </div>
        </div>
      </section>

      {/* FEATURE BANNER: Modern Real Estate Experience */}
      <section className="py-16 px-4 sm:px-8 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-amber-500/30 text-amber-400 text-xs font-bold backdrop-blur-md shadow-md">
              <Sparkles className="w-4 h-4" />
              <span>Experiência Imobiliária Moderna</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight tracking-tight">
              Encontre o imóvel ideal com <span className="text-amber-400">atendimento personalizado</span> e tecnologia avançada
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed">
              A Prime Imóveis oferece uma experiência completa para quem busca vender, alugar ou investir. Com atendimento especializado, mapas interativos, simulador de financiamento e avaliações inteligentes, você tem tudo o que precisa para tomar a melhor decisão no mercado imobiliário.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/avaliacao" className="px-5 py-2.5 rounded-2xl bg-amber-500 text-slate-950 text-xs font-black hover:bg-amber-400 transition-all shadow-xl shadow-amber-500/20">
                Avaliar Meu Imóvel
              </Link>
              <Link href="/mapa" className="px-5 py-2.5 rounded-2xl bg-slate-900 border border-slate-700 text-white text-xs font-bold hover:border-amber-500 hover:text-amber-400 transition-all">
                Ver Mapa Interativo
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-4">
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-400" />
              Por que Escolher a Prime?
            </h3>
            <ul className="space-y-3 text-xs text-slate-300">
              {[
                'Corretores credenciados com CRECI ativo e atendimento especializado',
                'Mapa interativo com filtros de venda, aluguel e categorias de imóveis',
                'Simulador de financiamento com comparação entre os principais bancos',
                'Avaliação inteligente de imóveis para proprietários',
                'Comparador de imóveis para análise lado a lado',
                'Atendimento via WhatsApp com resposta rápida e eficiente',
                'Experiência moderna com design premium e navegação intuitiva'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FEATURED PROPERTIES LISTINGS */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full space-y-10">
        
        {/* Header Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-4 h-4" />
              <span>Oportunidades em Destaque</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Imóveis Selecionados para Você
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTypeFilter('todos')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTypeFilter === 'todos' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setActiveTypeFilter('venda')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTypeFilter === 'venda' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'
              }`}
            >
              Vendas
            </button>
            <button
              onClick={() => setActiveTypeFilter('aluguel')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTypeFilter === 'aluguel' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'
              }`}
            >
              Aluguéis
            </button>
            <button
              onClick={() => setActiveTypeFilter('terreno')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTypeFilter === 'terreno' ? 'bg-amber-500 text-slate-950' : 'text-slate-300 hover:text-white'
              }`}
            >
              Terrenos
            </button>
          </div>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : filteredProps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProps.slice(0, 6).map((prop) => (
              <PropertyCard key={prop.id} property={prop} featuredMode={prop.featured} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-slate-900/40 rounded-3xl border border-slate-800 space-y-3">
            <Building2 className="w-10 h-10 text-slate-600 mx-auto" />
            <p className="text-sm text-slate-400">Nenhum imóvel encontrado nesta categoria.</p>
          </div>
        )}

        <div className="text-center pt-4">
          <Link
            href="/imoveis"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500 text-amber-400 text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-all shadow-xl"
          >
            <span>Ver Todos os Imóveis ({properties.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </section>

      {/* CATEGORIES GRID */}
      <section className="py-16 px-4 sm:px-8 bg-slate-900/40 border-y border-slate-800">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Ache seu Estilo</span>
            <h2 className="text-3xl font-black text-white">Categorias em Destaque</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              href="/imoveis?category=casa"
              className="group relative aspect-[4/3] rounded-3xl overflow-hidden border border-slate-800 hover:border-amber-500 transition-all"
            >
              <img
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80"
                alt="Casas de Condomínio"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 space-y-1">
                <span className="text-xs text-amber-400 font-bold uppercase">Casas & Mansões</span>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                  Condomínios Fechados
                </h3>
              </div>
            </Link>

            <Link
              href="/imoveis?category=terreno"
              className="group relative aspect-[4/3] rounded-3xl overflow-hidden border border-slate-800 hover:border-amber-500 transition-all"
            >
              <img
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&auto=format&fit=crop&q=80"
                alt="Terrenos e Lotes"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 space-y-1">
                <span className="text-xs text-amber-400 font-bold uppercase">Loteamentos</span>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                  Terrenos & Lotes
                </h3>
              </div>
            </Link>

            <Link
              href="/imoveis?category=cobertura"
              className="group relative aspect-[4/3] rounded-3xl overflow-hidden border border-slate-800 hover:border-amber-500 transition-all"
            >
              <img
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=80"
                alt="Coberturas Duplex"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 space-y-1">
                <span className="text-xs text-amber-400 font-bold uppercase">Vista Panorâmica</span>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                  Coberturas Duplex
                </h3>
              </div>
            </Link>

            <Link
              href="/imoveis?type=aluguel"
              className="group relative aspect-[4/3] rounded-3xl overflow-hidden border border-slate-800 hover:border-amber-500 transition-all"
            >
              <img
                src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&auto=format&fit=crop&q=80"
                alt="Locação"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 space-y-1">
                <span className="text-xs text-amber-400 font-bold uppercase">Locação Residencial</span>
                <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                  Aluguéis Prontos
                </h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* MAP SECTION */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Navegação Visual</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Explorar Imóveis pelo Mapa</h2>
          </div>
          <p className="text-xs text-slate-400">Clique nos valores no mapa para pré-visualizar as informações do imóvel.</p>
        </div>

        <InteractiveModernMap properties={properties} />
        <div className="flex items-center justify-end pt-2">
          <Link
            href="/mapa"
            className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-bold hover:underline"
          >
            <span>Abrir Mapa Completo & Interativo</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </section>

      {/* BROKERS TEAM SECTION */}
      <section className="py-16 px-4 sm:px-8 bg-slate-900/30 border-t border-slate-800">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Equipe de Elite</span>
            <h2 className="text-3xl font-black text-white">Corretores Especialistas</h2>
            <p className="text-xs text-slate-400">Atendimento personalizado com corretores credenciados e experientes.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {brokers.map((broker) => (
              <div key={broker.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4 hover:border-amber-500/50 transition-all shadow-xl">
                <div className="flex items-start gap-4">
                  <img
                    src={broker.photoUrl}
                    alt={broker.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500/60 shrink-0"
                  />
                  <div>
                    <h3 className="text-base font-bold text-white">{broker.name}</h3>
                    <span className="text-xs font-mono text-amber-400 font-semibold">{broker.creci}</span>
                    <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{broker.bio}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">
                    {broker.activeListingsCount || 0} imóveis geridos
                  </span>

                  <a
                    href={`https://wa.me/${broker.whatsapp.replace(/\D/g, '')}?text=Ol%C3%A1%20${encodeURIComponent(broker.name)}!%20Gostaria%20de%20um%20atendimento%20imobili%C3%A1rio.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
                  >
                    <MessageSquare className="w-3.5 h-3.5 fill-white" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI VALUATION & LISTING CTA BANNER */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 p-8 sm:p-12 text-slate-950 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="px-3 py-1 rounded-full bg-slate-950 text-amber-400 text-xs font-bold uppercase tracking-wider">
                Quer Vender ou Alugar seu Imóvel?
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-950 leading-tight">
                Descubra o valor real de mercado do seu imóvel com nossa Avaliação Inteligente
              </h2>
              <p className="text-sm font-medium text-slate-900/90 leading-relaxed max-w-2xl">
                Anunciamos seu imóvel com fotos profissionais, tours virtuais e fazemos o direcionamento direto para compradores e locatários qualificados.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <Link
                href="/avaliacao"
                className="py-4 px-6 rounded-2xl bg-slate-950 hover:bg-slate-900 text-amber-400 text-sm font-black text-center shadow-xl transition-all uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Award className="w-5 h-5 text-amber-400" />
                <span>Simular Avaliação Grátis</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
