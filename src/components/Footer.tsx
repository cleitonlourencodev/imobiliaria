'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  ChevronRight, 
  Clock,
  Globe,
  LayoutDashboard
} from 'lucide-react';
import WhatsappIcon from '@/components/icons/WhatsappIcon';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Building2 className="w-6 h-6 text-slate-950" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-2xl font-black tracking-wider text-white">
                  <span>PRIME</span>
                  <span className="text-amber-400">IMÓVEIS</span>
                </div>
                <span className="text-xs text-slate-400 uppercase tracking-widest -mt-1 font-medium">
                  Vendas & Locações de Alto Padrão
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed pr-6">
              A Prime Imóveis & Negócios é referência no mercado imobiliário, especializada na venda e locação de casas de condomínio, terrenos, apartamentos e oportunidades de investimentos estratégicos com atendimento personalizado via WhatsApp diretamente com os corretores responsáveis.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-amber-500" /> Redes Sociais da Imobiliária:
              </span>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-amber-400 hover:border-amber-500/50 transition-all text-xs font-bold">
                IG
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-amber-400 hover:border-amber-500/50 transition-all text-xs font-bold">
                FB
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-amber-400 hover:border-amber-500/50 transition-all text-xs font-bold">
                YT
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-all text-xs font-bold">
                <WhatsappIcon className="w-4 h-4 fill-current" />
              </a>
            </div>
          </div>

          {/* Imóveis por Categoria */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider border-l-2 border-amber-500 pl-3">
              Categorias
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/imoveis?category=casa" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                  Casas & Sobrados
                </Link>
              </li>
              <li>
                <Link href="/imoveis?category=terreno" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                  Terrenos & Lotes
                </Link>
              </li>
              <li>
                <Link href="/imoveis?category=cobertura" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                  Coberturas Duplex
                </Link>
              </li>
              <li>
                <Link href="/imoveis?category=apartamento" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                  Apartamentos
                </Link>
              </li>
              <li>
                <Link href="/imoveis?type=aluguel" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                  Aluguéis Residenciais
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Rápidos */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider border-l-2 border-amber-500 pl-3">
              Links Rápidos
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/corretores" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                  Nossos Corretores
                </Link>
              </li>
              <li>
                <Link href="/avaliacao" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                  Avaliação de Imóvel
                </Link>
              </li>
              <li>
                <Link href="/financiamento" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                  Simulador de Financiamento
                </Link>
              </li>
              <li>
                <Link href="/comparar" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ChevronRight className="w-3.5 h-3.5 text-amber-500" />
                  Comparador de Imóveis
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-amber-400 font-semibold hover:underline flex items-center gap-1.5">
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Área Administrativa
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato & Atendimento */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider border-l-2 border-amber-500 pl-3">
              Central de Atendimento
            </h4>
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Av. Brig. Faria Lima, 2200 - Itaim Bibi, São Paulo - SP</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>(11) 3890-4000</span>
              </div>
              <div className="flex items-center gap-2.5">
                <WhatsappIcon className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>WhatsApp: (11) 99888-7777</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>contato@primeimoveis.com.br</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-400 pt-1">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Segunda a Sábado, 08h às 19h</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Rights */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>© 2026 Prime Imóveis & Negócios Ltda. Todos os direitos reservados. CRECI 45.892-J.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/imoveis" className="hover:text-amber-400 transition-colors">Todos os Imóveis</Link>
            <Link href="/admin" className="hover:text-amber-400 transition-colors text-amber-400/80">Área Administrativa</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
