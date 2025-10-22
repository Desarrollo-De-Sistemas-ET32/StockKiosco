export default function Gestion() {
  return (
    <div className="w-full flex flex-col items-center px-4 py-10">
      {/* Contenedor de tarjetas */}
      <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-8">
        {/* Card Proveedores */}
        <div className="flex flex-col gap-5 bg-var1 rounded-[40px] overflow-hidden shadow-lg hover:scale-[1.02] transition-transform cursor-pointer p-[15px]">
          <img
            src={"/img/proveedor.jpg"}
            alt="Proveedores"
            className="w-full object-cover rounded-[15px]"
          ></img>
          <div className="flex justify-center">
            <span className="text-white font-semibold text-xl tracking-wide">
              PROVEEDORES
            </span>
          </div>
        </div>
        {/* Card Descuentos */}
        <div className="flex flex-col gap-5 bg-var1 rounded-[40px] overflow-hidden shadow-lg hover:scale-[1.02] transition-transform cursor-pointer p-[25px]">
          <img
            src={"/img/descuentos.jpg"}
            alt="Proveedores"
            className="w-full h-full object-cover rounded-[15px]"
          ></img>
          <div className="flex justify-center">
            <span className="text-white font-semibold text-xl tracking-wide">
              DESCUENTOS
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
