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
import { ProductoWithId } from "@/app/Service/producto/producto";

// 2. Definimos las props
interface ProductCardProps {
  producto: ProductoWithId,
  // Funciones que vienen de la página padre
  onEdit: () => void; 
  onDelete: () => void;
}

// 3. El componente ahora es "tonto" (solo muestra datos)
export default function ProductCard({
  producto,
  onEdit,
  onDelete,
}: ProductCardProps) {
  const stockQty = producto.stock?.[0]?.cantidad ?? 0;
  const stockMin = producto.stock?.[0]?.cantidad_min ?? 0;
  const marcaNombre = producto.marcas?.nombre_marca ?? "N/A";
  const categoriaNombre = producto.categoria?.nombre ?? "N/A";

  //Lógica visual para stock bajo
  const isLowStock = stockQty <= stockMin;

  return (
    <div className="flex gap-4 dark:bg-dark-30 bg-light-30 p-5 rounded-2xl w-full shadow-md">
      <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4">
        
        {/* INFO DEL PRODUCTO */}
        <div className="flex flex-col items-start gap-3 w-full">
          <div className="flex flex-wrap justify-start gap-3">
            <p className="text-lg font-semibold">{producto.nombre}</p>
            <Badge className={`${isLowStock ? 'bg-danger' : 'bg-confirm'}`} >
              {isLowStock ? 'Stock bajo' : 'Stock suficiente'}
            </Badge>
            <Badge className="bg-neutral">{categoriaNombre}</Badge>
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
            onClick={onEdit}
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
                  onClick={onDelete}
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