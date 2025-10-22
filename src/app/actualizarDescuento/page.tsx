// AQUÍ VA TU NAVBAR (importar tu componente Navbar)

export default function ActualizarProveedor() {
  return (
    <div className="min-h-screen w-full bg-[#1E242B] flex items-center justify-center px-4 py-10">
      <div className="bg-[#2B333B] w-full max-w-6xl rounded-lg shadow-lg p-6 md:p-10 flex flex-col gap-6">

        {/* Título */}
        <h2 className="text-white text-2xl font-semibold text-center md:text-left">
          ACTUALIZAR PROVEEDOR
        </h2>

        {/* Contenedor principal */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Imagen */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <img
              src="https://images.unsplash.com/photo-1607082349566-187342175e2c"
              alt="Entrega de proveedor"
              className="rounded-lg object-cover w-full h-72 md:h-full"
            />
          </div>

          {/* Formulario */}
          <form className="w-full lg:w-1/2 flex flex-col gap-5">

            <div className="flex flex-col gap-1">
              <label className="text-white">Nombre</label>
              <input
                className="bg-[#1E242B] text-white rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                type="text"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-white">Email</label>
              <input
                className="bg-[#1E242B] text-white rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                type="email"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-white">Dirección</label>
              <input
                className="bg-[#1E242B] text-white rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                type="text"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-white">Contacto</label>
              <input
                className="bg-[#1E242B] text-white rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                type="text"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-white">Teléfono</label>
              <input
                className="bg-[#1E242B] text-white rounded-lg px-4 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                type="tel"
              />
            </div>

            {/* Botones */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <button
                type="button"
                className="w-full sm:w-auto px-6 py-2 bg-[#4B5563] text-white rounded-lg hover:bg-[#5B6470] transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2 bg-[#6C757D] text-white rounded-lg hover:bg-[#7D868E] transition"
              >
                Actualizar
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
