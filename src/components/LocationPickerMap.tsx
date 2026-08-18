'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Search } from 'lucide-react';

interface LocationPickerMapProps {
  latitude?: string | number | null;
  longitude?: string | number | null;
  onLocationChange: (lat: string, lng: string) => void;
  onSearchAddress?: (address: string) => void;
}

export default function LocationPickerMap({
  latitude,
  longitude,
  onLocationChange,
  onSearchAddress
}: LocationPickerMapProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPos, setSelectedPos] = useState<{ lat: number; lng: number } | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const leafletLoadedRef = useRef(false);

  const lat = latitude ? Number(latitude) : -23.5505;
  const lng = longitude ? Number(longitude) : -46.6333;

  useEffect(() => {
    if (typeof window === 'undefined' || !mapRef.current || leafletLoadedRef.current) return;

    import('leaflet').then((L) => {
      import('leaflet/dist/leaflet.css');

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

      const map = (L.default).map(mapRef.current!).setView([lat, lng], 16);

      (L.default).tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 20,
      }).addTo(map);

      map.on('click', (e: any) => {
        const { lat: newLat, lng: newLng } = e.latlng;
        const roundedLat = Number(newLat.toFixed(6));
        const roundedLng = Number(newLng.toFixed(6));
        setSelectedPos({ lat: roundedLat, lng: roundedLng });
        if (markerRef.current) {
          markerRef.current.setLatLng([roundedLat, roundedLng]);
        } else {
          markerRef.current = (L.default).marker([roundedLat, roundedLng]).addTo(map);
        }
        onLocationChange(roundedLat.toString(), roundedLng.toString());
      });

      mapInstanceRef.current = map;

      if (lat && lng) {
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = (L.default).marker([lat, lng]).addTo(map);
        }
      }

      leafletLoadedRef.current = true;
      setMapReady(true);
    });
  }, [lat, lng, onLocationChange]);

  useEffect(() => {
    if (!mapInstanceRef.current || !selectedPos) return;
    mapInstanceRef.current.setView([selectedPos.lat, selectedPos.lng], 16);
    if (markerRef.current) {
      markerRef.current.setLatLng([selectedPos.lat, selectedPos.lng]);
    }
  }, [selectedPos]);

  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const handleMyLocation = () => {
    if (navigator.geolocation && mapInstanceRef.current) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLat = Number(latitude.toFixed(6));
          const newLng = Number(longitude.toFixed(6));
          setSelectedPos({ lat: newLat, lng: newLng });
          mapInstanceRef.current.setView([newLat, newLng], 16);
          if (markerRef.current) {
            markerRef.current.setLatLng([newLat, newLng]);
          } else {
            import('leaflet').then((L) => {
              markerRef.current = L.default.marker([newLat, newLng]).addTo(mapInstanceRef.current);
            });
          }
          onLocationChange(newLat.toString(), newLng.toString());
        },
        () => {
          alert('Não foi possível obter sua localização. Verifique as permissões do navegador.');
        },
        { timeout: 8000, maximumAge: 60000 }
      );
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim() && onSearchAddress) {
      onSearchAddress(searchQuery.trim());
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
        <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="text-[11px] font-mono text-slate-300">
          Latitude: <span className="text-amber-400 font-bold">{selectedPos ? selectedPos.lat : lat}</span> | Longitude: <span className="text-amber-400 font-bold">{selectedPos ? selectedPos.lng : lng}</span>
        </span>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            id="map-search"
            name="mapSearch"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Buscar endereço ou local no mapa..."
            className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:border-amber-500 focus:outline-none pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>
        <button
          type="button"
          onClick={handleSearch}
          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-all"
        >
          Buscar
        </button>
      </div>

      <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
        <div ref={mapRef} className="w-full h-full" />
        {!mapReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
            <div className="text-center space-y-2">
              <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400">Carregando mapa...</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleZoomIn}
          className="px-4 py-2 bg-slate-900 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500/40 text-amber-400 text-xs font-bold rounded-xl transition-all"
        >
          Aproximar
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="px-4 py-2 bg-slate-900 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500/40 text-amber-400 text-xs font-bold rounded-xl transition-all"
        >
          Afastar
        </button>
        <button
          type="button"
          onClick={handleMyLocation}
          className="px-4 py-2 bg-slate-900 hover:bg-emerald-500/10 border border-slate-800 hover:border-emerald-500/40 text-emerald-400 text-xs font-bold rounded-xl transition-all"
        >
          <Navigation className="w-4 h-4 inline mr-1" />
          Usar Minha Localização
        </button>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${selectedPos?.lat || lat},${selectedPos?.lng || lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-slate-900 hover:bg-blue-500/10 border border-slate-800 hover:border-blue-500/40 text-blue-400 text-xs font-bold rounded-xl transition-all"
        >
          Abrir no Google Maps
        </a>
      </div>
    </div>
  );
}
