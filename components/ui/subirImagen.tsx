import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface SubirImagenProps {
  onImageReady: (base64: string) => void
  onPreview: (previewUrl: string) => void
  onError?: (error: string) => void
  disabled?: boolean
  maxSizeMB?: number
}

export default function SubirImagen({
  onImageReady,
  onPreview,
  onError,
  disabled = false,
  maxSizeMB = 2
}: SubirImagenProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    console.log('📁 Archivo seleccionado:', file.name, '|', (file.size / 1024).toFixed(1), 'KB')

    // Validaciones
    if (!file.type.startsWith('image/')) {
      const error = 'Solo se permiten archivos de imagen (JPG, PNG, GIF, WebP)'
      console.error('❌', error)
      onError?.(error)
      return
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      const error = `La imagen debe ser menor a ${maxSizeMB}MB. Tamaño actual: ${(file.size / 1024 / 1024).toFixed(1)}MB`
      console.error('❌', error)
      onError?.(error)
      return
    }

    setSelectedFile(file)

    // Crear preview inmediatamente
    const previewUrl = URL.createObjectURL(file)
    console.log('👁️ Preview creado:', previewUrl)
    onPreview(previewUrl)
    
    // Limpiar errores previos
    onError?.('')
  }

  const convertToBase64 = async () => {
    if (!selectedFile) {
      onError?.('No hay archivo seleccionado')
      return
    }

    setIsLoading(true)

    try {
      console.log('🔄 Iniciando conversión a Base64...', selectedFile.name)
      
      const reader = new FileReader()
      
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            console.log('✅ Conversión exitosa. Tamaño Base64:', (reader.result.length / 1024).toFixed(1), 'KB')
            resolve(reader.result)
          } else {
            reject(new Error('Error en la conversión: resultado no es string'))
          }
        }
        reader.onerror = () => {
          console.error('❌ Error del FileReader:', reader.error)
          reject(new Error('Error al leer el archivo'))
        }
        reader.readAsDataURL(selectedFile)
      })

      // Verificar que el Base64 sea válido
      if (!base64.startsWith('data:image/')) {
        throw new Error('Base64 generado no es válido para imagen')
      }

      onImageReady(base64)

    } catch (error: any) {
      console.error('❌ Error procesando imagen:', error)
      onError?.(error.message || 'Error al procesar la imagen')
    } finally {
      setIsLoading(false)
    }
  }

  const resetSelection = () => {
    console.log('🔄 Reseteando selección...')
    setSelectedFile(null)
    setIsLoading(false)
    onError?.('')
    
    // Resetear el input file
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    if (input) {
      input.value = ''
      console.log('✅ Input file reseteado')
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Botón seleccionar archivo */}
      <label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled || isLoading}
        />
        <Button 
          asChild 
          variant="outline" 
          className="w-full cursor-pointer"
          disabled={disabled || isLoading}
        >
          <span className="flex items-center justify-center gap-2">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
              />
            </svg>
            {selectedFile ? 'Cambiar imagen' : 'Seleccionar imagen'}
          </span>
        </Button>
      </label>

      {/* Información y botones cuando hay archivo */}
      {selectedFile && (
        <div className="space-y-3">
          {/* Info del archivo */}
          <div className="text-sm text-gray-600 dark:text-gray-400 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border">
            <p className="font-medium">📁 {selectedFile.name}</p>
            <p>📏 Tamaño: {(selectedFile.size / 1024).toFixed(1)} KB ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</p>
            <p>🖼️ Tipo: {selectedFile.type}</p>
            <p>📅 Modificado: {new Date(selectedFile.lastModified).toLocaleString()}</p>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-2">
            <Button
              onClick={convertToBase64}
              disabled={isLoading || disabled}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Procesando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="16" 
                    height="16" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                  Convertir a Base64
                </div>
              )}
            </Button>

            <Button
              onClick={resetSelection}
              variant="ghost"
              disabled={isLoading}
              className="px-4"
            >
              <div className="flex items-center gap-1">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="14" 
                  height="14" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
                Cancelar
              </div>
            </Button>
          </div>

          {/* Barra de progreso visual (solo cuando está procesando) */}
          {isLoading && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-600 h-2 rounded-full animate-pulse" style={{width: '100%'}}></div>
            </div>
          )}
        </div>
      )}

      {/* Límites y ayuda */}
      <div className="text-xs text-gray-500 dark:text-gray-400 text-center space-y-1">
        <p>📎 Formatos: JPG, PNG, GIF, WebP</p>
        <p>📏 Máximo {maxSizeMB}MB por imagen</p>
        <p>💾 Se convierte a Base64 para almacenar en Supabase</p>
      </div>
    </div>
  )
}