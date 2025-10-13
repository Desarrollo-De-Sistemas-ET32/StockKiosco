export default function TopCard({puesto, nombreProducto, cantVendidos, precio, variacion}:
  {puesto: number, nombreProducto: string, cantVendidos: number, precio: number, variacion: number}) {
    return (
      <div className="flex justify-between items-center bg-var4 dark:bg-[#2F363C] p-3 rounded-lg mb-2">
        <div className="flex items-center gap-3 pl-1">
          <div className="flex justify-center items-center w-10 h-10 rounded-full bg-[#245144] text-[#059A43] font-bold">
            {puesto}
          </div>
          <div>
            <p className="text-white font-semibold">{nombreProducto}</p>
            <p className="text-gray-400 text-sm">{cantVendidos} Unidades</p>
          </div>
        </div>
  
        <div className="text-right">
          <p className="text-green-400 font-bold">${precio}</p>
          <p className="text-green-500 text-sm">+${variacion}</p>
        </div>
      </div>

  )
}