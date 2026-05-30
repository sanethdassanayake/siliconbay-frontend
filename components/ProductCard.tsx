"use client";

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from './ui/card'
import { Toggle } from './ui/toggle'
import { Heart } from 'lucide-react'
import { Product } from '@/types/product'
import { useCart, useWishlist } from './providers'
import { Button } from './ui/button'

const ProductCard = ({ product }: { product: Product }) => {
    const { addToCart } = useCart()
    const { isWishlisted, toggleWishlist } = useWishlist()
    const image = product.images?.[0] || "/products/microcontroller.jpg"

    return (
        <Card key={product.id} className="w-56 p-0 shadow-none gap-0 border-0 snap-start shrink-0">
            <CardContent className="p-0">
                <div className="relative w-full h-56 overflow-hidden rounded-lg border">
                    <Link href={`/product/${product.id}`}>
                        <Image
                            src={image}
                            alt={product.name}
                            fill
                            className="mx-auto rounded-lg object-cover
                            hover:scale-105 transition-transform duration-300
                            "
                        />
                    </Link>

                    <Toggle
                        aria-label="Toggle bookmark"
                        size="sm"
                        variant="default"
                        pressed={isWishlisted(product.id)}
                        onPressedChange={() => toggleWishlist({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            image,
                            inStock: (product.stock ?? product.availableQty ?? 0) > 0,
                        })}
                        className="data-[state=on]:bg-white data-[state=on]:*:[svg]:fill-amber-500 data-[state=on]:*:[svg]:stroke-amber-500 absolute top-4 right-4 bg-white backdrop-blur-md shadow-md rounded-full"
                    >
                        <Heart size={24} className="scale-110" />
                    </Toggle>
                </div>
            </CardContent>

            <CardFooter className="p-0">
                <div className="w-full flex flex-col gap-1">
                    <Link href={`/product/${product.id}`} className="hover:underline mt-2">
                        <CardTitle className="line-clamp-2 overflow-hidden leading-snug font-normal">
                            {product.name}
                        </CardTitle>
                    </Link>

                    <CardDescription className="font-medium text-black text-lg">
                        ${product.price.toFixed(2)}
                    </CardDescription>

                    <Button
                        size="sm"
                        className="mt-2 rounded-full bg-amber-600 hover:bg-amber-700"
                        onClick={() => addToCart({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            image,
                            stock: product.stock ?? product.availableQty,
                            brand: product.brand ?? product.manufacturerName,
                        })}
                    >
                        Add to Cart
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}

export default ProductCard