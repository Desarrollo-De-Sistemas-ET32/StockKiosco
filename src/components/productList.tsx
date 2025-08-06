"use client"

import * as React from "react"
import { ProductCard } from "@/components/ui/productCard"
import { useEffect, useState } from "react";

export function ProductList(){

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    async function fetchProducts() {
      try{
        console.log("Prueba1")
        const res = await fetch("/productos.json"); //desde el servidor
        console.log("Prueba2")
        const data = await res.json()
        setProducts(data)
        console.log(data)
        setIsLoading(false);
      }catch{
        console.error("Fallo")
      }finally{
        setIsLoading(false)
      }
    }
    fetchProducts();
  }, []);



  if (isLoading) {
    return ( 
      <ul className="bg-foreground mt-4 w-full h-full overflow-y-auto flex flex-col gap-4">
        <ProductCard id="............." name="Loading" brand="Loading" price={0}></ProductCard>
        <ProductCard id="............." name="Loading" brand="Loading" price={0}></ProductCard>
        <ProductCard id="............." name="Loading" brand="Loading" price={0}></ProductCard>
      </ul>
    )
  }

    return (
        <ul className="bg-foreground mt-4 w-full h-full overflow-y-auto flex flex-col gap-4">
            {products.map((product: { id: string; name: string; brand: string; price: number; }) => (
                <ProductCard id={product.id} name={product.name} brand={product.brand} price={product.price}></ProductCard>
            ))}
        </ul>
  )
}
