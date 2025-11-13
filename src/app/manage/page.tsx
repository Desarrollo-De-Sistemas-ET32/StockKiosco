'use client'
import Link from "next/link"
import { useEffect } from "react";

export default function Gestion() {

  useEffect(() => {
    document.title = "Gestionar | Kiosco";
  }, []);

  return (
    <div className="w-full flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-8">

        <Link href="/gestionar_proveedores" className="flex flex-col gap-5 bg-light-60 dark:bg-dark-60 rounded-[40px] overflow-hidden shadow-lg hover:scale-[1.02] transition-transform cursor-pointer p-[25px]">
          <img
            src={"/img/proveedor.jpg"}
            alt="Proveedores"
            className="w-full h-fit object-cover rounded-[15px]"
          ></img>
          <div className="flex justify-center">
            <h2 className="text-foreground font-semibold text-xl tracking-wide">PROVEEDORES</h2>
          </div>
        </Link>

        <Link href="/gestionar_descuentos" className="flex flex-col gap-5 bg-light-60 dark:bg-dark-60 rounded-[40px] overflow-hidden shadow-lg hover:scale-[1.02] transition-transform cursor-pointer p-[25px]">
          <img
            src={"/img/descuentos.jpg"}
            alt="Descuentos"
            className="w-full h-full object-cover rounded-[15px]"
          ></img>
          <div className="flex justify-center">
            <h2 className="text-foreground font-semibold text-xl tracking-wide">DESCUENTOS</h2>
          </div>
        </Link>

      </div>
    </div>
  );
}
