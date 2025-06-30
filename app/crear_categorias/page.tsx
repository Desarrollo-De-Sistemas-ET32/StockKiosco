'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';  // <-- Ruta basada en el alias "@" apuntando a /components

export default function CrearCategoria() {
  const [nombre, setNombre] = useState<string>('');
  const [cuit, setCuit] = useState<string>('');
  const [razonSocial, setRazonSocial] = useState<string>('');
  const [mensaje, setMensaje] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !cuit || !razonSocial) {
      setMensaje('Por favor, completá todos los campos.');
      return;
    }
    console.log({ nombre, cuit, razonSocial });
    setMensaje('Categoría creada con éxito.');
    setNombre(''); setCuit(''); setRazonSocial('');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 w-full max-w-md sm:max-w-lg">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Crear</h1>
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">categoría</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre"
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />
          <Input
            label="CUIT"
            type="text"
            value={cuit}
            onChange={e => setCuit(e.target.value)}
          />
          <Input
            label="Razón social"
            type="text"
            value={razonSocial}
            onChange={e => setRazonSocial(e.target.value)}
          />
          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full sm:w-auto mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-md transition duration-200"
            >
              Crear
            </button>
          </div>
          {mensaje && (
            <p className="text-sm text-center text-blue-600 mt-2" role="alert" aria-live="polite">
              {mensaje}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
