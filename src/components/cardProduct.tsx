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
// Define las propiedades que el componente espera recibir
interface ProductCardProps {
  producto: {
    id_producto: number; // El ID del producto
    nombre: string;
    precio: number;
    stock: { id_stock: number; cantidad: number }[];
    stock_minimo: number;
    codigo_barra: string;
  };
  onUpdateSuccess: () => void; // Función para notificar a la página principal
}

export default function ProductCard({
  producto,
  onUpdateSuccess,
}: ProductCardProps) {
  const [editedProduct, setEditedProduct] = useState({
    nombre: producto.nombre,
    codigo_barra: producto.codigo_barra,
    stock: producto.stock.length > 0 ? producto.stock[0].cantidad : 0,
    precio: producto.precio,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setEditedProduct((prev) => ({
      ...prev,
      [id]: value,
    }));
  };


    const handleDelete = async () => {
    const url = `/api/producto/${producto.id_producto}`;
    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id_producto: producto.id_producto }),
      });
      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.message);
      }
      const result = await response.json();
      if (result.success) {
        alert("Producto eliminado con éxito.");
        onUpdateSuccess(); // Llama a la función para refrescar la lista
      }
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      alert(`Error al eliminar el producto: ${error.message}`);
    }

  };

  const handleEdit = async () => {
    const { nombre, codigo_barra, stock, precio } = editedProduct;

    const url = `/api/producto/${producto.id_producto}`; // Usa la prop id_producto
    const newData = {
      nombre,
      codigo_barra,
      stock: stock ? parseInt(stock.toString(), 10) : 0,
      precio: precio ? parseFloat(precio.toString()) : 0,
    };

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newData),
      });

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.message);
      }

      const result = await response.json();
      if (result.success) {
        alert("Producto actualizado con éxito.");
        onUpdateSuccess(); // Llama a la función para refrescar la lista
      }
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      alert(`Error al actualizar el producto: ${error.message}`);
    }
}
  return (
    <div className="flex flex-col gap-5 bg-var1 p-5 rounded-2xl w-sm lg:w-full">
      <div className="flex flex-col lg:flex-row justify-between gap-5">
        <div className="flex flex-col gap-5 justify-center items-center lg:items-start">
          <div className="flex justify-start items-start h-5 gap-5">
            <p className="text-xl lg:text-2xl">{producto.nombre}</p>
            <Badge className={`text-xs rounded-2xl lg:rounded-4xl bg-confirm`}>
              {producto.stock.length > 0 ? "Hay Stock" : "Sin Stock"}
            </Badge>
            <Badge className="bg-neutral text-xs rounded-3xl lg:rounded-4xl">
              La Campora
            </Badge>
          </div>
          <div className="grid grid-cols-2 items-center justify-items-center lg:flex lg:flex-row gap-10">
            <p className="text-xs lg:text-md">
              {["Precio: " + producto.precio]}
            </p>
            <p className="text-xs lg:text-md">
              {[
                "Stock: ",
                producto.stock.length > 0
                  ? producto.stock[0].cantidad
                  : "Stock: No disponible",
              ]}
            </p>
            <p className="text-xs lg:text-md">
              {["Stock Minimo: " + producto.stock_minimo]}
            </p>
            <p className="text-xs lg:text-md">
              {["Valor total: " +  (producto.stock.length > 0 ? producto.stock[0].cantidad * producto.precio : 0)]}
            </p>
          </div>
          <p className="text-xs lg:text-md">
            {`Còdigo de barras: ` + producto.codigo_barra}
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-5 justify-center items-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="flex flex-row">
                <Button className="bg-background hover:bg-background/70">
                  <BiEdit className="h-5 w-5" />
                </Button>
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Editar Producto</AlertDialogTitle>
                <AlertDialogDescription>
                  <div className="grid grid-cols-1 gap-5">
                    <div>
                      <Label htmlFor="nombre">Nombre del Producto</Label>
                      <Input
                        className="bg-var1 border-2"
                        placeholder={producto.nombre}
                        id="nombre"
                        onChange={handleInputChange}
                        value={editedProduct.nombre}
                      />
                    </div>
                    <div>
                      <Label htmlFor="codigo_barra">Código de barras</Label>
                      <Input
                        className="bg-var1 border-2"
                        placeholder={producto.codigo_barra}
                        id="codigo_barra"
                        onChange={handleInputChange}
                        value={editedProduct.codigo_barra}
                      />
                    </div>
                    <div>
                      <Label htmlFor="stock">Stock</Label>
                      <Input
                        className="bg-var1 border-2"
                        placeholder="900"
                        id="stock"
                        onChange={handleInputChange}
                        value={editedProduct.stock}
                      />
                    </div>
                    <div>
                      <Label htmlFor="precio">Precio</Label>
                      <Input
                        className="bg-var1 border-2"
                        placeholder={producto.precio.toString()}
                        id="precio"
                        onChange={handleInputChange}
                        value={editedProduct.precio}
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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="flex flex-row">
                <Button className="bg-background hover:bg-background/70">
                  <BiTrash className="h-5 w-5" />
                </Button>
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Eliminar Producto</AlertDialogTitle>
                <AlertDialogDescription>
                  ¿Estás seguro de que deseas eliminar este producto? Esta acción
                  no se puede deshacer.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive hover:bg-destructive/70" onClick={handleDelete}>Eliminar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          </div>
      </div>
    </div>
  )
};