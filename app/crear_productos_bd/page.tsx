// editar_producto.tsx (fragmento)
"use client"

import { useState, FormEvent } from "react"
import { createClient } from "@supabase/supabase-js"
import { UploadImage } from "@/components/ui/subirImagen"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const supabase = createClient(
  "https://vqkilvejuwcsxufssdvx.supabase.co",
  "TU_ANON_KEY_AQUI"
)

export default function EditarProductoPage() {
  const [nombre, setNombre] = useState("")
  // ... otros campos ...
  const [productoId, setProductoId] = useState<number | null>(null)
  const [imagenUrl, setImagenUrl] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      // Insertás primero sin images
      const { data, error } = await supabase
        .from("productos")
        .insert([{ nombre /*, ...resto campos*/ }])
        .select("id")
        .single()

      if (error) throw error
      const id = data.id
      setProductoId(id)
      alert(`Producto creado con id=${id}. Ahora subí la imagen.`)
      // NO hacer aquí el update: esperar a que el usuario presione Confirmar subida
    } catch (err: any) {
      console.error(err)
      alert(err.message || "Error creando producto")
    }
  }

  // onUpload solo actualiza la columna images (si productoId está disponible)
  const handleOnUpload = async (dataUrl: string) => {
    setImagenUrl(dataUrl)              // guardá en estado para preview/local
    if (!productoId) {
      console.warn("Aún no hay productoId: subí la imagen después de crear el producto")
      return
    }
    try {
      const { data, error } = await supabase
        .from("productos")
        .update({ images: dataUrl })
        .eq("id", productoId)

      if (error) throw error
      console.log("Imagen guardada en DB:", data)
      alert("Imagen guardada correctamente.")
    } catch (err: any) {
      console.error("Error actualizando images:", err)
      alert(err.message || "Error actualizando imagen en DB")
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Input value={nombre} onChange={(e) => setNombre(e.target.value)} />
        {/* ... resto campos ... */}
        <Button type="submit">Crear producto</Button>
      </form>

      {/* componente de subir: no hace UPDATE por sí mismo si no le pasás productoId,
          pero su onUpload te devolverá la dataUrl y acá la actualizamos */}
      <UploadImage
        initialPreview={imagenUrl ?? undefined}
        onUpload={handleOnUpload}
      />
    </div>
  )
}
