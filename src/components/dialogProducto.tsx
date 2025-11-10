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
import { ProductoPayload } from "@/app/Service/producto/producto";
import { MarcaWithId } from "@/app/Service/marca/marca";
import { CategoriaWithId } from "@/app/Service/categoria/categoria";

// Props que recibe el Diálogo
type DialogProductoProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (formData: ProductoPayload) => void;
  isSubmitting: boolean;
  modalForm: ProductoPayload;
  setModalForm: React.Dispatch<React.SetStateAction<ProductoPayload>>;
  marcasList: MarcaWithId[];
  categoriasList: CategoriaWithId[];
  title: string;
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
  title,
}: DialogProductoProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setModalForm((prev) => ({
      ...prev,
      [name]: e.target.type === "number" ? Number(value) : value,
    }));
  };

  // Handler para el Combobox de Marca
  const handleMarcaChange = (marcaId: string) => {
    setModalForm((prev) => ({
      ...prev,
      marca_id: Number(marcaId) || null, // Guarda el ID numérico
    }));
  };

  // Handler para el Combobox de Categoria
  const handleCategoriaChange = (categoriaId: string) => {
    setModalForm((prev) => ({
      ...prev,
      categoria_id: Number(categoriaId) || null, // Guarda el ID numérico
    }));
  };
  // Handler para el submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(modalForm);
  };

  const marcaItems = marcasList.map((m) => ({
    value: m.id_marca,
    label: m.nombre_marca,
  }));

  const categoriaItems = categoriasList.map((c) => ({
    value: c.id_categoria,
    label: c.nombre,
  }));

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="border-none dark:bg-dark-60 bg-light-60">
        <DialogHeader>
          <DialogTitle className="mb-5">{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                name="nombre"
                value={modalForm.nombre}
                onChange={handleChange}
                className="border-none dark:bg-dark-30 bg-light-30"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="codigo_barra">Código de barra</Label>
              <Input
                id="codigo_barra"
                name="codigo_barra"
                value={modalForm.codigo_barra ?? ""}
                onChange={handleChange}
                className="border-none dark:bg-dark-30 bg-light-30"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="precio">Precio</Label>
              <Input
                id="precio"
                name="precio"
                value={modalForm.precio}
                type="number"
                onChange={handleChange}
                className="border-none dark:bg-dark-30 bg-light-30"
                required
              />
            </div>

            {/* NOTA: El campo 'stock' es complejo (un array). 
              Necesitarías inputs separados para 'cantidad' y 'cantidad_min'.
              Por simplicidad, lo he omitido, pero aquí deberías agregarlos.
              Ej:
            */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="stock_cantidad">Stock</Label>
              <Input
                id="stock_cantidad"
                name="stock_cantidad"
                value={modalForm.stock_cantidad}
                onChange={handleChange}
                type="number"
                className="border-none dark:bg-dark-30 bg-light-30"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="marca">Marca</Label>
              <ComboboxDemo
                items={marcaItems} // 1. Pasamos los items
                value={modalForm.marca_id ?? 0}
                onSelect={handleMarcaChange}
                placeholder="Seleccionar marca"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="categoria">Categoría</Label>
              <ComboboxDemo
                items={categoriaItems} // 1. Pasamos los items
                value={modalForm.categoria_id ?? 0} // BUG ARREGLADO: 'categoria_id'
                onSelect={handleCategoriaChange}
                placeholder="Seleccionar categoría"
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
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
