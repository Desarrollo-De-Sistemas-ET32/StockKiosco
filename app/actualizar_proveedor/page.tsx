'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function EditarProductoPage() {
  const [nombre, setNombre] = useState('')
  const [codigoBarras, setCodigoBarras] = useState('')
  const [vencimiento, setVencimiento] = useState('')
  const [categoria, setCategoria] =  useState('')
  const [marca, setMarca] = useState('')
  const [precioCompra, setPrecioCompra] = useState('')
  const [precioPublico, setPrecioPublico] = useState('')
  const [imagenPreview, setImagenPreview] = useState<string>('/milka.png')

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImagenPreview(URL.createObjectURL(file))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
  
    console.log({ nombre, codigoBarras, vencimiento, categoria, marca, precioCompra, precioPublico })
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-2xl p-8 w-full max-w-4xl flex flex-col">
        <h1 className="text-center text-2xl font-bold mb-6">EDITAR PRODUCTO</h1>
        <div className="flex flex-col lg:flex-row gap-8">
          <form onSubmit={handleSubmit} className="flex-1 space-y-4">
            <Input 
              label="Nombre del producto" 
              value={nombre} 
              onChange={e => setNombre(e.target.value)} 
              placeholder="Nombre del producto" 
            />
            <Input 
              label="Código de barras" 
              value={codigoBarras} 
              onChange={e => setCodigoBarras(e.target.value)} 
              placeholder="0000000000000" 
            />
            <Input 
              label="Fecha de vencimiento" 
              type="date"
              value={vencimiento} 
              onChange={e => setVencimiento(e.target.value)} 
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select
                  className="block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm"
                  value={categoria}
                  onChange={e => setCategoria(e.target.value)}
                >
                  <option value="">Seleccionar</option>
                  <option>Golosinas</option>
                  <option>Bebidas</option>
                  <option>Lácteos</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                <select
                  className="block w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm"
                  value={marca}
                  onChange={e => setMarca(e.target.value)}
                >
                  <option value="">Seleccionar</option>
                  <option>Milka</option>
                  <option>Arcor</option>
                  <option>Pepsi</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input 
                label="Precio de compra" 
                type="number" 
                value={precioCompra}
                onChange={e => setPrecioCompra(e.target.value)}
                placeholder="$0,00"
              />
              <Input 
                label="Precio al público" 
                type="number" 
                value={precioPublico}
                onChange={e => setPrecioPublico(e.target.value)}
                placeholder="$0,00"
              />
            </div>

            <div className="flex gap-4 mt-6">
              <Button type="submit" className="flex-1">Siguiente</Button>
              <Button variant="outline" className="flex-1" onClick={() => history.back()}>Volver</Button>
            </div>
          </form>


          <div className="flex-1 flex flex-col items-center gap-4">
            <div className="w-full h-48 bg-white rounded-lg overflow-hidden flex items-center justify-center">
              <Image
                src={imagenPreview}
                alt="Producto"
                width={300}
                height={200}
                className="object-contain"
              />
            </div>
            <label>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageChange} 
              />
              <Button variant="outline" asChild>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v6h.582M20 20v-6h-.581M4 10V4h6M20 14v6h-6" />
                  </svg>
                  Cambiar imagen de producto
                </div>
              </Button>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
