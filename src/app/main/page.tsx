// src/app/main/page.tsx
"use client";

import {
  BiBox,
  BiErrorCircle,
  BiMoney,
  BiShoppingBag,
  BiError,
  BiShow,
  BiCart,
  BiMedal,
  BiPlus,
} from "react-icons/bi";
import InfoCard from "@/components/info-card";
import { NavBar } from "@/components/navBar";
import { Button } from "@/components/ui/button";
import Venta from "@/components/sale-box";
import StockBajo from "@/components/product-box";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";

type Producto = {
  name: string;
  unidades: number;
  minimoUnidades: number;
  price: number;
  categoria: string;
  brand: string;
  id: number;
};

export default function MainPage() {
  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    fetch("/productos.json")
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => {
        console.warn("No se pudieron cargar productos de prueba:", err);
        setProductos([]);
      });
  }, []);

  return (
    <main className="flex flex-col items-center justify-center gap-10 px-4 sm:px-6 lg:px-10 py-3 lg:mx-50">
      {/* INFO CARDS */}
      <div className="grid w-full gap-5 grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 justify-items-center">
        <InfoCard
          title="Inventario total"
          icon={<BiBox className="size-7 text-neutral" />}
          data={1500}
          percentage={50}
          description="Productos"
        />
        <InfoCard
          title="Vendido hoy"
          icon={<BiMoney className="size-7 text-confirm" />}
          data={1500}
          percentage={20}
          description="Productos"
        />
        <InfoCard
          title="Productos vendidos"
          icon={<BiShoppingBag className="size-7 text-random" />}
          data={1500}
          percentage={20}
          description="Productos"
        />
        <InfoCard
          title="Stock bajo"
          icon={<BiError className="size-7 text-danger" />}
          data={1500}
          percentage={20}
          description="Productos"
        />
      </div>

      {/* STOCK BAJO Y VENTAS */}
      <div className="flex flex-col xl:flex-row gap-5 w-full justify-center items-start">
        {/* STOCK BAJO */}
        <div className="w-full xl:w-3/5 bg-light-60 dark:bg-dark-30 p-5 rounded-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
            <div className="flex flex-col items-start gap-1">
              <div className="flex items-center gap-3">
                <BiErrorCircle className="size-7 text-danger" />
                <p className="text-xl xl:text-2xl font-medium">
                  Productos con stock bajo
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Productos que deben reponerse lo antes posible
              </p>
            </div>
            <Button className="bg-light-30 dark:bg-dark-60 text-foreground hover:bg-light-30/70 dark:hover:bg-dark-60/70 border-0 w-full sm:w-auto">
              <BiShow className="size-5 text-foreground" />
              Ver todo
            </Button>
          </div>

          <div className="flex flex-col gap-4">
            {productos.slice(0, 4).map((p, i) => (
              <StockBajo
                key={p.id ?? `stock-${i}`}
                nombreProducto={p?.name}
                unidades={p?.unidades}
                minimoUnidades={p?.minimoUnidades}
              />
            ))}
          </div>
        </div>

        {/* VENTAS RECIENTES */}
        <div className="w-full xl:w-2/5 bg-light-60 dark:bg-dark-30 p-5 rounded-2xl">
          <div className="flex flex-col justify-start mb-5 gap-1">
            <p className="flex items-center text-2xl gap-3">
              <BiCart className="text-confirm size-7" />
              Ventas recientes
            </p>
            <p className="text-sm text-muted-foreground">
              Últimas transacciones del día
            </p>
          </div>

          <div className="flex flex-col h-fit">
            {productos.slice(0, 6).map((p, i) => (
              <div key={p.id ?? `venta-${i}`} className="flex flex-col gap-5">
                <Venta
                  nombreProducto={p?.name}
                  horario="15:00"
                  precio={p?.price}
                  unidades={Math.floor(Math.random() * 10) + 1}
                />
                {i < 5 && <Separator className="dark:bg-light-10 bg-dark-10" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ACCIONES PRINCIPALES */}
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
