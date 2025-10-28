"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Search } from "@/components/ui/search";
import { SlArrowDown, SlMenu } from "react-icons/sl";
import { DescuentoList } from "@/components/descuentoList";


export default function DiscountManagement() {
  const [sortBy, setSortBy] = useState<"nombre" | "valor" | "fecha_inicio">("nombre");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <main className="bg-var5 dark:bg-var2 rounded-xl shadow-lg p-6 sm:p-6 2xl:max-w-450 sm:max-w-200 m-auto flex flex-col items-center justify-center">
      <h2 className="text-foreground text-center text-3xl font-bold mb-6 ">DESCUENTOS</h2>
      <div className="flex flex-col sm:flex-row w-full gap-4">
        <Search id="search-product" placeholder="Buscar" className="w-full flex-1 min-w-0" label="" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <Popover>
          <PopoverTrigger>
            <Button>
              <SlMenu /> Ordenar por <SlArrowDown/>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 gap-1 flex flex-col items-start bg-var2 drop-shadow-2xl/75" align="center">
            <button onClick={() => setSortBy("nombre")}className="text-left cursor-pointer">Nombre</button>
            <button onClick={() => setSortBy("valor")}className="text-left cursor-pointer">Valor</button>
            <button onClick={() => setSortBy("fecha_inicio")}className="text-left cursor-pointer">Fecha inicio</button>
            <button onClick={() =>setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}className="text-left cursor-pointer">Orden: {sortOrder === "asc" ? "Ascendente" : "Descendente"}</button>
          </PopoverContent>
        </Popover>
      </div>
      <DescuentoList sortBy={sortBy} sortOrder={sortOrder} searchTerm={searchTerm}/>
    </main>
  );
}
