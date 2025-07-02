'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-md">
        <h1 className="text-center text-3xl font-bold mb-6">Regístrate</h1>
        <form className="space-y-4">
          <Input
            label="Nombre"
            type="text"
            name="name"
            placeholder="Ingresá tu nombre"
          />
          <Input
            label="Mail"
            type="email"
            name="email"
            placeholder="tu@ejemplo.com"
          />
          <Input
            label="Teléfono"
            type="tel"
            name="phone"
            placeholder="+54 9 11 1234‑5678"
          />
          <Input
            label="Contraseña"
            type="password"
            name="password"
            placeholder="•••••••••"
          />
          <Input
            label="Repite la contraseña"
            type="password"
            name="confirmPassword"
            placeholder="•••••••••"
          />

          <p className="text-center text-sm text-gray-600">
            ¿Ya tenés cuenta?{' '}
            <a href="/login" className="text-blue-600 hover:underline">
              Inicia sesión
            </a>
          </p>

          <Button
            type="submit"
            variant="green"
            size="default"
            className="w-full"
          >
            Crear
          </Button>
        </form>
      </div>
    </div>
  );
}
