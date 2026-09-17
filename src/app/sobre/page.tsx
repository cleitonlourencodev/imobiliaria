'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Building2, Award, CheckCircle2, MapPin, Phone } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function SobrePage() {
  const valores = [
    { title: 'Excelência', desc: 'Excelência na mediação de negócios e no acompanhamento de cada etapa do processo.', icon: Award },
    { title: 'Transparência', desc: 'Transparência total em todas as operações, com informações claras e sem surpresas.', icon: ShieldCheck },
    { title: 'Confiabilidade', desc: 'Confiabilidade comprovada por clientes e parceiros que confiam seus imóveis conosco.', icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />

      <section className="bg-slate-900/80 border-b border-slate-800 py-14 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <span className="text-amber-400 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Sobre a Prime Imóveis & Negócios
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Sua Consultoria de Imóveis de Alto Padrão
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto">
            Referência no mercado imobiliário, especializada na venda e locação de casas de condomínio, terrenos, apartamentos e coberturas, com atendimento VIP e ferramentas modernas.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-12 w-full flex-1 space-y-16">
        {/* Quem Somos */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <h2 className="text-2xl font-black text-white flex items-center gap-2.5">
              <Building2 className="w-6 h-6 text-amber-400" /> Quem Somos
            </h2>
            <p className="text-slate-300 leading-relaxed">
              A Prime Imóveis & Negócios é uma corretora de imóveis de alto padrão fundada em 2018, com foco em vendas, locações e avaliações de imóveis residenciais e comerciais. Contamos com uma equipe de corretores especializados e credenciados, prontos para oferecer uma experiência personalizada e ágil.
            </p>
            <p className="text-slate-300 leading-relaxed">
              Nossa CRECI é <strong className="text-white">45.892-J</strong> e atendemos a toda a Grande São Paulo e região, com visitas e acompanhamento completo desde a negociação até a assinatura do contrato.
            </p>
            <div className="flex items-center gap-2.5 pt-2">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span className="text-slate-300">Av. Brigadeiro Faria Lima, 2200 - Itaim Bibi, São Paulo - SP</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-amber-400" />
              <span className="text-slate-300">(11) 3890-4000</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-amber-400 text-xs font-black uppercase tracking-wider">Nossa Missão</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Conectar pessoas e negócios ao imóvel ideal, oferecendo assessoria especializada, transparência e resultados que superam expectativas.
            </p>
            <h3 className="text-amber-400 text-xs font-black uppercase tracking-wider pt-2">Nossa Visão</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Ser a corretora de referência no alto padrão, reconhecida pela excelência no atendimento e pela ética no mercado imobiliário.
            </p>
          </div>
        </section>

        {/* Valores */}
        <section className="space-y-6">
          <h2 className="text-2xl font-black text-white">Nossos Valores</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {valores.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3 shadow-xl text-center">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-white font-black">{v.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl p-8 text-center space-y-4">
          <h2 className="text-2xl font-black text-slate-950">Pronto para encontrar o imóvel ideal?</h2>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-950 text-white text-xs font-bold rounded-2xl hover:bg-slate-800 transition-all"
          >
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>Conheça Nossos Imóveis</span>
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
