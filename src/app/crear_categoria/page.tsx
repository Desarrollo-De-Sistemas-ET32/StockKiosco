"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createCategoria } from "@/services/categorias";

export default function CrearCategoria() {
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState(""); // mensaje general
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [categorias, setCategorias] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setFieldErrors({});

    if (!nombre.trim()) {
      setFieldErrors({ nombre: "Por favor, completá el campo nombre." });
      return;
    }

    setLoading(true);
    try {
      const result = await createCategoria({ nombre: nombre.trim() });

      if (result.error) {
        // Si la API devolvió errores por campo (p. ej. { nombre: "..." })
        if (Object.keys(result.error).length > 0) {
          setFieldErrors(result.error);
          // también mostrar mensaje general si existe
          if (result.error.general) setMensaje(result.error.general);
        } else {
          setMensaje("Error al crear la categoría.");
        }
      } else if (result.categoria) {
        // Suponemos que categoria.nombre existe
        setCategorias(prev => [...prev, result.categoria.nombre]);
        setMensaje("Categoría creada con éxito.");
        setNombre("");
      } else {
        setMensaje(result.message ?? "Categoría creada.");
      }
    } catch (error) {
      console.error("Error inesperado creando categoría:", error);
      setMensaje("Ocurrió un error inesperado. Revisá la consola.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 w-full max-w-md sm:max-w-lg">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">Crear</h1>
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">categoría</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombre" className="sr-only">Nombre</label>
            <Input
              id="nombre"
              placeholder="Nombre de la categoría"
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
            />
            {fieldErrors.nombre && (
              <p className="text-sm text-red-600 mt-1" role="alert" aria-live="polite">
                {fieldErrors.nombre}
              </p>
            )}
          </div>

          <div className="flex justify-center">
            <Button
              type="submit"
              variant="green"
              size="default"
              className="w-full sm:w-auto mt-4"
              disabled={loading}
            >
              {loading ? "Creando..." : "Crear"}
            </Button>
          </div>

          {mensaje && (
            <p className="text-sm text-blue-600 mt-2 text-center" role="status" aria-live="polite">
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
