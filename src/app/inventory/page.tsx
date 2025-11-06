'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProductCard from '@/components/cardProduct';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { productoService } from '@/app/Service/producto/ProductoService';
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';

interface Producto {
  imagen: any;
  categoria: { id_categoria: number; nombre: string };
  marcas: { id_marca: number; nombre_marca: string };
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

      const lista = Array.isArray(data) ? data : [data];

      const formattedData: Producto[] = lista.map((item: any) => {
        const marcas =
          item.marcas && typeof item.marcas === 'object'
            ? item.marcas
            : item.marca_nombre
              ? { id_marca: item.id_marca ?? 0, nombre_marca: String(item.marca_nombre) }
              : item.marcas
                ? { id_marca: item.id_marca ?? 0, nombre_marca: String(item.marcas) }
                : { id_marca: 0, nombre_marca: '' };

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
          precio: item.precio !== undefined && item.precio !== null ? item.precio.toString() : "0",
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
        }
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
    document.title = "Inventario | Kiosco";
    let mounted = true;
    (async () => {
      if (!mounted) return;
      await fetchProductos();
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <main className="flex flex-col items-center justify-center gap-10 px-4 sm:px-6 lg:px-10 py-3 lg:mx-50">
        <div className="flex justify-center items-center flex-col bg-light-60 dark:bg-dark-30 rounded-md p-5 gap-5">
          <p>Cargando Productos</p>
          <Spinner className="size-10" />
        </div>
      </main>
    );
  }

  if (error) return <div className="text-center mt-10 text-danger">{error}</div>;

  return (
    <main className="flex flex-col items-center justify-center gap-10 px-4 sm:px-6 lg:px-10 py-6 lg:mx-100">
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
          className="w-full sm:w-auto bg-light-30 dark:bg-dark-30 text-foreground hover:bg-light-30/70 dark:hover:bg-dark-30/70 text-lg px-6 py-3 rounded-2xl"
        >
          Agregar producto
        </Button>
      </div>
    </main>
  );
}
