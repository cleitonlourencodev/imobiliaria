'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { HelpCircle, ChevronDown, ExternalLink, MapPin } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  link: string | null;
}

export default function FaqPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    async function loadFaqs() {
      try {
        const res = await fetch('/api/faq');
        const data = await res.json();
        if (data.success) setFaqs(data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadFaqs();
  }, []);

  const toggle = (id: string) => setOpenId(openId === id ? null : id);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />

      <section className="bg-slate-900/80 border-b border-slate-800 py-14 px-4 sm:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="text-amber-400 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
            <HelpCircle className="w-4 h-4" /> Perguntas Frequentes
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Tudo o que você precisa saber
          </h1>
          <p className="text-sm text-slate-400">
            Veja as respostas para as dúvidas mais comuns sobre compra, venda, locação e avaliação de imóveis.
          </p>
        </div>
      </section>

      <main className="max-w-3xl mx-auto px-4 sm:px-8 py-12 w-full flex-1 space-y-4">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse" />
          ))
        ) : faqs.length === 0 ? (
          <div className="text-center py-16 text-slate-400">Nenhuma pergunta frequente cadastrada.</div>
        ) : (
          faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div key={faq.id} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  className="w-full flex items-center justify-between gap-3 p-4 sm:p-5 text-left text-slate-200 hover:bg-slate-800/50 transition-colors"
                >
                  <span className="font-medium text-sm sm:text-base">{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-amber-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 border-t border-slate-800 space-y-4">
                    <p className="text-sm text-slate-300 leading-relaxed pt-3">{faq.answer}</p>
                    {faq.link && (
                      <div className="flex items-center gap-2 pt-1">
                        <Link
                          href={faq.link.startsWith('http') ? faq.link : faq.link}
                          target={faq.link.startsWith('http') ? '_blank' : undefined}
                          rel={faq.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 hover:underline"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>{faq.link.startsWith('http') ? 'Acessar solução' : 'Ver mais detalhes'}</span>
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-slate-400">
          <MapPin className="w-3.5 h-3.5 text-amber-400" />
          <span>Não achou sua resposta? Fale conosco pelo WhatsApp ou visite nossa central de atendimento.</span>
        </div>
      </main>

      <Footer />
    </div>
  );
}
