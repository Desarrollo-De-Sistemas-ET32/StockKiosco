"use client"

import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "../../components/ui/popover";
import { Search } from "@/components/ui/search";

import { SlArrowDown, SlMenu } from "react-icons/sl";
import { GoFilter } from "react-icons/go";
import { ProductList } from "@/components/productList";
import { useState } from "react";

export default function ProductManagement() {
  const [sortBy, setSortBy] = useState<"nombre" | "valor" | "fecha_inicio">("nombre");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <main className="bg-foreground rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-screen-lg max-h-[84vh] mx-auto flex flex-col items-center justify-center">
      <h2 className="text-background text-center text-3xl font-bold mb-6">PRODUCTOS</h2>

      <div className="flex flex-col sm:flex-row w-full gap-4">
        <Search id="search-product" placeholder="Buscar..." className="w-full flex-1 min-w-0" label="" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="gray">
              <SlMenu /> Ordernar por <SlArrowDown />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40"> 
            <button onClick={() => setSortBy("nombre")}className="text-left cursor-pointer">Nombre</button>
            <button onClick={() => setSortBy("valor")}className="text-left cursor-pointer">Valor</button>
            <button onClick={() => setSortBy("fecha_inicio")}className="text-left cursor-pointer">Fecha inicio</button>
            <button onClick={() =>setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}className="text-left cursor-pointer">Orden: {sortOrder === "asc" ? "Ascendente" : "Descendente"}</button>
          </PopoverContent>
        </Popover>

        <Popover>
         <PopoverTrigger asChild>
           <Button variant="gray">
              <GoFilter />  Filtrar <SlArrowDown />
           </Button>
         </PopoverTrigger>
          <PopoverContent className="w-28"> 
            
          </PopoverContent>
       </Popover>
      </div>

      <ProductList sortBy={sortBy} sortOrder={sortOrder} searchTerm={searchTerm}></ProductList>

    </main>

  );
}
