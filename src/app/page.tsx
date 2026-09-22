'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Sparkles, 
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
  Search
} from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSearch from '@/components/HeroSearch';
import WhatsappIcon from '@/components/icons/WhatsappIcon';
import PropertyCard from '@/components/PropertyCard';
import InteractiveModernMap from '@/components/InteractiveModernMap';
import { PropertyItem } from '@/context/RealEstateContext';
import { formatCurrencyBRL } from '@/lib/whatsapp';

export default function HomePage() {
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [brokers, setBrokers] = useState<any[]>([]);
  const [workWithBrokers, setWorkWithBrokers] = useState(true);
  const [loading, setLoading] = useState(true);
  const [activeTypeFilter, setActiveTypeFilter] = useState<string>('todos');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [pRes, bRes, sRes] = await Promise.all([
          fetch('/api/properties'),
          fetch('/api/brokers'),
          fetch('/api/settings')
        ]);
        const pData = await pRes.json();
        const bData = await bRes.json();
        const sData = await sRes.json();

        if (pData.success) setProperties(pData.data);
        if (bData.success) setBrokers(bData.data);
        if (sData.success) setWorkWithBrokers(sData.data.workWithBrokers !== false);
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
      <section className="relative pt-16 pb-28 px-4 sm:px-8 overflow-hidden bg-slate-950 min-h-[640px]">
        {/* Beautiful luxury house background image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&auto=format&fit=crop&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
          aria-hidden="true"
        />
        {/* Dark overlay so the headline and search remain legible */}
        <div className="absolute inset-0 bg-slate-950/60" />

        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[250px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto text-center space-y-6 relative z-10">
          <p className="text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Casas em condomínio, coberturas duplex, terrenos e aluguéis de alto padrão nas localizações mais cobiçadas do mercado.
          </p>

          {/* Search Filter Box Component */}
          <div className="pt-4">
            <HeroSearch />
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
            {filteredProps.filter(p => p.featured).map((prop) => (
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
            <span>Ver Todos os Imóveis</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </section>

      {/* MAP SECTION */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full space-y-6">
        <InteractiveModernMap properties={properties} />
      </section>

      {/* BROKERS TEAM SECTION */}
      <section className="py-16 px-4 sm:px-8 bg-slate-900/30 border-t border-slate-800">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Equipe de Elite</span>
            <h2 className="text-3xl font-black text-white">Corretores Especialistas</h2>
            <p className="text-xs text-slate-400">Atendimento personalizado com corretores credenciados e experientes.</p>
          </div>

          <div className="marquee-viewport">
            <div className="marquee-track">
              {[...brokers, ...brokers].map((broker, idx) => (
                <div
                  key={`${broker.id}-${idx}`}
                  className="marquee-card bg-slate-900 border border-slate-800 rounded-3xl flex flex-col justify-between space-y-4 hover:border-amber-500/50 shadow-xl"
                >
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

                  {workWithBrokers && (
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end text-xs">
                      <a
                        href={`https://wa.me/${broker.whatsapp.replace(/\D/g, '')}?text=Ol%C3%A1%20${encodeURIComponent(broker.name)}!%20Gostaria%20de%20um%20atendimento%20imobili%C3%A1rio.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
                      >
                        <WhatsappIcon className="w-3.5 h-3.5 fill-white" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
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
                Avalie Seu Imóvel com Nossa Equipe Especializada
              </h2>
              <p className="text-sm font-medium text-slate-900/90 leading-relaxed max-w-2xl">
                Solicite uma avaliação profissional e receba o acompanhamento de corretores credenciados para vender ou alugar seu imóvel.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <Link
                href="/avaliacao"
                className="py-4 px-6 rounded-2xl bg-slate-950 hover:bg-slate-900 text-amber-400 text-sm font-black text-center shadow-xl transition-all uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Award className="w-5 h-5 text-amber-400" />
                <span>Solicitar Avaliação</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
