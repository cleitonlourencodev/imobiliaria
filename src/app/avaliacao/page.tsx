'use client';

import React, { useState } from 'react';
import { Award, Calculator, CheckCircle2, ShieldCheck, Building2, MapPin, Sparkles, Send } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRealEstate } from '@/context/RealEstateContext';

export default function PropertyValuationPage() {
  const { showToast } = useRealEstate();

  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [propertyType, setPropertyType] = useState('casa');
  const [intent, setIntent] = useState('vender');
  const [city, setCity] = useState('São Paulo');
  const [neighborhood, setNeighborhood] = useState('');
  const [estimatedArea, setEstimatedArea] = useState(120);
  const [bedrooms, setBedrooms] = useState(3);
  const [notes, setNotes] = useState('');

  const [resultValuation, setResultValuation] = useState<{ formattedEstimate: string; estimatedMarketValue: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleValuationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName || !ownerPhone || !ownerEmail) {
      showToast('Preencha os campos obrigatórios!', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('/api/valuation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerName,
          ownerPhone,
          ownerEmail,
          propertyType,
          intent,
          city,
          neighborhood,
          estimatedArea,
          bedrooms,
          notes
        })
      });

      const data = await res.json();
      if (data.success) {
        setResultValuation({
          formattedEstimate: data.formattedEstimate,
          estimatedMarketValue: data.estimatedMarketValue
        });
        showToast('Avaliação calculada e solicitação enviada aos nossos corretores!', 'success');
      } else {
        showToast('Erro ao processar avaliação.', 'error');
      }
    } catch (e) {
      console.error(e);
      showToast('Erro ao conectar com o servidor.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />

      <section className="bg-slate-900/80 border-b border-slate-800 py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <span className="text-amber-400 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Award className="w-4 h-4" /> Avaliação Imobiliária Inteligente
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Quanto Vale o Seu Imóvel?
          </h1>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Simule o valor estimado de mercado do seu imóvel e coloque à venda ou locação com a Prime Imóveis.
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-12 w-full flex-1">
        <div className="bg-slate-900 border border-slate-800 p-6 sm:p-10 rounded-3xl space-y-8 shadow-2xl">
          
          {resultValuation ? (
            <div className="text-center space-y-6 py-6 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <Sparkles className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                  Estimativa de Mercado Gerada
                </span>
                <div className="text-4xl sm:text-5xl font-black text-white font-mono">
                  {resultValuation.formattedEstimate}
                </div>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Valor estimado com base no metro quadrado médio da região de {neighborhood || city} para imóveis do tipo {propertyType}.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 max-w-md mx-auto space-y-2">
                <p className="font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Solicitação Recebida
                </p>
                <p className="text-slate-400">
                  Um dos nossos corretores credenciados entrará em contato via WhatsApp no número <strong>{ownerPhone}</strong> para agendar uma vistoria técnica gratuita.
                </p>
              </div>

              <button
                onClick={() => setResultValuation(null)}
                className="px-6 py-3 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl"
              >
                Fazer Nova Avaliação
              </button>
            </div>
          ) : (
            <form onSubmit={handleValuationSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="ownerName" className="text-xs font-semibold text-slate-300">Seu Nome Completo *</label>
                  <input
                    id="ownerName"
                    name="ownerName"
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Ex: João da Silva"
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 text-xs focus:border-amber-500 focus:outline-none mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="ownerPhone" className="text-xs font-semibold text-slate-300">Seu WhatsApp *</label>
                  <input
                    id="ownerPhone"
                    name="ownerPhone"
                    type="tel"
                    required
                    value={ownerPhone}
                    onChange={(e) => setOwnerPhone(e.target.value)}
                    placeholder="(11) 99999-8888"
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 text-xs focus:border-amber-500 focus:outline-none mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="ownerEmail" className="text-xs font-semibold text-slate-300">Seu E-mail *</label>
                  <input
                    id="ownerEmail"
                    name="ownerEmail"
                    type="email"
                    required
                    value={ownerEmail}
                    onChange={(e) => setOwnerEmail(e.target.value)}
                    placeholder="joao@email.com"
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 text-xs focus:border-amber-500 focus:outline-none mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="intent" className="text-xs font-semibold text-slate-300">Objetivo</label>
                  <select
                    id="intent"
                    name="intent"
                    value={intent}
                    onChange={(e) => setIntent(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 text-xs focus:border-amber-500 focus:outline-none mt-1"
                  >
                    <option value="vender">Quero Vender meu imóvel</option>
                    <option value="alugar">Quero Alugar meu imóvel</option>
                    <option value="apenas_avaliar">Apenas consultar valor de mercado</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-4">
                <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Dados do Imóvel
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="propertyType" className="text-xs font-semibold text-slate-300">Tipo de Imóvel</label>
                    <select
                      id="propertyType"
                      name="propertyType"
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 text-xs focus:border-amber-500 focus:outline-none mt-1"
                    >
                      <option value="casa">Casa / Sobrado</option>
                      <option value="terreno">Terreno / Lote</option>
                      <option value="apartamento">Apartamento</option>
                      <option value="cobertura">Cobertura</option>
                      <option value="comercial">Comercial</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="city" className="text-xs font-semibold text-slate-300">Cidade</label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label htmlFor="neighborhood" className="text-xs font-semibold text-slate-300">Bairro</label>
                    <input
                      id="neighborhood"
                      name="neighborhood"
                      type="text"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      placeholder="Ex: Pinheiros, Alphaville..."
                      className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label htmlFor="estimatedArea" className="text-xs font-semibold text-slate-300">Área Estimada (m²)</label>
                    <input
                      id="estimatedArea"
                      name="estimatedArea"
                      type="number"
                      value={estimatedArea}
                      onChange={(e) => setEstimatedArea(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label htmlFor="bedrooms" className="text-xs font-semibold text-slate-300">Quantidade de Quartos</label>
                    <input
                      id="bedrooms"
                      name="bedrooms"
                      type="number"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 text-xs mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className="text-xs font-semibold text-slate-300">Observações Adicionais</label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Detalhes sobre reformas, acabamentos, condomínio, etc."
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2 text-xs focus:border-amber-500 focus:outline-none mt-1"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20"
              >
                <Calculator className="w-4 h-4" />
                <span>{loading ? 'Calculando Avaliação...' : 'Calcular Avaliação & Enviar Solicitação'}</span>
              </button>
            </form>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
