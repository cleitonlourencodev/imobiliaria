'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Navigation, Building2, Bed, Bath, Maximize,
  ArrowRight, Sparkles, CheckCircle2, Eye, Zap, Filter,
  Search, Compass, MapPin, X, LocateFixed, Globe
} from 'lucide-react';
import { formatCurrencyBRL } from '@/lib/whatsapp';

export interface MapPropertyItem {
  id: string;
  code: string;
  title: string;
  slug: string;
  price: string;
  neighborhood: string;
  city: string;
  state: string;
  category: string;
  type: string;
  coverImage: string;
  totalArea: number;
  bedrooms: number;
  bathrooms: number;
  whatsappDirectEnabled: boolean;
  latitude?: number | null;
  longitude?: number | null;
  locationLink?: string;
}

interface InteractiveModernMapProps {
  properties?: MapPropertyItem[];
  filterCategory?: string;
  filterType?: string;
}

export default function InteractiveModernMap({ properties: propsFromParent, filterCategory, filterType }: InteractiveModernMapProps) {
  const [mapFilter, setMapFilter] = useState<'venda' | 'aluguel' | 'terreno' | 'todos'>('todos');
  const [mapCategory, setMapCategory] = useState<string>('todos');
  const [selectedProp, setSelectedProp] = useState<MapPropertyItem | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchCity, setSearchCity] = useState('São Paulo');

  const [properties, setProperties] = useState<MapPropertyItem[]>([]);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const leafletLoadedRef = useRef(false);
  const leafletModuleRef = useRef<any>(null);

  useEffect(() => {
    if (propsFromParent && propsFromParent.length > 0) {
      setProperties(propsFromParent);
      return;
    }
    async function fetchProps() {
      try {
        const res = await fetch('/api/properties');
        const data = await res.json();
        if (data.success && data.data) {
          setProperties(data.data);
        }
      } catch (e) {
        console.error('Map props fetch error:', e);
      }
    }
    fetchProps();
  }, [propsFromParent]);

  const detectUserLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setSearchCity('Sua Localização');
        },
        () => {
          alert('Não foi possível obter sua localização. Verifique as permissões do navegador.');
        },
        { timeout: 8000, maximumAge: 60000 }
      );
    }
  };

  const filteredProperties = properties.filter(p => {
    const matchType = filterType ? (p.type === filterType || p.type === 'ambos') : true;
    const matchCategory = filterCategory ? p.category === filterCategory : true;
    const matchMapFilter = mapFilter === 'todos' ? true : (mapFilter === 'terreno' ? p.category === 'terreno' : (p.type === mapFilter || p.type === 'ambos'));
    const matchMapCat = mapCategory === 'todos' ? true : p.category === mapCategory;
    return matchType && matchCategory && matchMapFilter && matchMapCat;
  });

  const availableCities = Array.from(new Set(properties.map(p => p.city))).sort();

  const getValidCoords = () => {
    const valid = filteredProperties.filter(p => p.latitude != null && p.longitude != null && !isNaN(Number(p.latitude)) && !isNaN(Number(p.longitude)));
    if (valid.length > 0) return valid;
    return filteredProperties;
  };

  const initMap = () => {
    if (typeof window === 'undefined' || !mapRef.current || leafletLoadedRef.current) return;

    import('leaflet').then((L) => {
      import('leaflet/dist/leaflet.css');

      leafletModuleRef.current = L.default;

      const defaultIcon = (L.default as any).icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });

      (L.default as any).Marker.prototype.options.icon = defaultIcon;

      const validCoords = getValidCoords();
      const center: [number, number] = validCoords.length > 0
        ? [Number(validCoords[0].latitude), Number(validCoords[0].longitude)]
        : (userLocation ? [userLocation.lat, userLocation.lng] : [-23.5505, -46.6333]);

      const map = (L.default).map(mapRef.current!).setView(center, 13);

      (L.default).tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 20,
      }).addTo(map);

      markersRef.current = validCoords.map((prop) => {
        const marker = (L.default).marker([Number(prop.latitude), Number(prop.longitude)] as [number, number])
          .addTo(map)
          .on('click', () => setSelectedProp(prop));
        return marker;
      });

      if (validCoords.length > 1) {
        const group = new (L.default as any).featureGroup(markersRef.current);
        map.fitBounds(group.getBounds().pad(0.15));
      }

      mapInstanceRef.current = map;
      leafletLoadedRef.current = true;
    });
  };

  useEffect(() => {
    initMap();
  }, [filteredProperties, userLocation]);

  useEffect(() => {
    if (!mapInstanceRef.current || !leafletModuleRef.current) return;
    const validCoords = getValidCoords();
    markersRef.current.forEach(m => mapInstanceRef.current.removeLayer(m));
    markersRef.current = validCoords.map((prop) => {
      const marker = leafletModuleRef.current.marker([Number(prop.latitude), Number(prop.longitude)] as [number, number])
        .addTo(mapInstanceRef.current)
        .on('click', () => setSelectedProp(prop));
      return marker;
    });
    if (validCoords.length > 1) {
      const group = new leafletModuleRef.current.featureGroup(markersRef.current);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.15));
    } else if (validCoords.length === 1) {
      mapInstanceRef.current.setView([Number(validCoords[0].latitude), Number(validCoords[0].longitude)] as [number, number], 14);
    }
  }, [filteredProperties]);

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-8">
      <div className="mb-6 space-y-3">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest">
          <MapPin className="w-4 h-4" />
          <span>Mapa Interativo com OpenStreetMap</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Encontre Seu Imóvel no Mapa
        </h2>
        <p className="text-sm text-slate-400 max-w-lg">
          Mapa integrado com coordenadas reais. Use os filtros para explorar casas, terrenos, aluguéis e coberturas. Selecione uma cidade ou permita que o mapa use sua localização atual.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-4 flex flex-wrap items-center gap-3 mb-6 shadow-xl">
        <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 font-semibold shrink-0">
          <Filter className="w-4 h-4 text-amber-400" />
          <span>Filtros:</span>
        </div>

        <button
          onClick={() => setMapFilter('todos')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${mapFilter === 'todos' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-950 text-slate-300 border border-slate-800 hover:text-white'}`}
        >Todos</button>
        <button
          onClick={() => setMapFilter('venda')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${mapFilter === 'venda' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-950 text-slate-300 border border-slate-800 hover:text-white'}`}
        >Vendas</button>
        <button
          onClick={() => setMapFilter('aluguel')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${mapFilter === 'aluguel' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-950 text-slate-300 border border-slate-800 hover:text-white'}`}
        >Aluguéis</button>
        <button
          onClick={() => setMapFilter('terreno')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${mapFilter === 'terreno' ? 'bg-amber-500 text-slate-950 shadow-md' : 'bg-slate-950 text-slate-300 border border-slate-800 hover:text-white'}`}
        >Terrenos & Lotes</button>

        <div className="flex items-center gap-2 ml-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <select
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              className="pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 text-white rounded-xl text-xs font-medium focus:outline-none focus:border-amber-500"
            >
              <option value="São Paulo">São Paulo (Padrão)</option>
              {availableCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <button
            onClick={detectUserLocation}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/20"
            title="Centralizar no seu local"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Minha Localização</span>
          </button>
        </div>

        <div className="w-full flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
          <span className="text-[10px] text-slate-500 font-semibold">Categoria:</span>
          <button
            onClick={() => setMapCategory('todos')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${mapCategory === 'todos' ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-slate-300 border border-slate-800'}`}
          >Todos</button>
          <button
            onClick={() => setMapCategory('casa')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${mapCategory === 'casa' ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-slate-300 border border-slate-800'}`}
          >Casas</button>
          <button
            onClick={() => setMapCategory('apartamento')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${mapCategory === 'apartamento' ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-slate-300 border border-slate-800'}`}
          >Apartamentos</button>
          <button
            onClick={() => setMapCategory('terreno')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${mapCategory === 'terreno' ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-slate-300 border border-slate-800'}`}
          >Terrenos</button>
          <button
            onClick={() => setMapCategory('cobertura')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${mapCategory === 'cobertura' ? 'bg-amber-500 text-slate-950' : 'bg-slate-950 text-slate-300 border border-slate-800'}`}
          >Coberturas</button>
          <span className="ml-auto text-[11px] text-slate-500 font-mono">{filteredProperties.length} imóvel(is)</span>
        </div>
      </div>

      <div className="relative w-full h-[580px] md:h-[720px] rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
        <div ref={mapRef} className="absolute inset-0 w-full h-full z-0" />

        <div className="absolute top-4 left-4 z-20 pointer-events-none">
          <div className="bg-slate-950/90 border border-amber-500/30 px-4 py-2.5 rounded-2xl backdrop-blur-md shadow-xl pointer-events-auto">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider">
              <Navigation className="w-4 h-4 animate-pulse" />
              <span>OpenStreetMap Integrado</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Clique nos pinos para ver detalhes dos imóveis</p>
          </div>
        </div>

        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          <div className="flex flex-col gap-1.5 bg-slate-950/90 border border-slate-800 p-1.5 rounded-xl backdrop-blur-md shadow-lg">
            <button
              onClick={() => { if (mapInstanceRef.current) mapInstanceRef.current.zoomIn(); }}
              className="w-9 h-9 bg-slate-900 hover:bg-amber-500/20 border border-slate-800 text-white rounded-lg flex items-center justify-center transition-all"
              title="Aproximar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <button
              onClick={() => { if (mapInstanceRef.current) mapInstanceRef.current.zoomOut(); }}
              className="w-9 h-9 bg-slate-900 hover:bg-amber-500/20 border border-slate-800 text-white rounded-lg flex items-center justify-center transition-all"
              title="Afastar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
          </div>
          <button
            onClick={detectUserLocation}
            className="w-9 h-9 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center justify-center shadow-lg shadow-emerald-600/20 transition-all"
            title="Minha Localização"
          >
            <LocateFixed className="w-4 h-4" />
          </button>
        </div>

        {selectedProp && (
          <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-[440px] bg-slate-950/98 border border-amber-500/40 rounded-3xl p-5 shadow-2xl backdrop-blur-xl z-[200] animate-in slide-in-from-bottom-3 duration-300">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-base font-black text-white truncate">{selectedProp.title}</h3>
              <button onClick={() => setSelectedProp(null)} className="p-1.5 text-slate-400 hover:text-white bg-slate-900 rounded-lg border border-slate-800 transition-all shrink-0 ml-2">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex gap-4">
              <img
                src={selectedProp.coverImage}
                alt={selectedProp.title}
                className="w-28 h-28 rounded-2xl object-cover border border-slate-800 shrink-0"
              />
              <div className="flex-1 min-w-0 space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[9px] font-black uppercase tracking-wider shadow-md">
                    {selectedProp.type === 'venda' ? 'Venda' : selectedProp.type === 'aluguel' ? 'Aluguel' : 'Ambos'}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-900 text-slate-400 text-[9px] font-bold uppercase border border-slate-800">
                    {selectedProp.category}
                  </span>
                  <span className="text-[10px] font-mono text-amber-400 font-bold">{selectedProp.code}</span>
                </div>

                <h4 className="text-xl font-black text-amber-400 font-mono">{formatCurrencyBRL(selectedProp.price)}</h4>

                <p className="text-[11px] text-slate-300 leading-relaxed">{selectedProp.neighborhood}, {selectedProp.city} — {selectedProp.state}</p>

                <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium flex-wrap">
                  <span className="flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800"><Maximize className="w-3 h-3 text-amber-400" /> {selectedProp.totalArea || 0} m²</span>
                  <span className="flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800"><Bed className="w-3 h-3 text-amber-400" /> {selectedProp.bedrooms || 0}</span>
                  <span className="flex items-center gap-1 bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800"><Bath className="w-3 h-3 text-amber-400" /> {selectedProp.bathrooms || 0}</span>
                </div>

                {(selectedProp.latitude && selectedProp.longitude) || selectedProp.locationLink ? (
                  <div className="pt-2">
                    <a
                      href={selectedProp.locationLink || `https://www.google.com/maps/search/?api=1&query=${selectedProp.latitude},${selectedProp.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold hover:text-emerald-300 hover:underline"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Abrir localização no Google Maps</span>
                    </a>
                  </div>
                ) : null}
              </div>
            </div>

            <Link
              href={`/imoveis/${selectedProp.slug}`}
              className="mt-4 w-full py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20"
            >
              <Eye className="w-4 h-4" />
              <span>Ver Detalhes Completos do Imóvel</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
