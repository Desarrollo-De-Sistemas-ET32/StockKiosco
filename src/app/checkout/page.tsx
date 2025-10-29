"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "@/components/ui/search";
import { BiChevronDown, BiChevronUp, BiMoneyWithdraw } from "react-icons/bi";
import { BiTrashAlt } from "react-icons/bi";

export default function ChequePage() {
  const [showPopup, setShowPopup] = useState(false);
  const [showAplicarMenu, setShowAplicarMenu] = useState(false);
  const [venta, setVenta] = useState(null); 
  const [productosAgregados, setProductosAgregados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/data/venta.json");
        const data = await res.json();
        setVenta(data);
      } catch (error) {
        console.error("Error al cargar el JSON:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAgregarProducto = (detalle) => {
    if (!productosAgregados.find((p) => p.id_producto === detalle.id_producto)) {
      setProductosAgregados((prev) => [...prev, detalle]);
    }
    setShowPopup(false);
  };

  const handleEliminarProducto = (id_producto) => {
    setProductosAgregados((prev) =>
      prev.filter((p) => p.id_producto !== id_producto)
    );
  };

  return (
    <main className="h-screen flex flex-col mx-25">
      <div className="grid grid-cols-[3fr_1fr] gap-6 p-4 h-full">
        <div className="bg-var5 dark:bg-var2 rounded-xl p-6 drop-shadow-xl flex flex-col items-center justify-center gap-4">
          {productosAgregados.length === 0 ? (
            <>
              <h1 className="pb-10 text-black dark:text-white">
                No hay Productos en esta Venta
              </h1>

              <Button
                className="w-xs h-16 text-xl font-medium dark:bg-var1 dark:hover:bg-neutral-900 dark:text-white bg-var6 hover:bg-var3 hover:text-white"
                onClick={() => setShowPopup(true)}
              >
                Agregar Productos
              </Button>
            </>
          ) : (
            productosAgregados.map((producto, index) => (
              <div
                key={index}
                className="w-full dark:bg-var1 dark:hover:bg-neutral-900 transition-colors rounded-lg flex items-center justify-between p-4"
              >
                <span className="text-sm text-gray-400 w-[15%]">
                  {`{codigo_barra}`}
                </span>
                <span className="text-white text-sm font-medium w-[45%]">
                  Gaseosa Coca Cola Sabor Original 600mL
                </span>
                <span className="text-white text-sm w-[15%] text-center">
                  {producto.cantidad} Unidades
                </span>
                <span className="text-white text-sm w-[15%] text-right">
                  ${producto.cantidad * 1700},00
                </span>
                <button
                  className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition-colors ml-3 hover:cursor-pointer"
                  onClick={() => handleEliminarProducto(producto.id_producto)}
                >
                  <BiTrashAlt className="size-4" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="bg-var5 dark:bg-var2 rounded-xl p-4 drop-shadow-xl flex flex-col">
          <div className="w-full bg-var7 dark:bg-var1 rounded-md flex flex-col items-center transition-all cursor-pointer overflow-hidden">
            <div
              onClick={() => setShowAplicarMenu(!showAplicarMenu)}
              className="flex justify-center items-center h-15 w-full dark:hover:bg-neutral-900 transition-colors"
            >
              <h2 className="text-foreground text-xl">Aplicar</h2>
              {showAplicarMenu ? (
                <BiChevronUp className="size-8" />
              ) : (
                <BiChevronDown className="size-8" />
              )}
            </div>

            <div
              className={`w-full transition-[max-height,padding] duration-300 ease-in-out ${
                showAplicarMenu ? "max-h-60 p-3" : "max-h-0 p-0"
              }`}
            >
              <div className="w-full h-12 bg-neutral-800 rounded-md hover:bg-neutral-700 transition-colors cursor-pointer mb-2"></div>

            </div>
          </div>

          <div className="w-full h-25 bg-var7 dark:bg-var1 rounded-md flex items-center justify-center hover:bg-green-400 transition-colors mt-4">
            <BiMoneyWithdraw className="size-10" />
          </div>
        </div>
      </div>

      {showPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="bg-var5 dark:bg-var2 rounded-xl p-6 w-[500px] h-[500px] shadow-2xl flex flex-col items-start justify-start relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Search
              id="search-producto"
              placeholder="Buscar nombre de Producto"
              className="w-full bg-background dark:bg-background text-foreground border-0 focus:ring-0"
              label=""
            />

            <div className="mt-4 w-full overflow-y-auto">
              {loading ? (
                <p className="text-foreground text-sm">Cargando...</p>
              ) : venta ? (
                venta.detalles.map((detalle, index) => (
                  <div
                    key={index}
                    onClick={() => handleAgregarProducto(detalle)}
                    className="w-full bg-var1 hover:bg-foreground/20 transition-colors rounded-md flex items-center justify-between p-3 mb-2 cursor-pointer"
                  >
                    <span className="text-sm text-foreground">
                      ID Producto: {detalle.id_producto}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      Cantidad: {detalle.cantidad}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-foreground text-sm">
                  No se pudo cargar la venta.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
