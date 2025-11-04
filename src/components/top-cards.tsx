export default function TopCard({ nombreProducto, cantVendidos, precio}:
  {nombreProducto: string, cantVendidos: number, precio: number}) {
    return (
      <div className="flex justify-between items-center bg-light-10 dark:bg-dark-10 p-3 rounded-lg mb-2">
        <div className="flex items-center gap-3 pl-1">
          <div>
            <p className="text-foreground font-semibold">{nombreProducto}</p>
            <p className="text-foreground text-sm">{cantVendidos} Unidades</p>
          </div>
        </div>
  
        <div className="text-right">
          <p className="dark:text-foreground">${precio}</p>
        </div>
      </div>

  )
}