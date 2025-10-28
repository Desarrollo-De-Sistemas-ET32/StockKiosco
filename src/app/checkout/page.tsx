"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ChequePage() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <main className="h-screen flex flex-col mx-25">
      <div className="grid grid-cols-[3fr_1fr] gap-6 p-4 h-full">
        <div className="bg-var5 dark:bg-var2 rounded-xl p-4 drop-shadow-xl flex items-center justify-center flex-col">
          <h1 className="pb-10 text-black dark:text-white">
            No hay Productos en esta Venta
          </h1>

          <Button
            className="w-xs h-16 text-xl font-medium dark:bg-var1 dark:hover:bg-neutral-900 dark:text-white bg-var6 hover:bg-var3 hover:text-white"
            onClick={() => setShowPopup(true)}
          >
            Agregar Productos
          </Button>
        </div>

        <div className="bg-var5 dark:bg-var2 rounded-xl p-4 drop-shadow-xl flex items-center justify-center"></div>
      </div>

        {showPopup && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
            onClick={() => setShowPopup(false)} 
          >
            <div
              className="bg-var5 dark:bg-var2 rounded-xl p-6 w-[500px] h-[500px] shadow-2xl flex flex-col items-center justify-center relative"
              onClick={(e) => e.stopPropagation()} 
            >
              <Button
                className="absolute top-3 right-3 text-xl text-white"
                onClick={() => setShowPopup(false)}
              >
                
              </Button>
            </div>
          </div>
        )}
    </main>
  );
}
