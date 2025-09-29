export default function Venta({nombreProducto, horario, precio, unidades}: {nombreProducto: string, horario?: string, precio?: number, unidades?: number}) {

    let unidad = "unidad";
    const safeUnidades = unidades ?? 1;

    if(safeUnidades > 1){
        unidad = "unidades";
    }
    return(
        <div className="flex flex-row justify-between items-center">
            <div>
                <p>{nombreProducto}</p>
                <p className="text-sm">{horario}</p>
            </div>
            <div className="flex flex-col items-end">
                <p>{`$` + precio}</p>
                <p>{safeUnidades} {unidad}</p>
            </div>
        </div>
    )
}