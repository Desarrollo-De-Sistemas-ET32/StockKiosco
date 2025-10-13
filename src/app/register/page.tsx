'use client'

import React, { useState } from 'react'
import Image from 'next/image'
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
import { BiEnvelope, BiKey, BiUser } from 'react-icons/bi'
import { usuarioService } from '@/app/Service/usuario/UsuarioService'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ nombre: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setForm((p) => ({ ...p, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await usuarioService.addUsuario({
        nombre: form.nombre,
        email: form.email,
        password: form.password,
      })

      // Redirigir después del registro (ajustá la ruta si preferís otra)
      router.push('/login')
    } catch (err: any) {
      console.error('Error en registro:', err)
      const msg = err?.response?.data?.message || err?.message || 'Error registrando usuario'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex h-screen items-center justify-center overflow-hidden">
      <Image  
        src={`/andamoactivo.jpg`}
        fill
        objectFit="cover"
        alt="Background"
        className="absolute opacity-100"
      />
      <Card className="flex flex-col justify-center m-5 w-[28rem] [@media(max-height:550px)]:grow max-w-[50rem] border-none bg-var7 dark:bg-var2 drop-shadow-xl/75 ">
        <CardHeader className="flex items-center justify-center">
          <CardTitle className="text-3xl text-black dark:text-white cursor-default">REGISTRARSE</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 items-center justify-center flex-wrap">
          {/* Mostrar error sin alterar diseño (pequeño banner dentro del card) */}
          {error && (
            <div className="w-full mb-4 px-3 py-2 rounded bg-red-100 text-red-700 text-sm text-center">
              {error}
            </div>
          )}

          <form id="register-form" className="flex w-full flex-col flex-wrap" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-12">
              <div className="grid gap-2">
                <Label htmlFor="nombre" className="text-black dark:text-white font-semibold">Nombre Completo</Label>
                <div className="relative">
                  <Input
                    className="h-12 rounded-lg border-none bg-var5 pl-12  dark:text-white dark:bg-var1"
                    id="nombre"
                    type="text"
                    placeholder="John Doe"
                    required
                    value={form.nombre}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <BiUser
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={20}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-black dark:text-white font-semibold">Correo electrónico</Label>
                <div className="relative">
                  <Input
                    className="h-12 rounded-lg border-none bg-var5 pl-12 dark:text-white dark:bg-var1"
                    id="email"
                    type="email"
                    placeholder="john_doe@example.com"
                    required
                    value={form.email}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <BiEnvelope
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={20}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-black dark:text-white font-semibold">Contraseña</Label>
                <div className="relative">
                  <Input
                    className="h-12 rounded-lg border-none bg-var5 pl-12 dark:text-white dark:bg-var1"
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={form.password}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <BiKey
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={20}
                  />
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex h-full items-center justify-center">
          <Button
            form="register-form"
            type="submit"
            className="h-12 w-3/4 cursor-pointer bg-white text-black dark:text-var4 font-semibold transition-colors border border-transparent hover:border-white hover:text-white duration:350 hover:border-1 ease-in-out dark:bg-var1"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
