'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/cardProduct';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { productoService } from '@/app/Service/producto/ProductoService';

interface Producto {
  imagen: any;
  categoria: { id_categoria: number; nombre: string };
  marcas: { id_marca: number; nombre_marca: string }[];
  id_producto: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: { id_stock: number; cantidad: number; cantidad_min: number }[];
  codigo_barra: string;
}

export default function ProductManagement() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchProductos = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await productoService.getAll();

      // data puede venir en varias formas, nos aseguramos que sea array
      const lista = Array.isArray(data) ? data : [data];

      const formattedData: Producto[] = lista.map((item: any) => {
        const marcas: { id_marca: number; nombre_marca: string }[] = Array.isArray(item.marcas)
          ? item.marcas
          : item.marca
            ? [{ id_marca: item.id_marca ?? 0, nombre_marca: String(item.marca) }]
            : [];

        const categoria =
          item.categoria && typeof item.categoria === 'object'
            ? item.categoria
            : item.categoria_nombre
              ? { id_categoria: item.id_categoria ?? 0, nombre: String(item.categoria_nombre) }
              : item.categoria
                ? { id_categoria: item.id_categoria ?? 0, nombre: String(item.categoria) }
                : { id_categoria: 0, nombre: '' };

        return {
          id_producto: Number(item.id_producto ?? item.id ?? 0),
          nombre: String(item.nombre ?? item.title ?? ''),
          descripcion: item.descripcion ?? item.description ?? '',
          precio: Number(item.precio ?? item.price ?? 0),
          stock: Array.isArray(item.stock)
            ? item.stock.map((s: any) => ({
                id_stock: Number(s.id_stock ?? s.id ?? 0),
                cantidad: Number(s.cantidad ?? s.qty ?? 0),
                cantidad_min: Number(s.cantidad_min ?? s.cantidad_minima ?? 0),
              }))
            : [],
          codigo_barra: String(item.codigo_barra ?? item.barcode ?? ''),
          imagen: item.images ?? item.imagen ?? null,
          categoria,
          marcas,
        } as Producto;
      });

      setProductos(formattedData);
    } catch (err: any) {
      console.error('fetchProductos error:', err);
      setError(err?.message ?? 'Error al obtener productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      await fetchProductos();
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleEdit = async (producto: Producto) => {
    const nuevoNombre = prompt('Nuevo nombre:', producto.nombre);
    if (!nuevoNombre) return;

    try {
      // Construimos el payload que espera tu server: stock como número, id_producto, id_marca (si existe), categoria como nombre
      const payload: any = {
        id_producto: producto.id_producto,
        nombre: nuevoNombre,
        precio: producto.precio,
        stock: producto.stock && producto.stock.length > 0 ? Number(producto.stock[0].cantidad ?? 0) : 0,
        codigo_barra: String(producto.codigo_barra ?? ''),
        images: producto.imagen ?? undefined,
      };

      // categoría: pasar el nombre (tu updateProduct busca la categoría por nombre)
      if (producto.categoria?.nombre) {
        payload.categoria = String(producto.categoria.nombre).toLowerCase();
      }

      // enviar id_marca si existe (updateProduct acepta id_marca)
      if (producto.marcas && producto.marcas.length > 0 && producto.marcas[0].id_marca) {
        payload.id_marca = Number(producto.marcas[0].id_marca);
      }

      const result = await productoService.updatePatch(payload);

      if (result && result.success === false) {
        alert('Error al actualizar producto: ' + (result.message ?? 'desconocido'));
        return;
      }

      alert('Producto actualizado correctamente');
      await fetchProductos();
    } catch (err: any) {
      console.error('Error al actualizar el producto:', err);
      // si el backend devolvió HTML (404 page) evitamos crash y damos indicación
      if (err?.response && typeof err.response.data === 'string' && err.response.data.trim().startsWith('<')) {
        alert('El backend devolvió HTML en vez de JSON. Revisa que /producto/editarProducto exista y devuelva JSON.');
      } else {
        alert('Error al actualizar el producto: ' + (err?.response?.data?.message ?? err?.message ?? 'desconocido'));
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este producto?')) return;

    try {
      setLoading(true);
      await productoService.delete(id);
      await fetchProductos();
      alert('Producto eliminado');
    } catch (err: any) {
      console.error('Error eliminando producto:', err);
      alert('No se pudo eliminar el producto: ' + (err?.message ?? 'desconocido'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center gap-10 px-4 sm:px-6 lg:px-10 py-3 lg:mx-50">
        <div className="flex justify-center items-center flex-col bg-var6 dark:bg-var2 rounded-md p-5 gap-5">
          <p>Cargando Productos</p>
          <Spinner className="size-10" />
        </div>
      </main>
    );
  }

  if (error) return <div className="text-center mt-10 text-danger">{error}</div>;

  return (
    <main className="flex flex-col items-center justify-center gap-10 px-4 sm:px-6 lg:px-10 py-6 lg:mx-50">
      <div className="flex flex-col gap-6 w-full">
        {productos.length > 0 ? (
          productos.map((producto) => (
            <ProductCard
              key={producto.id_producto}
              producto={producto}
              onUpdateSuccess={fetchProductos}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground">No hay productos disponibles.</p>
        )}
      </div>

      <div className="w-full flex justify-center">
        <Button
          onClick={() => router.push('/crear_productos')}
          className="w-full sm:w-auto bg-var5 dark:bg-var1 text-foreground hover:bg-var4 dark:hover:bg-var3 text-lg px-6 py-3 rounded-2xl"
        >
          Agregar producto
        </Button>
      </div>
    </main>
  );
}
