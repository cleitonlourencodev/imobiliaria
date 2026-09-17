'use client';

import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2, Send, ShieldCheck } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRealEstate } from '@/context/RealEstateContext';

interface Settings {
  whatsappDefault?: string;
  agencyName?: string;
}

export default function PropertyValuationPage() {
  const { showToast } = useRealEstate();
  const [settings, setSettings] = useState<Settings | null>(null);

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

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setSettings(data.data);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName || !ownerPhone || !ownerEmail) {
      showToast('Preencha os campos obrigatórios!', 'error');
      return;
    }

    setLoading(true);

    try {
      const agencyName = settings?.agencyName || 'Prime Imóveis';
      const whatsappNumber = settings?.whatsappDefault || '5511998887777';

      const intentLabel =
        intent === 'vender' ? 'Venda' : intent === 'alugar' ? 'Locação' : 'Consulta de Valor';

      const lines = [
        `Olá, *${agencyName}*! 👋`,
        `Recebi uma nova solicitação de *Avaliação de Imóvel*:`,
        ``,
        `🏡 *DADOS DO IMÓVEL:*`,
        `• *Tipo:* ${propertyType}`,
        `• *Objetivo:* ${intentLabel}`,
        `• *Cidade:* ${city}`,
        `• *Bairro:* ${neighborhood || 'Não informado'}`,
        `• *Área Estimada:* ${estimatedArea} m²`,
        `• *Quartos:* ${bedrooms}`,
        `• *Observações:* ${notes || 'Nenhuma'}`,
        ``,
        `👤 *DADOS DO PROPRIETÁRIO:*`,
        `• *Nome:* ${ownerName}`,
        `• *WhatsApp:* ${ownerPhone}`,
        ownerEmail ? `• *E-mail:* ${ownerEmail}` : '',
        ``,
        `⚡ _Aguardando contato do corretor responsável._`,
      ].filter(Boolean).join('\n');

      const encodedMsg = encodeURIComponent(lines);
      const cleanPhone = whatsappNumber.replace(/\D/g, '');
      const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMsg}`;

      window.open(whatsappUrl, '_blank');

      try {
        await fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            clientName: ownerName,
            clientPhone: ownerPhone,
            clientEmail: ownerEmail,
            propertyTitle: `${propertyType} em ${city}`,
            propertyCode: '—',
            propertyPrice: 'A avaliar',
            propertyAddress: `${neighborhood || ''}, ${city}`,
            clientMessage: notes,
            preferredDate: '',
            preferredTime: '',
            type: 'whatsapp_direto',
          }),
        });
      } catch {
        // Non-critical: lead logging is best-effort
      }

      setSubmitted(true);
      showToast('Solicitação enviada! A empresa entrará em contato.', 'success');
    } catch (e) {
      console.error(e);
      showToast('Erro ao enviar solicitação.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setOwnerName('');
    setOwnerPhone('');
    setOwnerEmail('');
    setPropertyType('casa');
    setIntent('vender');
    setCity('São Paulo');
    setNeighborhood('');
    setEstimatedArea(120);
    setBedrooms(3);
    setNotes('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />

      <section className="bg-slate-900/80 border-b border-slate-800 py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <span className="text-amber-400 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Award className="w-4 h-4" /> Avaliação de Imóvel
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Solicite a Avaliação do Seu Imóvel
          </h1>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Preencha os dados abaixo e nossa equipe entrará em contato com uma avaliação profissional.
          </p>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-12 w-full flex-1">
        <div className="bg-slate-900 border border-slate-800 p-6 sm:p-10 rounded-3xl space-y-8 shadow-2xl">

          {submitted ? (
            <div className="text-center space-y-6 py-6 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                  Solicitação Enviada
                </span>
                <h2 className="text-2xl font-black text-white">
                  Entraremos em Contato em Breve
                </h2>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Nossa equipe analisará os dados do seu imóvel e entrará em contato via WhatsApp para agendar uma visita técnica.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 max-w-md mx-auto space-y-2">
                <p className="font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Próximos Passos
                </p>
                <p className="text-slate-400">
                  Um corretor credenciado da <strong>{settings?.agencyName || 'Prime Imóveis'}</strong> retornará pelo WhatsApp no número <strong>{ownerPhone}</strong>.
                </p>
              </div>

              <button
                onClick={resetForm}
                className="px-6 py-3 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl"
              >
                Nova Solicitação
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    <option value="vender">Quero Vender</option>
                    <option value="alugar">Quero Alugar</option>
                    <option value="apenas_avaliar">Apenas Avaliar</option>
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
                <Send className="w-4 h-4" />
                <span>{loading ? 'Enviando...' : 'Solicitar Avaliação'}</span>
              </button>
            </form>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
