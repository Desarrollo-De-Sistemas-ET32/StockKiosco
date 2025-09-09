import { Button } from "./ui/button";
import { BiPlus } from "react-icons/bi";
export default function StockBajo({nombreProducto, unidades , minimoUnidades}: {nombreProducto: string, unidades?: number, minimoUnidades?: number}) {

    let unidad = "unidad";
    const safeUnidades = unidades ?? 1;

    if(safeUnidades > 1){
        unidad = "unidades";
    }
    return(
        <div className="flex flex-col md:flex-row justify-between items-center bg-var5 dark:bg-var1 p-4 rounded-xl gap-5 w-full">
            <div>
                <p>{nombreProducto}</p>
                <p className="text-sm">Minimo requerido: {minimoUnidades}</p>
            </div>
            <div className="flex flex-col gap-5 xl:flex-row">
                <Button className="text-sm bg-danger text-foreground rounded-4xl">{safeUnidades} {unidad}</Button>
                <Button className="bg-neutral text-foreground hover:bg-neutral/80 text-md"><BiPlus/>Reabastecer</Button>
            </div>
        </div>
    )
}