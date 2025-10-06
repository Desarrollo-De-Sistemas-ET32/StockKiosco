// components/ui/subirImagen.tsx
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface SubirImagenProps {
  imagenPreview: string
  setImagenPreview: (url: string) => void
  productoId?: string
  onImagenSubida?: (url: string) => void
}

export default function SubirImagen({
  imagenPreview,
  setImagenPreview,
  productoId,
  onImagenSubida
}: SubirImagenProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  useEffect(() => {
    if (blobUrl) setImagenPreview(blobUrl)
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl)
    }
  }, [blobUrl, setImagenPreview])

  const fileToDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => (typeof reader.result === 'string' ? resolve(reader.result) : reject('No string'))
      reader.onerror = () => reject('FileReader error')
      reader.readAsDataURL(file)
    })

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadError(null)

    try {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl)
        setBlobUrl(null)
      }

      const previewUrl = URL.createObjectURL(file)
      setBlobUrl(previewUrl)

      const dataUrl = await fileToDataUrl(file)

      setIsUploading(true)

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataUrl, fileName: file.name, productoId })
      })

      const json = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(json?.error || 'Upload failed')

      const publicUrl = json.publicUrl
      if (!publicUrl) throw new Error('No publicUrl returned from upload')

      setImagenPreview(publicUrl)
      if (onImagenSubida) onImagenSubida(publicUrl)
    } catch (err: any) {
      console.error('Error handleImageChange', err)
      setUploadError(err?.message || 'Error al procesar imagen')
    } finally {
      setIsUploading(false)
    }
  }

  const handleReset = () => {
    if (blobUrl) {
      URL.revokeObjectURL(blobUrl)
      setBlobUrl(null)
    }
    setImagenPreview('/milka.png')
    setUploadError(null)
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full h-56 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden flex items-center justify-center relative">
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <div className="text-white text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p className="text-sm">Subiendo imagen...</p>
            </div>
          </div>
        )}
        <img src={imagenPreview} alt="Preview" className="max-h-full max-w-full object-contain" />
      </div>

      <div className="flex w-full gap-3">
        <label className="flex-1">
          <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={isUploading} />
          <Button asChild variant="outline" className="w-full" disabled={isUploading}>
            <span className="flex items-center justify-center gap-2 px-4 py-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v6h.582M20 20v-6h-.581M4 10V4h6M20 14v6h-6" />
              </svg>
              {isUploading ? 'Subiendo...' : 'Subir imagen'}
            </span>
          </Button>
        </label>

        <Button type="button" variant="ghost" className="px-4 py-2" onClick={handleReset} disabled={isUploading}>
          Reset
        </Button>
      </div>

      {uploadError && (
        <div className="w-full p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-md">
          <p className="text-sm text-red-700 dark:text-red-300">Error: {uploadError}</p>
        </div>
      )}

      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 text-center">
        {isUploading ? 'Subiendo imagen a servidor...' : 'La imagen se subirá automáticamente al servidor'}
      </p>
    </div>
  )
}
