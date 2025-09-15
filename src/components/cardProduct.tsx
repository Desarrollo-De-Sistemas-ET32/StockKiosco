import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BiTrash, BiEdit } from "react-icons/bi";


export default function ProductCard() {
  const pene = 100;
  const barra = "8759214182013";
  return (
    <div className="flex flex-col gap-5 bg-var1 p-5 rounded-2xl w-sm lg:w-full">
      <div className="flex flex-col lg:flex-row justify-between gap-5">
        <div className="flex flex-col gap-5 justify-center items-center lg:items-start">
          <div className="flex justify-start items-start h-5 gap-5">
            <p className="text-xl lg:text-2xl">Vamo a volver</p>
            <Badge className="bg-confirm text-x rounded-3xl lg:rounded-4xl">Hay Stock</Badge>
            <Badge className="bg-neutral text-xs rounded-3xl lg:rounded-4xl">La Campora</Badge>
          </div>
          <div className="grid grid-cols-2 items-center justify-items-center lg:flex lg:flex-row gap-10">
            <p className="text-xs lg:text-md">{["Precio: " + pene]}</p>
            <p className="text-xs lg:text-md">{["Stock: " + pene]}</p>
            <p className="text-xs lg:text-md">{["Stock Minimo: " + pene]}</p>
            <p className="text-xs lg:text-md">{["Valor total: " + pene]}</p>
          </div>
          <p className="text-xs lg:text-md">{`Còdigo de barras: `+ barra}</p>
        </div>
        <div className="flex justify-center items-center flex-col lg:flex-row gap-5">
            <Button className="bg-background border-none w-full lg:w-fit"><BiEdit className="size-3 xl:size-5 text-var7"/></Button>
            <Button className="bg-background border-none w-full lg:w-fit"><BiTrash className="size-3 xl:size-5 text-var7"/></Button>
        </div>
      </div>
    </div>
  );
}
