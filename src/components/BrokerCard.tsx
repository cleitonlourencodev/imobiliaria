'use client';

import React, { useState } from 'react';
import { Trash2, Smartphone } from 'lucide-react';

interface BrokerCardProps {
  broker: any;
  properties: any[];
  onEdit: (broker: any) => void;
  onDelete: (brokerId: string) => void;
}

export default function BrokerCard({ broker, properties, onEdit, onDelete }: BrokerCardProps) {
  const managedProps = properties.filter(p => p.brokerId === broker.id);
  const [showManaged, setShowManaged] = useState(false);

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4 flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3">
            <img src={broker.photoUrl} alt={broker.name} className="w-14 h-14 rounded-2xl object-cover border border-amber-500 shrink-0" />
            <div>
              <h3 className="font-bold text-white text-sm">{broker.name}</h3>
              <span className="text-xs font-mono text-amber-400 font-bold">{broker.creci}</span>
              <div className="text-[11px] text-slate-400 mt-0.5">{broker.email}</div>
            </div>
          </div>
          <button
            onClick={() => onDelete(broker.id)}
            className="p-1.5 text-slate-500 hover:text-rose-400"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-1">
          <div className="text-slate-400 text-[10px]">WhatsApp Cadastrado para Recebimento de Leads:</div>
          <div className="font-mono font-bold text-emerald-400 flex items-center gap-1">
            <Smartphone className="w-3.5 h-3.5" /> {broker.whatsapp}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-amber-400 font-bold">{managedProps.length} imóveis geridos</span>
          <button
            onClick={() => setShowManaged(!showManaged)}
            className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 hover:text-amber-400 text-[10px] font-bold transition-all"
          >
            {showManaged ? '▼ Ocultar' : '▶ Ver Imóveis'}
          </button>
        </div>

        {showManaged && managedProps.length > 0 && (
          <div className="space-y-1.5 pt-1">
            {managedProps.map(prop => (
              <div key={prop.id} className="flex items-center justify-between px-2.5 py-1.5 bg-slate-950 rounded-lg border border-slate-800/50 text-[10px]">
                <span className="text-slate-300 font-medium truncate">{prop.title}</span>
                <span className="text-amber-400 font-mono shrink-0 ml-2">{prop.code}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => onEdit(broker)}
        className="w-full py-2 bg-slate-950 border border-slate-800 hover:border-amber-500 text-slate-300 hover:text-amber-400 text-xs font-bold rounded-xl"
      >
        Editar Dados do Corretor
      </button>
    </div>
  );
}
