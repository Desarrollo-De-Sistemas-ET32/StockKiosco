// app/crear_productos/page.tsx
'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import SubirImagen from '@/components/ui/subirImagen'
import { productoService } from '@/app/Service/producto/ProductoService'

export default function CrearProductoPage() {
  const router = useRouter()

  const [nombre, setNombre] = useState('')
  const [codigoBarras, setCodigoBarras] = useState('')
  const [vencimiento, setVencimiento] = useState('')
  const [categoria, setCategoria] = useState('')
  const [marca, setMarca] = useState('')
  const [precio, setPrecio] = useState('')
  const [stock, setStock] = useState('')
  const [idProveedor, setIdProveedor] = useState('')
  const [idMarca, setIdMarca] = useState('')
  const [imagenPreview, setImagenPreview] = useState<string>('/milka.png')
  const [imagenUrl, setImagenUrl] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleImagenSubida = (url: string) => {
    setImagenUrl(url)
    console.log('Imagen subida con URL:', url)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrors({})

    // Validaciones básicas
    if (!nombre.trim()) {
      setErrors({ nombre: 'El nombre es requerido' })
      return
    }
    if (!precio || Number(precio) <= 0) {
      setErrors({ precio: 'El precio debe ser mayor a 0' })
      return
    }

    setIsSaving(true)

    try {
      const payload = {
        nombre,
        precio: Number(precio),
        codigo_barra: codigoBarras,
        stock: Number(stock) || 0,
        categoria: categoria || 'general',
        images: imagenUrl || '',
        id_proveedor: Number(idProveedor) || 1,
        id_marca: idMarca ? Number(idMarca) : undefined,
      }

      const result = await productoService.create(payload)

      if (result.error) {
        // Mostrar errores del backend
        setErrors(result.error)
        return
      }

      console.log('Producto creado exitosamente:', result.product)
      router.push('/productos')
    } catch (err: any) {
      console.error('Error guardar producto', err)
      setErrors({ general: err?.message || 'Error desconocido al conectar con el servidor' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="min-h-screen min-w-0.5 bg-gray-50 dark:bg-neutral-800 flex flex-col p-6">
      <div className="w-full max-w-4xl bg-white dark:bg-var1 rounded-2xl shadow-lg overflow-hidden flex self-center">
        <div className="p-6 md:p-8">
          <h1 className="text-center text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-6">
            CREAR PRODUCTO
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input 
                  value={nombre} 
                  onChange={(e) => setNombre(e.target.value)} 
                  placeholder="Nombre del producto"
                  className='dark:bg-var2'
                />
                {errors.nombre && <p className="text-xs text-red-600 mt-1">{errors.nombre}</p>}
              </div>

              <div>
                <Input 
                  value={codigoBarras} 
                  onChange={(e) => setCodigoBarras(e.target.value)} 
                  placeholder="Código de barras"
                  className='dark:bg-var2'
                />
                {errors.codigo_barra && <p className="text-xs text-red-600 mt-1">{errors.codigo_barra}</p>}
              </div>

              <Input 
                type="date" 
                value={vencimiento} 
                onChange={(e) => setVencimiento(e.target.value)}
                placeholder="Fecha de vencimiento"
                className='dark:bg-var2'
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Categoría
                </label>
                <select 
                  value={categoria} 
                  onChange={(e) => setCategoria(e.target.value)} 
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:bg-var2 dark:border-gray-600 dark:text-white"
                >
                  <option value="">Seleccionar</option>
                  <option value="golosinas">Golosinas</option>
                  <option value="bebidas">Bebidas</option>
                  <option value="lacteos">Lácteos</option>
                </select>
                {errors.categoria && <p className="text-xs text-red-600 mt-1">{errors.categoria}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  ID Marca (opcional)
                </label>
                <Input 
                  type="number" 
                  value={idMarca} 
                  onChange={(e) => setIdMarca(e.target.value)} 
                  placeholder="ID de marca"
                  className='dark:bg-var2'
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input 
                    type="number" 
                    value={precio} 
                    onChange={(e) => setPrecio(e.target.value)} 
                    placeholder="Precio"
                    className='dark:bg-var2'
                    step="0.01"
                  />
                  {errors.precio && <p className="text-xs text-red-600 mt-1">{errors.precio}</p>}
                </div>

                <div>
                  <Input 
                    type="number" 
                    value={stock} 
                    onChange={(e) => setStock(e.target.value)} 
                    placeholder="Stock inicial"
                    className='dark:bg-var2'
                  />
                  {errors.stock && <p className="text-xs text-red-600 mt-1">{errors.stock}</p>}
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <Button 
                  type="submit" 
                  className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white" 
                  disabled={isSaving}
                >
                  {isSaving ? 'Guardando...' : 'Guardar'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex-1 border-neutral-300 dark:border-gray-600 text-gray-900 dark:text-white bg-var6 dark:bg-var3 rounded-lg transition-colors dark:hover:bg-var2 hover:bg-var4" 
                  onClick={() => router.back()}
                >
                  Volver
                </Button>
              </div>

              {errors.general && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
                </div>
              )}
            </form>

            <SubirImagen 
              imagenPreview={imagenPreview} 
              setImagenPreview={setImagenPreview} 
              onImagenSubida={handleImagenSubida} 
            />
          </div>
        </div>
      </div>
    </main>
  )
}