'use client'

import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { proveedorService } from '@/app/Service/proveedor/ProveedorService'
import { ProveedorPayload, ProveedorWithId } from '@/app/Service/proveedor/proveedor'

export default function ActualizarProveedorPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams?.get('id')

  const [form, setForm] = useState<ProveedorPayload>({
    nombre: '',
    email: '',
    direccion: '',
    contacto: '',
    telefono: '',
  })

  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null) // para errores de submit

  // Cargar datos del proveedor al montar el componente
  useEffect(() => {
    let mounted = true

    const fetchProveedor = async () => {
      if (!id) {
        if (mounted) {
          setLoadError('ID de proveedor no proporcionado')
          setLoadingData(false)
        }
        return
      }

      try {
        if (mounted) setLoadingData(true)

        // proveedorService.getById devuelve response.data (o null) según tu service
        const resp = await proveedorService.getById(Number(id))

        // resp puede ser: null | ProveedorWithId | { proveedor: ProveedorWithId } | { data: ProveedorWithId }\        const proveedor: ProveedorWithId | null = resp
          ? ((resp as any).proveedor ?? (resp as any).data ?? resp) as ProveedorWithId
          : null

        if (mounted) {
          if (proveedor) {
            setForm({
              nombre: proveedor.nombre ?? '',
              email: proveedor.email ?? '',
              direccion: proveedor.direccion ?? '',
              contacto: proveedor.contacto ?? '',
              telefono: proveedor.telefono ?? '',
            })
          } else {
            setLoadError('Proveedor no encontrado')
          }
        }
      } catch (err) {
        console.error('Error cargando proveedor:', err)
        if (mounted) setLoadError('Error al cargar los datos del proveedor')
      } finally {
        if (mounted) setLoadingData(false)
      }
    }

    fetchProveedor()

    return () => {
      mounted = false
    }
  }, [id])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!id) {
      setError('ID de proveedor no válido')
      return
    }

    setLoading(true)
    setError(null)

    try {
      await proveedorService.update(Number(id), form)

      // Redirigir a la lista de proveedores
      router.push('/proveedores')
      console.log('Proveedor actualizado exitosamente')
    } catch (err) {
      console.error('Error actualizando proveedor:', err)
      setError('Error al actualizar el proveedor. Por favor, intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="min-h-screen bg-var5 dark:bg-[#212529] flex items-center justify-center">
        <p className="text-lg">Cargando datos del proveedor...</p>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-var5 dark:bg-[#212529] flex items-center justify-center">
        <div className="text-center p-6">
          <p className="text-lg text-red-500 mb-4">{loadError}</p>
          <Button onClick={() => router.back()}>Volver</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-var5 dark:bg-[#212529] flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-2xl p-10 w-full max-w-6xl dark:bg-var1">
        <div className="flex flex-col md:flex-row gap-10 items-center">

          <div className="flex-1 w-full h-full max-w-md flex flex-col items-start gap-6">
            <h1 className="text-3xl font-bold">ACTUALIZAR PROVEEDOR</h1>
            <Image
              src="/img/proveedor.jpg"
              alt="Proveedor"
              width={400}
              height={300}
              className="rounded-xl object-cover w-full h-auto"
            />
          </div>

          <form onSubmit={handleSubmit} className="flex-1 space-y-4 w-full" aria-live="polite">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="nombre" className="block text-sm font-medium mb-1">Nombre</label>
              <Input
                id="nombre"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                placeholder="Nombre"
                className="dark:bg-var2"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                className="dark:bg-var2"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="direccion" className="block text-sm font-medium mb-1">Dirección</label>
              <Input
                id="direccion"
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                placeholder="Calle, número, ciudad"
                className="dark:bg-var2"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="contacto" className="block text-sm font-medium mb-1">Contacto</label>
              <Input
                id="contacto"
                name="contacto"
                value={form.contacto}
                onChange={handleChange}
                placeholder="Persona de contacto"
                className="dark:bg-var2"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="telefono" className="block text-sm font-medium mb-1">Teléfono</label>
              <Input
                id="telefono"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                placeholder="0123456789"
                className="dark:bg-var2"
                required
                disabled={loading}
              />
            </div>

            <div className="flex gap-4 pt-2">
              <Button
                variant="secondary"
                type="button"
                className="bg-gray-500 hover:bg-gray-600 text-white"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Actualizando...' : 'Actualizar'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
