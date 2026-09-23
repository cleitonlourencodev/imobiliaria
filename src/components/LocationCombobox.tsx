'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { ChevronDown, X } from 'lucide-react';

export interface LocationComboboxProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  icon?: ReactNode;
  className?: string;
  inputClassName?: string;
  showClear?: boolean;
  ariaLabel?: string;
}

export default function LocationCombobox({
  id,
  value,
  onChange,
  options,
  placeholder = 'Selecione...',
  icon,
  className,
  inputClassName,
  showClear = true,
  ariaLabel,
}: LocationComboboxProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const hasOptions = options.length > 0;

  useEffect(() => {
    function onOutside(e: MouseEvent | TouchEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onOutside);
    document.addEventListener('touchstart', onOutside);
    return () => {
      document.removeEventListener('mousedown', onOutside);
      document.removeEventListener('touchstart', onOutside);
    };
  }, []);

  const filtered = hasOptions
    ? Array.from(new Set(options)).filter((o) =>
        o.toLowerCase().includes(value.toLowerCase())
      )
    : [];

  const wrapperCls = `relative flex items-center gap-1 ${
    className ??
    'bg-slate-900 border border-slate-800 rounded-xl focus-within:border-amber-500 px-3.5 py-2.5'
  }`;

  return (
    <div ref={wrapperRef} className={wrapperCls}>
      {icon && <span className="shrink-0">{icon}</span>}
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          if (hasOptions && !open) setOpen(true);
        }}
        onFocus={() => hasOptions && setOpen(true)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className={
          inputClassName ??
          'flex-1 bg-transparent text-white text-xs focus:outline-none placeholder:text-slate-500'
        }
      />
      {showClear && value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="p-0.5 text-slate-500 hover:text-white shrink-0"
          aria-label="Limpar"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
      {hasOptions && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="p-0.5 text-slate-400 hover:text-white shrink-0"
          aria-label={open ? 'Fechar opções' : 'Mostrar opções'}
          aria-expanded={open}
        >
          <ChevronDown className="w-3.5 h-3.5 transition-transform" />
        </button>
      )}
      {open && hasOptions && (
        <div className="absolute z-40 mt-1 top-full left-0 right-0 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl max-h-56 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-xs text-slate-500">Sem resultados</div>
          ) : (
            filtered.map((opt) => (
              <div
                key={opt}
                className="px-3 py-2 cursor-pointer text-xs hover:bg-slate-800"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
              >
                <span
                  className={
                    value === opt ? 'text-amber-400 font-medium' : ''
                  }
                >
                  {opt || '(sem nome)'}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
