'use client'

import { Button } from '@/components/ui/button'
import { FaUser } from 'react-icons/fa'

export default function LogsPage() {
  const logs = [
    { name: 'Juan', producto: 'Gaseosa Coca-Cola', hora: '17:50hs' },
  ]

  return (
    <div className="min-h-screen bg-[#212529] flex items-center justify-center p-4">
      <div className="bg-[#e9edf1] rounded-2xl w-full max-w-4xl p-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-8">Ultima actividad</h1>

        <div className="bg-[#b3bbc4] rounded-xl p-4 w-full max-w-2xl">
          <div className="bg-[#d5dbe0] rounded-lg p-4 max-h-96 overflow-y-auto space-y-4">
            {logs.map((log, index) => (
              <div
                key={index}
                className="bg-[#6c757d] text-white rounded-md px-4 py-2 flex items-center gap-4"
              >
                <FaUser className="text-xl" />
                <span>
                  <strong>{log.name}</strong>, creó el producto <strong>{log.producto}</strong> a las {log.hora}
                </span>
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={() => window.history.back()}
          className="mt-10 bg-[#6c757d] hover:bg-[#5a6268] text-white px-8 py-2"
        >
          Volver
        </Button>
      </div>
    </div>
  )
}
