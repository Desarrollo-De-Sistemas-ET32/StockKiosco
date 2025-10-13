'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import ProductCard from '@/components/ui/productCard' 
import { NavBar } from "@/components/navBar"

interface Product {
  id: number
  name: string
  cant: number
  stock: number | string
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
    <div className="bg-[#2F363C] min-h-screen p-4">
      <div className="flex items-center justify-center gap-10 py-3">
          <NavBar />
        </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-neutral-800 rounded-lg p-4">
          <div className="flex flex-col gap-4 bg-[#2F363C] p-4 rounded-lg max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-300">
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


        <div className="lg:w-72 w-full bg-neutral-800 rounded-lg p-4 flex flex-col justify-between">
          <div className="bg-gray-500 p-4 rounded-lg text-lg font-semibold">
            <div>Total: ${formatMoney(totalPrice)}</div>


            <div className="lg:mt-[60px] mt-4">
              <select className="w-full p-2 rounded-md bg-gray-400 text-white">
                <option>Aplicar Descuento</option>
                <option>Robar</option>
                <option>Si</option>
              </select>
            </div>


            <div className="lg:mt-[60px] mt-4 bg-gray-400 p-4 rounded-lg flex flex-col gap-2">
              <label className="flex items-center gap-2">
                <input type="radio" name="payment" defaultChecked /> Efectivo
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="payment" /> Mercado Pago
              </label>
            </div>


            <div className="lg:mt-[340px] mt-6 bg-gray-500 p-4 rounded-lg flex flex-col gap-2"></div>
          </div>


          <Button
            variant="default"
            className="mt-4 w-full bg-gray-400 text-white hover:bg-gray-500 border-0"
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}
