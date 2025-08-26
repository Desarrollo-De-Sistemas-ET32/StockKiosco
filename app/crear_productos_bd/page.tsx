'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import SubirImagen from '@/components/ui/subirImagen'

// Configuración de Supabase con tus credenciales
const supabaseUrl = 'https://vqkilvejuwcsxufssdvx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxa2lsdmVqdXdjc3h1ZnNzZHZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NjA2MzEsImV4cCI6MjA2MzIzNjYzMX0.qO5W9toOEze0NPtJiV6E1aDTput2MSWy6Mzf38AjYK8'
const supabase = createClient(supabaseUrl, supabaseKey)

export default function EditarProductoPage() {
  const router = useRouter()

  // Estados del formulario según tu esquema de BD
  const [nombre, setNombre] = useState('')
  const [codigoBarra, setCodigoBarra] = useState('')
  const [precio, setPrecio] = useState('')
  const [idProveedor, setIdProveedor] = useState('')
  const [idMarca, setIdMarca] = useState('')

  // Estados para imagen
  const [imagenPreview, setImagenPreview] = useState<string>('/milka.png')
  const [imagenBase64, setImagenBase64] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Estados para cargar opciones de la BD
  const [proveedores, setProveedores] = useState<any[]>([])
  const [marcas, setMarcas] = useState<any[]>([])

  // Cargar proveedores y marcas al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🔄 Conectando a Supabase...')
        console.log('🌐 URL:', supabaseUrl)
        
        // Test de conexión básica
        const { data: testData, error: testError } = await supabase
          .from('proveedores')
          .select('*')
          .limit(1)

        if (testError) {
          console.error('❌ ERROR DE CONEXIÓN:', {
            message: testError.message,
            details: testError.details,
            hint: testError.hint,
            code: testError.code
          })
          
          if (testError.code === '42P01') {
            setErrorMessage('❌ Tabla "proveedores" no existe. Necesitas crearla en Supabase.')
          } else if (testError.message.includes('RLS')) {
            setErrorMessage('❌ Problema de permisos (RLS). Desactiva Row Level Security o crea políticas.')
          } else {
            setErrorMessage(`❌ Error de conexión: ${testError.message}`)
          }
          return
        }

        console.log('✅ Conexión exitosa. Datos de prueba:', testData)
        
        // Cargar proveedores
        const { data: proveedoresData, error: errorProveedores } = await supabase
          .from('proveedores')
          .select('id_proveedor, nombre')
          .order('nombre')

        if (errorProveedores) {
          console.error('❌ Error cargando proveedores:', {
            message: errorProveedores.message,
            code: errorProveedores.code,
            details: errorProveedores.details
          })
          setErrorMessage(`Error cargando proveedores: ${errorProveedores.message}`)
        } else {
          console.log('✅ Proveedores cargados:', proveedoresData?.length || 0, 'registros')
          setProveedores(proveedoresData || [])
        }

        // Cargar marcas
        const { data: marcasData, error: errorMarcas } = await supabase
          .from('marcas')
          .select('id_marca, nombre_marca')
          .order('nombre_marca')

        if (errorMarcas) {
          console.error('❌ Error cargando marcas:', {
            message: errorMarcas.message,
            code: errorMarcas.code,
            details: errorMarcas.details
          })
          setErrorMessage(`Error cargando marcas: ${errorMarcas.message}`)
        } else {
          console.log('✅ Marcas cargadas:', marcasData?.length || 0, 'registros')
          setMarcas(marcasData || [])
        }
        
      } catch (error: any) {
        console.error('❌ Error general:', error)
        setErrorMessage(`Error de conexión: ${error.message || 'Error desconocido'}`)
      }
    }

    fetchData()
  }, [])

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
    setErrorMessage('')
    console.log('✅ Imagen lista para guardar. Tamaño:', (base64.length / 1024).toFixed(1), 'KB')
  }

  const handleImagePreview = (previewUrl: string) => {
    if (imagenPreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagenPreview)
    }
    setImagenPreview(previewUrl)
    setErrorMessage('')
  }

  const handleImageError = (error: string) => {
    setErrorMessage(error)
  }

  const resetImage = () => {
    if (imagenPreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagenPreview)
    }
    setImagenPreview('/milka.png')
    setImagenBase64('')
    setErrorMessage('')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Validaciones básicas
    if (!nombre.trim()) {
      setErrorMessage('El nombre del producto es requerido')
      return
    }

    if (!precio || parseFloat(precio) <= 0) {
      setErrorMessage('El precio debe ser mayor a 0')
      return
    }

    try {
      setIsSubmitting(true)
      setErrorMessage('')
      
      // Preparar datos según el esquema de tu BD
      const productoData = {
        nombre: nombre.trim(),
        codigo_barra: codigoBarra.trim() || null,
        precio: parseFloat(precio),
        images: imagenBase64 || null,
        id_proveedor: idProveedor ? parseInt(idProveedor) : null,
        id_marca: idMarca ? parseInt(idMarca) : null,
        fecha_creacion: new Date().toISOString(),
        fecha_actualizacion: new Date().toISOString()
      }

      console.log('📤 Enviando producto a Supabase:', {
        ...productoData,
        images: imagenBase64 ? `Base64 (${(imagenBase64.length / 1024).toFixed(1)}KB)` : null
      })

      // Insertar en la tabla productos
      const { data, error } = await supabase
        .from('productos')
        .insert([productoData])
        .select()

      if (error) {
        console.error('❌ Error de Supabase:', error)
        throw new Error(error.message)
      }

      console.log('✅ Producto creado exitosamente en Supabase:', data)
      
      // Mostrar mensaje de éxito
      alert('¡Producto creado exitosamente!')
      
      // Limpiar formulario
      setNombre('')
      setCodigoBarra('')
      setPrecio('')
      setIdProveedor('')
      setIdMarca('')
      resetImage()
      
      // Opcional: redireccionar
      // router.push('/productos')

    } catch (error: any) {
      console.error('❌ Error creando producto:', error)
      setErrorMessage(error.message || 'Error al crear el producto. Verifica tu conexión y las tablas de la BD.')
    } finally {
      setIsSubmitting(false)
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
            {/* FORMULARIO */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              <Input
                label="Nombre del producto *"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Chocolate Milka Oreo"
                className="dark:placeholder-gray-300"
                required
              />

              <Input
                label="Código de barras"
                value={codigoBarra}
                onChange={(e) => setCodigoBarra(e.target.value)}
                placeholder="7790895001234"
                className="dark:placeholder-gray-300"
              />

              <Input
                label="Precio *"
                type="number"
                step="0.01"
                min="0"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                placeholder="0.00"
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
                    {proveedores.map((proveedor) => (
                      <option key={proveedor.id_proveedor} value={proveedor.id_proveedor}>
                        {proveedor.nombre}
                      </option>
                    ))}
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
                    {marcas.map((marca) => (
                      <option key={marca.id_marca} value={marca.id_marca}>
                        {marca.nombre_marca}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Mostrar errores */}
              {errorMessage && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">
                    ⚠️ {errorMessage}
                  </p>
                </div>
              )}

              {/* Información de conexión */}
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  🔗 Conectado a: {supabaseUrl.split('//')[1]}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  📊 Proveedores: {proveedores.length} | Marcas: {marcas.length}
                </p>
              </div>

              {/* Botones del formulario */}
              <div className="flex gap-4 mt-6">
                <Button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Guardando en Supabase...
                    </div>
                  ) : (
                    '💾 Crear Producto'
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  ⬅️ Volver
                </Button>
              </div>
            </form>

            {/* PREVIEW Y SUBIDA DE IMAGEN */}
            <div className="flex flex-col items-center gap-4">
              
              {/* Preview de la imagen */}
              <div className="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 overflow-hidden flex items-center justify-center">
                <img
                  src={imagenPreview}
                  alt="Preview del producto"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Componente de subida */}
              <SubirImagen
                onImageReady={handleImageReady}
                onPreview={handleImagePreview}
                onError={handleImageError}
                disabled={isSubmitting}
                maxSizeMB={2}
              />

              {/* Botón reset */}
              <Button
                type="button"
                variant="ghost"
                className="text-gray-500 hover:text-gray-700"
                onClick={resetImage}
                disabled={isSubmitting}
              >
                🔄 Resetear imagen
              </Button>

              {/* Estado de la imagen */}
              {imagenBase64 && (
                <div className="w-full p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-sm text-green-700 dark:text-green-300 text-center">
                    ✅ Imagen procesada y lista
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 text-center">
                    Tamaño final: {(imagenBase64.length / 1024).toFixed(1)} KB
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}