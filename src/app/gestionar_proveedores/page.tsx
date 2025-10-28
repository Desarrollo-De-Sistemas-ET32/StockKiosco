'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import CardProveedor from '@/components/gestion-card'
import { proveedorService } from '@/app/Service/proveedor/ProveedorService'
import type { ProveedorPayload, ProveedorWithId } from '@/app/Service/proveedor/proveedor'

export default function ListaProveedores() {
  const [proveedores, setProveedores] = useState<ProveedorWithId[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')

  // modal form state (campos del payload)
  const [modalForm, setModalForm] = useState<ProveedorPayload>({
    nombre: '',
    email: '',
    direccion: '',
    contacto: '',
    telefono: '',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        if (mounted) {
          setLoadingData(true)
          setError(null)
        }
        const data = await proveedorService.getAll()
        if (mounted) setProveedores(data)
      } catch (err: any) {
        console.error('Error cargando proveedores', err)
        if (mounted) setError('Error al cargar proveedores')
      } finally {
        if (mounted) setLoadingData(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  const refreshList = async () => {
    try {
      setLoadingData(true)
      const data = await proveedorService.getAll()
      setProveedores(data)
    } catch (err) {
      console.error('Error refrescando lista', err)
      setError('Error al refrescar lista')
    } finally {
      setLoadingData(false)
    }
  }

  const proveedoresFiltrados = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return proveedores
    return proveedores.filter((p) => (p.nombre ?? '').toLowerCase().includes(q))
  }, [proveedores, search])

  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setModalForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleCreate = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setError(null)

    if (!modalForm.nombre || !modalForm.email) {
      setError('Nombre y email son requeridos')
      return
    }

    try {
      setSubmitting(true)
      const resp = await proveedorService.create(modalForm)
      // intentar normalizar: resp puede ser { success, proveedor } o el proveedor directamente
      const created =
        (resp && (resp as any).proveedor) ?? (resp && !(resp as any).proveedor ? resp : null)

      // refrescar lista
      await refreshList()
      setIsOpen(false)
      setModalForm({ nombre: '', email: '', direccion: '', contacto: '', telefono: '' })
    } catch (err: any) {
      console.error('Error creando proveedor', err)
      const msg = err?.response?.data?.error ?? err?.message ?? 'Error creando proveedor'
      setError(String(msg))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id?: number) => {
    if (!id) return
    if (!confirm('¿Eliminar este proveedor?')) return
    try {
      setLoading(true)
      await proveedorService.delete(id)
      await refreshList()
    } catch (err: any) {
      console.error('Error eliminando proveedor', err)
      setError('No se pudo eliminar el proveedor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-var1 min-h-screen p-6">
      <div className="flex flex-col items-center gap-4 mx-auto my-5 font-sans max-w-[900px]">
        <h1 className="text-2xl font-semibold dark:text-white">Lista Proveedores</h1>

        <div className="flex items-center w-full gap-4">
          <input
            type="text"
            placeholder="Buscar proveedor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm transition
                       focus:border-blue-500 focus:outline-none focus:shadow-md"
          />
          <Button onClick={() => setIsOpen(true)} className="bg-green-600">
            Agregar
          </Button>
        </div>

        <div
          className="h-[70vh] w-full bg-gray-100 overflow-y-auto p-4 rounded-xl flex flex-col gap-3 dark:bg-var2"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#888 #f1f1f1' }}
        >
          {loadingData ? (
            <div className="flex items-center justify-center py-6">Cargando proveedores...</div>
          ) : proveedoresFiltrados.length === 0 ? (
            <div className="flex items-center justify-center py-6 text-gray-500">
              No se encontraron proveedores
            </div>
          ) : (
            proveedoresFiltrados.map((p) => (
              <div key={p.id_proveedor ?? p.nombre} className="flex items-center justify-between">
                <CardProveedor
                  // props esperados por tu componente
                  nombre={p.nombre}
                  telefono={p.telefono}
                  // si tu Card espera 'cuil' y no existe en el modelo, mandamos vacío
                  cuil={(p as any).cuil ?? ''}
                />
                <div className="ml-4 flex gap-2">
                  <button
                    onClick={() => handleDelete(p.id_proveedor)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                    disabled={loading}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {error && <div className="text-sm text-red-500 mt-2">{error}</div>}
      </div>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white p-7 rounded-2xl w-full max-w-md shadow-xl dark:bg-var1">
            <h2 className="mb-5 text-center text-xl font-extrabold text-gray-800 dark:text-white">
              Agregar Proveedor
            </h2>

            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div className="flex flex-col">
                <label className="mb-1 text-gray-600 text-xs font-medium dark:text-white">Nombre</label>
                <input
                  name="nombre"
                  value={modalForm.nombre}
                  onChange={handleModalChange}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-gray-600 text-xs font-medium dark:text-white">Email</label>
                <input
                  name="email"
                  value={modalForm.email}
                  onChange={handleModalChange}
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-gray-600 text-xs font-medium dark:text-white">Dirección</label>
                <input
                  name="direccion"
                  value={modalForm.direccion}
                  onChange={handleModalChange}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-gray-600 text-xs font-medium dark:text-white">Contacto</label>
                <input
                  name="contacto"
                  value={modalForm.contacto}
                  onChange={handleModalChange}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-gray-600 text-xs font-medium dark:text-white">Teléfono</label>
                <input
                  name="telefono"
                  value={modalForm.telefono}
                  onChange={handleModalChange}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700"
                >
                  {submitting ? 'Guardando...' : 'Guardar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false)
                    setError(null)
                    setModalForm({ nombre: '', email: '', direccion: '', contacto: '', telefono: '' })
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg font-semibold text-sm hover:bg-gray-400"
                >
                  Cerrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
