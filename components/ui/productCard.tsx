'use client'

import Image from 'next/image'
import React from 'react'

interface ProductCardProps {
  name: string
  cant: number
  stock: number
  precio: number
  image: string
  formatMoney: (value: number) => string
}

export default function ProductCard({ name, cant, stock, precio, image, formatMoney }: ProductCardProps) {
  return (
    <div className="flex items-start gap-4 bg-gray-400 p-3 rounded-lg">
      <div className="flex-shrink-0">
        <Image
          src={image}
          alt={name}
          width={64}
          height={64}
          className="rounded-md object-cover"
        />
      </div>
      <div className="flex-1">
        <div className="text-base font-semibold text-white">{name}</div>
        <div className="mt-1 text-sm text-gray-200">
          <span className="mr-3"><strong>cant:</strong> {cant}</span>
          <span><strong>stock:</strong> {stock}</span>
        </div>
        <div className="mt-2 text-sm text-gray-100">
          <strong>precio:</strong> ${formatMoney(precio)}
        </div>
      </div>
    </div>
  )
}
