"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, Menu, Search, X } from "lucide-react";
import Cart from "./Cart";
import { useWishlist } from "./providers";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount: wishlistItemCount } = useWishlist();

  const [user] = useState<{
    firstName: string;
    lastName: string;
  } | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      return null;
    }

    try {
      return JSON.parse(userData) as { firstName: string; lastName: string };
    } catch {
      return null;
    }
  });

  return (
    <header>
      {/* Top Bar */}
      <div className="hidden md:flex justify-between items-center py-2 px-8 text-sm bg-gray-950 text-white">
        <div className="space-x-4">
          <span>Call: 123-456-7890</span>
          <span>Email: info@example.com</span>
        </div>

        <div className="space-x-4">
          {user ? (
            <div>
              <span>Hello,</span>
              <Link href="/account/overview" className="underline ml-1">
                {user.firstName}
              </Link>
              <button
                className="ml-4 underline"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  window.location.href = "/";
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link href="/sign-in" className="underline">
                Sign In
              </Link>
              <Link href="/sign-up" className="underline">
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Main Header */}
      <div className="flex justify-between items-center p-4 px-8 text-sm gap-6 bg-gray-800 text-white">
        {/* <div className='text-lg font-bold text-amber-500'>SiliconBay</div> */}
        <Link href="/">
          <div className="text-2xl font-bold p-4">
            <span className="text-amber-500">Silicon</span>
            <span>Bay</span>
          </div>
        </Link>

        {/* Search bar (desktop only) */}
        <div className="flex-1 mx-4 hidden md:flex">
          <input
            type="text"
            placeholder="Search products..."
            className="px-4 py-2 w-full rounded-l-full text-black bg-white focus:outline-amber-500"
          />
          <button className="px-4 py-2 rounded-r-full text-white bg-amber-500 hover:bg-amber-600">
            <Search size={24} />
          </button>
        </div>

        {/* Icons */}
        <div className="gap-8 flex">
          <Link href="/account/wishlist" className="flex items-center">
            <Heart size={24} />
            <span className="ml-2 hidden md:inline">Wishlist ({wishlistItemCount})</span>
          </Link>

          <Cart />

          {/* Mobile menu toggle */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-gray-800 text-white p-4 animate-fadeIn">
          <div className="mb-4 flex">
            <input
              type="text"
              placeholder="Search products..."
              className="px-4 py-2 w-full rounded-l-full text-black bg-white focus:outline-amber-500 mb-4"
            />
            <button className="px-4 py-2 rounded-r-full text-white bg-amber-600 hover:bg-amber-700 mb-4">
              <Search size={24} />
            </button>
          </div>
          <div className="space-y-2">
            {/* <button className='w-full py-2 hover:bg-amber-600'>
              <Link href='/' className='flex items-center'>
                <span className='ml-2'>Wishlist (0)</span>
              </Link>
            </button>
            <button className='w-full py-2 hover:bg-amber-600'>
              <Link href='/' className='flex items-center'>
                <span className='ml-2'>Cart (0)</span>
              </Link>
            </button>

            <hr className='border-gray-500' /> */}

            <div className="space-x-4">
              {user ? (
                <div>
                  <span>Hello, {user.firstName}</span>
                  <Link href="/account/overview" className="underline ml-2">
                    Profile
                  </Link>
                  <button
                    className="ml-2 underline"
                    onClick={() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("user");
                      window.location.href = "/";
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <>
                  <Link href="/sign-in" className="underline">
                    Sign In
                  </Link>
                  <Link href="/sign-up" className="underline">
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
