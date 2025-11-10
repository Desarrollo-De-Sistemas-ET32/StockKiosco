"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BiTrash, BiEdit } from "react-icons/bi";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogDescription,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

// 1. Definimos el tipo de Producto (puedes moverlo a un archivo .ts)
type Producto = {
  id_producto: number;
  nombre: string;
  precio: number;
  stock?: { id_stock: number; cantidad: number; cantidad_min: number }[];
  codigo_barra?: string;
  imagen?: string;
  categoria?: { id_categoria: number; nombre: string };
  marcas?: { id_marca: number; nombre_marca: string };
};

// 2. Definimos las props
interface ProductCardProps {
  producto: Producto;
  // Funciones que vienen de la página padre
  onEdit: (producto: Producto) => void; 
  onDelete: (producto: Producto) => void;
}

// 3. El componente ahora es "tonto" (solo muestra datos)
export default function ProductCard({
  producto,
  onEdit,
  onDelete,
}: ProductCardProps) {
  
  // Extraemos los valores para que sea más fácil de leer
  const stockInfo = producto.stock?.[0];
  const stockQty = stockInfo?.cantidad ?? 0;
  const stockMin = stockInfo?.cantidad_min ?? 0;
  const categoriaNombre = producto.categoria?.nombre ?? "Sin categoría";
  const marcaNombre = producto.marcas?.nombre_marca ?? "Sin marca";

  return (
    <div className="flex gap-4 dark:bg-dark-30 bg-light-30 p-5 rounded-2xl w-full shadow-md">
      <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4">
        
        {/* INFO DEL PRODUCTO */}
        <div className="flex flex-col items-start gap-3 w-full">
          <div className="flex flex-wrap justify-start gap-3">
            <p className="text-lg font-semibold">{producto.nombre}</p>
            <Badge>
              {stockQty > 0 ? "En Stock" : "Sin stock"}
            </Badge>
            <Badge variant="outline">{categoriaNombre}</Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 justify-items-start gap-2 text-sm text-muted-foreground">
            <p>Precio: $ {producto.precio}</p>
            <p>Stock: {stockQty}</p>
            <p>Stock mínimo: {stockMin}</p>
            <p>Valor total: $ {stockQty * producto.precio}</p>
            <p>Marca: {marcaNombre}</p>
            <p>Código: {producto.codigo_barra ?? "N/A"}</p>
          </div>
        </div>

        {/* BOTONES */}
        <div className="flex justify-center lg:justify-end gap-3 items-center">
          {/* Botón de Editar */}
          <Button
            className="dark:bg-dark-60 dark:hover:bg-dark-60/70 bg-light-60 hover:bg-light-60/70 p-2"
            onClick={() => onEdit(producto)} // 4. Avisa a la página que abra el modal
          >
            <BiEdit className="h-5 w-5" />
          </Button>

          {/* Botón de Eliminar (con su propio diálogo de confirmación) */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="dark:bg-dark-60 dark:hover:bg-dark-60/70 bg-light-60 hover:bg-light-60/70 p-2">
                <BiTrash className="h-5 w-5 text-danger" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-none">
              <AlertDialogHeader>
                <AlertDialogTitle>Eliminar producto</AlertDialogTitle>
                <AlertDialogDescription>
                  ¿Seguro que deseas eliminar <b>{producto.nombre}</b>? Esta acción no se puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(producto)} // 5. Avisa a la página que borre
                  className="bg-danger hover:bg-danger/80"
                >
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}