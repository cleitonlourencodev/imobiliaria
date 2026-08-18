'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  MapPin, 
  Bed, 
  Bath, 
  Car, 
  Maximize, 
  Heart, 
  Scale, 
  Share2, 
  Printer, 
  MessageSquare, 
  Zap, 
  ShieldCheck, 
  CheckCircle2, 
  Calculator, 
  ChevronRight,
  User,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PropertyCard from '@/components/PropertyCard';
import { PropertyItem, useRealEstate } from '@/context/RealEstateContext';
import { formatCurrencyBRL } from '@/lib/whatsapp';

export default function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { slug } = use(params);

  const { toggleFavorite, isFavorite, addToCompare, removeFromCompare, isInCompare, showToast } = useRealEstate();

  const [property, setProperty] = useState<PropertyItem | null>(null);
  const [similarProps, setSimilarProps] = useState<PropertyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>('');

  // Form Lead State
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [leadType, setLeadType] = useState<'whatsapp_direto' | 'agendamento_visita' | 'simulacao_financiamento'>('whatsapp_direto');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Financing Calculator Local State
  const [downPaymentPct, setDownPaymentPct] = useState<number>(20);
  const [loanYears, setDownLoanYears] = useState<number>(30);
  const [annualRate, setAnnualRate] = useState<number>(10.5);

  useEffect(() => {
    async function loadProperty() {
      try {
        setLoading(true);
        const res = await fetch(`/api/properties/${slug}`);
        const data = await res.json();
        if (data.success && data.data) {
          setProperty(data.data);
          setActiveImage(data.data.coverImage);

          // Fetch similar properties
          const simRes = await fetch(`/api/properties?category=${data.data.category}`);
          const simData = await simRes.json();
          if (simData.success) {
            setSimilarProps(simData.data.filter((p: PropertyItem) => p.id !== data.data.id));
          }
        }
      } catch (e) {
        console.error('Error fetching property detail:', e);
      } finally {
        setLoading(false);
      }
    }
    loadProperty();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 w-full text-center space-y-4">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-slate-400">Carregando detalhes do imóvel...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-20 w-full text-center space-y-4">
          <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
          <h2 className="text-xl font-bold text-white">Imóvel não encontrado</h2>
          <Link href="/imoveis" className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl inline-block">
            Voltar ao Catálogo
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const favorited = isFavorite(property.id);
  const compared = isInCompare(property.id);

  // Mortgage calculations
  const priceVal = parseFloat(property.price) || 0;
  const downPaymentVal = (priceVal * downPaymentPct) / 100;
  const loanVal = Math.max(0, priceVal - downPaymentVal);
  const monthlyRate = annualRate / 12 / 100;
  const totalMonths = loanYears * 12;
  const monthlyPayment = loanVal > 0 && monthlyRate > 0
    ? (loanVal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
    : 0;

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) {
      showToast('Por favor, informe seu nome e telefone.', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: property.id,
          clientName: clientName.trim(),
          clientPhone: clientPhone.trim(),
          clientEmail: clientEmail.trim(),
          type: leadType,
          preferredDate,
          preferredTime,
          message: message.trim() || `Interesse manifestado no imóvel ${property.code} (${property.title}).`
        })
      });

      const data = await res.json();
      if (data.success && data.whatsapp) {
        showToast('Atendimento registrado! Redirecionando para o WhatsApp...', 'success');
        setTimeout(() => {
          window.open(data.whatsapp.url, '_blank');
        }, 600);
      } else {
        showToast('Erro ao registrar interesse.', 'error');
      }
    } catch (e) {
      console.error(e);
      showToast('Erro ao conectar com o servidor.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Confira o imóvel ${property.code}: ${property.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copiado para a área de transferência!', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />

      {/* Breadcrumb Navigation */}
      <div className="bg-slate-900/60 border-b border-slate-800 py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Link href="/" className="hover:text-amber-400">Início</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <Link href="/imoveis" className="hover:text-amber-400">Imóveis</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-slate-200 font-semibold truncate max-w-xs">{property.title}</span>
          </div>

          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 w-full flex-1 space-y-10">
        
        {/* Title & Action Buttons Bar */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-slate-800/80 pb-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider">
                {property.type === 'venda' ? 'Venda' : property.type === 'aluguel' ? 'Aluguel' : 'Venda & Aluguel'}
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-900 text-slate-200 border border-slate-800 text-xs font-bold uppercase tracking-wider">
                {property.category}
              </span>
              <span className="px-3 py-1 rounded-lg bg-slate-950 text-amber-400 font-mono text-xs font-bold border border-amber-500/30">
                Cód: {property.code}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              {property.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{property.address} — {property.neighborhood}, {property.city} - {property.state}</span>
            </p>
          </div>

          {/* Price & Primary Actions */}
          <div className="flex flex-col items-start md:items-end gap-3 shrink-0">
            <div className="text-3xl font-black text-amber-400">
              {formatCurrencyBRL(property.price)}
              {property.type === 'aluguel' && <span className="text-sm font-normal text-slate-400"> /mês</span>}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleFavorite(property.id)}
                className={`p-2.5 rounded-xl border transition-all ${
                  favorited ? 'bg-rose-500 text-white border-rose-400' : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-rose-400'
                }`}
                title="Favoritar Imóvel"
              >
                <Heart className={`w-4 h-4 ${favorited ? 'fill-white' : ''}`} />
              </button>

              <button
                onClick={() => compared ? removeFromCompare(property.id) : addToCompare(property)}
                className={`p-2.5 rounded-xl border transition-all ${
                  compared ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold' : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-amber-400'
                }`}
                title="Comparar"
              >
                <Scale className="w-4 h-4" />
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                title="Compartilhar"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => window.print()}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                title="Imprimir Ficha"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* High Res Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl">
            <img
              src={activeImage || property.coverImage}
              alt={property.title}
              className="w-full h-full object-cover transition-all duration-300"
            />

            {/* VIP Service Indicator */}
            <div className="absolute top-4 left-4 z-10">
              {property.whatsappDirectEnabled ? (
                <div className="px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-xl backdrop-blur-md">
                  <Zap className="w-4 h-4 fill-slate-950 animate-pulse" />
                  <span>Atendimento VIP Ativo</span>
                </div>
              ) : (
                <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 text-slate-400 text-xs font-bold flex items-center gap-1.5 backdrop-blur-md border border-slate-800">
                  <span>Consultoria Prime</span>
                </div>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          {property.images && property.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {property.images.map((imgUrl, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`relative w-24 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImage === imgUrl ? 'border-amber-400 scale-105 shadow-lg' : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Specs Overview Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 p-5 rounded-3xl bg-slate-900 border border-slate-800 text-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400">
              <Maximize className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Área Total</span>
              <div className="text-sm font-bold text-white">{property.totalArea} m²</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400">
              <Bed className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Dormitórios</span>
              <div className="text-sm font-bold text-white">{property.bedrooms} quartos</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400">
              <Bath className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Suítes / Banheiros</span>
              <div className="text-sm font-bold text-white">{property.suites} suítes / {property.bathrooms} ban</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Vagas</span>
              <div className="text-sm font-bold text-white">{property.parkingSpaces} vagas</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Condomínio</span>
              <div className="text-sm font-bold text-white">{formatCurrencyBRL(property.condoFee)}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">IPTU Mensal</span>
              <div className="text-sm font-bold text-white">{formatCurrencyBRL(property.iptu)}</div>
            </div>
          </div>
        </div>

        {/* Detailed Description + Responsible Broker & Contact Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Info Left Column */}
          <div className="lg:col-span-8 space-y-10">
            {/* Description */}
            <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-4">
              <h3 className="text-lg font-bold text-white border-l-4 border-amber-500 pl-3">
                Descrição do Imóvel
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-4">
                <h3 className="text-lg font-bold text-white border-l-4 border-amber-500 pl-3">
                  Características & Diferenciais
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mortgage Simulator Embedded */}
            <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-amber-400" />
                    Simulador de Financiamento Estimado
                  </h3>
                  <p className="text-xs text-slate-400">Simule a entrada e parcelas estimadas para este imóvel.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="downPaymentPct" className="text-xs font-semibold text-slate-300">Entrada ({downPaymentPct}%)</label>
                  <input
                    id="downPaymentPct"
                    name="downPaymentPct"
                    type="range"
                    min="10"
                    max="80"
                    value={downPaymentPct}
                    onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                  <span className="text-xs font-mono font-bold text-amber-400">{formatCurrencyBRL(downPaymentVal)}</span>
                </div>

                <div>
                  <label htmlFor="loanYears" className="text-xs font-semibold text-slate-300">Prazo ({loanYears} anos)</label>
                  <input
                    id="loanYears"
                    name="loanYears"
                    type="range"
                    min="5"
                    max="35"
                    value={loanYears}
                    onChange={(e) => setDownLoanYears(Number(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                  <span className="text-xs font-mono font-bold text-amber-400">{loanYears} Anos ({totalMonths} meses)</span>
                </div>

                <div>
                  <label htmlFor="annualRate" className="text-xs font-semibold text-slate-300">Taxa Anual Média</label>
                  <input
                    id="annualRate"
                    name="annualRate"
                    type="number"
                    step="0.1"
                    value={annualRate}
                    onChange={(e) => setAnnualRate(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <span className="text-xs text-slate-400">{annualRate}% a.a.</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-400">Parcela Inicial Estimada (SAC):</span>
                  <div className="text-2xl font-black text-amber-400">
                    {formatCurrencyBRL(monthlyPayment)} <span className="text-xs font-normal text-slate-400">/mês</span>
                  </div>
                </div>

                <Link
                  href="/financiamento"
                  className="px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition-colors"
                >
                  Comparar com Bancos (Caixa, Itaú...)
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Responsible Broker & Lead Direct Contact Box */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* BROKER RESPONSIBLE BADGE CARD */}
            <div className="bg-slate-900 border-2 border-amber-500/40 p-6 rounded-3xl space-y-5 shadow-2xl relative">
              <div className="flex items-center gap-4 border-b border-slate-800 pb-4">
                {property.broker ? (
                  <img
                    src={property.broker.photoUrl}
                    alt={property.broker.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500 shadow-md"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                    <User className="w-8 h-8" />
                  </div>
                )}

                <div>
                  <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                    Corretor Responsável
                  </span>
                  <h4 className="text-base font-bold text-white">
                    {property.broker ? property.broker.name : 'Central Prime Imóveis'}
                  </h4>
                  <span className="text-xs font-mono text-slate-400">
                    {property.broker ? property.broker.creci : 'CRECI 45.892-J'}
                  </span>
                </div>
              </div>

              {/* Atendimento ao Cliente */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Atendimento Personalizado</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Nossos consultores estão disponíveis para orientá-lo em todas as etapas, desde a primeira visita até a assinatura do contrato.
                </p>
              </div>

              {/* Form Tab Toggles */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setLeadType('whatsapp_direto')}
                  className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                    leadType === 'whatsapp_direto' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  Tenho Interesse
                </button>
                <button
                  onClick={() => setLeadType('agendamento_visita')}
                  className={`flex-1 py-1.5 rounded-lg font-bold transition-all ${
                    leadType === 'agendamento_visita' ? 'bg-amber-500 text-slate-950' : 'text-slate-400'
                  }`}
                >
                  Agendar Visita
                </button>
              </div>

              {/* Contact Lead Form */}
              <form onSubmit={handleLeadSubmit} className="space-y-3">
                <div>
                  <label htmlFor="clientName" className="text-xs font-semibold text-slate-300">Seu Nome *</label>
                  <input
                    id="clientName"
                    name="clientName"
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Nome completo"
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="clientPhone" className="text-xs font-semibold text-slate-300">Seu Telefone / WhatsApp *</label>
                  <input
                    id="clientPhone"
                    name="clientPhone"
                    type="tel"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="(11) 99999-8888"
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="clientEmail" className="text-xs font-semibold text-slate-300">E-mail (opcional)</label>
                  <input
                    id="clientEmail"
                    name="clientEmail"
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2.5 text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>

                {leadType === 'agendamento_visita' && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="preferredDate" className="text-xs font-semibold text-slate-300">Data Preferida</label>
                      <input
                        id="preferredDate"
                        name="preferredDate"
                        type="date"
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-2.5 py-2 text-xs"
                      />
                    </div>
                    <div>
                      <label htmlFor="preferredTime" className="text-xs font-semibold text-slate-300">Horário</label>
                      <input
                        id="preferredTime"
                        name="preferredTime"
                        type="time"
                        value={preferredTime}
                        onChange={(e) => setPreferredTime(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-2.5 py-2 text-xs"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label htmlFor="message" className="text-xs font-semibold text-slate-300">Mensagem</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Gostaria de agendar uma visita ou receber mais informações..."
                    className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3.5 py-2 text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>{submitting ? 'Gerando Notificação...' : 'Falar no WhatsApp com o Corretor'}</span>
                </button>
              </form>

              <div className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Seus dados estão protegidos e não serão compartilhados.</span>
              </div>
            </div>

          </div>

        </div>

        {/* Similar Properties */}
        {similarProps.length > 0 && (
          <div className="pt-10 border-t border-slate-800 space-y-6">
            <h3 className="text-xl font-black text-white">Imóveis Semelhantes</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarProps.slice(0, 3).map((prop) => (
                <PropertyCard key={prop.id} property={prop} />
              ))}
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
