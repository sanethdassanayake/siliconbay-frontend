"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, ShoppingCart } from "lucide-react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Toggle } from "./ui/toggle";
import { useCart, useWishlist } from "./providers";

type ProductActionsProps = {
  id: string | number;
  name: string;
  price: number;
  image: string;
  stock?: number;
  brand?: string;
};

const ProductActions = ({ id, name, price, image, stock, brand }: ProductActionsProps) => {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const handleAddToCart = () => {
    addToCart({ id, name, price, image, stock, brand }, quantity);
  };

  return (
    <div className="grid md:flex items-center gap-2">
      <div className="flex items-center gap-3">
        <Input
          type="number"
          min={1}
          max={stock ?? 999}
          value={quantity}
          onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
          className="w-24"
        />
        <span className="text-sm text-gray-700">{stock ?? 0} in stock</span>
      </div>

      <Button size="lg" className="flex-1 md:flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 rounded-full" onClick={handleAddToCart}>
        <ShoppingCart size={16} />
        Add to Cart
      </Button>

      <div className="flex gap-2">
        <Toggle
          variant="outline"
          className="flex-1 md:flex rounded-full data-[state=on]:*:[svg]:fill-amber-500 data-[state=on]:*:[svg]:stroke-amber-500"
          size="lg"
          pressed={isWishlisted(id)}
          onPressedChange={() => toggleWishlist({ id, name, price, image, inStock: (stock ?? 0) > 0 })}
        >
          <Heart size={16} className="scale-150" />
        </Toggle>

        <Button variant="outline" className="flex-1 md:flex rounded-full" size="lg" onClick={() => router.push("/checkout")}>
          Buy Now
        </Button>
      </div>
    </div>
  );
};

export default ProductActions;