"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { ProductoPayload } from "@/app/Service/producto/producto";

export default function DialogMainUpdate() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Ejemplo inicial — en la práctica recibirías estos datos como props o desde un servicio
  const [modalForm, setModalForm] = useState<ProductoPayload>({
    id_producto: 1,
    nombre: "Producto ejemplo",
    codigo_barra: "1234567890",
    precio: 100,
    stock_cantidad: 50,
    marca_id: 1,
    categoria_id: 1,
  });

  // Manejador de cambio
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setModalForm((prev) => ({
      ...prev,
      [name]: e.target.type === "number" ? Number(value) : value,
    }));
  };

  // Manejador de envío
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Aquí iría la lógica de actualización (API o servicio)
      console.log("Actualizando producto:", modalForm);
      // Simulación de espera
      await new Promise((r) => setTimeout(r, 1000));
      setIsOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="dark:bg-dark-10 bg-light-10 hover:bg-light-10/70 hover:dark:bg-dark-10/70">
          Actualizar producto
        </Button>
      </DialogTrigger>

      <DialogContent className="border-none dark:bg-dark-60 bg-light-60 max-w-lg">
        <DialogHeader>
          <DialogTitle>Actualizar producto</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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
            <Label htmlFor="stock_cantidad">Stock</Label>
            <Input
              id="stock_cantidad"
              name="stock_cantidad"
              value={modalForm.stock_cantidad}
              onChange={handleChange}
              type="number"
              className="border-none dark:bg-dark-30 bg-light-30"
              required
            />
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Guardar cambios"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
