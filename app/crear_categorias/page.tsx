'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';   
import { Button } from '@/components/ui/button'; 
import { categoriaService } from "../Service/CategoryService"





export default function CrearCategoria() {
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [categorias, setCategorias] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState('');




const fetchCategorias = async () => {
      try {
        const nuevaCategoria = await categoriaService.create({
          nombre: "Cateríssa d"
        });

        console.log('Categorías:', nuevaCategoria.categoria.id_categoria);
        setState( (nuevaCategoria.categoria.id_categoria >0) ? true : false  );
      } catch (error) {
        console.error('Error obteniendo categorías:', error);
      }
    };


        const fetchViewCategorias = async () => {
      try {
        const categorias = await categoriaService.getAll();
        console.log('Categorías:', categorias);
      } catch (error) {
        console.error('Error obteniendo categorías:', error);
      }
    };

     

useEffect(() => {
    fetchViewCategorias();
    setMounted(true);
  }, []);




  const handleSubmit = (e: React.FormEvent) => {
    fetchCategorias();
    e.preventDefault();
    if (!nombre.trim()) {
      setMensaje('Por favor, completá el campo nombre.');
      return;
    }
    setCategorias([...categorias, nombre.trim()]);
    setMensaje('Categoría creada con éxito.');
    setNombre('');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 w-full max-w-md sm:max-w-lg">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Crear</h1>
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">categoría</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre"
            type="text"
            value={state}
            onChange={e => setNombre(e.target.value)}
          />

          <div className="flex justify-center">
            <Button
              type="submit"
              variant="green"
              size="default"
              className="w-full sm:w-auto mt-4"
            >
              Crear
            </Button>
          </div>

          {mensaje && (
            <p
              className="text-sm text-center text-blue-600 mt-2"
              role="alert"
              aria-live="polite"
            >
              {mensaje}
            </p>
          )}
        </form>
      </div>

      {mounted && categorias.length > 0 && (
        <div className="w-full max-w-md sm:max-w-lg mt-8 bg-gray-50 rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-4 text-center">Categorías creadas</h2>
          <ul className="divide-y divide-gray-300">
            {categorias.map((cat, i) => (
              <li key={i} className="py-2">
                {cat}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
