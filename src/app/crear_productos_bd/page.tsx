// app/crear_productos/page.tsx
'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { NavBar } from '@/components/navBar'
import SubirImagen from '@/components/ui/subirImagen'

export default function CrearProductoPage() {
  const router = useRouter()

  const [nombre, setNombre] = useState('')
  const [codigoBarras, setCodigoBarras] = useState('')
  const [vencimiento, setVencimiento] = useState('')
  const [marca, setMarca] = useState('')
  const [precioCompra, setPrecioCompra] = useState('')
  const [precioPublico, setPrecioPublico] = useState('')
  const [imagenPreview, setImagenPreview] = useState<string>('/milka.png')
  const [imagenUrl, setImagenUrl] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImagenSubida = (url: string) => {
    setImagenUrl(url)
    console.log('Imagen subida con URL:', url)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!nombre.trim()) {
      setError('El nombre es requerido')
      return
    }

    setIsSaving(true)

    try {
      // 👇 solo mandamos lo que realmente existe en la tabla productos
      const payload = {
        nombre,
        images: imagenUrl || null
      }

      const res = await fetch('/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || 'Error creando producto')

      router.push('/productos')
    } catch (err: any) {
      console.error('Error guardar producto', err)
      setError(err?.message || 'Error desconocido')
    } finally {
      setIsSaving(false)
    }
  }
  
  return (
    <body className="min-h-screen bg-gray-50 dark:bg-[#2F363C] flex flex-col items-center p-6 gap-10">
       <div className=" w-full flex items-center justify-center gap-10 py-3">
          <NavBar />
        </div>
      <div className="w-full max-w-4xl bg-var7 dark:bg-var2 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 md:p-8">
          <h1 className="text-center text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-6">
            CREAR PRODUCTO
          </h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <form onSubmit={handleSubmit} className="space-y-4">

              <Input 
              value={nombre} 
              onChange={(e) => setNombre(e.target.value)} 
              placeholder="Nombre del producto"
              className='dark:bg-var1' 
              />

              <Input 
              value={codigoBarras} 
              onChange={(e) => setCodigoBarras(e.target.value)} 
              placeholder="Código de barras (no se guarda aún)" 
              className='dark:bg-var1'
              />

              <Input 
              type="date" 
              value={vencimiento} 
              onChange={(e) => setVencimiento(e.target.value)} 
              className='dark:bg-var1'
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Marca (no se guarda aún)
                </label>
                <select 
                value={marca} 
                onChange={(e) => setMarca(e.target.value)} 
                className="dark:bg-var1 block w-full rounded-md border px-3 py-2 text-sm"
                >
                  <option>Seleccionar</option>
                  <option>Milka</option>
                  <option>Arcor</option>
                  <option>Pepsi</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input type="number" 
                value={precioCompra} 
                onChange={(e) => setPrecioCompra(e.target.value)} 
                placeholder="$0,00 (no se guarda aún)"
                className='dark:bg-var1'
                />

                <Input type="number" 
                value={precioPublico} 
                onChange={(e) => setPrecioPublico(e.target.value)} 
                placeholder="$0,00 (no se guarda aún)"
                className='dark:bg-var1'
                />
              </div>

              <div className="flex gap-4 mt-4">
                <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isSaving}>
                  {isSaving ? 'Guardando...' : 'Guardar'}
                </Button>
                <Button 
                type="button" 
                variant="outline" 
                className="flex-1 bg-var5 hover:bg-var4 dark:bg-var3 dark:hover:bg-var1" 
                onClick={() => window.history.back()}>
                  Volver
                </Button>
              </div>

              {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
            </form>

            <SubirImagen imagenPreview={imagenPreview} setImagenPreview={setImagenPreview} onImagenSubida={handleImagenSubida} />
          </div>
        </div>
      </div>
    </body>
  )
}
