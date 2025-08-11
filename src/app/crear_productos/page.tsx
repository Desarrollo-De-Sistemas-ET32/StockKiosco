"use client";

import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createDescuento } from "@/actions/addDescuento";

export default function EditarProductoPage() {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha_inicio, setFechaInicio] = useState("");
  const [fecha_fin, setFechaFin] = useState("");
  const [tipo, setTipo] = useState("");
  const [valor, setValor] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (
      !nombre.trim() ||
      !tipo.trim() ||
      !valor.trim() ||
      !fecha_inicio.trim() ||
      !fecha_fin.trim()
    ) {
      alert("Por favor, complete todos los campos obligatorios.");
      return;
    }

    const tipoFormatted =
      tipo.toUpperCase() === "PORCENTAJE" ? "PORCENTAJE" : "MONTOFIJO";
    const valorFormatted = Number(valor);
    const fechaInicioDate = new Date(fecha_inicio);
    const fechaFinDate = new Date(fecha_fin);

    try {
      const response = await createDescuento({
        id_descuento: 0,
        nombre,
        descripcion,
        tipo: tipoFormatted as "PORCENTAJE" | "MONTOFIJO",
        valor: valorFormatted,
        fecha_inicio: fechaInicioDate,
        fecha_fin: fechaFinDate,
      });

      if ("error" in response) {
        alert("Error: " + response.error);
      } else {
        alert("Descuento creado con éxito!");
      }
    } catch (error) {
      alert("Error inesperado al crear descuento");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-2xl p-8 w-full max-w-3xl flex flex-col">
        <h1 className="text-center text-4xl font-bold mb-8 text-black">
          CREAR DESCUENTO
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            size={1}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre del descuento"
            label="Nombre"
          />
          <Input
            size={1}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Acerca del descuento"
            label="Descripcion"
          />
          <Input
            size={1}
            type="number"
            min="0"
            max={tipo === "PORCENTAJE" ? 100 : undefined} // máximo 100 si porcentaje, sino sin máximo
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="Valor del descuento"
            label="Valor"
          />

          <Input
            size={1}
            type="date"
            value={fecha_inicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            label="Fecha de inicio"
          />
          <Input
            size={1}
            type="date"
            value={fecha_fin}
            onChange={(e) => setFechaFin(e.target.value)}
            label="Fecha de vencimiento"
          />

          <label className="text-black font-medium">Tipo</label>
          <select
            className="block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black-400 text-black"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
          >
            <option value="">Seleccione un tipo</option>
            <option value="PORCENTAJE">Porcentaje</option>
            <option value="MONTOFIJO">Monto Fijo</option>
          </select>

          <div className="flex gap-4 mt-6">
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-b from-gray-700 to-gray-500 text-white hover:from-gray-600 hover:to-gray-400"
            >
              Siguiente
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => history.back()}
            >
              Volver
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
