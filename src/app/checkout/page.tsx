"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "@/components/ui/search";
import {
  BiChevronDown,
  BiChevronUp,
  BiMoneyWithdraw,
  BiTrashAlt,
  BiCheck,
} from "react-icons/bi";
import ventasService from "@/app/Service/ventas/VentasService";
import { productoService } from "@/app/Service/producto/ProductoService";
import descuentoService from "@/app/Service/descuento/DescuentoService";

export default function ChequePage() {
  const [showPopup, setShowPopup] = useState(false);
  const [showAplicarMenu, setShowAplicarMenu] = useState(false);
  const [venta, setVenta] = useState<any>(null);
  const [productosAgregados, setProductosAgregados] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [saleSuccess, setSaleSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [descuentos, setDescuentos] = useState<any[]>([]);
  const [loadingDescuentos, setLoadingDescuentos] = useState(false);
  const [appliedDescuentoId, setAppliedDescuentoId] = useState<number | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productos = await productoService.getAll();
        const detalles = productos.map((p: any) => ({
          id_producto: Number(p.id_producto ?? p.id ?? 0),
          nombre: p.nombre ?? p.title ?? "",
          precio: Number((p.precio ?? "0").toString().replace(/[^0-9.-]/g, "")) || 0,
          codigo_barra: p.codigo_barra ?? p.barcode ?? "",
          cantidad: 1,
        }));
        setVenta({ detalles });
      } catch (err) {
        console.error("Error al cargar productos:", err);
        setError("Error al cargar los productos.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!showAplicarMenu || descuentos.length > 0) return;
    (async () => {
      setLoadingDescuentos(true);
      try {
        const list = await descuentoService.getAll();
        setDescuentos(list);
      } catch (err: any) {
        console.error("Error cargando descuentos:", err);
        setError("No se pudieron cargar los descuentos.");
        setDescuentos([]); // fallback para no romper la UI
      } finally {
        setLoadingDescuentos(false);
      }
    })();
  }, [showAplicarMenu, descuentos.length]);

  const handleAgregarProducto = (detalle: any) => {
    if (!productosAgregados.find((p) => p.id_producto === detalle.id_producto)) {
      setProductosAgregados((prev) => [...prev, { ...detalle }]);
    }
  };

  const handleEliminarProducto = (id_producto: number) => {
    setProductosAgregados((prev) => prev.filter((p) => p.id_producto !== id_producto));
  };

  const handleToggleDescuento = (id: number) => {
    setAppliedDescuentoId((prev) => (prev === id ? null : id));
  };

  const handleCrearVenta = async () => {
    if (productosAgregados.length === 0) return alert("No hay productos en la venta.");

    setProcessing(true);
    setError(null);
    setSuccessMsg(null);

    const nuevaVenta = {
      id_usuario: 1,
      detalles: productosAgregados.map((p) => ({ id_producto: Number(p.id_producto), cantidad: Number(p.cantidad) })),
      pagado: true,
      descuento_aplicado: appliedDescuentoId ?? null,
    };

    try {
      const result = await ventasService.create(nuevaVenta);
      if (result.success) {
        setSuccessMsg("Venta creada correctamente ✅");
        setProductosAgregados([]);
        setSaleSuccess(true);
        setTimeout(() => setSaleSuccess(false), 1500);
      } else {
        setError(result.error || "Error al crear la venta");
        console.error(result.details);
      }
    } catch (err: any) {
      console.error("Excepción al crear venta:", err);
      setError(err?.message ?? "Error al crear la venta");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main className="h-[80vh] flex flex-col mx-25">
      <div className="grid grid-cols-[3fr_1fr] gap-6 p-4 h-full">
        <div className="bg-light-60 dark:bg-dark-30 rounded-xl p-6 drop-shadow-xl flex flex-col items-center justify-start gap-4 overflow-y-auto">
          <Button
            className="w-full h-16 text-xl font-medium dark:bg-dark-60 dark:hover:bg-neutral-900 dark:text-white bg-light-30 mb-4"
            onClick={() => setShowPopup(true)}
          >
            Agregar Productos
          </Button>

          {productosAgregados.length === 0 ? (
            <h1 className="pb-10 text-black dark:text-white text-center">
              No hay Productos en esta Venta
            </h1>
          ) : (
            productosAgregados.map((producto, index) => (
              <div
                key={producto.id_producto ?? index}
                className="w-full dark:bg-dark-10 dark:hover:bg-neutral-900 transition-colors rounded-lg flex items-center justify-between p-4"
              >
                <span className="text-sm text-gray-400 w-[15%]">{producto.codigo_barra ?? "—"}</span>
                <span className="text-white text-sm font-medium w-[45%]">{producto.nombre ?? "Producto sin nombre"}</span>
                <span className="text-white text-sm w-[15%] text-center">{producto.cantidad} Unidades</span>
                <span className="text-white text-sm w-[15%] text-right">${((producto.precio ?? 0) * producto.cantidad).toFixed(2)}</span>
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

        <div className="bg-light-60 dark:bg-dark-30 rounded-xl p-4 drop-shadow-xl flex flex-col">
          <div className="w-full bg-light-30 dark:bg-dark-30 rounded-md flex flex-col items-center transition-all cursor-pointer overflow-hidden">
            <div
              onClick={() => setShowAplicarMenu(!showAplicarMenu)}
              className="flex justify-center items-center h-15 w-full dark:hover:bg-neutral-900 transition-colors dark:bg-dark-60"
            >
              <h2 className="text-foreground text-xl">Aplicar</h2>
              {showAplicarMenu ? <BiChevronUp className="size-8" /> : <BiChevronDown className="size-8" />}
            </div>

            <div className={`w-full transition-[max-height,padding] duration-300 ease-in-out ${showAplicarMenu ? "max-h-60 p-3" : "max-h-0 p-0"}`}>
              {loadingDescuentos ? (
                <div className="text-sm text-muted-foreground p-2">Cargando descuentos...</div>
              ) : descuentos.length === 0 ? (
                <div className="text-sm text-muted-foreground p-2">No hay descuentos disponibles.</div>
              ) : (
                <div className="space-y-2">
                  {descuentos.map((d: any) => (
                    <div
                      key={d.id_descuento ?? d.id}
                      className={`flex items-center justify-between p-2 rounded-md cursor-pointer border bg-light-10 dark:bg-dark-60 hover:bg-light-60 hover:dark:bg-neutral-800 transition-colors ${
                        appliedDescuentoId === Number(d.id_descuento ?? d.id)
                          ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30"
                          : "border-transparent hover:border-var3"
                      }`}
                      onClick={() => handleToggleDescuento(Number(d.id_descuento ?? d.id))}
                    >
                      <div>
                        <div className="font-medium">{d.nombre}</div>
                        <div className="text-xs text-muted-foreground">{d.tipo} — {Number(d.valor).toFixed(2)}</div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {appliedDescuentoId === Number(d.id_descuento ?? d.id) ? "Aplicado" : "Aplicar"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div
            className={`w-full h-25 mt-4 rounded-md flex items-center justify-center transition-colors ${processing ? "bg-gray-500 cursor-not-allowed" : "bg-light-30 dark:bg-dark-60 hover:bg-green-400 cursor-pointer"}`}
            onClick={() => { if (!processing) handleCrearVenta(); }}
            aria-disabled={processing}
          >
            {processing ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeOpacity="0.25" />
                  <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                </svg>
                <span>Procesando...</span>
              </div>
            ) : saleSuccess ? (
              <div className="flex items-center gap-2 text-emerald-500">
                <BiCheck className="size-6"/>
                <span>Listo</span>
              </div>
            ) : (
              <BiMoneyWithdraw className="size-10" />
            )}
          </div>

          {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}
          {successMsg && <p className="text-green-500 text-sm mt-3 text-center">{successMsg}</p>}
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50" onClick={() => setShowPopup(false)}>
          <div className="bg-light-60 dark:bg-dark-30 rounded-xl p-6 w-[500px] h-[500px] shadow-2xl flex flex-col items-start justify-start relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <Search
              id="search-producto"
              placeholder="Buscar nombre de Producto"
              className="w-full bg-light-30 dark:bg-dark-10 text-foreground border-0 focus:ring-0"
              label=""
            />
            <div className="mt-4 w-full overflow-y-auto">
              {loading ? (
                <p className="text-foreground text-sm">Cargando...</p>
              ) : venta && Array.isArray(venta.detalles) ? (
                venta.detalles.map((detalle: any, index: number) => (
                  <div
                    key={detalle.id_producto ?? index}
                    onClick={() => handleAgregarProducto(detalle)}
                    className="w-full bg-light-30 dark:bg-dark-10 hover:bg-light-10 transition-colors rounded-md flex items-center justify-between p-3 mb-2 cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm text-foreground">ID Producto: {detalle.id_producto}</span>
                      <span className="text-sm font-medium text-foreground">{detalle.nombre ?? `Producto ${detalle.id_producto}`}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-foreground">${detalle.precio?.toFixed ? detalle.precio.toFixed(2) : detalle.precio}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleAgregarProducto(detalle); }}
                        className="px-3 py-1 bg-light-10 text-white rounded"
                      >
                        Agregar
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-foreground text-sm">No se pudo cargar la lista de productos.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
