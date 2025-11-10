"use client";

import { DescuentoDB } from "@/app/Service/descuento/descuento";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2 } from "lucide-react";

// 1. Definimos las props:
// Recibe el objeto DescuentoDB completo, más las dos funciones
type CardDescuentoProps = DescuentoDB & {
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
};

export default function CardDescuento({
  // 2. Extraemos todas las props
  id_descuento,
  nombre,
  descripcion,
  tipo,
  valor,
  activo,
  fecha_fin,
  onEdit,
  onDelete,
}: CardDescuentoProps) {

  // 3. Lógica para formatear el valor
  const formatValor = () => {
    if (tipo === "PORCENTAJE") {
      return `${valor}%`;
    }
    // Formatea como moneda (ej: $ 1.250)
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(valor);
  };

  // 4. Lógica para formatear la fecha (opcional)
  const formatFecha = (isoString?: string | null) => {
    if (!isoString) return null;
    try {
      // Muestra la fecha en formato local (ej: 31/10/2025)
      return new Date(isoString).toLocaleDateString("es-AR");
    } catch {
      return null;
    }
  };

  const fechaFinFormateada = formatFecha(fecha_fin);

  return (
    <div className="flex items-center justify-between p-4 bg-light-30 dark:bg-dark-30 rounded-lg shadow-sm w-full">
      {/* Sección de Información */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg text-primary">{nombre}</span>
          <Badge className={activo.valueOf() ? "bg-confirm text-xs rounded-2xl" : "bg-danger text-xs rounded-2xl"}>
            {activo ? "Activo" : "Inactivo"}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            Valor: <span className="font-semibold">{formatValor()}</span>
          </span>
          {fechaFinFormateada && (
            <span>Vence: {fechaFinFormateada}</span>
          )}
        </div>

        {descripcion && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {descripcion}
          </p>
        )}
      </div>

      {/* Sección de Botones */}
      <div className="flex gap-2">
        <Button
          size="icon"
          className="text-primary hover:text-primary/80 bg-light-10 dark:bg-dark-10"
          onClick={() => onEdit(id_descuento)}
          aria-label="Editar"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          className="text-danger hover:text-danger/80 bg-light-10 dark:bg-dark-10"
          onClick={() => onDelete(id_descuento)}
          aria-label="Eliminar"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}