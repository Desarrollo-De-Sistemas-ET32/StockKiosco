"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Search } from "@/components/ui/search";
import { SlArrowDown, SlMenu } from "react-icons/sl";
import { DescuentoList } from "@/components/descuentoList";

export default function DiscountManagement() {
  const [sortBy, setSortBy] = useState<"nombre" | "valor" | "fecha_inicio">("nombre");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [descuentos, setDescuentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Gestión Descuentos | Kiosco";

    const loadData = async () => {
      try {
        const response = await fetch("/data/descuentos.json");
        const data = await response.json();
        setDescuentos(data);
      } catch (error) {
        console.error("Error al cargar descuentos:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <main>
      <div className="flex flex-col items-center gap-4 mx-auto my-5 font-sans max-w-[900px]">
        <h1 className="text-2xl font-semibold dark:text-white">Lista de Descuentos</h1>

        <div className="flex items-center w-full gap-4">
          <Search
            id="search-product"
            placeholder="Buscar descuento..."
            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm transition
               focus:border-blue-500 focus:outline-none focus:ring-0 focus:shadow-md dark:bg-dark-60 text-dark-30 dark:text-light-10"
            label=""
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Popover>
            <PopoverTrigger asChild>
              <Button className="bg-confirm flex items-center gap-2">
                <SlMenu /> Ordenar <SlArrowDown />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 gap-1 flex flex-col items-start dark:bg-dark-30 bg-light-60 drop-shadow-2xl/" align="center">
              <button onClick={() => setSortBy("nombre")} className="text-left cursor-pointer">Nombre</button>
              <button onClick={() => setSortBy("valor")} className="text-left cursor-pointer">Valor</button>
              <button onClick={() => setSortBy("fecha_inicio")} className="text-left cursor-pointer">Fecha inicio</button>
              <button onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")} className="text-left cursor-pointer">
                Orden: {sortOrder === "asc" ? "Ascendente" : "Descendente"}
              </button>
            </PopoverContent>
          </Popover>
        </div>

        <div className="h-full w-full bg-light-60 overflow-y-auto p-4 rounded-xl flex flex-col gap-3 dark:bg-dark-60">
          {loading ? (
            <div className="text-center py-4">Cargando descuentos...</div>
          ) : (
            <DescuentoList
              data={descuentos}
              sortBy={sortBy}
              sortOrder={sortOrder}
              searchTerm={searchTerm}
            />
          )}
        </div>
      </div>
    </main>
  );
}
