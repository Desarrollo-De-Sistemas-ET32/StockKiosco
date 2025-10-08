"use client";

import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NavBar } from "@/components/navBar";

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
    <body>
    <div className="min-h-screen bg-gray-50 dark:bg-[#2F363C] flex flex-col items-center justify-center p-4">
      <div className="w-full flex items-center justify-center gap-10 py-3">
        <NavBar />
      </div>
      <div className="bg-white dark:bg-var2 rounded-2xl p-8 w-full max-w-3xl flex flex-col drop-shadow-2xl/10">
        <h1 className="text-center text-4xl font-bold mb-8 text-black dark:text-white">
          CREAR DESCUENTO
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            size={1}
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre del descuento"
            label="Nombre"
            className="dark:bg-var3 "
            />
          <Input
            size={1}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Acerca del descuento"
            label="Descripcion"
            className="dark:bg-var3"
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
            className="dark:bg-var3"
          />

          <Input
            size={1}
            type="date"
            value={fecha_inicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            label="Fecha de inicio"
            className="dark:bg-var3"
            />
          <Input
            size={1}
            type="date"
            value={fecha_fin}
            onChange={(e) => setFechaFin(e.target.value)}
            label="Fecha de vencimiento"
            className="dark:bg-var3"
            />

          <label className="text-black font-medium dark:text-white">Tipo</label>
          <select
            className="block w-full rounded-md border border-gray-300 bg-var
             px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black-400 text-black dark:text-white"
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
              className="flex-1 dark:bg-var3 hover:bg-var3 hover:text-white dark:hover:bg-var1 dark:text-white bg-var6"
              >
              Siguiente
            </Button>
            <Button
              variant="outline"
              className="flex-1 dark:bg-var3 hover:bg-var3 hover:text-white dark:hover:bg-var1 dark:text-white bg-var6"
              onClick={() => history.back()}
            >
              Volver
            </Button>
          </div>
        </form>
      </div>
    </div>
    </body>
  )
}
