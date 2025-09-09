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
import { NavigationMenuDemo } from "@/components/navBar";
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

export default function Menu() {

  const [productos, setProductos] = useState<Producto[]>([]);

  useEffect(() => {
    fetch('/productos.json')
      .then(res => res.json())
      .then(data => setProductos(data));
  }, []);

  productos.map((producto) => {
    console.log(producto.price);
    console.log("hola");
  });

  
  return (
    <main className="flex justify-start items-center h-screen flex-col p-4 gap-15">
      <div className="w-full flex justify-center text-sm text-muted-foreground">
        <NavigationMenuDemo></NavigationMenuDemo>
      </div>
      <div className="max-h-fit w-fit xl:w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 justify-items-center">
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
      <div className="w-full flex flex-col xl:flex-row gap-5 justify-center items-start">
        <div className="w-full h-fit bg-var7 dark:bg-var2 p-5 rounded-2xl">
          <div className="flex flex-row justify-between items-center mb-5">
            <div className="flex flex-col justify-start items-start gap-1">
              <div className="flex justify-center items-center gap-5">
                <BiErrorCircle className="size-7 text-danger" />
                <p className="text-xl xl:text-3xl flex items-center gap-5">
                  Productos con stock bajo
                </p>
              </div>
              <p className="text-sm">
                Productos que deben reponerse lo antes posible
              </p>
            </div>
            <Button className="bg-var5 dark:bg-var1 text-foreground hover:bg-var5/50 dark:hover:bg-var1/50 border-0">
              <BiShow className="size-5 text-foreground"></BiShow>
              Ver todo
            </Button>
          </div>
          <div className="w-full h-fit gap-5 flex flex-col flex-wrap">
            <div className="max-h-fit flex flex-col gap-5">
              <StockBajo
                nombreProducto={productos[0]?.name}
                unidades={productos[0]?.unidades}
                minimoUnidades={productos[0]?.minimoUnidades}
              ></StockBajo>
              <StockBajo
                nombreProducto={productos[1]?.name}
                unidades={productos[1]?.unidades}
                minimoUnidades={productos[1]?.minimoUnidades}
              ></StockBajo>
              
              <StockBajo
                nombreProducto={productos[2]?.name}
                unidades={productos[2]?.unidades}
                minimoUnidades={productos[2]?.minimoUnidades}
              ></StockBajo>
              <StockBajo
                nombreProducto={productos[3]?.name}
                unidades={productos[3]?.unidades}
                minimoUnidades={productos[3]?.minimoUnidades}
              ></StockBajo>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full xl:w-2/4 h-fit bg-var7 dark:bg-var2 p-5 rounded-2xl">
          <div className="flex flex-col justify-start mb-5 gap-1">
            <p className="flex justify-start items-center text-2xl gap-5">
              <BiCart className="text-confirm size-7" />
              Ventas recientes
            </p>
            <p className="text-sm">Últimas transacciones del día</p>
          </div>
          <div className="w-full h-full gap-5 flex flex-col">
            <Venta
              nombreProducto={productos[0]?.name}
              horario="15:00"
              precio={productos[0]?.price}
              unidades={1}
            ></Venta>
            <Separator className="bg-var6"></Separator>
            <Venta
              nombreProducto={productos[1]?.name}
              horario="15:00"
              precio={productos[1]?.price}
              unidades={13}
            ></Venta>
            <Separator className="bg-var6"></Separator>
            <Venta
              nombreProducto={productos[2]?.name}
              horario="15:00"
              precio={productos[2]?.price}
              unidades={15}
            ></Venta>
            <Separator className="bg-var6"></Separator>
            <Venta
              nombreProducto={productos[3]?.name}
              horario="15:00"
              precio={productos[3]?.price}
              unidades={5}
            ></Venta>
            <Separator className="bg-var6"></Separator>
            <Venta
              nombreProducto={productos[4]?.name}
              horario="15:00"
              precio={productos[4]?.price}
              unidades={3}
            ></Venta>
            <Separator className="bg-var6"></Separator>
            <Venta
              nombreProducto={productos[0]?.name}
              horario="15:00"
              precio={productos[0]?.price}
              unidades={2}
            ></Venta>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col bg-var7 dark:bg-var2 rounded-2xl p-4">
        <div className="flex flex-col justify-center items-start">
          <p className="text-2xl text-center justify-center items-center flex gap-5">
            <BiMedal className="text-random size-7" />
            Acciones principales
          </p>
        </div>
        <div className="grid grid-cols-1 justify-items-center gap-5 mt-5 sm:grid-cols-2">
          <Button className="bg-var6 dark:bg-var1 w-full h-fit text-xl">
            <BiPlus className="size-7" />
            Nuevo Producto
          </Button>
          <Button className="bg-var6 dark:bg-var1 w-full h-fit text-xl">
            <BiCart className="size-7" />
            Nueva Venta
          </Button>
        </div>
      </div>
    </main>
  );
}
