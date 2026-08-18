'use client';

import React, { useCallback } from 'react';
import { UploadCloud, ImageIcon, X } from 'lucide-react';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  coverImage?: string | null;
  onCoverChange?: (url: string) => void;
}

export default function ImageUploader({ images, onChange, maxImages = 8, coverImage, onCoverChange }: ImageUploaderProps) {
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const newImages: string[] = [];
    let filesProcessed = 0;
    
    Array.from(files).forEach((file) => {
      if (filesProcessed >= maxImages) return;
      if (!file.type.startsWith('image/')) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          newImages.push(result);
          filesProcessed++;
          
          if (newImages.length === filesProcessed) {
            onChange([...images, ...newImages].slice(0, maxImages));
          }
        }
      };
      reader.readAsDataURL(file);
    });
  }, [images, onChange, maxImages]);

  const removeImage = useCallback((index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
    if (coverImage === images[index] && onCoverChange) {
      onCoverChange(updated[0] || '');
    }
  }, [images, onChange, coverImage, onCoverChange]);

  const setAsCover = useCallback((url: string) => {
    if (onCoverChange) onCoverChange(url);
  }, [onCoverChange]);

  return (
    <div className="space-y-3">
      <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
        <UploadCloud className="w-4 h-4 text-amber-400" />
        Galeria de Imagens do Imóvel (até {maxImages})
      </label>
      
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        id="property-images-upload"
      />
      
      <label
        htmlFor="property-images-upload"
        className="inline-flex items-center gap-2 px-4 py-3 bg-slate-900 border-2 border-dashed border-slate-700 hover:border-amber-500 text-slate-300 hover:text-amber-400 text-xs font-bold rounded-2xl cursor-pointer transition-all"
      >
        <ImageIcon className="w-4 h-4" />
        <span>Selecionar Fotos do Computador</span>
      </label>

      {coverImage && (
        <div className="p-3 bg-slate-950 border border-amber-500/30 rounded-2xl text-xs text-slate-300 space-y-1">
          <span className="text-amber-400 font-bold">Imagem de Capa Atual:</span>
          <div className="text-[11px] font-mono text-slate-500 truncate">{coverImage.substring(0, 80)}...</div>
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {images.map((img, idx) => (
            <div key={idx} className="relative group">
              <img
                src={img}
                alt={`Foto ${idx + 1}`}
                className="w-full h-20 rounded-xl object-cover border-2 border-slate-800"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-1.5">
                <button
                  type="button"
                  onClick={() => setAsCover(img)}
                  className="text-[9px] font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded-md"
                >
                  Capa
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="p-0.5 rounded bg-rose-500 text-white hover:bg-rose-400"
                  title="Remover"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              {coverImage === img && (
                <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-amber-500 text-slate-950 text-[8px] font-black rounded-md">
                  CAPA
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
