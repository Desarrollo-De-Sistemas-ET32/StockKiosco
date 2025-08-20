'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { supabase } from '@/supabase/supabase'
import SubirImagen from '@/components/ui/subirImagen' // asegúrate que este path exista

export default function EditarProductoPage() {
  const router = useRouter()

  const [nombre, setNombre] = useState('')
  const [codigoBarras, setCodigoBarras] = useState('')
  const [vencimiento, setVencimiento] = useState('')
  const [categoria, setCategoria] =  useState('')
  const [marca, setMarca] = useState('')
  const [precioCompra, setPrecioCompra] = useState('')
  const [precioPublico, setPrecioPublico] = useState('')
  const [imagenPreview, setImagenPreview] = useState<string>('/milka.png')
  const [imagenUrl, setImagenUrl] = useState<string | null>(null) // URL pública guardada
  const [saving, setSaving] = useState(false)

  // callback que recibe la URL pública desde el componente SubirImagen
  const handleImageSelected = (publicUrl: string) => {
    setImagenUrl(publicUrl)
    setImagenPreview(publicUrl) // mostrar la imagen subida
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!nombre) return alert('Nombre requerido')

    setSaving(true)
    try {
      const producto = {
        nombre,
        codigo_barras: codigoBarras || null,
        vencimiento: vencimiento || null,
        categoria: categoria || null,
        marca: marca || null,
        precio_compra: precioCompra ? parseFloat(precioCompra) : null,
        precio_publico: precioPublico ? parseFloat(precioPublico) : null,
        images: imagenUrl ?? null, // <-- guardamos la URL en la columna "images"
      };

      const { data, error } = await supabase
        .from('productos')
        .insert([producto]);

      if (error) {
        console.error('Error al crear producto:', error);
        alert('Error al crear producto: ' + error.message);
        setSaving(false)
        return;
      }

      alert('Producto creado ✅');
      // Limpio formulario (opcional) y redirijo
      setNombre('')
      setCodigoBarras('')
      setVencimiento('')
      setCategoria('')
      setMarca('')
      setPrecioCompra('')
      setPrecioPublico('')
      setImagenPreview('/milka.png')
      setImagenUrl(null)

      // redirigir a lista de productos o volver
      router.push('/productos') // ajustá la ruta si hace falta
    } catch (err: any) {
      console.error(err);
      alert('Error inesperado');
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-2xl p-8 w-full max-w-4xl flex flex-col">
        <h1 className="text-center text-2xl font-bold mb-6">CREAR PRODUCTO</h1>
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
                  <option>Villavicencio</option>
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
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-b from-gray-700 to-gray-500 text-white hover:from-gray-600 hover:to-gray-400"
                disabled={saving}
              >
                {saving ? 'Guardando...' : 'Siguiente'}
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => window.history.back()}>Volver</Button>
            </div>
          </form>


          <div className="flex-1 flex flex-col items-center gap-4">
            <div className="w-full h-48 bg-white rounded-lg overflow-hidden flex items-center justify-center">
              {/* Si imagenPreview es una URL remota (Supabase), Next.js Image necesita agregar el dominio en next.config.js */}
              <Image
                src={imagenPreview}
                alt="Producto"
                width={300}
                height={200}
                className="object-contain"
              />
            </div>

            {/* Componente reutilizable para subir imagen */}
            <SubirImagen onUploadComplete={handleImageSelected} />

            {imagenUrl && (
              <div className="text-sm text-green-700 mt-2">Imagen lista: {imagenUrl}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
