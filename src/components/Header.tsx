'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Building2, 
  Heart, 
  Scale, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Menu, 
  X, 
  PlusCircle, 
  Lock,
  LayoutDashboard,
  Home,
  MapPin,
  Calculator,
  Award,
  Users
} from 'lucide-react';
import { useRealEstate } from '@/context/RealEstateContext';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { favorites, comparedProperties } = useRealEstate();

  const isLinkActive = (href: string) => {
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
  };

  const navLinks = [
    { name: 'Início', href: '/', icon: Home },
    { name: 'Imóveis', href: '/imoveis', icon: Building2 },
    { name: 'Venda', href: '/imoveis?type=venda', icon: MapPin },
    { name: 'Aluguel', href: '/imoveis?type=aluguel', icon: Building2 },
    { name: 'Terrenos', href: '/imoveis?category=terreno', icon: MapPin },
    { name: 'Corretores', href: '/corretores', icon: Users },
    { name: 'Avaliar Imóvel', href: '/avaliacao', icon: Award },
    { name: 'Financiamento', href: '/financiamento', icon: Calculator },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-slate-100 transition-all duration-200 overflow-hidden">
      {/* Top Banner with Discrete System Access Button at Top Right */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800/80 overflow-hidden">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2 flex-wrap">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>CRECI 45.892-J • Atendimento Exclusivo</span>
            </span>
            <span className="hidden md:inline text-slate-700">•</span>
            <span className="hidden md:inline text-slate-400">Seg a Sáb: 08:00 às 19:00</span>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="tel:1138904000" 
              className="hidden sm:flex items-center gap-1 text-slate-300 hover:text-amber-400 transition-colors font-medium text-[11px]"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              (11) 3890-4000
            </a>

            <span className="hidden sm:inline text-slate-800">|</span>

            {/* Discrete Top Right Access Button for the Management System */}
            <Link 
              href="/admin" 
              title="Acesso à Área Administrativa"
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-amber-500/10 text-slate-400 hover:text-amber-400 border border-slate-800 hover:border-amber-500/40 px-2.5 py-1 rounded-lg transition-all text-[11px] font-medium whitespace-nowrap"
            >
              <Lock className="w-3 h-3 text-amber-400 shrink-0" />
              <span>Área Administrativa</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
            <Building2 className="w-6 h-6 text-slate-950" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1 text-xl font-black tracking-wider text-white">
              <span>PRIME</span>
              <span className="text-amber-400">IMÓVEIS</span>
            </div>
            <span className="text-[10px] text-slate-400 uppercase tracking-widest -mt-1 font-medium">
              Vendas & Locações
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links + Actions */}
        <div className="hidden xl:flex items-center gap-1 bg-slate-900/70 p-1.5 rounded-2xl border border-slate-800">
          {navLinks.map((link) => {
            const active = isLinkActive(link.href);
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  active
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <link.icon className={`w-3.5 h-3.5 ${active ? 'text-slate-950' : 'text-slate-400'}`} />
                {link.name}
              </Link>
            );
          })}

          <span className="w-px h-5 bg-slate-700 mx-1" />

          {/* Icon Actions */}
          <Link
            href="/comparar"
            title="Comparar Imóveis"
            className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
          >
            <Scale className="w-4 h-4 text-amber-400" />
            {comparedProperties.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-amber-500 text-slate-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                {comparedProperties.length}
              </span>
            )}
          </Link>

          <Link
            href="/favoritos"
            title="Meus Imóveis Favoritos"
            className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
          >
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
            {favorites.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </Link>

          <Link
            href="/avaliacao"
            title="Anunciar Imóvel"
            className="p-2 rounded-xl text-amber-400 hover:text-amber-300 hover:bg-slate-800/60 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
          </Link>

          <a
            href="https://wa.me/5511998887777?text=Ol%C3%A1!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20os%20im%C3%B3veis%20da%20Prime%20Im%C3%B3veis."
            target="_blank"
            rel="noopener noreferrer"
            title="WhatsApp"
            className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
          >
            <MessageSquare className="w-4 h-4 fill-white" />
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-6 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${
                    active ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-950/60 text-slate-300'
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-800 grid grid-cols-2 gap-3">
            <Link
              href="/favoritos"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-rose-400"
            >
              <Heart className="w-4 h-4 fill-rose-500/20" />
              Favoritos ({favorites.length})
            </Link>

            <Link
              href="/comparar"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-amber-400"
            >
              <Scale className="w-4 h-4" />
              Comparar ({comparedProperties.length})
            </Link>

            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="col-span-2 flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-950 border border-amber-500/40 text-amber-400 text-xs font-bold"
            >
              <Lock className="w-4 h-4" />
              Acesso à Área Administrativa
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
