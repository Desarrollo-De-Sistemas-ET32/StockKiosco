export default function TopCard({puesto, nombreProducto, cantVendidos, precio, variacion}:
  {puesto: number, nombreProducto: string, cantVendidos: number, precio: number, variacion: number}) {
    return (
      <div className="flex justify-between items-center bg-light-10 dark:bg-[#2F363C] p-3 rounded-lg mb-2">
        <div className="flex items-center gap-3 pl-1">
          <div>
            <p className="text-white font-semibold">{nombreProducto}</p>
            <p className="text-white/80 text-sm">{cantVendidos} Unidades</p>
          </div>
        </div>
  
        <div className="text-right">
          <p className="text-white dark:text-green-400 font-bold">${precio}</p>
          <p className="text-white dark:text-green-500 text-sm">+${variacion}</p>
        </div>
      </div>

  )
}