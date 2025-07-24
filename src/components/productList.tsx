"use client"

import * as React from "react"
import { ProductCard } from "@/components/ui/productCard"

const products = [
  {
    id: "0000000000001",
    name: "Alfajor de chocolate",
    brand: "Jorgito",
    price: 129999,
  },
  {
    id: "0000000000002",
    name: "Zzzz",
    brand: "aDormir",
    price: 19999,
  },
  {
    id: "0000000000003",
    name: "Producto 200",
    brand: "omg",
    price: 2999,
  },
  {
    id: "0000000000004",
    name: "25 clientes!1!!",
    brand: "omg",
    price: 3799,
  },
  {
    id: "0000000000005",
    name: "Producto 400",
    brand: "omg",
    price: 2999,
  },
];

export function ProductList(){
  //const products = await getProducts();
  //una vez se tenga la función de getProducts, volver la función un async


    return (
        <ul className="bg-foreground mt-4 w-full h-full overflow-y-auto flex flex-col gap-4">
            {products.map((product: { id: string; name: string; brand: string; price: number; }) => (
                <ProductCard id={product.id} name={product.name} brand={product.brand} price={product.price}></ProductCard>
            ))}
        </ul>
  )
}
