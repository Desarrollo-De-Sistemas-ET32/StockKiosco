"use client"

import { useState, useEffect, useRef, ChangeEvent } from "react"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"

const supabase = createClient(
  "https://vqkilvejuwcsxufssdvx.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxa2lsdmVqdXdjc3h1ZnNzZHZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NjA2MzEsImV4cCI6MjA2MzIzNjYzMX0.qO5W9toOEze0NPtJiV6E1aDTput2MSWy6Mzf38AjYK8"
)

interface UploadImageProps {
  productoId?: string | number
  initialPreview?: string
  onUpload?: (dataUrl: string) => void
  maxSizeMB?: number
}

export const UploadImage: React.FC<UploadImageProps> = ({
  productoId,
  initialPreview,
  onUpload,
  maxSizeMB = 5,
}) => {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | undefined>(initialPreview)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])

  // debug helper
  const dbg = (...args: any[]) => {
    // visible in console
    console.log("[UploadImage]", ...args)
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    dbg("file input change event")
    const f = e.target.files?.[0] ?? null
    if (!f) {
      dbg("no file selected")
      return
    }
    dbg("selected file:", f.name, f.size, f.type)
    if (f.size > maxSizeMB * 1024 * 1024) {
      const msg = `El archivo supera el límite de ${maxSizeMB} MB`
      setError(msg)
      dbg(msg)
      return
    }
    setFile(f)
    setError(null)
  }

  // File -> data URL
  const fileToDataUrl = (f: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string | null
        if (!result) return reject(new Error("No se pudo leer el archivo"))
        resolve(result)
      }
      reader.onerror = (e) => {
        dbg("FileReader error", e)
        reject(new Error("Error leyendo el archivo"))
      }
      reader.readAsDataURL(f)
    })

  const upload = async () => {
    dbg("upload() called")
    if (!file) {
      setError("No hay archivo seleccionado")
      dbg("no file, aborting")
      return
    }
    setLoading(true)
    setError(null)
    try {
      dbg("convirtiendo archivo a data URL...")
      const dataUrl = await fileToDataUrl(file)
      dbg("dataUrl length:", dataUrl.length)

      if (onUpload) {
        dbg("llamando onUpload callback")
        onUpload(dataUrl)
      }

      if (productoId !== undefined && productoId !== null) {
        dbg("actualizando tabla productos id=", productoId)
        const { data, error } = await supabase
          .from("productos")
          .update({ images: dataUrl })
          .eq("id", productoId)

        if (error) {
          dbg("supabase update error:", error)
          throw error
        }
        dbg("update success:", data)
      } else {
        dbg("productoId no provisto — no se actualiza DB, solo devuelve dataUrl")
      }
    } catch (err: any) {
      dbg("upload error:", err)
      setError(err?.message || "Error al procesar/subir la imagen")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div className="w-full h-56 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden flex items-center justify-center mb-3">
        {preview ? (
          <img src={preview} alt="preview" className="max-h-full max-w-full object-contain" />
        ) : (
          <div className="text-sm text-gray-500">No hay imagen seleccionada</div>
        )}
      </div>

      <div className="flex gap-3">
        {/* Hidden input, referenciado por inputRef. El botón Subir imagen dispara inputRef.current.click() */}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* botón que abre el file picker */}
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => {
            dbg("Subir imagen button clicked -> trigger file input")
            inputRef.current?.click()
          }}
        >
          <span className="flex items-center justify-center gap-2 px-4 py-2">Subir imagen</span>
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="px-4 py-2"
          onClick={() => {
            dbg("Reset clicked")
            setFile(null)
            setPreview(initialPreview)
            setError(null)
            // clear native input value so change fires next time same file chosen
            if (inputRef.current) inputRef.current.value = ""
          }}
        >
          Reset
        </Button>

        <Button
          type="button"
          className="px-4 py-2"
          disabled={loading || !file}
          onClick={upload}
        >
          {loading ? "Subiendo..." : "Confirmar subida"}
        </Button>
      </div>

      {/* filename + errors + debug hints */}
      <div className="mt-2">
        {file && <div className="text-sm text-gray-700 dark:text-gray-300">Archivo: {file.name} ({Math.round(file.size / 1024)} KB)</div>}
        {error && <div className="text-sm text-red-500 mt-1">{error}</div>}
        <div className="text-xs text-gray-500 mt-1">Abre la consola del navegador (F12) si algo no funciona — ahí verás logs del proceso.</div>
      </div>
    </div>
  )
}

export default UploadImage
