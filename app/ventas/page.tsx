'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Producto {
  id: number
  name: string
  stock: number
  precio: number
  cantidad: number
  imagen: string
}

export default function VentaPage() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [descuento, setDescuento] = useState(0)
  const [metodoPago, setMetodoPago] = useState('efectivo')

  useEffect(() => {
    fetch('/ventas/ventas.json')
      .then((res) => res.json())
      .then((data) => setProductos(data))
      .catch((err) => console.error('Error cargando productos:', err))
  }, [])

  const total = productos.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0)
  const totalConDescuento = total - (total * descuento) / 100

  return (
    <div className="min-h-screen bg-[#1e1f22] flex flex-col items-center p-4 text-white">
      {/* Menú Superior */}
      <div className="flex gap-4 mb-6">
        <Button variant="secondary">Página Principal</Button>
        <Button variant="secondary">Estadísticas</Button>
        <Button variant="secondary">Configuración</Button>
        <Button variant="secondary">Registros</Button>
      </div>

      <div className="flex gap-6 w-full max-w-6xl">
        {/* Lista de Productos */}
        <div className="flex-1 bg-[#e9edf1] rounded-2xl p-6">
          <div className="bg-[#b3bbc4] rounded-xl p-4">
            {productos.map((product) => (
              <div
                key={product.id}
                className="bg-[#6c757d] rounded-lg flex items-center gap-4 p-3 mb-4"
              >
                <img
                  src={product.imagen}
                  alt={product.name}
                  className="w-16 h-16 rounded-lg"
                />
                <span className="text-white">
                  {product.name} ({product.cantidad}) Stock: {product.stock} $
                  {product.precio}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Panel Derecho */}
        <div className="w-72 bg-[#e9edf1] rounded-2xl p-4 flex flex-col gap-4">
          <h2 className="text-lg font-bold text-black">
            Total: ${totalConDescuento.toFixed(2)}
          </h2>

          {/* Selector Descuento */}
          <select
            value={descuento}
            onChange={(e) => setDescuento(Number(e.target.value))}
            className="bg-[#b3bbc4] p-2 rounded text-black"
          >
            <option value={0}>Aplicar Descuento</option>
            <option value={10}>10%</option>
            <option value={20}>20%</option>
            <option value={50}>50%</option>
          </select>

          {/* Métodos de Pago */}
          <div className="bg-[#b3bbc4] p-3 rounded flex flex-col gap-2 text-black">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="pago"
                value="efectivo"
                checked={metodoPago === 'efectivo'}
                onChange={() => setMetodoPago('efectivo')}
              />
              Efectivo
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="pago"
                value="mercadopago"
                checked={metodoPago === 'mercadopago'}
                onChange={() => setMetodoPago('mercadopago')}
              />
              Mercado Pago
            </label>
          </div>

          {/* Botón Siguiente */}
          <Button variant="secondary" className="mt-auto">
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}
