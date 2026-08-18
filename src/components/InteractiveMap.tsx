'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { MapPin, Navigation, Building2, Bed, Bath, Maximize, ExternalLink, X } from 'lucide-react';
import { PropertyItem } from '@/context/RealEstateContext';
import { formatCurrencyBRL } from '@/lib/whatsapp';

interface InteractiveMapProps {
  properties: PropertyItem[];
}

export default function InteractiveMap({ properties }: InteractiveMapProps) {
  const [selectedProp, setSelectedProp] = useState<PropertyItem | null>(properties[0] || null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const leafletLoadedRef = useRef(false);
  const leafletModuleRef = useRef<any>(null);

  const getValidCoords = () => {
    return properties.filter(p => {
      const lat = (p as any).latitude;
      const lng = (p as any).longitude;
      return lat != null && lng != null && !isNaN(Number(lat)) && !isNaN(Number(lng));
    });
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
        ? [Number((validCoords[0] as any).latitude), Number((validCoords[0] as any).longitude)]
        : [-23.5505, -46.6333];

      const map = (L.default).map(mapRef.current!).setView(center, 13);

      (L.default).tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 20,
      }).addTo(map);

      markersRef.current = validCoords.map((prop) => {
        const marker = (L.default as any).marker([Number((prop as any).latitude), Number((prop as any).longitude)] as [number, number])
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
  }, [properties]);

  useEffect(() => {
    if (!mapInstanceRef.current || !leafletModuleRef.current) return;
    const validCoords = getValidCoords();
    markersRef.current.forEach(m => mapInstanceRef.current.removeLayer(m));
    markersRef.current = validCoords.map((prop) => {
      const marker = leafletModuleRef.current.marker([Number((prop as any).latitude), Number((prop as any).longitude)] as [number, number])
        .addTo(mapInstanceRef.current)
        .on('click', () => setSelectedProp(prop));
      return marker;
    });
    if (validCoords.length > 1) {
      const group = new leafletModuleRef.current.featureGroup(markersRef.current);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.15));
    } else if (validCoords.length === 1) {
      mapInstanceRef.current.setView([Number((validCoords[0] as any).latitude), Number((validCoords[0] as any).longitude)] as [number, number], 14);
    }
  }, [properties]);

  return (
    <div className="relative w-full h-[520px] rounded-3xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
      <div ref={mapRef} className="absolute inset-0 w-full h-full z-0" />

      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 pointer-events-none">
        <div className="bg-slate-950/90 border border-slate-800 px-4 py-2 rounded-2xl backdrop-blur-md flex items-center gap-2 pointer-events-auto">
          <Navigation className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="text-xs font-bold text-white">Mapa Interativo de Imóveis • Coordenadas Reais</span>
        </div>

        <div className="bg-slate-950/90 border border-slate-800 px-3 py-1.5 rounded-xl backdrop-blur-md text-[11px] text-slate-300 font-mono pointer-events-auto">
          {properties.length} imóveis mapeados
        </div>
      </div>

      {selectedProp && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 bg-slate-950/95 border border-amber-500/40 p-4 rounded-2xl shadow-2xl backdrop-blur-xl z-30 animate-in slide-in-from-bottom duration-300">
          <button
            onClick={() => setSelectedProp(null)}
            className="absolute top-2 right-2 p-1 text-slate-400 hover:text-white bg-slate-900 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex gap-3">
            <img
              src={selectedProp.coverImage}
              alt={selectedProp.title}
              className="w-24 h-24 rounded-xl object-cover border border-slate-800 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                {selectedProp.category} • {selectedProp.code}
              </span>
              <h4 className="text-xs font-bold text-white line-clamp-1 mt-0.5">
                {selectedProp.title}
              </h4>
              <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                {selectedProp.neighborhood}, {selectedProp.city}
              </p>

              <div className="text-sm font-black text-amber-400 mt-1">
                {formatCurrencyBRL(selectedProp.price)}
              </div>

              <div className="flex items-center gap-3 text-[10px] text-slate-300 mt-2 font-medium">
                <span className="flex items-center gap-1"><Maximize className="w-3 h-3 text-amber-400" /> {selectedProp.totalArea} m²</span>
                {selectedProp.bedrooms > 0 && <span className="flex items-center gap-1"><Bed className="w-3 h-3 text-amber-400" /> {selectedProp.bedrooms} qto</span>}
                {selectedProp.bathrooms > 0 && <span className="flex items-center gap-1"><Bath className="w-3 h-3 text-amber-400" /> {selectedProp.bathrooms} ban</span>}
              </div>
            </div>
          </div>

          <Link
            href={`/imoveis/${selectedProp.slug}`}
            className="mt-3 w-full py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all"
          >
            <span>Ver Detalhes do Imóvel</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
