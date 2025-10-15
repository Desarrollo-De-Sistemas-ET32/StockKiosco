import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { BiTrash, BiEdit } from "react-icons/bi";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertDialogAction } from "@radix-ui/react-alert-dialog";

interface ProductCardProps {
  producto: {
    id_producto: number;
    nombre: string;
    precio: number;
    stock: { id_stock: number; cantidad: number }[];
    stock_minimo: number;
    codigo_barra: string;
    imagen?: string;
    categoria?: { id_categoria: number; nombre: string };
  };
  onUpdateSuccess: () => void;
}

export default function ProductCard({ producto, onUpdateSuccess }: ProductCardProps) {
  const [editedProduct, setEditedProduct] = useState({
    nombre: producto.nombre,
    codigo_barra: producto.codigo_barra,
    stock: producto.stock.length > 0 ? producto.stock[0].cantidad : 0,
    precio: producto.precio,
    id_producto: producto.id_producto,
    stock_minimo: producto.stock_minimo,
    imagen: producto.imagen,
    categoria: producto.categoria,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setEditedProduct((prev) => ({ ...prev, [id]: value }));
  };

  const handleDelete = async () => {
    const url = `/api/producto/${producto.id_producto}`;
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_producto: producto.id_producto }),
      });
      const result = await response.json();
      if (result.success) {
        alert("Producto eliminado con éxito.");
        onUpdateSuccess();
      }
    } catch (error: any) {
      alert(`Error al eliminar el producto: ${error.message}`);
    }
  };

  const handleEdit = async () => {
    const { nombre, codigo_barra, stock, precio } = editedProduct;
    const url = `/api/producto/${producto.id_producto}`;
    const newData = {
      nombre,
      codigo_barra,
      stock: parseInt(stock.toString(), 10) || 0,
      precio: parseFloat(precio.toString()) || 0,
      id_producto: producto.id_producto,
      stock_minimo: producto.stock_minimo,
      imagen: producto.imagen,
      categoria: producto.categoria,
    };

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
      });
      const result = await response.json();
      if (result.success) {
        alert("Producto actualizado con éxito.");
        onUpdateSuccess();
      }
    } catch (error: any) {
      alert(`Error al actualizar el producto: ${error.message}`);
    }
  };

  return (
    <div className="flex gap-4 dark:bg-var1 bg-var6 p-5 rounded-2xl w-full shadow-md transition-all hover:shadow-lg">
      {/* Información del producto */}
      <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4">
        <div className="flex flex-col items-center lg:items-start gap-3 w-full">
          <div className="flex flex-wrap justify-center lg:justify-start gap-3 text-center lg:text-left">
            <p className="text-lg font-semibold">{producto.nombre}</p>
            <Badge className="bg-confirm text-xs rounded-2xl">
              {producto.stock.length > 0 ? "Hay stock" : "Sin stock"}
            </Badge>
            <Badge className="bg-neutral text-xs rounded-2xl">
              {producto.categoria ? producto.categoria.nombre : "Sin categoría"}
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
            <p>Precio: $ {producto.precio}</p>
            <p>
              Stock:{" "}
              {producto.stock.length > 0
                ? producto.stock[0].cantidad
                : "No disponible"}
            </p>
            <p>Stock mínimo: {producto.stock_minimo}</p>
            <p>
              Valor total: $ {" "}
              {producto.stock.length > 0
                ? producto.stock[0].cantidad * producto.precio
                : 0}
              
            </p>
            <p className="col-span-full">Código: {producto.codigo_barra}</p>
          </div>
        </div>

        {/* Botones editar / eliminar */}
        <div className="flex justify-center lg:justify-end gap-3 items-center">
          {/* EDITAR */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="dark:bg-background hover:bg-background/70 p-2">
                <BiEdit className="h-5 w-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-lg w-[90vw]">
              <AlertDialogHeader>
                <AlertDialogTitle>Editar producto</AlertDialogTitle>
                <AlertDialogDescription>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    <div className="flex flex-col gap-1">
                      <Label htmlFor="nombre">Nombre</Label>
                      <Input
                        id="nombre"
                        value={editedProduct.nombre}
                        onChange={handleInputChange}
                        className="bg-var1 border-2 rounded-xl"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label htmlFor="codigo_barra">Código de barras</Label>
                      <Input
                        id="codigo_barra"
                        value={editedProduct.codigo_barra}
                        onChange={handleInputChange}
                        className="bg-var1 border-2 rounded-xl"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label htmlFor="stock">Stock</Label>
                      <Input
                        id="stock"
                        value={editedProduct.stock}
                        onChange={handleInputChange}
                        className="bg-var1 border-2 rounded-xl"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label htmlFor="precio">Precio</Label>
                      <Input
                        id="precio"
                        type="number"
                        value={editedProduct.precio}
                        onChange={handleInputChange}
                        className="bg-var1 border-2 rounded-xl"
                      />
                    </div>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleEdit}>
                  Guardar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* ELIMINAR */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="dark:bg-background hover:bg-background/70 p-2">
                <BiTrash className="h-5 w-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Eliminar producto</AlertDialogTitle>
                <AlertDialogDescription>
                  ¿Seguro que deseas eliminar este producto? Esta acción no se
                  puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive hover:bg-destructive/70"
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
