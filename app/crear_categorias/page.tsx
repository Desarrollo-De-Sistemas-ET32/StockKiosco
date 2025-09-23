'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { categoriaService } from '../Service/CategoryService';
import { CategoriaWithId } from '../Service/categoria';
import axios from 'axios';

export default function CrearCategoria() {
  const [nombre, setNombre] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [categorias, setCategorias] = useState<CategoriaWithId[]>([]);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false); // para la carga del listado

  // Obtener todas las categorías (desde BD)
  const fetchViewCategorias = async () => {
    setIsFetching(true);
    try {
      console.log('Intentando obtener categorías desde BD...');
      const categoriasData = await categoriaService.getAll();
      console.log('Categorías obtenidas:', categoriasData);
      setCategorias(Array.isArray(categoriasData) ? categoriasData : []);
    } catch (error: any) {
      console.error('Error obteniendo categorías:', error);
      if (axios.isAxiosError(error) && error.code === 'ERR_NETWORK') {
        console.warn('API no disponible para cargar categorías iniciales');
      }
      // No mostramos mensaje de error en UI automáticamente para la carga inicial
    } finally {
      setIsFetching(false);
    }
  };

  // Crear categoría
  const crearCategoria = async (nombreCategoria: string) => {
    setIsLoading(true);
    setMensaje('');

    try {
      console.log('Intentando crear categoría:', { nombre: nombreCategoria });

      const nuevaCategoriaResp = await categoriaService.create({
        nombre: nombreCategoria
      });

      console.log('Categoría creada exitosamente:', nuevaCategoriaResp);

      // Si creation fue OK, refrescar listado desde BD
      setMensaje('Categoría creada con éxito.');
      setNombre('');
      await fetchViewCategorias();
    } catch (error: unknown) {
      console.error('Error completo:', error);

      // Manejo Axios más preciso
      if (axios.isAxiosError(error)) {
        if (error.code === 'ERR_NETWORK') {
          setMensaje(
            'Error de conexión: No se puede conectar al servidor. Verifica que la API esté ejecutándose en http://localhost:3001'
          );
        } else if (error.response) {
          setMensaje(
            `Error del servidor: ${error.response.status} - ${error.response.data?.message || JSON.stringify(error.response.data)}`
          );
        } else if (error.request) {
          setMensaje('No hay respuesta del servidor. Verifica la conexión.');
        } else {
          setMensaje(`Error: ${error.message}`);
        }
      } else {
        setMensaje(`Error inesperado: ${String(error)}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchViewCategorias();
      setMounted(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) {
      setMensaje('Por favor, completá el campo nombre.');
      return;
    }
    crearCategoria(nombre.trim());
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 w-full max-w-md sm:max-w-lg">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Crear</h1>
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">categoría</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            // si tu componente Input no soporta label como prop, sacalo
            label="Nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ingresa el nombre de la categoría"
            disabled={isLoading}
          />

          <div className="flex justify-center">
            <Button
              type="submit"
              variant="green"
              size="default"
              className="w-full sm:w-auto mt-4"
              disabled={isLoading}
            >
              {isLoading ? 'Creando...' : 'Crear'}
            </Button>
          </div>

          {mensaje && (
            <p
              className={`text-sm text-center mt-2 px-3 py-2 rounded ${
                mensaje.toLowerCase().includes('error') || mensaje.toLowerCase().includes('no hay') || mensaje.toLowerCase().includes('conexión')
                  ? 'text-red-600 bg-red-50'
                  : 'text-green-600 bg-green-50'
              }`}
              role="alert"
              aria-live="polite"
            >
              {mensaje}
            </p>
          )}
        </form>
      </div>

      {/* Listado de categorías (traído desde BD) */}
      <div className="w-full max-w-md sm:max-w-lg mt-8 bg-gray-50 rounded-lg p-6 shadow">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Categorías {isFetching ? '(cargando...)' : `(${categorias.length})`}
        </h2>

        {isFetching ? (
          <div className="text-center text-sm text-gray-600">Cargando categorías...</div>
        ) : categorias.length > 0 ? (
          // Contenedor con altura limitada + scroll vertical
          <div className="max-h-48 overflow-y-auto rounded-md">
            <ul className="divide-y divide-gray-300">
              {categorias.map((categoria, i) => (
                <li key={categoria.id_categoria ?? i} className="py-2 px-2">
                  <div className="flex justify-between items-center">
                    <span>{categoria.nombre}</span>
                    {categoria.id_categoria && (
                      <span className="text-xs text-gray-500">ID: {categoria.id_categoria}</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center text-sm text-gray-600">No hay categorías registradas.</div>
        )}
      </div>
    </div>
  );
}
