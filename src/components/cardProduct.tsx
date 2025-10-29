// src/components/cardProduct.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { productoService } from "@/app/Service/producto/ProductoService";

interface ProductCardProps {
  producto: {
    id_producto: number;
    nombre: string;
    precio: number;
    stock?: { id_stock: number; cantidad: number; cantidad_min: number }[];
    codigo_barra?: string;
    imagen?: string;
    categoria?: { id_categoria: number; nombre: string };
    marcas?: { id_marca: number; nombre_marca: string }[];
  };
  onUpdateSuccess: () => void;
}

export default function ProductCard({ producto, onUpdateSuccess }: ProductCardProps) {
  const [editedProduct, setEditedProduct] = useState(() => ({
    nombre: producto?.nombre ?? "",
    codigo_barra: producto?.codigo_barra ?? "",
    stock: producto?.stock && producto.stock.length > 0 ? producto.stock[0].cantidad : 0,
    stock_minimo: producto?.stock && producto.stock.length > 0 ? producto.stock[0].cantidad_min : 0,
    precio: producto?.precio ?? 0,
    id_producto: producto?.id_producto ?? 0,
    imagen: producto?.imagen ?? "",
    categoria: producto?.categoria ?? null,
    marcaSeleccionada: producto?.marcas && producto.marcas.length > 0 ? producto.marcas[0].nombre_marca : "",
  }));

  // Sincronizar cuando cambie la prop producto
  useEffect(() => {
    setEditedProduct({
      nombre: producto?.nombre ?? "",
      codigo_barra: producto?.codigo_barra ?? "",
      stock: producto?.stock && producto.stock.length > 0 ? producto.stock[0].cantidad : 0,
      stock_minimo: producto?.stock && producto.stock.length > 0 ? producto.stock[0].cantidad_min : 0,
      precio: producto?.precio ?? 0,
      id_producto: producto?.id_producto ?? 0,
      imagen: producto?.imagen ?? "",
      categoria: producto?.categoria ?? null,
      marcaSeleccionada: producto?.marcas && producto.marcas.length > 0 ? producto.marcas[0].nombre_marca : "",
    });
  }, [producto]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const key = target.id || target.name;
    const value = target.value;
    if (target.type === "number") {
      setEditedProduct((prev) => ({ ...prev, [key]: value === "" ? "" : Number(value) }));
    } else {
      setEditedProduct((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleMarcaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditedProduct((prev) => ({ ...prev, marcaSeleccionada: e.target.value }));
  };

  const handleDelete = async () => {
    if (!confirm("¿Eliminar este producto?")) return;
    try {
      await productoService.delete(producto.id_producto);
      alert("Producto eliminado con éxito.");
      onUpdateSuccess();
    } catch (err: any) {
      console.error("Error al eliminar producto:", err);
      if (err?.response && typeof err.response.data === "string" && err.response.data.trim().startsWith("<")) {
        alert("El servidor devolvió HTML en vez de JSON al eliminar. Revisa la ruta /producto/eliminarProducto.");
      } else {
        alert("Error al eliminar: " + (err?.response?.data?.message ?? err?.message ?? String(err)));
      }
    }
  };

  const handleEdit = async () => {
    const { nombre, codigo_barra, stock, precio, marcaSeleccionada, imagen } = editedProduct as any;

    const payload: any = {
      id_producto: Number(producto.id_producto),
      nombre: String(nombre ?? producto.nombre ?? ""),
      codigo_barra: String(codigo_barra ?? producto.codigo_barra ?? ""),
      stock: Number(stock ?? (producto.stock && producto.stock[0]?.cantidad) ?? 0),
      precio: Number(precio ?? producto.precio ?? 0),
      images: imagen ?? producto.imagen ?? undefined,
    };

    if (producto.categoria?.nombre) payload.categoria = String(producto.categoria.nombre).toLowerCase();
    if (producto.marcas && producto.marcas.length > 0 && producto.marcas[0].id_marca) payload.id_marca = Number(producto.marcas[0].id_marca);
    if (marcaSeleccionada) payload.marca = String(marcaSeleccionada);

    try {
      const result = await productoService.updatePatch(payload);
      if (result && result.success === false) {
        alert("Error al actualizar: " + (result.message ?? JSON.stringify(result)));
        return;
      }
      alert("Producto actualizado con éxito.");
      onUpdateSuccess();
    } catch (err: any) {
      console.error("Error al actualizar producto:", err);
      if (err?.response && typeof err.response.data === "string" && err.response.data.trim().startsWith("<")) {
        alert("El servidor devolvió HTML en vez de JSON al actualizar. Revisa que la ruta /producto/editarProducto exista y responda JSON.");
      } else {
        alert("Error al actualizar: " + (err?.response?.data?.message ?? err?.message ?? String(err)));
      }
    }

    const data = await productoService.getAll()
    console.log("DATA DESPUÉS DEL PATCH", data)
  };

  return (
    <div className="flex gap-4 dark:bg-var1 bg-var6 p-5 rounded-2xl w-full shadow-md transition-all hover:shadow-lg">
      <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4">
        <div className="flex flex-col items-center lg:items-start gap-3 w-full">
          <div className="flex flex-wrap justify-center lg:justify-start gap-3 text-center lg:text-left">
            <p className="text-lg font-semibold">{producto.nombre}</p>
            <Badge className="bg-confirm text-xs rounded-2xl">
              {producto.stock && producto.stock.length > 0 ? "Hay stock" : "Sin stock"}
            </Badge>
            <Badge className="bg-neutral text-xs rounded-2xl">
              {producto.categoria ? producto.categoria.nombre : "Sin categoría"}
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
            <p>Precio: $ {String(editedProduct.precio)}</p>
            <p>Stock: {producto.stock && producto.stock.length > 0 ? producto.stock[0].cantidad : "No disponible"}</p>
            <p>Stock mínimo: {producto.stock && producto.stock.length > 0 ? producto.stock[0].cantidad_min : 0}</p>
            <p>Valor total: ${producto.stock && producto.stock.length > 0 ? producto.stock[0].cantidad * producto.precio : 0}</p>
            <p className="col-span-full">Código: {producto.codigo_barra}</p>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end gap-3 items-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="dark:bg-background hover:bg-background/70 p-2">
                <BiEdit className="h-5 w-5" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="w-7xl border-none">
              <AlertDialogHeader>
                <AlertDialogTitle className="mb-5">Editar producto</AlertDialogTitle>

                <AlertDialogDescription asChild>
                  <div className="flex flex-col w-[50%] gap-5">
                    <div className="flex flex-row gap-5 justify-center items-center">
                      <div className="flex flex-col gap-1 w-full">
                        <Label htmlFor="nombre">Nombre del producto</Label>
                        <Input id="nombre" value={String(editedProduct.nombre)} onChange={handleInputChange} placeholder={producto.nombre} className="bg-var1 rounded-4xl border-none" />
                      </div>

                      <div className="flex flex-col gap-1 w-full">
                        <Label htmlFor="codigo_barra">Código de barras</Label>
                        <Input id="codigo_barra" value={String(editedProduct.codigo_barra)} placeholder="000000000000" onChange={handleInputChange} className="bg-var1 rounded-4xl border-none" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <Label htmlFor="precio">Precio</Label>
                      <Input id="precio" type="number" value={String(editedProduct.precio)} onChange={handleInputChange} placeholder={String(editedProduct.precio)} className="bg-var1 rounded-4xl border-none" />
                    </div>

                    <div className="flex flex-row gap-5 justify-between">
                      <div className="flex flex-col gap-1 w-full">
                        <Label htmlFor="stock">Stock</Label>
                        <Input id="stock" type="number" value={String(editedProduct.stock)} onChange={handleInputChange} placeholder={producto.stock && producto.stock.length > 0 ? String(producto.stock[0].cantidad) : "0"} className="bg-var1 rounded-4xl border-none" />
                      </div>

                      <div className="flex flex-col gap-1 w-full">
                        <Label htmlFor="stock_minimo">Stock Minimo</Label>
                        <Input id="stock_minimo" type="number" value={String(editedProduct.stock_minimo)} placeholder={producto.stock && producto.stock.length > 0 ? String(producto.stock[0].cantidad_min) : "0"} onChange={handleInputChange} className="bg-var1 rounded-4xl border-none" />
                      </div>

                      <div className="flex flex-col gap-1 w-full">
                        <Label htmlFor="marca">Marca</Label>
                        <select id="marca" value={(editedProduct as any).marcaSeleccionada} onChange={handleMarcaChange} className="p-2 rounded">
                          {(producto.marcas?.length ?? 0) > 0 ? producto.marcas!.map((m) => (<option key={m.id_marca} value={m.nombre_marca}>{m.nombre_marca}</option>)) : (<option value="">Sin marcas</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter className="flex flex-row justify-center items-center">
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleEdit}>Guardar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="dark:bg-background hover:bg-background/70 p-2">
                <BiTrash className="h-5 w-5" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Eliminar producto</AlertDialogTitle>
                <AlertDialogDescription>¿Seguro que deseas eliminar este producto? Esta acción no se puede deshacer.</AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/70">Eliminar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
