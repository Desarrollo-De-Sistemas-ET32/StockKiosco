'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

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
      {/* navegación */}
      <nav className="flex items-center gap-4 bg-gray-800 p-3 rounded-md mb-6">
        <div className="w-10 h-10 bg-gray-600 rounded-full" />
        <Button variant="outline" className="bg-white text-black">
          Página Principal
        </Button>
        <Button variant="outline" className="bg-white text-black">
          Estadísticas
        </Button>
        <Button variant="outline" className="bg-white text-black">
          Configuración
        </Button>
        <Button variant="outline" className="bg-white text-black">
          Registros
        </Button>
      </nav>

      <div className="flex gap-6">
        {/* lista */}
        <div className="flex-1 bg-gray-100 rounded-lg p-6">
          <div className="flex flex-col gap-4 bg-gray-400 p-4 rounded-lg">
            {products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-start gap-4 bg-gray-500 p-3 rounded-lg"
                >
                  {/* imagen */}
                  <div className="flex-shrink-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={64}
                      height={64}
                      className="rounded-md object-cover"
                    />
                  </div>

                  {/* info */}
                  <div className="flex-1">
                    {/* nombre */}
                    <div className="text-base font-semibold text-white">
                      {product.name}
                    </div>

                    {/* cant y stock */}
                    <div className="mt-1 text-sm text-gray-200">
                      <span className="mr-3">
                        <strong>cant:</strong> {product.cant}
                      </span>
                      <span>
                        <strong>stock:</strong> {product.stock}
                      </span>
                    </div>

                    {/* precio*/}
                    <div className="mt-2 text-sm text-gray-100">
                      <strong>precio:</strong> ${formatMoney(product.precio)}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-white">Cargando productos...</p>
            )}
          </div>
        </div>

        {/* total y pago */}
        <div className="w-72 bg-gray-100 rounded-lg p-4 flex flex-col justify-between">
          <div className="bg-gray-500 p-4 rounded-lg text-lg font-semibold">
            Total: ${formatMoney(totalPrice)}
          </div>

          <div className="mt-4">
            <select className="w-full p-2 rounded-md bg-gray-500 text-white">
              <option>Aplicar Descuento</option>
            </select>
          </div>

          <div className="mt-4 bg-gray-500 p-4 rounded-lg flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <input type="radio" name="payment" defaultChecked />
              Efectivo
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="payment" />
              Mercado Pago
            </label>
          </div>

      <Button 
        variant="default" 
        className="mt-4 w-full bg-gray-500 text-white hover:bg-gray-600 border-0">
        Siguiente
      </Button>

        </div>
      </div>
    </div>
  )
}
