'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function ActualizarProveedorPage() {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    direccion: '',
    contacto: '',
    telefono: '',
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    console.log('Formulario enviado:', form)
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


          <form onSubmit={handleSubmit} className="flex-1 space-y-4 w-full">
            <Input
              label="Nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre"
              className='dark:bg-var2'
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="correo@ejemplo.com"
              className='dark:bg-var2'

            />
            <Input
              label="Dirección"
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              placeholder="Calle, número, ciudad"
              className='dark:bg-var2'
            />
            <Input
              label="Contacto"
              name="contacto"
              value={form.contacto}
              onChange={handleChange}
              placeholder="Persona de contacto"
              className='dark:bg-var2'
            />
            <Input
              label="Teléfono"
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              placeholder="0123456789"
              className='dark:bg-var2'
            />

            <div className="flex gap-4 pt-2">
              <Button
                variant="secondary"
                type="button"
                className="bg-gray-500 hover:bg-gray-600 text-white"
                onClick={() => window.history.back()}>
                Cancelar
              </Button>
              <Button type="submit">Actualizar</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
