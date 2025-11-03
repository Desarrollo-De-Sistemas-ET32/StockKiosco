"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "@/components/ui/search";
import { BiChevronDown, BiChevronUp, BiMoneyWithdraw, BiTrashAlt } from "react-icons/bi";
import ventasService from "@/app/Service/ventas/VentasService";
import { productoService } from "@/app/Service/producto/ProductoService";

export default function ChequePage() {
  const [showPopup, setShowPopup] = useState(false);
  const [showAplicarMenu, setShowAplicarMenu] = useState(false);
  const [venta, setVenta] = useState<any>(null); // ahora venta.detalles vendrá de productoService
  const [productosAgregados, setProductosAgregados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Obtener productos reales desde la API (productoService)
        const productos = await productoService.getAll();

        // Normalizar para usar en el popup: nos interesa id_producto, nombre, precio, codigo_barra
        const detalles = productos.map((p: any) => ({
          id_producto: Number(p.id_producto ?? p.id ?? 0),
          nombre: p.nombre ?? p.title ?? "",
          precio: Number((p.precio ?? "0").toString().replace(/[^0-9.-]/g, "")) || 0,
          codigo_barra: p.codigo_barra ?? p.barcode ?? "",
          // cantidad por defecto para agregar desde el popup
          cantidad: 1,
        }));

        setVenta({ detalles });
      } catch (err) {
        console.error("Error al cargar productos desde productoService:", err);
        setError("Error al cargar los productos.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAgregarProducto = (detalle: any) => {
    // si ya existe, no lo agregamos (puedes cambiar lógica para sumar cantidades)
    if (!productosAgregados.find((p) => p.id_producto === detalle.id_producto)) {
      setProductosAgregados((prev) => [...prev, { ...detalle }]);
    }
    setShowPopup(false);
  };

  const handleEliminarProducto = (id_producto: number) => {
    setProductosAgregados((prev) => prev.filter((p) => p.id_producto !== id_producto));
  };

  const handleCrearVenta = async () => {
    if (productosAgregados.length === 0) return alert("No hay productos en la venta.");

    setProcessing(true);
    setError(null);
    setSuccessMsg(null);

    const nuevaVenta = {
      id_usuario: 1, // TODO: reemplazar con usuario real (sesión)
      detalles: productosAgregados.map((p) => ({
        id_producto: Number(p.id_producto),
        cantidad: Number(p.cantidad),
      })),
      pagado: true,
    };

    const result = await ventasService.create(nuevaVenta);

    if (result.success) {
      setSuccessMsg("Venta creada correctamente ✅");
      setProductosAgregados([]);
    } else {
      setError(result.error || "Error al crear la venta");
      console.error("Error al crear venta:", result.details ?? result.error);
    }

    setProcessing(false);
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
                  {producto.codigo_barra ?? "—"}
                </span>
                <span className="text-white text-sm font-medium w-[45%]">
                  {producto.nombre ?? "Producto sin nombre"}
                </span>
                <span className="text-white text-sm w-[15%] text-center">
                  {producto.cantidad} Unidades
                </span>
                <span className="text-white text-sm w-[15%] text-right">
                  ${((producto.precio ?? 0) * producto.cantidad).toFixed(2)}
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
              <div
                onClick={handleCrearVenta}
                className={`w-full h-12 rounded-md flex items-center justify-center ${
                  processing
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-neutral-800 hover:bg-neutral-700 cursor-pointer"
                } transition-colors mb-2`}
              >
                {processing ? "Procesando..." : "Confirmar Venta"}
              </div>
            </div>
          </div>

          <div
            className="w-full h-25 bg-var7 dark:bg-var1 rounded-md flex items-center justify-center hover:bg-green-400 transition-colors mt-4 cursor-pointer"
            onClick={handleCrearVenta}
          >
            <BiMoneyWithdraw className="size-10" />
          </div>

          {error && (
            <p className="text-red-500 text-sm mt-3 text-center">{error}</p>
          )}
          {successMsg && (
            <p className="text-green-500 text-sm mt-3 text-center">
              {successMsg}
            </p>
          )}
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
              ) : venta && Array.isArray(venta.detalles) ? (
                venta.detalles.map((detalle: any, index: number) => (
                  <div
                    key={index}
                    onClick={() => handleAgregarProducto(detalle)}
                    className="w-full bg-var1 hover:bg-foreground/20 transition-colors rounded-md flex items-center justify-between p-3 mb-2 cursor-pointer"
                  >
                    <span className="text-sm text-foreground">
                      ID Producto: {detalle.id_producto}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {detalle.nombre ?? `Producto ${detalle.id_producto}`}
                    </span>
                    <span className="text-sm text-foreground">
                      ${detalle.precio?.toFixed ? detalle.precio.toFixed(2) : detalle.precio}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-foreground text-sm">
                  No se pudo cargar la lista de productos.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
