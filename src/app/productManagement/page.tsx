"use client"

import ProductCard from "@/components/cardProduct";

export default function ProductManagement() {
  return (
    <main className="w-full flex justify-center items-center flex-col gap-5">
      <ProductCard></ProductCard>
      <ProductCard></ProductCard>
      <ProductCard></ProductCard>
    </main>

  );
}
