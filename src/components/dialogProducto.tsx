"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { ComboboxDemo } from "./comboBox";
import { ProductoPayload, ProductoWithId } from "@/app/Service/producto/producto";
import { MarcaWithId } from "@/app/Service/marca/marca";
import { CategoriaWithId } from "@/app/Service/categoria/categoria";
import { ProveedorWithId } from "@/app/Service/proveedor/proveedor";

type DialogProductoProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  modalForm: ProductoPayload;
  setModalForm: React.Dispatch<React.SetStateAction<ProductoPayload>>;
  marcasList: MarcaWithId[];
  categoriasList: CategoriaWithId[];
  title: string;
  proveedorList: ProveedorWithId[];
};

export function DialogProducto({
  isOpen,
  onOpenChange,
  onSubmit,
  isSubmitting,
  modalForm,
  setModalForm,
  marcasList,
  categoriasList,
  proveedorList,
  title,
}: DialogProductoProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setModalForm((prev) => ({
      ...prev,
      [name]: e.target.type === "number" ? Number(value) : value,
    }));
  };

  const handleMarcaChange = (marcaId: string) => {
    console.log("Seleccioné marca ID:", marcaId); // <--- AGREGA ESTO
    setModalForm((prev) => ({ ...prev, id_marca: Number(marcaId) || null }));
  };

  const handleCategoriaChange = (categoriaId: string) => {
    console.log("Seleccioné categoria ID:", categoriaId); // <--- AGREGA ESTO
    setModalForm((prev) => ({
      ...prev,
      id_categoria: Number(categoriaId) || null,
    }));
  };

  const handleProveedorChange = (proveedorId: string) => {
    console.log("Seleccioné proveedor ID:", proveedorId); // <--- AGREGA ESTO
    setModalForm((prev) => ({
      ...prev,
      id_proveedor: Number(proveedorId),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const marcaItems = marcasList.map((m) => ({
    value: m.id_marca,
    label: m.nombre_marca,
  }));
  const categoriaItems = categoriasList.map((c) => ({
    value: c.id_categoria,
    label: c.nombre,
  }));

  const proveedorItems =(proveedorList ?? []).map((p) => ({
    value: p.id_proveedor ?? 0,
    label: p.nombre,
  }));


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="border-none dark:bg-dark-60 bg-light-60">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              name="nombre"
              value={modalForm.nombre}
              onChange={handleChange}
              required
              className="border-none bg-light-30 dark:bg-dark-30 focus:shadow-md"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="codigo_barra">Código de barra</Label>
            <Input
              id="codigo_barra"
              name="codigo_barra"
              value={modalForm.codigo_barra ?? ""}
              onChange={handleChange}
              className="border-none bg-light-30 dark:bg-dark-30 focus:shadow-md"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="precio">Precio</Label>
            <Input
              id="precio"
              name="precio"
              type="number"
              value={modalForm.precio}
              required
              onChange={handleChange}
              className="border-none bg-light-30 dark:bg-dark-30 focus:shadow-md"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="stock_cantidad">Stock</Label>
            <Input
              id="stock_cantidad"
              name="stock_cantidad"
              type="number"
              value={modalForm.stock_cantidad}
              onChange={handleChange}
              className="border-none bg-light-30 dark:bg-dark-30 focus:shadow-md"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="stock_minimo">Stock Minimo</Label>
            <Input
              id="stock_minimo"
              name="stock_minimo"
              type="number"
              value={modalForm.stock_minimo}
              onChange={handleChange}
              className="border-none bg-light-30 dark:bg-dark-30 focus:shadow-md"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="id_marca">Marca</Label>
            <ComboboxDemo
              items={marcaItems}
              value={modalForm.id_marca ?? 0}
              onSelect={handleMarcaChange}
              placeholder="Seleccionar marca"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="id_categoria">Categoría</Label>
            <ComboboxDemo
              items={categoriaItems}
              value={modalForm.id_categoria ?? 0}
              onSelect={handleCategoriaChange}
              placeholder="Seleccionar categoría"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="id_proveedor">Proveedor</Label>
            <ComboboxDemo
              items={proveedorItems}
              value={modalForm.id_proveedor ?? 0}
              onSelect={handleProveedorChange}
              placeholder="Seleccionar proveedor"
            />
          </div>
          <DialogFooter className="mt-6 col-span-2 grid grid-cols-2 justify-end gap-4 w-full">
            <Button
              className="w-full bg-light-30 dark:bg-dark-30"
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="w-full bg-light-30 dark:bg-dark-30">
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Guardar"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
