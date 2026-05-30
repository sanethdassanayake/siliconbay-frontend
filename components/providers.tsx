"use client";

import React, { createContext, useContext, useMemo, useSyncExternalStore } from "react";

export type CartItem = {
  id: string | number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock?: number;
  brand?: string;
};

export type WishlistItem = {
  id: string | number;
  name: string;
  price: number;
  image: string;
  inStock?: boolean;
  category?: string;
};

type CartContextValue = {
  items: CartItem[];
  hydrated: boolean;
  itemCount: number;
  subtotal: number;
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  removeFromCart: (id: string | number) => void;
  clearCart: () => void;
  replaceCartItems: (items: CartItem[]) => void;
};

type WishlistContextValue = {
  items: WishlistItem[];
  hydrated: boolean;
  itemCount: number;
  isWishlisted: (id: string | number) => boolean;
  toggleWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string | number) => void;
  clearWishlist: () => void;
  replaceWishlistItems: (items: WishlistItem[]) => void;
};

const CART_STORAGE_KEY = "siliconbay-cart";
const WISHLIST_STORAGE_KEY = "siliconbay-wishlist";
const CART_EVENT = "siliconbay-cart-updated";
const WISHLIST_EVENT = "siliconbay-wishlist-updated";
// Stable empty arrays used as server snapshots to avoid creating
// a new array instance on every render which can trigger an infinite
// update loop when used with `useSyncExternalStore`.
const EMPTY_CART_SNAPSHOT: CartItem[] = [];
const EMPTY_WISHLIST_SNAPSHOT: WishlistItem[] = [];

const CartContext = createContext<CartContextValue | undefined>(undefined);
const WishlistContext = createContext<WishlistContextValue | undefined>(undefined);

const readStorage = <T,>(key: string): T[] => {
  if (typeof window === "undefined") {
    return [];
  }

  const rawValue = localStorage.getItem(key);

  if (!rawValue) {
    return [];
  }

  try {
    return JSON.parse(rawValue) as T[];
  } catch {
    return [];
  }
};

const writeStorage = <T,>(key: string, eventName: string, items: T[]) => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(key, JSON.stringify(items));
  // update module-level caches so getSnapshot can return stable references
  if (key === CART_STORAGE_KEY) {
    cartCache = items as unknown as CartItem[];
  }

  if (key === WISHLIST_STORAGE_KEY) {
    wishlistCache = items as unknown as WishlistItem[];
  }

  window.dispatchEvent(new Event(eventName));
};

// Module-level caches to keep stable snapshot references between renders
let cartCache: CartItem[] | null = null;
let wishlistCache: WishlistItem[] | null = null;

const subscribeToStorage = (eventName: string) => (callback: () => void) => {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleEvent = () => callback();

  window.addEventListener(eventName, handleEvent);
  window.addEventListener("storage", handleEvent);

  return () => {
    window.removeEventListener(eventName, handleEvent);
    window.removeEventListener("storage", handleEvent);
  };
};

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <CartProvider>
      <WishlistProvider>{children}</WishlistProvider>
    </CartProvider>
  );
};

const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const items = useSyncExternalStore<CartItem[]>(
    subscribeToStorage(CART_EVENT),
    () => {
      if (typeof window === "undefined") return EMPTY_CART_SNAPSHOT;
      if (cartCache === null) cartCache = readStorage<CartItem>(CART_STORAGE_KEY);
      return cartCache;
    },
    () => EMPTY_CART_SNAPSHOT
  );

  const addToCart = (item: Omit<CartItem, "quantity">, quantity = 1) => {
    const currentItems = readStorage<CartItem>(CART_STORAGE_KEY);
    const existingItem = currentItems.find((cartItem) => cartItem.id === item.id);

    const nextItems = existingItem
      ? currentItems.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + quantity } : cartItem
        )
      : [...currentItems, { ...item, quantity }];

    writeStorage(CART_STORAGE_KEY, CART_EVENT, nextItems);
  };

  const updateQuantity = (id: string | number, quantity: number) => {
    const currentItems = readStorage<CartItem>(CART_STORAGE_KEY);

    if (quantity <= 0) {
      writeStorage(CART_STORAGE_KEY, CART_EVENT, currentItems.filter((item) => item.id !== id));
      return;
    }

    writeStorage(
      CART_STORAGE_KEY,
      CART_EVENT,
      currentItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (id: string | number) => {
    const currentItems = readStorage<CartItem>(CART_STORAGE_KEY);
    writeStorage(CART_STORAGE_KEY, CART_EVENT, currentItems.filter((item) => item.id !== id));
  };

  const clearCart = () => writeStorage(CART_STORAGE_KEY, CART_EVENT, [] as CartItem[]);
  const replaceCartItems = (nextItems: CartItem[]) => writeStorage(CART_STORAGE_KEY, CART_EVENT, nextItems);

  const actions = useMemo(
    () => ({ addToCart, updateQuantity, removeFromCart, clearCart, replaceCartItems }),
    []
  );

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  const value = useMemo<CartContextValue>(() => ({
    items,
    hydrated: true,
    itemCount,
    subtotal,
    ...actions,
  }), [items, itemCount, subtotal, actions]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const items = useSyncExternalStore<WishlistItem[]>(
    subscribeToStorage(WISHLIST_EVENT),
    () => {
      if (typeof window === "undefined") return EMPTY_WISHLIST_SNAPSHOT;
      if (wishlistCache === null)
        wishlistCache = readStorage<WishlistItem>(WISHLIST_STORAGE_KEY);
      return wishlistCache;
    },
    () => EMPTY_WISHLIST_SNAPSHOT
  );

  const isWishlisted = (id: string | number) => items.some((item) => item.id === id);

  const toggleWishlist = (item: WishlistItem) => {
    const currentItems = readStorage<WishlistItem>(WISHLIST_STORAGE_KEY);

    if (currentItems.some((wishlistItem) => wishlistItem.id === item.id)) {
      writeStorage(
        WISHLIST_STORAGE_KEY,
        WISHLIST_EVENT,
        currentItems.filter((wishlistItem) => wishlistItem.id !== item.id)
      );
      return;
    }

    writeStorage(WISHLIST_STORAGE_KEY, WISHLIST_EVENT, [...currentItems, item]);
  };

  const removeFromWishlist = (id: string | number) => {
    const currentItems = readStorage<WishlistItem>(WISHLIST_STORAGE_KEY);
    writeStorage(WISHLIST_STORAGE_KEY, WISHLIST_EVENT, currentItems.filter((wishlistItem) => wishlistItem.id !== id));
  };

  const clearWishlist = () => writeStorage(WISHLIST_STORAGE_KEY, WISHLIST_EVENT, [] as WishlistItem[]);

  const replaceWishlistItems = (nextItems: WishlistItem[]) => writeStorage(WISHLIST_STORAGE_KEY, WISHLIST_EVENT, nextItems);

  const wishlistActions = {
    isWishlisted,
    toggleWishlist,
    removeFromWishlist,
    clearWishlist,
    replaceWishlistItems,
  };

  const value: WishlistContextValue = {
    items,
    hydrated: true,
    itemCount: items.length,
    ...wishlistActions,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within AppProviders");
  }

  return context;
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error("useWishlist must be used within AppProviders");
  }

  return context;
};