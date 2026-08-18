'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Scale, 
  X, 
  Building2, 
  MapPin, 
  Bed, 
  Bath, 
  Car, 
  Maximize, 
  MessageSquare, 
  Zap,
  ArrowRight
} from 'lucide-react';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRealEstate } from '@/context/RealEstateContext';
import { formatCurrencyBRL } from '@/lib/whatsapp';

export default function PropertyComparePage() {
  const { comparedProperties, removeFromCompare, clearCompare } = useRealEstate();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />

      <section className="bg-slate-900/80 border-b border-slate-800 py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5">
              <Scale className="w-4 h-4" /> Comparador
            </span>
            <h1 className="text-3xl font-black text-white tracking-tight mt-1">
              Comparação Lado a Lado
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Compare as especificações e valores de até 3 imóveis simultaneamente.
            </p>
          </div>

          {comparedProperties.length > 0 && (
            <button
              onClick={clearCompare}
              className="px-4 py-2 bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white text-xs font-bold rounded-xl transition-colors"
            >
              Limpar Comparação
            </button>
          )}
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-10 w-full flex-1">
        {comparedProperties.length === 0 ? (
          <div className="p-16 text-center bg-slate-900/40 rounded-3xl border border-slate-800 space-y-4 max-w-lg mx-auto my-12">
            <Scale className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-white">Nenhum imóvel selecionado para comparação</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Clique no ícone de balança (<Scale className="w-3.5 h-3.5 inline text-amber-400" />) nos cartões de imóveis para adicionar à comparação side-by-side.
            </p>
            <Link
              href="/imoveis"
              className="px-5 py-2.5 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl inline-flex items-center gap-2"
            >
              <span>Explorar Imóveis</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto pb-4">
            <table className="w-full min-w-[700px] text-xs text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-4 bg-slate-900 text-slate-400 font-bold uppercase w-48 border-b border-slate-800 rounded-tl-2xl">
                    Atributos
                  </th>
                  {comparedProperties.map((prop) => (
                    <th key={prop.id} className="p-4 bg-slate-900 border-b border-slate-800 relative min-w-[240px]">
                      <button
                        onClick={() => removeFromCompare(prop.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-slate-950 text-slate-400 hover:text-rose-400"
                        title="Remover"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <img
                        src={prop.coverImage}
                        alt={prop.title}
                        className="w-full h-32 object-cover rounded-xl border border-slate-800 mb-3"
                      />
                      <span className="text-[10px] font-bold text-amber-400 uppercase font-mono">
                        {prop.code}
                      </span>
                      <h4 className="text-sm font-bold text-white line-clamp-2 mt-0.5">
                        {prop.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                        {prop.neighborhood}, {prop.city}
                      </p>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                {/* Preço */}
                <tr className="bg-slate-950/60">
                  <td className="p-4 font-bold text-slate-400 uppercase text-[10px]">Preço Total</td>
                  {comparedProperties.map((prop) => (
                    <td key={prop.id} className="p-4 text-base font-black text-amber-400 font-mono">
                      {formatCurrencyBRL(prop.price)}
                    </td>
                  ))}
                </tr>

                {/* Preço por m² */}
                <tr>
                  <td className="p-4 font-bold text-slate-400 uppercase text-[10px]">Valor / m²</td>
                  {comparedProperties.map((prop) => {
                    const price = parseFloat(prop.price) || 0;
                    const area = prop.totalArea || prop.builtArea || 1;
                    const priceM2 = Math.round(price / area);
                    return (
                      <td key={prop.id} className="p-4 font-mono font-bold text-slate-300">
                        {formatCurrencyBRL(priceM2)} /m²
                      </td>
                    );
                  })}
                </tr>

                {/* Modalidade e Categoria */}
                <tr className="bg-slate-950/60">
                  <td className="p-4 font-bold text-slate-400 uppercase text-[10px]">Tipo & Categoria</td>
                  {comparedProperties.map((prop) => (
                    <td key={prop.id} className="p-4 font-semibold text-slate-200 uppercase text-[11px]">
                      {prop.type} • {prop.category}
                    </td>
                  ))}
                </tr>

                {/* Área Total */}
                <tr>
                  <td className="p-4 font-bold text-slate-400 uppercase text-[10px]">Área Total</td>
                  {comparedProperties.map((prop) => (
                    <td key={prop.id} className="p-4 font-medium">
                      {prop.totalArea} m²
                    </td>
                  ))}
                </tr>

                {/* Dormitórios e Suítes */}
                <tr className="bg-slate-950/60">
                  <td className="p-4 font-bold text-slate-400 uppercase text-[10px]">Quartos / Suítes</td>
                  {comparedProperties.map((prop) => (
                    <td key={prop.id} className="p-4 font-medium">
                      {prop.bedrooms} quartos ({prop.suites} suítes)
                    </td>
                  ))}
                </tr>

                {/* Banheiros */}
                <tr>
                  <td className="p-4 font-bold text-slate-400 uppercase text-[10px]">Banheiros Total</td>
                  {comparedProperties.map((prop) => (
                    <td key={prop.id} className="p-4 font-medium">
                      {prop.bathrooms} banheiros
                    </td>
                  ))}
                </tr>

                {/* Vagas */}
                <tr className="bg-slate-950/60">
                  <td className="p-4 font-bold text-slate-400 uppercase text-[10px]">Vagas Garagem</td>
                  {comparedProperties.map((prop) => (
                    <td key={prop.id} className="p-4 font-medium">
                      {prop.parkingSpaces} vagas
                    </td>
                  ))}
                </tr>

                {/* Condomínio e IPTU */}
                <tr>
                  <td className="p-4 font-bold text-slate-400 uppercase text-[10px]">Condomínio / IPTU</td>
                  {comparedProperties.map((prop) => (
                    <td key={prop.id} className="p-4 font-mono text-[11px] text-slate-300">
                      Cond: {formatCurrencyBRL(prop.condoFee)}<br />
                      IPTU: {formatCurrencyBRL(prop.iptu)}
                    </td>
                  ))}
                </tr>

                {/* WhatsApp Direct status */}
                <tr className="bg-slate-950/60">
                  <td className="p-4 font-bold text-slate-400 uppercase text-[10px]">WhatsApp Corretor</td>
                  {comparedProperties.map((prop) => (
                    <td key={prop.id} className="p-4">
                      {prop.whatsappDirectEnabled ? (
                        <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px] flex items-center gap-1 w-fit">
                          <Zap className="w-3 h-3 fill-emerald-400" /> Direto ao Corretor
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded bg-slate-800 text-slate-400 text-[10px]">
                          Central Agência
                        </span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Actions */}
                <tr>
                  <td className="p-4"></td>
                  {comparedProperties.map((prop) => (
                    <td key={prop.id} className="p-4">
                      <Link
                        href={`/imoveis/${prop.slug}`}
                        className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all"
                      >
                        <span>Ver Ficha Completa</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
