"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Filter, Heart, ShoppingCart, Trash2, Share2, Eye } from "lucide-react";

import { useCart, useWishlist } from "@/components/providers";
import { requestBackend } from "@/lib/backend";

type WishlistRow = {
  id: string | number;
  name: string;
  category: string;
  price: string;
  originalPrice: string;
  discount: string | null;
  inStock: boolean;
  addedDate: string;
  image: string;
};

const Wishlist = () => {
  const { items, replaceWishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const response = await requestBackend<Record<string, unknown>>("/wishlist");
        const rawWishlist = Array.isArray(response)
          ? response
          : Array.isArray((response as { wishlist?: unknown[] }).wishlist)
            ? (response as { wishlist: unknown[] }).wishlist
            : Array.isArray((response as { items?: unknown[] }).items)
              ? (response as { items: unknown[] }).items
              : [];

        const normalized = rawWishlist.map((entry, index) => {
          const item = entry as Record<string, unknown>;

          return {
            id: item.id ?? item.productId ?? index + 1,
            name: String(item.name ?? item.productName ?? ""),
            price: String(item.price ?? ""),
            originalPrice: String(item.originalPrice ?? item.price ?? ""),
            category: String(item.category ?? "General"),
            discount: item.discount ? String(item.discount) : null,
            inStock: Boolean(item.inStock ?? true),
            addedDate: String(item.addedDate ?? item.createdAt ?? ""),
            image: String(item.image ?? ""),
          } as WishlistRow;
        });

        if (normalized.length > 0) {
          replaceWishlistItems(
            normalized.map((item) => ({
              id: item.id,
              name: item.name,
              price: Number(item.price.replace(/[^\d.]/g, "")),
              image: item.image,
              inStock: item.inStock,
              category: item.category,
            }))
          );
        } else {
          setQuery("");
        }
      } catch {
        setQuery("");
      }
    };

    loadWishlist();
  }, [replaceWishlistItems]);

  const visibleItems = useMemo(() => {
    return items.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()));
  }, [items, query]);

  const stats = [
    { label: "Total Items", value: String(items.length), icon: Heart },
    { label: "In Stock", value: String(items.filter((item) => item.inStock).length), icon: ShoppingCart },
    { label: "On Sale", value: String(items.filter((item) => Boolean(item.price)).length), icon: Filter },
    { label: "Out of Stock", value: String(items.filter((item) => !item.inStock).length), icon: Eye },
  ];

  const handleRemove = async (id: string | number) => {
    try {
      await requestBackend(`/wishlist/items/${id}`, { method: "DELETE" });
    } catch {
      // keep local state in sync even if backend is unavailable
    } finally {
      removeFromWishlist(id);
    }
  };

  return (
    <div className="flex-1 space-y-6 mb-20">
      <div className="bg-white border p-4">
        <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
        <p className="text-sm text-gray-600 mt-1">Save items you love and move them to cart when ready</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div key={stat.label} className="bg-white border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className="bg-amber-50 p-3">
                  <Icon className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-pink-50 border border-pink-200 p-4">
        <div className="flex gap-3">
          <Heart className="w-5 h-5 text-pink-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-pink-900 mb-1">Wishlist items are loaded from your saved account data</h3>
            <p className="text-sm text-pink-800">Use the heart button on product cards to save items, then move them into your cart.</p>
          </div>
        </div>
      </div>

      <div className="bg-white border p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} type="text" placeholder="Search wishlist items..." className="w-full pl-10 pr-4 py-2 border focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 border bg-white hover:bg-gray-50 flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">All Wishlist Items</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Product Name</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Price</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Stock</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {visibleItems.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-sm text-gray-600" colSpan={5}>
                    No wishlist items are available yet.
                  </td>
                </tr>
              ) : visibleItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                  <td className="px-4 py-3 text-gray-600">{item.category ?? "General"}</td>
                  <td className="px-4 py-3 text-gray-900 font-semibold">{item.price > 0 ? `$${item.price.toFixed(2)}` : "Unavailable"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 font-medium ${item.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {item.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        disabled={!item.inStock}
                        onClick={() => addToCart({ id: item.id, name: item.name, price: item.price, image: item.image, inStock: item.inStock, category: item.category })}
                        className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 p-2 disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleRemove(item.id)} className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;