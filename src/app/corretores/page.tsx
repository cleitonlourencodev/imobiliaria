'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Users, ShieldCheck, MessageSquare, Phone, Mail, Award, CheckCircle2, Building2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function BrokersPage() {
  const [brokers, setBrokers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBrokers() {
      try {
        setLoading(true);
        const res = await fetch('/api/brokers');
        const data = await res.json();
        if (data.success) {
          setBrokers(data.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadBrokers();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />

      <section className="bg-slate-900/80 border-b border-slate-800 py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <span className="text-amber-400 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Users className="w-4 h-4" /> Equipe de Corretores
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Consultores Imobiliários Credenciados
          </h1>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Profissionais altamente capacitados, com registro CRECI ativo e prontos para lhe prestar um atendimento personalizado e transparente.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-12 w-full flex-1 space-y-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 rounded-3xl bg-slate-900 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {brokers.map((broker) => (
              <div
                key={broker.id}
                className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 p-6 rounded-3xl space-y-6 shadow-2xl transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={broker.photoUrl}
                      alt={broker.name}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-500 shadow-md shrink-0"
                    />
                    <div>
                      <span className="text-[10px] font-bold text-amber-400 font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {broker.creci}
                      </span>
                      <h3 className="text-lg font-bold text-white mt-1">{broker.name}</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3.5 h-3.5 text-amber-400" />
                        <span className="truncate">{broker.email}</span>
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
                    {broker.bio || 'Consultor imobiliário especializado em negócios de alto padrão.'}
                  </p>

                  {/* Specialties */}
                  {broker.specialties && broker.specialties.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400">Especialidades:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {broker.specialties.map((spec: string, i: number) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 text-[10px] font-semibold border border-slate-800">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                    <Building2 className="w-4 h-4 text-amber-400" />
                    <span>{broker.activeListingsCount || 0} imóveis</span>
                  </div>

                  <a
                    href={`https://wa.me/${broker.whatsapp.replace(/\D/g, '')}?text=Ol%C3%A1%20${encodeURIComponent(broker.name)}!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20im%C3%B3veis.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg"
                  >
                    <MessageSquare className="w-4 h-4 fill-white" />
                    <span>Conversar no WhatsApp</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
