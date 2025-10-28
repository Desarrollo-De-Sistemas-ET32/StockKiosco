// app/.../gestionar_proveedores/page.tsx  (o la ruta donde tengas la página)
'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import CardProveedor from '@/components/gestion-card' // asegúrate que la ruta coincida
import { proveedorService } from '@/app/Service/proveedor/ProveedorService'
import type { ProveedorPayload, ProveedorWithId } from '@/app/Service/proveedor/proveedor'

export default function ListaProveedores() {
  const [proveedores, setProveedores] = useState<ProveedorWithId[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [search, setSearch] = useState('')

  const emptyForm = { nombre: '', email: '', direccion: '', contacto: '', telefono: '' }
  const [modalForm, setModalForm] = useState<ProveedorPayload>(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  const [editingId, setEditingId] = useState<number | null>(null)
  const [loadingEditData, setLoadingEditData] = useState(false)

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
      await proveedorService.create(modalForm)
      await refreshList()
      setIsCreateOpen(false)
      setModalForm(emptyForm)
    } catch (err: any) {
      console.error('Error creando proveedor', err)
      setError(String(err?.response?.data?.error ?? err?.message ?? 'Error creando proveedor'))
    } finally {
      setSubmitting(false)
    }
  }

  const openEditModal = async (id?: number | string) => {
    const numericId = typeof id === 'string' ? Number(id) : id
    if (!numericId) return setError('ID inválido')
    setError(null)
    setEditingId(numericId as number)
    setIsEditOpen(true)
    setLoadingEditData(true)
    try {
      const resp = await proveedorService.getById(Number(numericId))
      if (!resp) {
        setError('Proveedor no encontrado')
        setIsEditOpen(false)
        return
      }
      const provider = (resp as any).proveedor ?? (resp as any).data ?? resp
      setModalForm({
        nombre: provider.nombre ?? '',
        email: provider.email ?? '',
        direccion: provider.direccion ?? '',
        contacto: provider.contacto ?? '',
        telefono: provider.telefono ?? '',
      })
    } catch (err: any) {
      console.error('Error al cargar proveedor para editar', err)
      setError('Error al cargar datos para editar')
      setIsEditOpen(false)
    } finally {
      setLoadingEditData(false)
    }
  }

  const handleUpdate = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!editingId) return setError('ID inválido para editar')
    if (!modalForm.nombre || !modalForm.email) {
      return setError('Nombre y email son requeridos')
    }
    try {
      setSubmitting(true)
      await proveedorService.update(editingId, modalForm)
      await refreshList()
      setIsEditOpen(false)
      setEditingId(null)
      setModalForm(emptyForm)
    } catch (err: any) {
      console.error('Error actualizando proveedor', err)
      setError(String(err?.response?.data?.error ?? err?.message ?? 'Error actualizando proveedor'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id?: number | string) => {
    const numericId = typeof id === 'string' ? Number(id) : id
    if (!numericId) return
    if (!confirm('¿Eliminar este proveedor?')) return
    try {
      setLoading(true)
      await proveedorService.delete(Number(numericId))
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
          <Button
            onClick={() => {
              setIsCreateOpen(true)
              setError(null)
              setModalForm(emptyForm)
            }}
            className="bg-green-600"
          >
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
            <div className="flex items-center justify-center py-6 text-gray-500">No se encontraron proveedores</div>
          ) : (
            proveedoresFiltrados.map((p) => (
              <div key={p.id_proveedor ?? p.nombre} className="flex items-center justify-between">
                <CardProveedor
                  id={p.id_proveedor}
                  nombre={p.nombre}
                  telefono={p.telefono}
                  cuil={(p as any).cuil ?? ''}
                  onEdit={openEditModal}
                  onDelete={handleDelete}
                />
              </div>
            ))
          )}
        </div>

        {error && <div className="text-sm text-red-500 mt-2">{error}</div>}
      </div>

      {/* Modal Crear */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white p-7 rounded-2xl w-full max-w-md shadow-xl dark:bg-var1">
            <h2 className="mb-5 text-center text-xl font-extrabold text-gray-800 dark:text-white">Agregar Proveedor</h2>

            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <label className="text-xs">Nombre</label>
              <input name="nombre" value={modalForm.nombre} onChange={handleModalChange} className="w-full px-3 py-2 border rounded" />

              <label className="text-xs">Email</label>
              <input name="email" value={modalForm.email} onChange={handleModalChange} type="email" className="w-full px-3 py-2 border rounded" />

              <label className="text-xs">Dirección</label>
              <input name="direccion" value={modalForm.direccion} onChange={handleModalChange} className="w-full px-3 py-2 border rounded" />

              <label className="text-xs">Contacto</label>
              <input name="contacto" value={modalForm.contacto} onChange={handleModalChange} className="w-full px-3 py-2 border rounded" />

              <label className="text-xs">Teléfono</label>
              <input name="telefono" value={modalForm.telefono} onChange={handleModalChange} className="w-full px-3 py-2 border rounded" />

              <div className="flex justify-end gap-2 mt-2">
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                  {submitting ? 'Guardando...' : 'Guardar'}
                </button>
                <button type="button" onClick={() => { setIsCreateOpen(false); setModalForm(emptyForm); setError(null) }} className="px-4 py-2 bg-gray-300 rounded-lg">
                  Cerrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
          <div className="bg-white p-7 rounded-2xl w-full max-w-md shadow-xl dark:bg-var1">
            <h2 className="mb-5 text-center text-xl font-extrabold text-gray-800 dark:text-white">
              {loadingEditData ? 'Cargando...' : 'Editar Proveedor'}
            </h2>

            {loadingEditData ? (
              <div className="py-6 text-center">Cargando datos...</div>
            ) : (
              <form onSubmit={handleUpdate} className="flex flex-col gap-4">
                <label className="text-xs">Nombre</label>
                <input name="nombre" value={modalForm.nombre} onChange={handleModalChange} className="w-full px-3 py-2 border rounded" />

                <label className="text-xs">Email</label>
                <input name="email" value={modalForm.email} onChange={handleModalChange} type="email" className="w-full px-3 py-2 border rounded" />

                <label className="text-xs">Dirección</label>
                <input name="direccion" value={modalForm.direccion} onChange={handleModalChange} className="w-full px-3 py-2 border rounded" />

                <label className="text-xs">Contacto</label>
                <input name="contacto" value={modalForm.contacto} onChange={handleModalChange} className="w-full px-3 py-2 border rounded" />

                <label className="text-xs">Teléfono</label>
                <input name="telefono" value={modalForm.telefono} onChange={handleModalChange} className="w-full px-3 py-2 border rounded" />

                <div className="flex justify-end gap-2 mt-2">
                  <button type="submit" disabled={submitting} className="px-4 py-2 bg-green-600 text-white rounded-lg">
                    {submitting ? 'Actualizando...' : 'Actualizar'}
                  </button>
                  <button type="button" onClick={() => { setIsEditOpen(false); setEditingId(null); setModalForm(emptyForm); setError(null) }} className="px-4 py-2 bg-gray-300 rounded-lg">
                    Cerrar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
