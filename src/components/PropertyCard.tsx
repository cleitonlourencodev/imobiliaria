'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Bed, 
  Bath, 
  Car, 
  Maximize, 
  MapPin, 
  Heart, 
  Scale, 
  MessageSquare, 
  Zap, 
  User, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { PropertyItem, useRealEstate } from '@/context/RealEstateContext';
import { formatCurrencyBRL } from '@/lib/whatsapp';

interface PropertyCardProps {
  property: PropertyItem;
  featuredMode?: boolean;
}

export default function PropertyCard({ property, featuredMode = false }: PropertyCardProps) {
  const { toggleFavorite, isFavorite, addToCompare, removeFromCompare, isInCompare } = useRealEstate();
  const favorited = isFavorite(property.id);
  const compared = isInCompare(property.id);

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'casa': return 'Casa';
      case 'terreno': return 'Terreno / Lote';
      case 'cobertura': return 'Cobertura';
      case 'apartamento': return 'Apartamento';
      case 'comercial': return 'Comercial';
      case 'chacara': return 'Sítio / Chácara';
      default: return cat;
    }
  };

  const getTypeBadge = (t: string) => {
    if (t === 'venda') return { label: 'Venda', bg: 'bg-amber-500 text-slate-950 font-black' };
    if (t === 'aluguel') return { label: 'Aluguel', bg: 'bg-emerald-500 text-slate-950 font-black' };
    return { label: 'Venda & Aluguel', bg: 'bg-sky-500 text-slate-950 font-black' };
  };

  const typeInfo = getTypeBadge(property.type);

  return (
    <div className={`group rounded-2xl bg-slate-900/90 border transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1.5 shadow-xl ${
      featuredMode ? 'border-amber-500/40 shadow-amber-500/10' : 'border-slate-800 hover:border-slate-700 shadow-black/40'
    }`}>
      {/* Cover Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
        <img
          src={property.coverImage || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80'}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className={`px-2.5 py-1 rounded-lg text-[10px] uppercase tracking-wider ${typeInfo.bg}`}>
            {typeInfo.label}
          </span>
          <span className="px-2.5 py-1 rounded-lg text-[10px] uppercase font-bold tracking-wider bg-slate-950/80 text-white border border-slate-700/80 backdrop-blur-md">
            {getCategoryLabel(property.category)}
          </span>
          {property.featured && (
            <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-amber-400 text-slate-950 flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-slate-950" /> Destaque
            </span>
          )}
        </div>

        {/* Action Controls (Favorite & Compare) */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(property.id);
            }}
            className={`p-2 rounded-xl backdrop-blur-md border transition-all ${
              favorited 
                ? 'bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-500/30' 
                : 'bg-slate-950/70 border-slate-700 text-slate-300 hover:text-rose-400 hover:bg-slate-900'
            }`}
            title={favorited ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-white' : ''}`} />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              compared ? removeFromCompare(property.id) : addToCompare(property);
            }}
            className={`p-2 rounded-xl backdrop-blur-md border transition-all ${
              compared 
                ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold' 
                : 'bg-slate-950/70 border-slate-700 text-slate-300 hover:text-amber-400 hover:bg-slate-900'
            }`}
            title={compared ? 'Remover da comparação' : 'Comparar imóvel'}
          >
            <Scale className="w-4 h-4" />
          </button>
        </div>

        {/* Atendimento VIP Indicator */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10">
          {property.whatsappDirectEnabled ? (
            <div className="px-2.5 py-1 rounded-lg bg-amber-500/90 text-slate-950 text-[10px] font-extrabold flex items-center gap-1.5 shadow-lg backdrop-blur-sm border border-amber-300/40">
              <Zap className="w-3 h-3 fill-slate-950 animate-pulse" />
              <span>Atendimento VIP Ativo</span>
            </div>
          ) : (
            <div className="px-2.5 py-1 rounded-lg bg-slate-900/90 text-slate-400 text-[10px] font-medium flex items-center gap-1.5 backdrop-blur-sm border border-slate-800">
              <span>Consultoria Prime</span>
            </div>
          )}

          <span className="text-[11px] font-mono text-slate-300 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
            {property.code}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Price Header */}
          <div className="flex items-baseline justify-between gap-2 mb-1.5">
            <span className="text-xl font-black text-amber-400 tracking-tight">
              {formatCurrencyBRL(property.price)}
              {property.type === 'aluguel' && <span className="text-xs text-slate-400 font-normal"> /mês</span>}
            </span>
            {property.condoFee && parseFloat(property.condoFee) > 0 && (
              <span className="text-[11px] text-slate-400 font-medium">
                Cond. {formatCurrencyBRL(property.condoFee)}
              </span>
            )}
          </div>

          {/* Title */}
          <Link href={`/imoveis/${property.slug}`}>
            <h3 className="text-base font-bold text-white line-clamp-1 hover:text-amber-400 transition-colors group-hover:underline">
              {property.title}
            </h3>
          </Link>

          {/* Location */}
          <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            {property.neighborhood}, {property.city} - {property.state}
          </p>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-800/80 text-slate-300 text-xs font-medium">
          <div className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-slate-950/50 border border-slate-800/60" title="Área Total / Útil">
            <Maximize className="w-3.5 h-3.5 text-amber-400 mb-1" />
            <span>{property.totalArea || property.builtArea} m²</span>
          </div>

          <div className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-slate-950/50 border border-slate-800/60" title="Dormitórios">
            <Bed className="w-3.5 h-3.5 text-amber-400 mb-1" />
            <span>{property.bedrooms > 0 ? `${property.bedrooms} dorm` : '-'}</span>
          </div>

          <div className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-slate-950/50 border border-slate-800/60" title="Banheiros / Suítes">
            <Bath className="w-3.5 h-3.5 text-amber-400 mb-1" />
            <span>{property.bathrooms > 0 ? `${property.bathrooms} ban` : '-'}</span>
          </div>

          <div className="flex flex-col items-center justify-center p-1.5 rounded-lg bg-slate-950/50 border border-slate-800/60" title="Vagas de Garagem">
            <Car className="w-3.5 h-3.5 text-amber-400 mb-1" />
            <span>{property.parkingSpaces > 0 ? `${property.parkingSpaces} veg` : '-'}</span>
          </div>
        </div>

        {/* Broker Info Footer & Action Link */}
        <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-800/60">
          {property.broker ? (
            <div className="flex items-center gap-2 min-w-0" title={`Corretor: ${property.broker.name}`}>
              <img
                src={property.broker.photoUrl}
                alt={property.broker.name}
                className="w-7 h-7 rounded-full object-cover border border-amber-500/50 shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-semibold text-slate-200 truncate">{property.broker.name}</span>
                <span className="text-[9px] text-amber-400/80 font-mono truncate">{property.broker.creci}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>Central Prime</span>
            </div>
          )}

          <Link
            href={`/imoveis/${property.slug}`}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-amber-500 text-slate-200 hover:text-slate-950 text-xs font-bold transition-all flex items-center gap-1.5 shrink-0"
          >
            <span>Detalhes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
