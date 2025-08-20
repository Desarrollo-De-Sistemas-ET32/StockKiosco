// components/ui/subirImagen.tsx
'use client'
import React, { useState, ChangeEvent } from 'react';
import { supabase } from '@/supabase/supabase.js'; // ajustá ruta si no usás alias @/

type Props = {
  onUploadComplete: (publicUrl: string) => void;
  bucketName?: string;
  folder?: string;
  maxSizeBytes?: number;
};

export default function SubirImagen({
  onUploadComplete,
  bucketName = 'productos',
  folder = 'uploads',
  maxSizeBytes = 10 * 1024 * 1024,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    setMsg(null);
    const f = e.target.files?.[0] ?? null;
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      setMsg('Solo se permiten imágenes');
      return;
    }
    if (f.size > maxSizeBytes) {
      setMsg(`Archivo muy grande. Máx ${Math.round(maxSizeBytes / 1024 / 1024)} MB`);
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f)); // solo en cliente, está bien
  };

  const handleUpload = async () => {
    if (!file) { setMsg('Seleccioná una imagen'); return; }
    setLoading(true);
    setMsg(null);
    try {
      const ext = file.name.split('.').pop() ?? 'png';
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2,8)}.${ext}`;
      const path = `${folder}/${fileName}`;

      console.log('Subiendo al bucket', bucketName, 'ruta', path);

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(path, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage.from(bucketName).getPublicUrl(path);
      const publicUrl = publicData?.publicUrl ?? null;

      if (!publicUrl) throw new Error('No se obtuvo URL pública (bucket privado?)');

      setMsg('Subida OK');
      onUploadComplete(publicUrl);
    } catch (err: any) {
      console.error('Upload error', err);
      setMsg('Error: ' + (err.message ?? String(err)));
      alert('Error al subir imagen: ' + (err.message ?? String(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2 w-full">
      <input type="file" accept="image/*" onChange={handleFile} className="mb-2" />
      {preview && (
        <div className="mb-2">
          <img src={preview} alt="preview" className="w-40 h-40 object-contain rounded" />
        </div>
      )}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleUpload}
          disabled={loading || !file}
          className="px-3 py-1 bg-blue-600 text-white rounded disabled:opacity-60"
        >
          {loading ? 'Subiendo...' : 'Subir imagen'}
        </button>
        <button
          type="button"
          onClick={() => { setFile(null); setPreview(null); setMsg(null); }}
          disabled={loading}
          className="px-3 py-1 border rounded"
        >
          Limpiar
        </button>
      </div>
      {msg && <div className="mt-2 text-sm">{msg}</div>}
    </div>
  );
}
