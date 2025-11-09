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
    document.title = "Checkout | Kiosco";
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

  const getQtyInCart = (id_producto: number) => {
    const p = productosAgregados.find((x) => x.id_producto === id_producto);
    return p ? Number(p.cantidad || 0) : 0;
  };

  const getInitialStock = (id_producto: number) => {
    const p = productosDisponibles.find((x) => Number(x.id_producto) === Number(id_producto));
    return typeof p?.stock === "number" ? Number(p.stock) : undefined;
  };

  const getRemainingStock = (id_producto: number) => {
    const inicial = getInitialStock(id_producto);
    if (typeof inicial !== "number") return undefined;
    const enCarrito = getQtyInCart(id_producto);
    return Math.max(0, inicial - enCarrito);
  };

  const handleAgregarProducto = (detalle: any) => {
    const remaining = getRemainingStock(detalle.id_producto);
    if (typeof remaining === "number" && remaining <= 0) {
      setError(`No queda stock disponible para ${detalle.nombre}.`);
      setTimeout(() => setError(null), 3000);
      return;
    }

    setProductosAgregados((prev) => {
      const found = prev.find((p) => p.id_producto === detalle.id_producto);
      if (!found) {
        return [...prev, { ...detalle, cantidad: 1 }];
      } else {
        const nuevaQty = found.cantidad + 1;
        if (typeof remaining === "number" && nuevaQty > (getInitialStock(detalle.id_producto) ?? Infinity)) {
          return prev;
        }
        return prev.map((p) => (p.id_producto === detalle.id_producto ? { ...p, cantidad: nuevaQty } : p));
      }
    });
  };

  const handleEliminarProducto = (id_producto: number) => {
    setProductosAgregados((prev) => prev.filter((p) => p.id_producto !== id_producto));
  };

  const handleChangeCantidad = (id_producto: number, nuevaCantidad: number) => {
    if (!Number.isFinite(nuevaCantidad)) return;
    if (nuevaCantidad < 0) return;
    const inicial = getInitialStock(id_producto);
    if (typeof inicial === "number" && nuevaCantidad > inicial) {
      nuevaCantidad = inicial;
      setError("No podés setear una cantidad mayor al stock disponible.");
      setTimeout(() => setError(null), 2500);
    }

    setProductosAgregados((prev) =>
      prev.map((p) => {
        if (p.id_producto !== id_producto) return p;
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
      const tipoStr = (discountObj.tipo ?? "").toString().toUpperCase().trim();
      const val = Number(discountObj.valor ?? 0);

      const isMontoFijo = tipoStr === "MONTOFIJO";

      if (val > 0) {
        if (isMontoFijo) {
          descuentoValor = Math.min(subtotal, val);
          total = Math.max(0, subtotal - descuentoValor);
        } else {
          descuentoValor = subtotal * (val / 100);
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
      const initial = getInitialStock(p.id_producto);
      if (typeof initial === "number" && p.cantidad > initial) {
        setError(`Stock insuficiente para ${p.nombre}. Disponible: ${initial}`);
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
      }
    } catch (err: any) {
      setError(err?.message ?? "Error al crear la venta");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <>
      <style>{`
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] { -moz-appearance: textfield; }
      `}</style>

      <main className="h-[80vh] flex flex-col mx-4 lg:mx-25">
        
        {/* ✅ Ahora responsive */}
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-6 p-4 h-full">

          {/* LISTA DE PRODUCTOS */}
          <div className="bg-light-60 dark:bg-dark-30 rounded-xl p-4 lg:p-6 drop-shadow-xl flex flex-col items-center justify-start gap-4 overflow-y-auto w-full">
            <Button className="w-full min-h-14 text-lg font-medium dark:bg-dark-60 dark:hover:bg-neutral-900 dark:text-white bg-light-30 mb-4" onClick={() => setShowPopup(true)}>
              Agregar Productos
            </Button>

            {productosAgregados.length === 0 ? (
              <h1 className="pb-10 text-black dark:text-white text-center">No hay Productos en esta Venta</h1>
            ) : (
              productosAgregados.map((producto, index) => {
                const precioUnit = Number(producto.precio || 0);
                let precioUnitConDesc = precioUnit;
                if (discountObj) {
                  const tipoStr = (discountObj.tipo ?? "").toString().toUpperCase().trim();
                  const val = Number(discountObj.valor ?? 0);
                  const isMontoFijo = tipoStr === "MONTOFIJO";
                  if (val > 0 && !isMontoFijo) {
                    precioUnitConDesc = Math.max(0, precioUnit * (1 - val / 100));
                  }
                }

                const remaining = getRemainingStock(producto.id_producto);

                return (
                  <div key={producto.id_producto ?? index} className="w-full flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-4 dark:bg-dark-10 dark:hover:bg-neutral-900 transition-colors rounded-lg">
                    
                    <div className="flex flex-col lg:flex-row items-start lg:items-center gap-2 w-full lg:w-[60%]">
                      <div className="text-sm text-gray-400">{producto.codigo_barra ?? "—"}</div>
                      <div className="text-white text-sm font-medium">{producto.nombre ?? "Producto"}</div>
                      {typeof remaining === "number" && <div className={`text-xs ${remaining === 0 ? "text-red-400" : "text-muted-foreground"}`}>{remaining} disponibles</div>}
                    </div>

                    <div className="flex items-center gap-3 w-full lg:w-[25%] justify-start lg:justify-center">
                      <button className="p-1 rounded hover:bg-light-10" onClick={() => handleChangeCantidad(producto.id_producto, Number(producto.cantidad || 0) - 1)}>
                        <BiMinus />
                      </button>
                      <input className="w-12 text-center bg-transparent border-b" type="number" value={producto.cantidad} min={0} onChange={(e) => handleChangeCantidad(producto.id_producto, Number(e.target.value || 0))} />
                      <button className="p-1 rounded hover:bg-light-10" onClick={() => { const rem = getRemainingStock(producto.id_producto); if (typeof rem === "number" && rem <= 0) { setError("No queda stock disponible."); setTimeout(() => setError(null), 2000); return; } handleChangeCantidad(producto.id_producto, Number(producto.cantidad || 0) + 1); }}>
                        <BiPlus />
                      </button>
                    </div>

                    <div className="w-full lg:w-[15%] text-left lg:text-right">
                      {precioUnitConDesc !== precioUnit ? (
                        <div>
                          <div className="text-xs text-muted-foreground line-through">${precioUnit.toFixed(2)}</div>
                          <div className="text-white">${(precioUnitConDesc * producto.cantidad).toFixed(2)}</div>
                        </div>
                      ) : (
                        <div className="text-white">${(precioUnit * producto.cantidad).toFixed(2)}</div>
                      )}
                    </div>

                    <button className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-md transition-colors" onClick={() => handleEliminarProducto(producto.id_producto)}>
                      <BiTrashAlt className="size-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* PANEL DE TOTAL / DESCUENTO */}
          <div className="bg-light-60 dark:bg-dark-30 rounded-xl p-4 drop-shadow-xl flex flex-col">
            
            <div className="w-full bg-light-30 dark:bg-dark-30 rounded-md flex flex-col items-center cursor-pointer overflow-hidden">
              <div onClick={() => setShowAplicarMenu(!showAplicarMenu)} className="flex justify-center items-center h-15 w-full dark:hover:bg-neutral-900 transition-colors dark:bg-dark-60">
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
                    {descuentos.map((d: any) => {
                      const tipoStr = (d.tipo ?? "PORCENTAJE").toString().toUpperCase().trim();
                      const isMontoFijo = tipoStr === "MONTOFIJO";
                      return (
                        <div key={d.id_descuento ?? d.id} className={`flex items-center justify-between p-2 rounded-md cursor-pointer border bg-light-10 dark:bg-dark-60 hover:bg-light-60 hover:dark:bg-neutral-800 transition-colors ${appliedDescuentoId === Number(d.id_descuento ?? d.id) ? "border-emerald-400 bg-emerald-50 dark:bg-emerald-900/30" : "border-transparent hover:border-var3"}`} onClick={() => applyOrToggleDescuento(Number(d.id_descuento ?? d.id))}>
                          <div>
                            <div className="font-medium">{d.nombre}</div>
                            <div className="text-xs text-muted-foreground">
                              {tipoStr} — {isMontoFijo ? `$${Number(d.valor).toFixed(2)}` : `${Number(d.valor).toFixed(2)}%`}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {appliedDescuentoId === Number(d.id_descuento ?? d.id) ? "Aplicado" : "Aplicar"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className={`w-full mt-4 rounded-md flex items-center justify-center min-h-14 transition-colors ${processing ? "bg-gray-500 cursor-not-allowed" : "bg-light-30 dark:bg-dark-60 hover:bg-green-400 cursor-pointer"}`} onClick={() => { if (!processing) crearVenta(); }}>
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

        {/* POPUP AGREGAR PRODUCTOS */}
        {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50" onClick={() => setShowPopup(false)}>
            <div className="bg-light-60 dark:bg-dark-30 rounded-xl p-6 w-[90%] max-w-[500px] h-[80%] max-h-[600px] shadow-2xl flex flex-col items-start justify-start relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <Search id="search-producto" placeholder="Buscar nombre de Producto" className="w-full bg-light-30 dark:bg-dark-10 text-foreground border-0 focus:ring-0" label="" />
              <div className="mt-4 w-full overflow-y-auto">
                {loading ? (
                  <p className="text-foreground text-sm">Cargando...</p>
                ) : productosDisponibles.length === 0 ? (
                  <p className="text-foreground text-sm">No hay productos disponibles para vender.</p>
                ) : (
                  productosDisponibles.map((detalle: any) => {
                    const remaining = getRemainingStock(detalle.id_producto);
                    const disabled = typeof remaining === "number" && remaining <= 0;
                    return (
                      <div key={detalle.id_producto} onClick={() => { if (disabled) return; handleAgregarProducto(detalle); }} className={`w-full bg-light-30 dark:bg-dark-10 hover:bg-light-10 transition-colors rounded-md flex items-center justify-between p-3 mb-2 cursor-pointer ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}>
                        <div className="flex flex-col">
                          <span className="text-sm text-foreground">ID Producto: {detalle.id_producto}</span>
                          <span className="text-sm font-medium text-foreground">{detalle.nombre}</span>
                          {typeof detalle.stock === "number" && <span className="text-xs text-muted-foreground">Stock: {detalle.stock} — Quedan: {remaining}</span>}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-foreground">${detalle.precio?.toFixed ? detalle.precio.toFixed(2) : detalle.precio}</span>
                          <button onClick={(e) => { e.stopPropagation(); if (!disabled) handleAgregarProducto(detalle); }} className={`px-3 py-1 text-white rounded ${disabled ? "bg-gray-400" : "bg-light-10"}`} disabled={disabled}>
                            Agregar
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
