"use client";

import { useState } from "react";
import proveedores from "../data/proveedores.json";
import CardProveedor from "./card";

export default function ListaProveedores() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const proveedoresFiltrados = proveedores.filter((p) =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="contenedor-lista">
      {/* Barra de búsqueda + botón */}
      <div className="barra-superior">
        <input
          type="text"
          className="input-busqueda"
          placeholder="Buscar proveedor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn-primary btn-agregar" onClick={() => setIsOpen(true)}>
          Agregar
        </button>
      </div>

      {/* Lista de proveedores */}
      <div className="lista-proveedores">
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
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Agregar Proveedor</h2>
            <form>
              <div>
                <label>Nombre</label>
                <input type="text" />
              </div>
              <div>
                <label>Teléfono</label>
                <input type="text" />
              </div>
              <div>
                <label>CUIL</label>
                <input type="text" />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-primary">
                  Guardar
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsOpen(false)}
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
