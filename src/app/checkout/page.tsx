"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "@/components/ui/search";
import {
  BiChevronDown,
  BiChevronUp,
  BiMoneyWithdraw,
  BiTrashAlt,
  BiCheck,
  BiPlus,
  BiMinus,
} from "react-icons/bi";
import ventasService from "@/app/Service/ventas/VentasService";
import { productoService } from "@/app/Service/producto/ProductoService";
import descuentoService from "@/app/Service/descuento/DescuentoService";

export default function ChequePage() {
  // estados...
  const [showPopup, setShowPopup] = useState(false);
  const [showAplicarMenu, setShowAplicarMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [saleSuccess, setSaleSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [productosDisponibles, setProductosDisponibles] = useState<any[]>([]);
  const [productosAgregados, setProductosAgregados] = useState<any[]>([]);
  const [descuentos, setDescuentos] = useState<any[]>([]);
  const [loadingDescuentos, setLoadingDescuentos] = useState(false);
  const [appliedDescuentoId, setAppliedDescuentoId] = useState<number | null>(null);


  useEffect(() => {
    document.title = "Checkout | Kiosco"
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const productos = await productoService.getAll();

        const detalles = productos
          .map((p: any) => {
            const stockArray = Array.isArray(p.stock) ? p.stock : [];
            const totalStock =
              stockArray.length > 0
                ? stockArray.reduce((acc: number, s: any) => acc + Number(s.cantidad ?? 0), 0)
                : undefined;

            return {
              id_producto: Number(p.id_producto ?? p.id ?? 0),
              nombre: p.nombre ?? p.title ?? `Producto ${p.id_producto ?? p.id ?? ""}`,
              precio: Number(String(p.precio ?? "0").replace(/[^0-9.-]/g, "")) || 0,
              codigo_barra: p.codigo_barra ?? p.barcode ?? "",
              cantidad: 1,
              stock: typeof totalStock === "number" ? totalStock : undefined,
              raw: p,
            };
          })
          .filter((p: any) => {
            if (typeof p.stock === "number") return p.stock > 0;
            return true;
          });

        setProductosDisponibles(detalles);
      } catch (err) {
        console.error("Error al cargar productos:", err);
        setError("Error al cargar los productos.");
        setProductosDisponibles([]);
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
        setDescuentos(list ?? []);
      } catch (err: any) {
        console.error("Error cargando descuentos:", err);
        setError("No se pudieron cargar los descuentos.");
        setDescuentos([]);
      } finally {
        setLoadingDescuentos(false);
      }
    })();
  }, [showAplicarMenu, descuentos.length]);

  const applyOrToggleDescuento = (id: number) => {
    setAppliedDescuentoId((prev) => (prev === id ? null : id));
  };

  const handleAgregarProducto = (detalle: any) => {
    setProductosAgregados((prev) => {
      const found = prev.find((p) => p.id_producto === detalle.id_producto);
      if (!found) {
        return [...prev, { ...detalle, cantidad: 1 }];
      } else {
        const stock = detalle.stock;
        const nuevaQty = found.cantidad + 1;
        if (typeof stock === "number" && nuevaQty > stock) return prev;
        return prev.map((p) => (p.id_producto === detalle.id_producto ? { ...p, cantidad: nuevaQty } : p));
      }
    });
  };

  const handleEliminarProducto = (id_producto: number) => {
    setProductosAgregados((prev) => prev.filter((p) => p.id_producto !== id_producto));
  };

  const handleChangeCantidad = (id_producto: number, nuevaCantidad: number) => {
    if (nuevaCantidad < 0) return;
    setProductosAgregados((prev) =>
      prev.map((p) => {
        if (p.id_producto !== id_producto) return p;
        const stock = p.stock;
        if (typeof stock === "number" && nuevaCantidad > stock) {
          return { ...p, cantidad: stock };
        }
        return { ...p, cantidad: nuevaCantidad };
      })
    );
  };

  const discountObj = useMemo(() => {
    if (!appliedDescuentoId) return null;
    return descuentos.find((d) => Number(d.id_descuento ?? d.id) === Number(appliedDescuentoId)) ?? null;
  }, [appliedDescuentoId, descuentos]);

  const calculation = useMemo(() => {
    const subtotal = productosAgregados.reduce((acc, p) => acc + (Number(p.precio || 0) * Number(p.cantidad || 0)), 0);
    let descuentoValor = 0;
    let total = subtotal;

    if (discountObj) {
      const tipo = (discountObj.tipo ?? "").toString().toLowerCase();
      const val = Number(discountObj.valor ?? 0);
      if (val > 0) {
        if (tipo.includes("porc") || tipo.includes("percent") || tipo.includes("%")) {
          descuentoValor = subtotal * (val / 100);
          total = Math.max(0, subtotal - descuentoValor);
        } else {
          descuentoValor = Math.min(subtotal, val);
          total = Math.max(0, subtotal - descuentoValor);
        }
      }
    }

    return { subtotal, descuentoValor, total };
  }, [productosAgregados, discountObj]);

  const crearVenta = async () => {
    if (productosAgregados.length === 0) {
      alert("No hay productos en la venta.");
      return;
    }

    for (const p of productosAgregados) {
      if (typeof p.stock === "number" && p.cantidad > p.stock) {
        setError(`Stock insuficiente para ${p.nombre}. Disponible: ${p.stock}`);
        return;
      }
    }

    setProcessing(true);
    setError(null);
    setSuccessMsg(null);

    const payload = {
      id_usuario: 1,
      detalles: productosAgregados.map((p) => ({ id_producto: Number(p.id_producto), cantidad: Number(p.cantidad) })),
      pagado: true,
      descuento_aplicado: appliedDescuentoId ?? null,
    };

    try {
      const result = await ventasService.create(payload);
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
    <>
      {/* CSS local: oculta los spinners de los input number para que no haya "doble control" */}
      <style>{`
        /* Chrome, Safari, Edge, Opera */
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        /* Firefox */
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>

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
              <h1 className="pb-10 text-black dark:text-white text-center">No hay Productos en esta Venta</h1>
            ) : (
              productosAgregados.map((producto, index) => {
                const precioUnit = Number(producto.precio || 0);
                let precioUnitConDesc = precioUnit;
                if (discountObj) {
                  const tipo = (discountObj.tipo ?? "").toString().toLowerCase();
                  const val = Number(discountObj.valor ?? 0);
                  if (val > 0) {
                    if (tipo.includes("porc") || tipo.includes("percent") || tipo.includes("%")) {
                      precioUnitConDesc = Math.max(0, precioUnit * (1 - val / 100));
                    } else {
                      precioUnitConDesc = Math.max(0, precioUnit - val);
                    }
                  }
                }

                return (
                  <div
                    key={producto.id_producto ?? index}
                    className="w-full dark:bg-dark-10 dark:hover:bg-neutral-900 transition-colors rounded-lg flex items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-4 w-[60%]">
                      <div className="text-sm text-gray-400 w-[10%]">{producto.codigo_barra ?? "—"}</div>
                      <div className="text-white text-sm font-medium">{producto.nombre ?? "Producto sin nombre"}</div>
                    </div>

                    <div className="flex items-center gap-3 w-[25%] justify-center">
                      <button
                        className="p-1 rounded hover:bg-light-10"
                        onClick={() => handleChangeCantidad(producto.id_producto, Number(producto.cantidad || 0) - 1)}
                        aria-label={`Disminuir ${producto.nombre}`}
                      >
                        <BiMinus />
                      </button>
                      <input
                        className="w-12 text-center bg-transparent border-b"
                        type="number"
                        value={producto.cantidad}
                        min={0}
                        onChange={(e) => handleChangeCantidad(producto.id_producto, Number(e.target.value || 0))}
                      />
                      <button
                        className="p-1 rounded hover:bg-light-10"
                        onClick={() => handleChangeCantidad(producto.id_producto, Number(producto.cantidad || 0) + 1)}
                        aria-label={`Aumentar ${producto.nombre}`}
                      >
                        <BiPlus />
                      </button>
                    </div>

                    <div className="w-[15%] text-right">
                      {precioUnitConDesc !== precioUnit ? (
                        <div>
                          <div className="text-xs text-muted-foreground line-through">${precioUnit.toFixed(2)}</div>
                          <div className="text-white">${(precioUnitConDesc * producto.cantidad).toFixed(2)}</div>
                        </div>
                      ) : (
                        <div className="text-white">${(precioUnit * producto.cantidad).toFixed(2)}</div>
                      )}
                    </div>

                    <button
                      className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition-colors ml-3 hover:cursor-pointer"
                      onClick={() => handleEliminarProducto(producto.id_producto)}
                    >
                      <BiTrashAlt className="size-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* panel derecho (descuentos / total / boton) - sin cambios relevantes */}
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
                  <div className="space-y-2 w-full">
                    {descuentos.map((d: any) => (
                      <div
                        key={d.id_descuento ?? d.id}
                        className={`flex items-center justify-between p-2 rounded-md cursor-pointer border bg-light-10 dark:bg-dark-60 hover:bg-light-60 hover:dark:bg-neutral-800 transition-colors ${
                          appliedDescuentoId === Number(d.id_descuento ?? d.id)
                            ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30"
                            : "border-transparent hover:border-var3"
                        }`}
                        onClick={() => applyOrToggleDescuento(Number(d.id_descuento ?? d.id))}
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
              className={`w-full h-25 mt-4 rounded-md flex items-center justify-center transition-colors ${
                processing ? "bg-gray-500 cursor-not-allowed" : "bg-light-30 dark:bg-dark-60 hover:bg-green-400 cursor-pointer"
              }`}
              onClick={() => { if (!processing) crearVenta(); }}
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
                  <BiCheck className="size-6" />
                  <span>Listo</span>
                </div>
              ) : (
                <BiMoneyWithdraw className="size-10" />
              )}
            </div>

            <div className="mt-4 px-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <div>Subtotal</div>
                <div>${calculation.subtotal.toFixed(2)}</div>
              </div>
              {calculation.descuentoValor > 0 && (
                <div className="flex justify-between text-sm text-red-500">
                  <div>Descuento</div>
                  <div>-${calculation.descuentoValor.toFixed(2)}</div>
                </div>
              )}
              <div className="flex justify-between font-medium text-lg mt-2">
                <div>Total</div>
                <div>${calculation.total.toFixed(2)}</div>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}
            {successMsg && <p className="text-green-500 text-sm mt-3 text-center">{successMsg}</p>}
          </div>
        </div>

        {/* Popup productos */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50" onClick={() => setShowPopup(false)}>
            <div
              className="bg-light-60 dark:bg-dark-30 rounded-xl p-6 w-[500px] h-[500px] shadow-2xl flex flex-col items-start justify-start relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <Search
                id="search-producto"
                placeholder="Buscar nombre de Producto"
                className="w-full bg-light-30 dark:bg-dark-10 text-foreground border-0 focus:ring-0"
                label=""
              />
              <div className="mt-4 w-full overflow-y-auto">
                {loading ? (
                  <p className="text-foreground text-sm">Cargando...</p>
                ) : productosDisponibles.length === 0 ? (
                  <p className="text-foreground text-sm">No hay productos disponibles para vender.</p>
                ) : (
                  productosDisponibles.map((detalle: any) => (
                    <div
                      key={detalle.id_producto}
                      onClick={() => handleAgregarProducto(detalle)}
                      className="w-full bg-light-30 dark:bg-dark-10 hover:bg-light-10 transition-colors rounded-md flex items-center justify-between p-3 mb-2 cursor-pointer"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm text-foreground">ID Producto: {detalle.id_producto}</span>
                        <span className="text-sm font-medium text-foreground">{detalle.nombre}</span>
                        {typeof detalle.stock === "number" && <span className="text-xs text-muted-foreground">Stock: {detalle.stock}</span>}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-foreground">${detalle.precio?.toFixed ? detalle.precio.toFixed(2) : detalle.precio}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAgregarProducto(detalle);
                          }}
                          className="px-3 py-1 bg-light-10 text-white rounded"
                        >
                          Agregar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
