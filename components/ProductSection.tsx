import React from 'react'
import ProductCard from './ProductCard';
import { Product } from '@/types/product';

type ProductSectionProps = {
    products: Product[];
    section: string;
}

const ProductSection = ({ section, products }: ProductSectionProps) => {
    return (
        <div className="px-8 py-6">
            <h2 className="text-2xl font-bold mb-4">{section}</h2>

            <div className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory">
                {products.map((product) => (
                    <div key={product.id} className="snap-start">
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ProductSection
