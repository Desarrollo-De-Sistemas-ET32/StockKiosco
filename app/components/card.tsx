import { useState } from "react";

type Proveedor = {
  nombre: string;
  telefono: string;
  cuil: string;
};

export default function CardProveedor({ nombre, telefono, cuil }: Proveedor) {
  const [showMore, setShowMore] = useState(false);

  return (
    <div className={`card-proveedor ${showMore ? "expanded" : ""}`}>
      <div className="card-header">
        <div className="name-container">
          <h2>{nombre}</h2>
          <button 
            className="btn-mostrar" 
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? "Mostrar menos" : "Mostrar más"}
          </button>
        </div>
        <div className="card-actions">
          <button className="btn-editar">Editar</button>
          <button className="btn-borrar">Borrar</button>
        </div>
      </div>

      {showMore && (
        <div className="card-datos">
          <p><span className="data-label">Teléfono:</span> {telefono}</p>
          <p><span className="data-label">CUIL:</span> {cuil}</p>
        </div>
      )}
    </div>
  );
}