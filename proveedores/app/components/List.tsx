"use client";

import { useState } from "react";
import proveedores from "../data/proveedores.json";
import CardProveedor from "./card";

export default function ListaProveedores() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="contenedor-lista">
      {/* Lista de proveedores */}
      <div className="lista-proveedores">
        {proveedores.map((p) => (
          <CardProveedor
            key={p.id}
            nombre={p.nombre}
            telefono={p.telefono}
            cuil={p.cuil}
          />
        ))}
      </div>

      {/* Botón al costado derecho */}
      <button className="btn-primary btn-agregar" onClick={() => setIsOpen(true)}>
        Agregar
      </button>

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
              <div style={{ textAlign: "right" }}>
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