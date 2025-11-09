"use client";

import { useEffect } from "react";

export default function Gestion() {
  useEffect(() => {
    document.title = "Menu de Gestion | Kiosco";
  }, []);

  return (
    <div className="w-full flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">


        <div className="flex flex-col gap-5 bg-light-60 dark:bg-dark-60 rounded-[40px] overflow-hidden shadow-lg hover:scale-[1.02] transition-transform cursor-pointer p-[25px]">
          <img
            src={"/img/proveedor.jpg"}
            alt="Proveedores"
            className="w-full h-fit object-cover rounded-[15px]"
          />
          <div className="flex justify-center">
            <span className="text-foreground font-semibold text-xl tracking-wide">
              <a href="/main">PROVEEDORES</a>
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-5 bg-light-60 dark:bg-dark-60 rounded-[40px] overflow-hidden shadow-lg hover:scale-[1.02] transition-transform cursor-pointer p-[25px]">
          <img
            src={"/img/descuentos.jpg"}
            alt="Descuentos"
            className="w-full h-full object-cover rounded-[15px]"
          />
          <div className="flex justify-center">
            <span className="text-foreground font-semibold text-xl tracking-wide">
              <a href="/gestionar_descuentos">DESCUENTOS</a>
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-5 bg-light-60 dark:bg-dark-60 rounded-[40px] overflow-hidden shadow-lg hover:scale-[1.02] transition-transform cursor-pointer p-[25px]">
          <img
            src={"/img/productos.jpg"}
            alt="Productos"
            className="w-full h-full object-cover rounded-[15px]"
          />
          <div className="flex justify-center">
            <span className="text-foreground font-semibold text-xl tracking-wide">
              <a href="/gestionar_productos">PRODUCTOS</a>
            </span>
          </div>
        </div>
        
      </div>
    </div>
  );
}
