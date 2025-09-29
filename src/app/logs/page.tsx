'use client'

import { Button } from '@/components/ui/button'
import { FaUser } from 'react-icons/fa'
import { useEffect, useState } from 'react'

interface Log {
  fecha: string
  usuario: string
  accion: string
  producto?: string
  cantidad?: number
  ip?: string
  hora?: string
}

export default function LogsPage() {
  const [logs, setLogs] = useState<Log[]>([])

  useEffect(() => {
    fetch('/logs/logs.json')
      .then((res) => res.json())
      .then((data) => setLogs(data))
      .catch((err) => console.error('Error cargando logs:', err))
  }, [])

  return (
    <div className="min-h-screen bg-[#212529] flex items-center justify-center p-4">
      <div className="bg-[#e9edf1] rounded-2xl w-full max-w-5xl p-4 sm:p-6 md:p-8 flex flex-col items-center dark:bg-[#2F363C]">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">
          Última actividad
        </h1>

        <div className="bg-var2 rounded-xl p-3 sm:p-4 w-full">
          <div className="bg-var3 rounded-lg p-3 sm:p-4 max-h-80 sm:max-h-96 overflow-y-auto space-y-3 sm:space-y-4">
            {logs.map((log, index) => (
              <div
                key={index}
                className="bg-var2 text-white rounded-md px-3 sm:px-4 py-2 flex items-start sm:items-center gap-3 sm:gap-4 text-sm sm:text-base"
              >
                <FaUser className="text-lg sm:text-xl mt-1 sm:mt-0" />
                <span>
                  <strong>{log.usuario}</strong> - {log.accion}
                  {log.producto && (
                    <>
                      {' '}
                      <strong>{log.producto}</strong>
                      {log.cantidad !== undefined ? ` (Cantidad: ${log.cantidad})` : ''}
                    </>
                  )}
                  {log.ip && <> (IP: {log.ip})</>}
                  {' '}a las <strong>{log.hora}</strong>
                </span>
              </div>
            ))}
          </div>
        </div>

        <Button
          variant="secondary"
          type="button"
          className="mt-6 sm:mt-10 bg-[#6c757d] hover:bg-[#5a6268] text-white px-6 sm:px-8 py-2 text-sm sm:text-base"
          onClick={() => window.history.back()}
        >
          Volver
        </Button>
      </div>
    </div>
  )
}
