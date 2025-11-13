import Link from "next/link"

import { Button } from "./ui/button";
import { BiPlus } from "react-icons/bi";
export default function StockBajo({ nombreProducto, unidades, minimoUnidades }: { nombreProducto: string, unidades?: number, minimoUnidades?: number }) {

  let unidad = "unidad";
  const safeUnidades = unidades ?? 1;

  if (safeUnidades > 1) {
    unidad = "unidades";
  }
  return (
    <div className="flex flex-row justify-between items-center bg-light-30 dark:bg-dark-60 p-4 rounded-xl gap-5 w-full">
      <div>
        <p>{nombreProducto}</p>
        <p className="text-sm">Minimo requerido: {minimoUnidades}</p>
      </div>
      <div className="flex flex-col gap-5 xl:flex-row">
        <Button className="hover:cursor-default bg-danger text-foreground rounded-xl">{safeUnidades} {unidad}</Button>
        <Link href="/inventory" className="flex justify-center items-center bg-neutral text-foreground hover:bg-neutral/80 text-md rounded-xl p-2"><BiPlus />Reabastecer</Link>
      </div>
    </div>
  )
}