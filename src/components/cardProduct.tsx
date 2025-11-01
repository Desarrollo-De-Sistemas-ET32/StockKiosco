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
import { marcaService } from "@/app/Service/marca/marcaService";
import { ComboboxDemo } from "./comboBox";

interface ProductCardProps {
  producto: {
    id_producto: number;
    nombre: string;
    precio: number;
    stock?: { id_stock: number; cantidad: number; cantidad_min: number }[];
    codigo_barra?: string;
    imagen?: string;
    categoria?: { id_categoria: number; nombre: string };
    marcas?: { id_marca: number; nombre_marca: string };
  };
  onUpdateSuccess: () => void;
}

interface MarcaProps {
  id_marca: number;
  nombre_marca: string;
}

export default function ProductCard({
  producto,
  onUpdateSuccess,
}: ProductCardProps) {
  const mapProductToState = (producto: any) => ({
    nombre: producto?.nombre ?? "",
    codigo_barra: producto?.codigo_barra ?? "",
    stock: producto?.stock?.[0]?.cantidad ?? 0,
    stock_minimo: producto?.stock?.[0]?.cantidad_min ?? 0,
    precio: producto?.precio ?? 0,
    id_producto: producto?.id_producto ?? 0,
    imagen: producto?.imagen ?? "",
    categoria: producto?.categoria ?? null,
    marcaSeleccionada: producto?.marcas?.id_marca ?? "",
    marcas: producto?.marcas?.nombre_marca ?? "",
  });

  const [editedProduct, setEditedProduct] = useState(() =>
    mapProductToState(producto)
  );

  const [marcasList, setMarcasList] = useState<MarcaProps[]>([]);

  useEffect(() => {
    setEditedProduct(mapProductToState(producto));
  }, [producto]);

  const loadMarcas = async () => {
    try {
      const data = await marcaService.getAll();
      setMarcasList(data);
    } catch (err) {
      console.error("Error al obtener marcas:", err);
      alert("Error al obtener marcas.");
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const key = target.name ?? target.id;
    if (!key) return;

    const value =
      target.type === "number" ? Number(target.value) : target.value;
    setEditedProduct((prev) => ({ ...prev, [key]: value }));
  };

  const handleMarcaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEditedProduct((prev) => ({
      ...prev,
      marcaSeleccionada: e.target.value,
    }));
  };

  const handleDelete = async () => {
    if (!confirm("¿Eliminar este producto?")) return;
    try {
      await productoService.delete(producto.id_producto);
      alert("Producto eliminado con éxito.");
      onUpdateSuccess();
    } catch (err: any) {
      console.error("Error al eliminar producto:", err);
      alert(
        "Error al eliminar: " + (err?.response?.data?.message ?? err?.message)
      );
    }
  };

  const handleEdit = async () => {
    const {
      nombre,
      codigo_barra,
      stock,
      precio,
      marcaSeleccionada,
      imagen,
      stock_minimo,
      ...rest
    } = editedProduct;
    const payload: any = {
      id_producto: Number(editedProduct.id_producto),
      nombre,
      codigo_barra,
      stock: stock,
      precio: precio,
      stock_minimo: stock_minimo,
      images: imagen ?? undefined,
      marcaSeleccionada,
    };

    // Estos solo se agregan si existen (no ensucian el payload)
    if (producto.categoria?.nombre)
      payload.categoria = producto.categoria.nombre.toLowerCase();

    if (marcaSeleccionada) {
      payload.id_marca = Number(marcaSeleccionada);
    }

    try {
      const result = await productoService.updatePatch(payload);

      if (result.success === false) {
        alert("Error al actualizar: " + (result.message ?? "Desconocido"));
        return;
      }

      alert("Producto actualizado con éxito.");
      onUpdateSuccess();
    } catch (err: any) {
      console.error("Error al actualizar producto:", err);

      if (
        err?.response &&
        typeof err.response.data === "string" &&
        err.response.data.trim().startsWith("<")
      ) {
        alert(
          "El servidor devolvió HTML en vez de JSON. Revisa /producto/editarProducto."
        );
      } else {
        alert(
          "Error al actualizar: " +
            (err?.response?.data?.message ?? err?.message)
        );
      }
    }
  };

  return (
    <div className="flex gap-4 dark:bg-var1 bg-var6 p-5 rounded-2xl w-full shadow-md transition-all hover:shadow-lg">
      <div className="flex flex-col md:flex-row items-center justify-between w-full gap-4">
        <div className="flex flex-col items-start gap-3 w-full">
          <div className="flex flex-wrap justify-start gap-3 text-center lg:text-left">
            <p className="text-lg font-semibold">{producto.nombre}</p>
            <Badge className="bg-confirm text-xs rounded-2xl">
              {producto.stock && producto.stock.length > 0
                ? "Hay stock"
                : "Sin stock"}
            </Badge>
            <Badge className="bg-neutral text-xs rounded-2xl">
              {producto.categoria ? producto.categoria.nombre : "Sin categoría"}
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 justify-items-start gap-2 text-sm text-muted-foreground">
            <p>Precio: $ {producto.precio}</p>
            <p>
              Stock:{" "}
              {producto.stock && producto.stock.length > 0
                ? producto.stock[0].cantidad
                : "No disponible"}
            </p>
            <p>
              Stock mínimo:{" "}
              {producto.stock && producto.stock.length > 0
                ? producto.stock[0].cantidad_min
                : 0}
            </p>
            <p>
              Valor total: $ {producto.stock && producto.stock.length > 0
                ? producto.stock[0].cantidad * producto.precio
                : 0}
            </p>
            <p> Marca: {producto.marcas ? producto.marcas.nombre_marca : "Sin marca"}</p>
            <p>Código de barras: {producto.codigo_barra}</p>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end gap-3 items-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="dark:bg-background bg-background hover:bg-background/70 p-2" onClick={loadMarcas}>
                <BiEdit className="h-5 w-5" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="border-none">
              <AlertDialogHeader>
                <AlertDialogTitle className="mb-5">
                  Editar producto
                </AlertDialogTitle>
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="nombre">Nombre</Label>
                      <Input
                        id="nombre"
                        name="nombre"
                        placeholder={editedProduct.nombre}
                        onChange={handleInputChange}
                        className="border-none dark:bg-var1 bg-var6"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="codigo_barra">Código de barra</Label>
                      <Input
                        id="codigo_barra"
                        name="codigo_barra"
                        placeholder={editedProduct.codigo_barra}
                        onChange={handleInputChange}
                        className="border-none dark:bg-var1 bg-var6"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="precio">Precio</Label>
                      <Input
                        id="precio"
                        name="precio"
                        placeholder={editedProduct.precio.toString()}
                        type="number"
                        onChange={handleInputChange}
                        className="border-none dark:bg-var1 bg-var6"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="stock">Stock</Label>
                      <Input
                        id="stock"
                        name="stock"
                        placeholder={editedProduct.stock.toString()}
                        type="number"
                        onChange={handleInputChange}
                        className="border-none dark:bg-var1 bg-var6"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="stock_minimo">Stock mínimo</Label>
                      <Input
                        id="stock_minimo"
                        name="stock_minimo"
                        placeholder={editedProduct.stock_minimo.toString()}
                        type="number"
                        onChange={handleInputChange}
                        className="border-none dark:bg-var1 bg-var6"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="marca">Marca</Label>
                      <ComboboxDemo marcas={marcasList}>
                      </ComboboxDemo>
                    </div>
                  </div>
                </div>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex flex-row justify-center items-center">
                <AlertDialogCancel className="bg-var6 dark:bg-var1 dark:hover:bg-var1/70 hover:bg-var6/70">Cancelar</AlertDialogCancel>
                <AlertDialogAction className="bg-var6 dark:bg-var1 dark:hover:bg-var1/70 hover:bg-var6/70" onClick={handleEdit}>
                  Guardar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="dark:bg-background bg-background hover:bg-background/70 p-2">
                <BiTrash className="h-5 w-5" />
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="border-none">
              <AlertDialogHeader>
                <AlertDialogTitle>Eliminar producto</AlertDialogTitle>
                <AlertDialogDescription>
                  ¿Seguro que deseas eliminar este producto? Esta acción <b>no se puede deshacer.</b>
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel className="bg-var6 dark:bg-var1 dark:hover:bg-var1/70 hover:bg-var6/70">Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-var6 dark:bg-var1 dark:hover:bg-var1/70 hover:bg-var6/70"
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
