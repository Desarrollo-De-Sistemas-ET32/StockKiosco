'use client'

import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import SubirImagenSimple from '@/components/ui/subirImagen'

// Configura tu cliente de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export default function EditarProductoPage() {
  const router = useRouter()

  const [nombre, setNombre] = useState('')
  const [codigoBarras, setCodigoBarras] = useState('')
  const [precio, setPrecio] = useState('')
  const [idProveedor, setIdProveedor] = useState('')
  const [idMarca, setIdMarca] = useState('')

  // Estado para manejar la imagen
  const [imagenPreview, setImagenPreview] = useState<string>('/milka.png')
  const [imagenBase64, setImagenBase64] = useState<string>('') // Base64 para guardar en BD
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [processError, setProcessError] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState(false)

  // Limpiar blob URLs al desmontar
  useEffect(() => {
    return () => {
      if (imagenPreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagenPreview)
      }
    }
  }, [imagenPreview])

  const handleImageReady = (base64: string) => {
    setImagenBase64(base64)
    setImagenPreview(base64)
    setIsProcessing(false)
    setProcessError('')
    console.log('✅ Imagen lista para guardar')
  }

  const handleImagePreview = (previewUrl: string) => {
    if (imagenPreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagenPreview)
    }
    setImagenPreview(previewUrl)
  }

  const handleImageError = (error: string) => {
    setProcessError(error)
    setIsProcessing(false)
  }

  const resetImage = () => {
    if (imagenPreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagenPreview)
    }
    setImagenPreview('/milka.png')
    setImagenBase64('')
    setSelectedFile(null)
    setProcessError('')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    try {
      setIsProcessing(true)
      
      // Preparar datos del producto según tu esquema
      const productoData = {
        nombre,
        codigo_barra: codigoBarras || null,
        precio: parseFloat(precio),
        images: imagenBase64 || null,
        id_proveedor: idProveedor ? parseInt(idProveedor) : null,
        id_marca: idMarca ? parseInt(idMarca) : null,
        fecha_creacion: new Date().toISOString(),
        fecha_actualizacion: new Date().toISOString()
      }

      console.log('Enviando producto:', {
        nombre,
        codigo_barra: codigoBarras,
        precio: parseFloat(precio),
        id_proveedor: idProveedor ? parseInt(idProveedor) : null,
        id_marca: idMarca ? parseInt(idMarca) : null,
        images: imagenBase64 ? `Base64 de ${(imagenBase64.length / 1024).toFixed(1)}KB` : null
      })

      // Insertar en la tabla de productos
      const { data, error } = await supabase
        .from('productos')
        .insert([productoData])
        .select()

      if (error) {
        throw error
      }

      console.log('Producto creado exitosamente:', data)
      
      // Mostrar mensaje de éxito o redireccionar
      alert('Producto creado exitosamente!')
      // router.push('/productos') // descomenta para redireccionar

    } catch (error: any) {
      console.error('Error creando producto:', error)
      setProcessError(error.message || 'Error al crear el producto')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
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
                className="dark:placeholder-gray-300"
                required
              />

              <Input
                label="Código de barras"
                value={codigoBarras}
                onChange={(e) => setCodigoBarras(e.target.value)}
                placeholder="0000000000000"
                className="dark:placeholder-gray-300"
              />

              <Input
                label="Precio"
                type="number"
                step="0.01"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                placeholder="$0,00"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Proveedor
                  </label>
                  <select
                    value={idProveedor}
                    onChange={(e) => setIdProveedor(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Seleccionar proveedor</option>
                    {/* Aquí puedes cargar proveedores desde tu tabla proveedores */}
                    <option value="1">Proveedor 1</option>
                    <option value="2">Proveedor 2</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                    Marca
                  </label>
                  <select
                    value={idMarca}
                    onChange={(e) => setIdMarca(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Seleccionar marca</option>
                    {/* Aquí puedes cargar marcas desde tu tabla marcas */}
                    <option value="1">Milka</option>
                    <option value="2">Arcor</option>
                    <option value="3">Pepsi</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Procesando...' : 'Crear Producto'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  onClick={() => router.back()}
                  disabled={isProcessing}
                >
                  Volver
                </Button>
              </div>
            </form>

            {/* PREVIEW / UPLOAD */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-full h-56 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden flex items-center justify-center">
                <img
                  src={imagenPreview}
                  alt="Preview"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Componente de procesamiento de imagen */}
              <SubirImagenSimple
                onImageReady={handleImageReady}
                onPreview={handleImagePreview}
                onError={handleImageError}
                disabled={isProcessing}
              />

              {/* Botón de reset */}
              <Button
                type="button"
                variant="ghost"
                className="px-4 py-2"
                onClick={resetImage}
                disabled={isProcessing}
              >
                Reset
              </Button>

              {/* Mostrar errores */}
              {processError && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-2 text-center">
                  {processError}
                </p>
              )}

              {/* Mostrar información de imagen procesada */}
              {imagenBase64 && !isProcessing && (
                <div className="text-xs text-green-600 dark:text-green-400 mt-2 text-center">
                  <p>✅ Imagen lista para guardar</p>
                  <p>Tamaño: {(imagenBase64.length / 1024).toFixed(1)} KB</p>
                </div>
              )}

              {/* Info sobre límites */}
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Máximo 1MB. Se comprime automáticamente si es necesario.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}