'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BiUser } from 'react-icons/bi'
import { proveedorService } from '@/app/Service/proveedor/ProveedorService'
import type { ProveedorPayload } from '@/app/Service/proveedor/proveedor'

export default function CrearProveedor() {
  const router = useRouter()
  const [form, setForm] = useState<ProveedorPayload>({
    nombre: '',
    email: '',
    direccion: '',
    contacto: '',
    telefono: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((p) => ({ ...p, [name]: value }))
  }

  const normalizeCreateResp = (resp: any) => {
    if (!resp) return { success: false, message: 'Respuesta vacía' }
    if (typeof resp === 'object') {
      if ('success' in resp) return { success: Boolean(resp.success), message: resp.message ?? '', proveedor: resp.proveedor }
      if ('proveedor' in resp) return { success: true, message: resp.message ?? '', proveedor: resp.proveedor ?? resp.proveedor }
      // respuesta directa con el proveedor
      return { success: true, message: '', proveedor: resp }
    }
    return { success: false, message: 'Respuesta inválida' }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!form.nombre || !form.email) {
      setError('Nombre y email son requeridos')
      return
    }

    try {
      setLoading(true)
      const resp = await proveedorService.create(form)
      const parsed = normalizeCreateResp(resp)

      if (parsed.success) {
        router.push('/main')
        return
      }

      setError(parsed.message || 'No se pudo crear el proveedor')
    } catch (err: any) {
      console.error('Error creando proveedor', err)
      const msg = err?.response?.data?.error ?? err?.message ?? 'No se pudo crear el proveedor. Reintenta.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex h-screen items-center flex-col bg-blend-darken relative">
      <div className="absolute -z-10 inset-0 opacity-50 bg-center bg-cover" style={{ backgroundImage: "url('/paquete.jpg')" }} />

      <Card className="m-5 w-[35rem] border-none bg-var6 dark:bg-var2 xl:h-[35rem]">
        <CardHeader className="flex items-center justify-center">
          <CardTitle className="text-3xl">CREAR PROVEEDOR</CardTitle>
        </CardHeader>

        <CardContent className="flex h-full w-full">
          <form
            id="register-form"
            className="flex w-full flex-col justify-center items-center"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col gap-12 w-full px-6">
              <div className="grid gap-5">
                <div className="flex flex-col sm:flex-row gap-5 w-full">
                  <div className="grid gap-2 flex-1">
                    <Label htmlFor="nombre">Nombre</Label>
                    <div className="relative flex items-center">
                      <Input
                        className="h-[3rem] rounded-4xl border-none bg-var5 dark:bg-var1 pl-12 w-full"
                        id="nombre"
                        name="nombre"
                        type="text"
                        placeholder="John"
                        value={form.nombre}
                        onChange={handleChange}
                        required
                      />
                      <BiUser className="absolute left-4 text-muted-foreground" size={20} />
                    </div>
                  </div>

                  <div className="grid gap-2 flex-1">
                    <Label htmlFor="apellido">Apellido</Label>
                    <div className="relative flex items-center">
                      <Input
                        className="h-[3rem] rounded-4xl border-none bg-var5 dark:bg-var1 pl-12 w-full"
                        id="apellido"
                        name="contacto"
                        type="text"
                        placeholder="Doe"
                        value={form.contacto}
                        onChange={handleChange}
                      />
                      <BiUser className="absolute left-4 text-muted-foreground" size={20} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  className="h-12 rounded-4xl border-none bg-var5 pl-5 dark:bg-var1"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john_doe@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="flex flex-col gap-2 w-full">
                <Label htmlFor="direccion">Dirección de la distribuidora</Label>
                <Input
                  className="h-12 rounded-4xl border-none bg-var5 pl-5 dark:bg-var1"
                  id="direccion"
                  name="direccion"
                  type="text"
                  placeholder="Corrientes 1234, CABA"
                  value={form.direccion}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col gap-2 w-full">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  className="h-12 rounded-4xl border-none bg-var5 pl-5 dark:bg-var1"
                  id="telefono"
                  name="telefono"
                  type="text"
                  placeholder="0123456789"
                  value={form.telefono}
                  onChange={handleChange}
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex h-full items-center justify-center">
          <Button
            form="register-form"
            type="submit"
            className="h-12 w-fit cursor-pointer bg-var4 px-15 hover:bg-var1/50 dark:bg-var1"
            disabled={loading}
          >
            {loading ? 'Creando...' : 'Crear Proveedor'}
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
