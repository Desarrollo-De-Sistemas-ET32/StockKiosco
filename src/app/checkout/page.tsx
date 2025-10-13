"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { NavBar } from "@/components/navBar";
import { Button } from "@/components/ui/button";

export default function ChequePage() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <main className="h-screen flex flex-col mx-25">
      <div className="flex items-center justify-center gap-10 py-3">
        <NavBar />
      </div>

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

      <AnimatePresence>
        {showPopup && (
          <motion.div
            key="overlay"
            className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setShowPopup(false)} 
          >
            <motion.div
              key="popup"
              className="bg-var5 dark:bg-var2 rounded-xl p-6 w-[500px] h-[500px] shadow-2xl flex flex-col items-center justify-center relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()} 
            >
              <Button
                className="absolute top-3 right-3 text-xl text-white"
                onClick={() => setShowPopup(false)}
              >
                
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
