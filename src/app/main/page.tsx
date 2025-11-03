"use client";

import {
  BiBox,
  BiError,
  BiMoney,
  BiShoppingBag,
  BiCart,
  BiMedal,
  BiPlus,
} from "react-icons/bi";
import InfoCard from "@/components/info-card";
import { Button } from "@/components/ui/button";
import Venta from "@/components/sale-box";
import StockBajo from "@/components/product-box";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { productoService } from "@/app/Service/producto/ProductoService";
import ventasService from "@/app/Service/ventas/VentasService";

type Producto = {
  id: number;
  name: string;
  unidades: number;
  minimoUnidades: number;
  price: number;
  categoria: string;
  brand: string;
};

type VentaInfo = {
  id_venta: number;
  detalles: { id_producto: number; cantidad: number }[];
  total: number;
  fecha: string;
};

export default function MainPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [ventas, setVentas] = useState<VentaInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingVentas, setLoadingVentas] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Productos
        let prods = [];
        try {
          prods = await productoService.getAll();
        } catch (err) {
          console.error("Error obteniendo productos:", err);
          prods = [];
        }

        const productosNormalizados: Producto[] = (prods ?? []).map((p: any) => {
          // precio: puede venir como string o number o un objeto Decimal-like
          const precioRaw = p.precio ?? p.price ?? p.valor ?? "0";
          const precio = Number(String(precioRaw).replace(/[^0-9.-]/g, "")) || 0;

          // stock puede venir como array o objeto o undefined
          const stockEntry =
            Array.isArray(p.stock) && p.stock.length > 0
              ? p.stock[0]
              : p.stock && typeof p.stock === "object"
              ? p.stock
              : null;

          const unidades = Number(stockEntry?.cantidad ?? 0) || 0;
          const minimoUnidades =
            Number(stockEntry?.cantidad_min ?? stockEntry?.cantidad_minima ?? 0) || 0;

          const categoria =
            (p.categoria && (p.categoria.nombre ?? p.categoria)) ??
            p.categoria_nombre ??
            p.id_categoria ??
            "Sin categoría";

          const brand =
            (p.marcas && (p.marcas.nombre_marca ?? p.marcas)) ??
            p.marca ??
            p.nombre_marca ??
            "Sin marca";

          return {
            id: Number(p.id_producto ?? p.id ?? 0),
            name: String(p.nombre ?? p.title ?? "Sin nombre"),
            unidades,
            minimoUnidades,
            price: precio,
            categoria: String(categoria ?? "Sin categoría"),
            brand: String(brand ?? "Sin marca"),
          };
        });

        setProductos(productosNormalizados);
      } finally {
        setLoading(false);
      }
    };

    // Cargamos ventas por separado (para que un fallo en productos no corte todo)
    const fetchVentas = async () => {
      setLoadingVentas(true);
      try {
        let ventasRaw: any[] = [];
        try {
          ventasRaw = await ventasService.getAll();
        } catch (err) {
          console.error("Error obteniendo ventas:", err);
          ventasRaw = [];
        }

        const ventasNormalizadas: VentaInfo[] = (ventasRaw ?? []).map((v: any) => {
          const rawDetalles =
            Array.isArray(v.detalles) && v.detalles.length > 0
              ? v.detalles
              : Array.isArray(v.detalles_venta) && v.detalles_venta.length > 0
              ? v.detalles_venta
              : v.detalles ?? [];

          const detalles = (rawDetalles ?? []).map((d: any) => ({
            id_producto: Number(d.id_producto ?? d.id ?? 0),
            cantidad: Number(d.cantidad ?? d.cant ?? d.qty ?? 0),
          }));

          const totalFromServer = v.total ?? v.total_vendido ?? v.monto ?? null;
          const total =
            totalFromServer != null
              ? Number(String(totalFromServer).replace(/[^0-9.-]/g, "")) || 0
              : detalles.reduce((acc: number, det: any) => acc + (Number(det.cantidad) || 0) * 0, 0); // fallback 0

          const fecha =
            v.fecha_venta ??
            v.fecha_creacion ??
            v.fecha ??
            v.createdAt ??
            new Date().toISOString();

          return {
            id_venta: Number(v.id_venta ?? v.id ?? 0),
            detalles,
            total,
            fecha: String(fecha),
          };
        });

        setVentas(ventasNormalizadas);
      } finally {
        setLoadingVentas(false);
      }
    };

    fetchData();
    fetchVentas();
  }, []);

  const isToday = (dateString: string) => {
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return false;
      const today = new Date();
      return (
        d.getFullYear() === today.getFullYear() &&
        d.getMonth() === today.getMonth() &&
        d.getDate() === today.getDate()
      );
    } catch {
      return false;
    }
  };

  const totalInventario = productos.reduce((acc, p) => acc + (Number(p.unidades) || 0), 0);
  const stockBajoCount = productos.filter((p) => Number(p.unidades) < Number(p.minimoUnidades)).length;
  const stockBajoPercent = productos.length ? +(stockBajoCount / productos.length) * 100 : 0;

  const totalVendidoHoy = ventas
    .filter((v) => isToday(v.fecha))
    .reduce((acc, v) => acc + v.detalles.reduce((a, d) => a + (Number(d.cantidad) || 0), 0), 0);

  const totalProductosVendidos = ventas.reduce(
    (acc, v) => acc + v.detalles.reduce((a, d) => a + (Number(d.cantidad) || 0), 0),
    0
  );

  if (loading && loadingVentas) {
    return (
      <main className="flex items-center justify-center h-[60vh]">
        <div>Cargando dashboard...</div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center gap-10 px-4 sm:px-6 lg:px-10 py-3 lg:mx-50">
      <div className="grid w-full gap-5 grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 justify-items-center">
        <InfoCard
          title="Inventario total"
          icon={<BiBox className="size-7 text-neutral" />}
          data={totalInventario}
          percentage={Number.isFinite(stockBajoPercent) ? +stockBajoPercent.toFixed(1) : 0}
          description="Productos"
        />
        <InfoCard
          title="Vendido hoy"
          icon={<BiMoney className="size-7 text-confirm" />}
          data={totalVendidoHoy}
          percentage={totalInventario ? +((totalVendidoHoy / totalInventario) * 100).toFixed(1) : 0}
          description="Productos"
        />
        <InfoCard
          title="Productos vendidos"
          icon={<BiShoppingBag className="size-7 text-random" />}
          data={totalProductosVendidos}
          percentage={totalInventario ? +((totalProductosVendidos / totalInventario) * 100).toFixed(1) : 0}
          description="Productos"
        />
        <InfoCard
          title="Stock bajo"
          icon={<BiError className="size-7 text-danger" />}
          data={stockBajoCount}
          percentage={Number.isFinite(stockBajoPercent) ? +stockBajoPercent.toFixed(1) : 0}
          description="Productos"
        />
      </div>

      <div className="flex flex-col xl:flex-row gap-5 w-full justify-center items-start">
        <div className="w-full xl:w-3/5 bg-light-60 dark:bg-dark-30 p-5 rounded-2xl">
          <div className="flex justify-end mb-5">
            <Button className="bg-light-30 dark:bg-dark-60 text-foreground hover:bg-light-30/70 dark:hover:bg-dark-60/70 border-0 w-full sm:w-auto">
              <BiPlus className="size-5 text-foreground" />
              Agregar Productos
            </Button>
          </div>

          <div className="flex flex-col gap-4">
            {productos.length === 0 ? (
              <div className="text-sm text-muted-foreground">No hay productos para mostrar.</div>
            ) : (
              productos.slice(0, 4).map((p, i) => (
                <StockBajo
                  key={p.id ?? `stock-${i}`}
                  nombreProducto={p.name}
                  unidades={p.unidades}
                  minimoUnidades={p.minimoUnidades}
                />
              ))
            )}
          </div>
        </div>

        <div className="w-full xl:w-2/5 bg-light-60 dark:bg-dark-30 p-5 rounded-2xl">
          <div className="flex flex-col justify-start mb-5 gap-1">
            <p className="flex items-center text-2xl gap-3">
              <BiCart className="text-confirm size-7" />
              Ventas recientes
            </p>
            <p className="text-sm text-muted-foreground">Últimas transacciones del día</p>
          </div>

          <div className="flex flex-col h-fit">
            {ventas.length === 0 ? (
              <div className="text-sm text-muted-foreground">No hay ventas registradas.</div>
            ) : (
              ventas.slice(0, 6).map((v, i) => (
                <div key={v.id_venta ?? `venta-${i}`} className="flex flex-col gap-5">
                  <Venta
                    nombreProducto={`Venta ${v.id_venta}`}
                    horario={new Date(v.fecha).toLocaleTimeString()}
                    precio={v.total}
                    unidades={v.detalles.reduce((a, d) => a + (Number(d.cantidad) || 0), 0)}
                  />
                  {i < 5 && <Separator className="dark:bg-light-10 bg-dark-10" />}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="w-full bg-light-60 dark:bg-dark-30 rounded-2xl p-5 flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <BiMedal className="text-random size-7" />
          <p className="text-2xl font-medium">Acciones principales</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button className="bg-light-30 dark:bg-dark-60 w-full text-lg text-foreground hover:bg-light-30/70 dark:hover:bg-dark-60/70">
            <BiPlus className="size-6" />
            Nuevo Producto
          </Button>
          <Button className="bg-light-30 dark:bg-dark-60 w-full text-lg text-foreground hover:bg-light-30/70 dark:hover:bg-dark-60/70">
            <BiCart className="size-6" />
            Nueva Venta
          </Button>
        </div>
      </div>
    </main>
  );
}
