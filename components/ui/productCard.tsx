"use client"

import * as React from "react"
import { Button } from "@/components/ui/button";
import Link from "next/link";

export interface productProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  className?: string;
}

export function ProductCard({
  className,
  name,
  brand,
  id,
  price,
}: productProps ) {
    

    return (
        <li className="bg-card text-card-foreground w-full p-2 flex items-center gap-6 whitespace-nowrap rounded-md font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive">
          <img src="/notFound.png" className="bg-foreground z-50 w-40 h-30 rounded-md border m-4"/>
          
          <div className="flex-1">
            <h4 className="text-[26px] font-bold">{name}</h4>
            <p>{brand}</p>
            <div className="flex gap-4">
              <p className="text-sm text-muted-foreground">{id}</p>
              <p className="text-sm font-medium">${price}</p>
            </div>
          </div>

          <div className="flex gap-3 items-center">
                <Button variant="filled" size="lg"><Link href="/editProduct">Editar</Link></Button>
              <Button size="lg">Eliminar</Button>
            </div>
        </li>
  )
}
