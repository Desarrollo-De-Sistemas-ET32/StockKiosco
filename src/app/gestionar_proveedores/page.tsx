"use client";

import { useState } from "react";
import proveedores from "@/app/data/proveedores.json";
import CardProveedor from "@/components/card";

export default function ListaProveedores() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const proveedoresFiltrados = proveedores.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center gap-4 w-fit mx-auto my-5 font-sans">
      {/* Barra de búsqueda + botón */}
      <h1 className="font-semibold"> Lista Proveedores</h1>
      <div className="flex items-center w-[700px] mx-auto gap-4">
        <input
          type="text"
          placeholder="Buscar proveedor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[450px] px-3 py-2 border border-gray-300 rounded-lg text-sm transition 
                     focus:border-blue-500 focus:outline-none focus:shadow-md focus:shadow-blue-300"
        />
        <button
          onClick={() => setIsOpen(true)}
          className="w-[250px] py-3 bg-green-600 text-white rounded-lg font-semibold text-base
                     shadow-md hover:bg-green-700 transition-transform active:scale-95 cursor-pointer"
        >
          Agregar
        </button>
      </div>

      {/* Lista de proveedores */}
      <div
        className="h-[80vh] w-[700px] bg-gray-100 overflow-y-auto overflow-x-hidden p-4 rounded-xl
                   flex flex-col gap-3"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#888 #f1f1f1",
        }}
      >
        {proveedoresFiltrados.map((p) => (
          <CardProveedor
            key={p.id}
            nombre={p.nombre}
            telefono={p.telefono}
            cuil={p.cuil}
          />
        ))}
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white p-7 rounded-2xl w-[400px] shadow-xl font-sans animate-slideUp">
            <h2 className="mb-5 text-center text-xl font-extrabold text-gray-800 tracking-wide">
              Agregar Proveedor
            </h2>
            <form className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label className="mb-1 text-gray-600 text-xs font-medium">Nombre</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                             transition focus:border-blue-500 focus:outline-none focus:shadow-md focus:shadow-blue-300"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-gray-600 text-xs font-medium">Teléfono</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                             transition focus:border-blue-500 focus:outline-none focus:shadow-md focus:shadow-blue-300"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-gray-600 text-xs font-medium">CUIL</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                             transition focus:border-blue-500 focus:outline-none focus:shadow-md focus:shadow-blue-300"
                />
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm
                             hover:bg-blue-700 active:translate-y-[-1px] transition"
                >
                  Guardar
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg font-semibold text-sm
                             hover:bg-gray-400 active:translate-y-[-1px] transition"
                >
                  Cerrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
