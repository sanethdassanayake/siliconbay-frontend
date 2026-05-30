import Image from "next/image";

import ProductSection from "@/components/ProductSection";
import HeroCarousel from "@/components/HeroCarousel";
import CategoryList from "@/components/CategoryList";
import { Button } from "@/components/ui/button";
import { productService } from "@/lib/services/productService";

export default async function Home() {
  
  const [featuredProducts, bestSellerProducts] = await Promise.all([
    productService.getFeaturedProducts().catch(() => []),
    productService.getBestSellerProducts().catch(() => []),
  ])
  
  return (
    <main className="flex-1">
      <CategoryList />

      <HeroCarousel />

      <ProductSection section="Featured Products" products={featuredProducts} />

      <ProductSection section="Best Sellers" products={bestSellerProducts} />

      <ProductSection section="Today's Deals" products={[]} />

      <div className="bg-amber-300 rounded-t-2xl overflow-hidden mt-8">
        <div className="grid lg:grid-cols-2 items-center px-8 py-12 gap-8">
          {/* Left Content */}
          <div className="flex flex-col gap-4 lg:px-8">
            <h1 className="text-3xl md:text-5xl font-bold leading-snug">
              Get help exactly
              <br /> when you need it
            </h1>

            <p className="text-lg text-black/80">
              Shop with confidence from our trusted sellers
            </p>

            <Button
              variant="outline"
              size="lg"
              className="mt-2 lg:w-sm rounded-full border-black hover:bg-black hover:text-white transition"
            >
              Learn More
            </Button>
          </div>

          {/* Right Image */}
          <div className="relative h-56 md:h-72 lg:h-96">
            <Image
              src="/image.jpg"
              alt="service-hero"
              fill
              className="object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
