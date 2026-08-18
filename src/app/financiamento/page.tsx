'use client';

import React, { useState } from 'react';
import { Calculator, DollarSign, Building2, CheckCircle2, TrendingDown, ArrowRight, ShieldCheck } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { formatCurrencyBRL } from '@/lib/whatsapp';

export default function FinancingSimulatorPage() {
  const [propertyValue, setPropertyValue] = useState<number>(850000);
  const [downPaymentPct, setDownPaymentPct] = useState<number>(20);
  const [years, setYears] = useState<number>(30);
  const [amortizationType, setAmortizationType] = useState<'SAC' | 'PRICE'>('SAC');

  const downPaymentVal = (propertyValue * downPaymentPct) / 100;
  const loanVal = Math.max(0, propertyValue - downPaymentVal);
  const totalMonths = years * 12;

  // Banks rates sample
  const bankOptions = [
    { name: 'Caixa Econômica Federal', rate: 9.8, logoBg: 'bg-blue-600' },
    { name: 'Itaú Unibanco', rate: 10.2, logoBg: 'bg-orange-600' },
    { name: 'Bradesco', rate: 10.4, logoBg: 'bg-red-600' },
    { name: 'Santander', rate: 10.6, logoBg: 'bg-red-700' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />

      <section className="bg-slate-900/80 border-b border-slate-800 py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <span className="text-amber-400 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Calculator className="w-4 h-4" /> Financiamento Imobiliário 2026
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Simulador de Crédito e Comparativo de Bancos
          </h1>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Simule o valor das parcelas e compare as taxas dos principais bancos do Brasil para conquistar seu imóvel.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-12 w-full flex-1 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Controls */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl">
            <h3 className="text-base font-bold text-white border-l-4 border-amber-500 pl-3">
              Parâmetros da Simulação
            </h3>

            <div>
              <label htmlFor="propertyValue" className="text-xs font-semibold text-slate-300">Valor do Imóvel (R$)</label>
              <input
                id="propertyValue"
                name="propertyValue"
                type="number"
                step="50000"
                value={propertyValue}
                onChange={(e) => setPropertyValue(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 text-amber-400 font-mono font-bold text-base rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 mt-1"
              />
            </div>

            <div>
              <label htmlFor="downPaymentPct" className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Entrada ({downPaymentPct}%)</span>
                <span className="text-amber-400 font-mono">{formatCurrencyBRL(downPaymentVal)}</span>
              </label>
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
            </div>

            <div>
              <label htmlFor="loanYears" className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                <span>Prazo em Anos ({years} anos)</span>
                <span className="text-amber-400 font-mono">{totalMonths} parcelas</span>
              </label>
              <input
                id="loanYears"
                name="loanYears"
                type="range"
                min="5"
                max="35"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300">Sistema de Amortização</label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setAmortizationType('SAC')}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                    amortizationType === 'SAC' ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  Tabela SAC (Decrescente)
                </button>
                <button
                  type="button"
                  onClick={() => setAmortizationType('PRICE')}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                    amortizationType === 'PRICE' ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  Tabela PRICE (Fixa)
                </button>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
              <span className="font-bold text-slate-200">Valor a Financiar:</span>
              <div className="text-2xl font-black text-white font-mono">{formatCurrencyBRL(loanVal)}</div>
            </div>
          </div>

          {/* Right Bank Comparison List */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-xl font-black text-white">
              Comparativo de Bancos
            </h3>

            <div className="space-y-4">
              {bankOptions.map((bank, idx) => {
                const monthlyRate = bank.rate / 12 / 100;
                let firstPayment = 0;

                if (amortizationType === 'SAC') {
                  const amortMonthly = loanVal / totalMonths;
                  firstPayment = amortMonthly + (loanVal * monthlyRate);
                } else {
                  firstPayment = loanVal > 0 && monthlyRate > 0
                    ? (loanVal * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
                    : 0;
                }

                return (
                  <div
                    key={idx}
                    className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-amber-500/40 transition-all shadow-xl"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl ${bank.logoBg} text-white flex items-center justify-center font-black text-sm shrink-0 shadow-lg`}>
                        {bank.name.slice(0, 2)}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white">{bank.name}</h4>
                        <span className="text-xs text-amber-400 font-mono font-semibold">
                          Taxa nominal: {bank.rate}% a.a. + TR
                        </span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400">1ª Parcela Estimada</span>
                      <div className="text-2xl font-black text-white font-mono">
                        {formatCurrencyBRL(firstPayment)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-xs text-slate-300 space-y-3">
              <h4 className="font-bold text-amber-400 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Assessoria de Financiamento Sem Custos
              </h4>
              <p className="leading-relaxed">
                A Prime Imóveis possui correspondentes bancários credenciados que realizam toda a aprovação de crédito e trâmites cartorários sem custos adicionais para o comprador.
              </p>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
