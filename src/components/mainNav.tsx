'use client'

import { Button } from '@/components/ui/button'
import React from 'react'

export default function MainNav() {
  return (
    <nav className="flex items-center gap-4 bg-gray-800 p-3 rounded-md mb-6">
      <div className="w-10 h-10 bg-gray-600 rounded-full" />
      <Button variant="outline" className="bg-white text-black">Página Principal</Button>
      <Button variant="outline" className="bg-white text-black">Estadísticas</Button>
      <Button variant="outline" className="bg-white text-black">Configuración</Button>
      <Button variant="outline" className="bg-white text-black">Registros</Button>
    </nav>
  )
}
