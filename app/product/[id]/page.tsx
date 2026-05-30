import Image from 'next/image';
import Link from 'next/link';

import { Products } from '@/constants/DummyData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import BreadcrumbSection from '@/components/BreadcrumbSection';
import ProductImageGallery from '@/components/ProductImageGallery';
import StarRating from '@/components/StarRating';
import ProductSection from '@/components/ProductSection';
import RatingBreakdown from '@/components/RatingBreakdown';
import ReviewFilter from '@/components/ReviewFilter';
import { Input } from '@/components/ui/input';
import { productService } from '@/lib/services/productService';
import { notFound } from 'next/navigation';
import ProductActions from '@/components/ProductActions';


interface PageProps {
    params: Promise<{ id: string }>
}

const SingleProduct = async ({ params }: PageProps) => {
    const { id } = await params;
    const product = (await productService.getProductById(id)) ?? Products.find((prod) => prod.id === id);

    if (!product) {
        notFound();
    }

    return (
        <div className='flex-1'>
            {/* BREADCRUMBS */}
            <div className='px-8 py-4'>
               <BreadcrumbSection />
            </div>

            {/* PRODUCT DETAILS */}
            <div className='grid md:grid-cols-2 gap-8 px-8'>
                <div>
                    <div className="sticky top-2">
                        <ProductImageGallery images={product?.images || []} />
                    </div>
                </div>

                <div className="space-y-5">
                    {/* PRODUCT NAME */}
                    <h1 className="text-3xl font-bold">{product?.name}</h1>

                    <hr className="border-gray-300" />

                    {/* BRAND + RATING */}
                    <div className="flex items-center gap-4">
                        <Image src="/products/currentsensor.jpg" alt="Brand Logo" width={64} height={64} className="border rounded-full w-16 h-16 object-cover" />

                        <div className="grid">
                            <Link href="#" className="hover:underline font-semibold text-lg flex items-center gap-1">
                                Texas Instruments <span className="text-gray-500 text-sm">(1471)</span>
                            </Link>
                            <div className="flex items-center gap-2 text-sm">
                                {/* <span className="text-yellow-500 text-lg">★★★★☆</span>
                                <span className="text-gray-500">(3200 Reviews)</span> */}

                                <Link href="#" className="flex items-center underline"> Seller&apos;s other items </Link>
                                <Link href="#" className="flex items-center underline"> Contact Seller </Link>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-300" />

                    {/* PRICE */}
                    <div className="flex items-center">
                        <h1 className="text-3xl font-bold">${product?.price ?? 0}</h1>
                        <span className="text-gray-500 line-through text-lg ml-4">$399.00</span>
                        <Badge className="ml-4 bg-green-100 text-green-800 px-2 py-1 rounded"> {product?.discount ?? 0}% OFF </Badge>
                    </div>

                    <hr className="border-gray-300" />

                    {/* PRODUCT RATING */}
                    <div className="flex items-center gap-2">
                        <StarRating rating={3.4} size={24} />
                        <span className="text-gray-500">({product?.rating?.count} Reviews)</span>
                    </div>

                    <hr className="border-gray-300" />

                    {/* SPECS (YOUR EXACT STRUCTURE, JUST CLEANER) */}
                    <div className="grid gap-3 w-80 text-sm">
                        <div className="flex gap-2">
                            <div className="w-2/3 font-semibold text-gray-700">Brand</div>
                            <div className="w-full">{product?.brand}</div>
                        </div>

                        <div className="flex gap-2">
                            <div className="w-2/3 font-semibold text-gray-700">Architecture</div>
                            <div className="w-full">{product?.specs?.architecture}</div>
                        </div>
                        <div className="flex gap-2">
                            <div className="w-2/3 font-semibold text-gray-700">Flash Memory</div>
                            <div className="w-full">{product?.specs?.flashMemory} KB</div>
                        </div>
                        <div className="flex gap-2">
                            <div className="w-2/3 font-semibold text-gray-700">GPIO Pins</div>
                            <div className="w-full">{product?.specs?.gpioPins}</div>
                        </div>
                        <div className="flex gap-2">
                            <div className="w-2/3 font-semibold text-gray-700">Package</div>
                            <div className="w-full">{product?.specs?.package}</div>
                        </div>
                        <div className="flex gap-2">
                            <div className="w-2/3 font-semibold text-gray-700">Clock Speed</div>
                            <div className="w-full">{product?.specs?.clockSpeed} MHz</div>
                        </div>
                        <div className="flex gap-2">
                            <div className="w-2/3 font-semibold text-gray-700">RAM</div>
                            <div className="w-full">{product?.specs?.ram} KB</div>
                        </div>
                        <div className="flex gap-2">
                            <div className="w-2/3 font-semibold text-gray-700">Operating Voltage</div>
                            <div className="w-full">{product?.specs?.operatingVoltage}</div>
                        </div>
                        <div className="flex gap-2">
                            <div className="w-2/3 font-semibold text-gray-700">Temperature Range</div>
                            <div className="w-full">{product?.specs?.temperatureRange} °C</div>
                        </div>
                    </div>

                    <hr className="border-gray-300" />

                    {/* QUANTITY SELECTOR */}
                    <div className="flex items-center gap-4">
                        <div className="font-semibold text-gray-700">Quantity:</div>
                        <Input type="number" defaultValue={1} min={1} className="w-20" />

                        <span className='text-gray-700'>{product?.stock} in stock</span>
                    </div>
                    
                    <hr className="border-gray-300" />

                    {/* CTA BUTTONS */}
                    <ProductActions
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      image={product.images?.[0] || "/products/microcontroller.jpg"}
                      stock={product.stock ?? product.availableQty}
                      brand={product.brand ?? product.manufacturerName}
                    />

                    <hr className="border-gray-300" />

                    {/* PAYMENT METHODS */}
                    <div className="flex flex-col gap-4">
                        <h2 className="text-lg font-semibold">Payment Methods</h2>
                        <div className="flex items-center gap-4">
                            <Image src="/payments/visa.png" alt="Visa" width={48} height={32} className="w-12 h-8 object-contain" />
                            <Image src="/payments/mastercard.png" alt="MasterCard" width={48} height={32} className="w-12 h-8 object-contain" />
                            <Image src="/payments/paypal.png" alt="PayPal" width={48} height={32} className="w-12 h-8 object-contain" />
                            <Image src="/payments/amex.png" alt="American Express" width={48} height={32} className="w-12 h-8 object-contain" />
                        </div>
                    </div>

                    <hr className="border-gray-300" />

                    {/* PRODUCT DESCRIPTION */}
                    <div className="space-y-2">
                        <h2 className="text-lg font-semibold">Product Description</h2>
                        <p className="text-gray-700 text-sm leading-6">
                            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Veritatis culpa nulla aliquam deleniti ex ipsam laudantium a voluptates totam excepturi, hic dolorem molestiae iure provident iste odit velit illo eius!

                            <br /><br />

                            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Qui, ducimus eum! Distinctio optio eveniet maiores quidem, soluta expedita nesciunt tempora repellat beatae id, porro vel ratione natus? Obcaecati, atque nisi.

                            <br /><br />

                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. At et sequi alias sint unde, quas nisi aliquam atque omnis nihil voluptatem dolorem quaerat consectetur non facere dignissimos aperiam porro nulla.
                        </p>
                    </div>
                </div>
            </div>

            {/* SIMILAR PRODUCTS */}
            <div className='my-12'>
                <ProductSection section="Similar Products" products={Products.slice(0, 6)} />
            </div>

            {/* REVIEW SECTION */}
            <div className='grid md:flex gap-10 p-8'>
                <div className='md:w-1/3'>
                    <div className='sticky top-2'>
                        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-6xl font-bold">4.2</span>
                            <div>
                                <StarRating rating={4.2} size={24} />
                                <div className="text-gray-500">Based on 3,200 reviews</div>
                            </div>
                        </div>
                        <RatingBreakdown data={{ 5: 1800, 4: 900, 3: 300, 2: 150, 1: 50 }} />

                        <hr className="border-gray-300 my-6" />

                        <div className="flex flex-col space-y-2">
                            <h2 className="text-2xl font-bold">Write a Review</h2>
                            <div className='flex justify-between items-center'>
                                <StarRating rating={0} size={24} interactive={true} />
                                <Button variant={'outline'} className="hover:bg-white hover:border-amber-500 hover:text-amber-500 rounded-full shadow-none"> Add Photos </Button>
                            </div>
                            <div>
                                <label className="block mb-1 font-semibold">Your Review</label>
                                <textarea className="w-full border border-gray-300 rounded-md p-2 h-32 resize-none" placeholder="Write your review here..."></textarea>
                            </div>
                            <Button className="ml-auto bg-amber-500 hover:bg-amber-600 rounded-full"> Submit Review </Button>
                        </div>
                    </div>
                </div>

                <div className='flex-1 min-w-0'>
                    <ReviewFilter reviews={product?.reviews || []} />
                </div>
            </div>
        </div>
    );
}

export default SingleProduct;