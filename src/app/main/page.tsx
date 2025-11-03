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
import { ventasService } from "@/app/Service/ventas/VentasService";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const prods = await productoService.getAll();
        const productosNormalizados = prods.map((p) => ({
          id: p.id_producto ?? p.id ?? 0,
          name: p.nombre ?? "Sin nombre",
          unidades: p.stock?.[0]?.cantidad ?? 0,
          minimoUnidades: p.stock?.[0]?.cantidad_min ?? 0,
          price: Number(p.precio ?? 0),
          categoria: p.categoria ?? "Sin categoría",
          brand: p.marca ?? "Sin marca",
        }));
        setProductos(productosNormalizados);

        const ventasData = await ventasService.getAll();
        const ventasNormalizadas: VentaInfo[] = ventasData.map((v: any) => ({
          id_venta: Number(v.id_venta),
          detalles: Array.isArray(v.detalles)
            ? v.detalles.map((d) => ({
                id_producto: Number(d.id_producto),
                cantidad: Number(d.cantidad),
              }))
            : [],
          total: Number(v.total ?? 0),
          fecha: v.fecha_venta ?? v.fecha ?? new Date().toISOString(),
        }));
        setVentas(ventasNormalizadas);
      } catch (err) {
        console.error("Error cargando datos:", err);
        setProductos([]);
        setVentas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const isToday = (dateString: string) => {
    const d = new Date(dateString);
    const today = new Date();
    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  };

  const totalInventario = productos.reduce((acc, p) => acc + p.unidades, 0);
  const stockBajoCount = productos.filter((p) => p.unidades < p.minimoUnidades)
    .length;
  const stockBajoPercent = productos.length
    ? (stockBajoCount / productos.length) * 100
    : 0;

  const totalVendidoHoy = ventas
    .filter((v) => isToday(v.fecha))
    .reduce(
      (acc, v) => acc + v.detalles.reduce((a, d) => a + d.cantidad, 0),
      0
    );

  const totalProductosVendidos = ventas.reduce(
    (acc, v) => acc + v.detalles.reduce((a, d) => a + d.cantidad, 0),
    0
  );

  return (
    <main className="flex flex-col items-center justify-center gap-10 px-4 sm:px-6 lg:px-10 py-3 lg:mx-50">
      <div className="grid w-full gap-5 grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 justify-items-center">
        <InfoCard
          title="Inventario total"
          icon={<BiBox className="size-7 text-neutral" />}
          data={totalInventario}
          percentage={stockBajoPercent}
          description="Productos"
        />
        <InfoCard
          title="Vendido hoy"
          icon={<BiMoney className="size-7 text-confirm" />}
          data={totalVendidoHoy}
          percentage={productos.length ? (totalVendidoHoy / totalInventario) * 100 : 0}
          description="Productos"
        />
        <InfoCard
          title="Productos vendidos"
          icon={<BiShoppingBag className="size-7 text-random" />}
          data={totalProductosVendidos}
          percentage={productos.length ? (totalProductosVendidos / totalInventario) * 100 : 0}
          description="Productos"
        />
        <InfoCard
          title="Stock bajo"
          icon={<BiError className="size-7 text-danger" />}
          data={stockBajoCount}
          percentage={stockBajoPercent}
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
            {productos.slice(0, 4).map((p, i) => (
              <StockBajo
                key={p.id ?? `stock-${i}`}
                nombreProducto={p.name}
                unidades={p.unidades}
                minimoUnidades={p.minimoUnidades}
              />
            ))}
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
            {ventas.slice(0, 6).map((v, i) => (
              <div key={v.id_venta ?? `venta-${i}`} className="flex flex-col gap-5">
                <Venta
                  nombreProducto={`Venta ${v.id_venta}`}
                  horario={new Date(v.fecha).toLocaleTimeString()}
                  precio={v.total}
                  unidades={v.detalles.reduce((a, d) => a + d.cantidad, 0)}
                />
                {i < 5 && <Separator className="dark:bg-light-10 bg-dark-10" />}
              </div>
            ))}
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
