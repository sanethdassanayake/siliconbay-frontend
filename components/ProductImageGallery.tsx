"use client";

import React, { useState } from "react";
import Image from "next/image";

interface Props {
    images: string[];
}

const ProductImageGallery = ({ images }: Props) => {
    const fallback = "/paypal.png";
    const [selected, setSelected] = useState(images?.[0] || fallback);

    return (
        <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="border rounded-2xl overflow-hidden flex items-center justify-center">
                <Image
                    src={selected}
                    alt="Main Product"
                    width={600}
                    height={600}
                    className="h-[500px] object-contain transition-transform duration-300 hover:scale-105"
                    priority
                />
            </div>

            {/* Thumbnail List */}
            <div className="flex gap-3 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-300 px-1">
                {images.length > 0 ? (
                    images.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => setSelected(img)}
                            className={`inline-block shrink-0 rounded-lg overflow-hidden border-2 transition 
          ${selected === img ? "border-amber-500" : "border-transparent hover:border-gray-300"}`}
                        >
                            <Image
                                src={img}
                                alt={`Thumbnail ${index + 1}`}
                                width={90}
                                height={90}
                                className="object-cover w-20 h-20"
                            />
                        </button>
                    ))
                ) : (
                    <span className="text-sm text-gray-500">No images available</span>
                )}
            </div>

        </div>
    );
};

export default ProductImageGallery;
