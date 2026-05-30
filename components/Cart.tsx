"use client";

import React from 'react'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import Image from 'next/image'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useCart } from './providers'

const Cart = () => {
    const { items, itemCount, subtotal, hydrated, updateQuantity, removeFromCart } = useCart()

    return (
        <Sheet>
            <SheetTrigger className='flex items-center cursor-pointer'>
                <ShoppingCart size={24} />
                <span className='ml-2 hidden md:inline'>Cart ({itemCount})</span>
            </SheetTrigger>

            <SheetContent className='gap-0 '>
                <SheetHeader>
                    <SheetTitle>Cart ({itemCount})</SheetTitle>
                </SheetHeader>

                <div className='flex-1 overflow-y-auto px-2 py-4 space-y-4'>
                    {!hydrated ? (
                        <div className='text-sm text-gray-500'>Loading cart...</div>
                    ) : items.length === 0 ? (
                        <div className='rounded-xl border border-dashed p-6 text-center text-sm text-gray-500'>
                            Your cart is empty.
                        </div>
                    ) : items.map((item) => (
                        <div key={item.id} className='flex gap-3 p-2 border rounded-xl'>
                            <Image src={item.image} alt={item.name} width={96} height={96} className='object-cover border rounded-lg w-24 h-24' />

                            <div className='grid gap-2 flex-1'>
                                <h2 className='line-clamp-2 overflow-hidden leading-snug font-normal'>{item.name}</h2>
                                <span className='font-semibold'>${item.price.toFixed(2)}</span>
                                <div className='flex items-center justify-between gap-2'>
                                    <Input
                                        type="number"
                                        min={1}
                                        value={item.quantity}
                                        onChange={(event) => updateQuantity(item.id, Number(event.target.value))}
                                        className='rounded w-20'
                                    />
                                    <Button variant="link" className='ml-2 cursor-pointer' onClick={() => removeFromCart(item.id)}>Remove</Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <SheetFooter>
                    <div className='w-full flex flex-col gap-4'>
                        <div className='flex justify-between font-semibold text-lg'>
                            <span>Subtotal ({itemCount} items):</span>
                            <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <Button asChild className='w-full bg-amber-600 hover:bg-amber-700 text-white rounded-full'>
                            <Link href="/checkout">Proceed to Checkout</Link>
                        </Button>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}

export default Cart