
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Search } from "@/components/ui/search";

import { SlArrowDown, SlMenu } from "react-icons/sl";
import { GoFilter } from "react-icons/go";
import { DescuentoList } from "@/components/productList";

export default function DiscountManagement() {
  return (
    <main className="bg-foreground rounded-xl shadow-lg p-6 sm:p-8 w-full max-w-screen-lg max-h-[84vh] mx-auto flex flex-col items-center justify-center">
      <h2 className="text-background text-center text-3xl font-bold mb-6">DESCUENTOS</h2>

      <div className="flex flex-col sm:flex-row w-full gap-4">
        <Search
          id="search-product"
          placeholder="Buscar"
          className="w-full flex-1 min-w-0"
          label=""
        />

        <Popover>
          <PopoverTrigger>
            <Button variant="gray">
              <SlMenu /> Ordernar por <SlArrowDown />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-40"> {} </PopoverContent>
        </Popover>

        <Popover>
         <PopoverTrigger>
           <Button variant="gray">
              <GoFilter/>Filtrar<SlArrowDown/>
           </Button>
         </PopoverTrigger>
          <PopoverContent className="w-28">{}</PopoverContent>
       </Popover>
      </div>

      <DescuentoList></DescuentoList>

    </main>

  );
}
