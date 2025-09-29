'use client'

import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function EditarProductoPage() {
  const router = useRouter()

  const [nombre, setNombre] = useState('')
  const [codigoBarras, setCodigoBarras] = useState('')
  const [vencimiento, setVencimiento] = useState('')
  const [categoria, setCategoria] = useState('')
  const [marca, setMarca] = useState('')
  const [precioCompra, setPrecioCompra] = useState('')
  const [precioPublico, setPrecioPublico] = useState('')

  // Preview handling: imagenPreview = string que puede ser ruta pública o blob URL
  const [imagenPreview, setImagenPreview] = useState<string>('/milka.png')
  const [blobUrl, setBlobUrl] = useState<string | null>(null)

  useEffect(() => {
    // cuando blobUrl cambia, actualizamos imagenPreview y limpiamos el anterior
    if (blobUrl) setImagenPreview(blobUrl)
    // cleanup al desmontar: revoke si existe
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl)
      }
    }
  }, [blobUrl])

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    // revocar anterior si existía
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl)
      setBlobUrl(null)
    }
    const previewUrl = URL.createObjectURL(file)
    setBlobUrl(previewUrl)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    // aquí enviarías datos al backend / supabase
    console.log({
      nombre,
      codigoBarras,
      vencimiento,
      categoria,
      marca,
      precioCompra,
      precioPublico,
      imagenPreview,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#2F363C] flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white dark:bg-neutral-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 md:p-8">
          <h1 className="text-center text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-6">
            CREAR PRODUCTO
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nombre del producto"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre del producto"
                className="dark:placeholder-neutral-300 dark:bg-neutral-700"
              />

              <Input
                label="Código de barras"
                value={codigoBarras}
                onChange={(e) => setCodigoBarras(e.target.value)}
                placeholder="0000000000000"
                className="dark:placeholder-gray-300 dark:bg-neutral-700"
              />

              <Input
                label="Fecha de vencimiento"
                type="date"
                value={vencimiento}
                onChange={(e) => setVencimiento(e.target.value)}
                className="dark:bg-neutral-700"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Categoría
                  </label>
                  <select
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:bg-neutral-700 dark:border-gray-600 dark:text-white "
                  >
                    <option value="">Seleccionar</option>
                    <option>Golosinas</option>
                    <option>Bebidas</option>
                    <option>Lácteos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Marca
                  </label>
                  <select
                    value={marca}
                    onChange={(e) => setMarca(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:bg-neutral-700 dark:border-gray-600 dark:text-white"
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
                  onChange={(e) => setPrecioCompra(e.target.value)}
                  placeholder="$0,00"
                  className='dark:bg-neutral-700'
                />
                <Input
                  label="Precio al público"
                  type="number"
                  value={precioPublico}
                  onChange={(e) => setPrecioPublico(e.target.value)}
                  placeholder="$0,00"
                  className='dark:bg-neutral-700'
                />
              </div>

              <div className="flex gap-4 mt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white"
                >
                  Siguiente
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-neutral-300 dark:border-gray-600 text-gray-900 dark:text-white dark:"
                  onClick={() => router.back()}
                >
                  Volver
                </Button>
              </div>
            </form>

            {/* PREVIEW / UPLOAD */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-full h-56 bg-neutral-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden flex items-center justify-center">
                {/* uso <img> para blob URLs y evitar problemas de next/image */}
                <img
                  src={imagenPreview}
                  alt="Preview"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="flex w-full gap-3">
                <label className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <Button asChild variant="outline" className="w-full">
                    <span className="flex items-center justify-center gap-2 px-4 py-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-current">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v6h.582M20 20v-6h-.581M4 10V4h6M20 14v6h-6" />
                      </svg>
                      Subir imagen
                    </span>
                  </Button>
                </label>

                <Button
                  type="button"
                  variant="ghost"
                  className="px-4 py-2"
                  onClick={() => {

                    if (blobUrl) {
                      URL.revokeObjectURL(blobUrl)
                      setBlobUrl(null)
                    }
                    setImagenPreview('/milka.png')
                  }}
                >
                  Reset
                </Button>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 text-center">

              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
