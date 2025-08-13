'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import ProductCard from '@/components/ui/productCard'

interface Product {
  id: number
  name: string
  cant: number
  stock: number
  precio: number
  image: string
}

export default function VentaPage() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetch('/ventas/ventas.json')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error('Error cargando productos:', err))
  }, [])

  const totalPrice = products.reduce((acc, p) => acc + p.precio * p.cant, 0)

  const formatMoney = (value: number) =>
    new Intl.NumberFormat('es-AR').format(value)

  return (
    <div className="bg-gray-900 min-h-screen text-white p-4">
      <nav className="flex items-center gap-4 bg-gray-800 p-3 rounded-md mb-6">
        <div className="w-10 h-10 bg-gray-600 rounded-full" />
        <Button variant="outline" className="bg-white text-black">Página Principal</Button>
        <Button variant="outline" className="bg-white text-black">Estadísticas</Button>
        <Button variant="outline" className="bg-white text-black">Configuración</Button>
        <Button variant="outline" className="bg-white text-black">Registros</Button>
      </nav>

      <div className="flex gap-6">
        <div className="flex-1 bg-gray-100 rounded-lg p-6">
          <div className="flex flex-col gap-4 bg-gray-500 p-4 rounded-lg max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-300">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard
                  key={product.id}
                  {...product}
                  formatMoney={formatMoney}
                />
              ))
            ) : (
              <p className="text-center text-white">Cargando productos...</p>
            )}
          </div>
        </div>

        <div className="w-72 bg-gray-100 rounded-lg p-4 flex flex-col justify-between">
        <div className="bg-gray-500 p-4 rounded-lg text-lg font-semibold">
          <div className="bg-gray-500 p-4 rounded-lg text-lg font-semibold">
            Total: ${formatMoney(totalPrice)}
          </div>

          <div className="mt-15">
            <select className="w-full p-2 rounded-md bg-gray-400 text-white">
              <option>Aplicar Descuento</option>
            </select>
          </div>

          <div className="mt-15 bg-gray-400 p-4 rounded-lg flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <input type="radio" name="payment" defaultChecked /> Efectivo
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="payment" /> Mercado Pago
            </label>
          </div>
          <div className="mt-85 bg-gray-500 p-4 rounded-lg flex flex-col gap-2"></div>
          </div>
          <Button
            variant="default"
            className="mt-4 w-full bg-gray-400 text-white hover:bg-gray-500 border-0">
            Siguiente
          </Button>
        </div>
        
      </div>
    </div>
  )
}
