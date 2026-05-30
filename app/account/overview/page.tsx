"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CreditCard, Heart, MapPin, Package, ShoppingCart, ShieldCheck, LayoutDashboard } from "lucide-react";

import { useCart, useWishlist } from "@/components/providers";
import { Card } from "@/components/ui/card";
import { requestBackend } from "@/lib/backend";

type OrderRow = {
  id: string;
  status: string;
  total: string;
  date: string;
};

type DashboardSummary = {
  orders: OrderRow[];
  instruments: number;
  returns: number;
  addresses: number;
};

const Overview = () => {
  const { itemCount: cartCount } = useCart();
  const { itemCount: wishlistCount } = useWishlist();
  const [summary, setSummary] = useState<DashboardSummary>({
    orders: [],
    instruments: 0,
    returns: 0,
    addresses: 0,
  });
  const [loadMessage, setLoadMessage] = useState("Account summary is loading from your backend data.");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [ordersResponse, instrumentsResponse, returnsResponse, addressesResponse] = await Promise.all([
          requestBackend<Record<string, unknown>>("/orders"),
          requestBackend<Record<string, unknown>>("/payments/instruments"),
          requestBackend<Record<string, unknown>>("/returns"),
          requestBackend<Record<string, unknown>>("/addresses"),
        ]);

        const rawOrders = Array.isArray(ordersResponse)
          ? ordersResponse
          : Array.isArray((ordersResponse as { orders?: unknown[] }).orders)
            ? (ordersResponse as { orders: unknown[] }).orders
            : [];

        setSummary({
          orders: rawOrders.slice(0, 5).map((entry, index) => {
            const order = entry as Record<string, unknown>;

            return {
              id: String(order.id ?? order.orderId ?? `ORD-${index + 1}`),
              status: String(order.status ?? "Processing"),
              total: String(order.total ?? order.amount ?? "$0.00"),
              date: String(order.date ?? order.createdAt ?? "Today"),
            };
          }),
          instruments: Array.isArray((instrumentsResponse as { instruments?: unknown[] } | null)?.instruments)
            ? (instrumentsResponse as { instruments: unknown[] }).instruments.length
            : Array.isArray(instrumentsResponse)
              ? instrumentsResponse.length
              : 0,
          returns: Array.isArray((returnsResponse as { returns?: unknown[] } | null)?.returns)
            ? (returnsResponse as { returns: unknown[] }).returns.length
            : Array.isArray(returnsResponse)
              ? returnsResponse.length
              : 0,
          addresses: Array.isArray((addressesResponse as { addresses?: unknown[] } | null)?.addresses)
            ? (addressesResponse as { addresses: unknown[] }).addresses.length
            : Array.isArray(addressesResponse)
              ? addressesResponse.length
              : 0,
        });

        setLoadMessage("");
      } catch {
        setSummary({ orders: [], instruments: 0, returns: 0, addresses: 0 });
        setLoadMessage("No account summary data is available right now.");
      }
    };

    loadDashboard();
  }, []);

  const stats = useMemo(
    () => [
      { label: "Cart Items", value: String(cartCount), icon: ShoppingCart, tone: "bg-amber-50 text-amber-600" },
      { label: "Wishlist Items", value: String(wishlistCount), icon: Heart, tone: "bg-amber-50 text-amber-600" },
      { label: "Saved Cards", value: String(summary.instruments), icon: CreditCard, tone: "bg-amber-50 text-amber-600" },
      { label: "Open Returns", value: String(summary.returns), icon: Package, tone: "bg-amber-50 text-amber-600" },
    ],
    [cartCount, wishlistCount, summary.instruments, summary.returns]
  );

  const quickLinks = [
    { label: "Orders", href: "/account/orders", icon: LayoutDashboard },
    { label: "Payments", href: "/account/payments", icon: CreditCard },
    { label: "Returns", href: "/account/returns", icon: Package },
    { label: "Addresses", href: "/account/addresses", icon: MapPin },
  ];

  return (
    <div className="flex-1 space-y-6">
      <Card className="p-6 border-0 shadow-sm bg-linear-to-r from-amber-500 to-amber-200 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Account Dashboard</h1>
            <p className="text-sm text-white/90 max-w-2xl">
              Monitor shopping activity, saved payment methods, and return requests from a single control panel.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm">
            <ShieldCheck className="w-4 h-4" />
            Secure account area
          </div>
        </div>
      </Card>

      {loadMessage ? (
        <div className="bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">
          {loadMessage}
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-4 border-0 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.tone} p-3 rounded-xl`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        <Card className="p-4 border-0 shadow-sm h-fit sticky top-4">
          <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
          <div className="space-y-2">
            {quickLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-3 rounded-xl border px-4 py-3 hover:border-amber-500 hover:bg-amber-50"
                >
                  <Icon className="w-4 h-4 text-amber-600" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="mt-6 rounded-xl border bg-gray-50 p-4 text-sm text-gray-700">
            <div className="flex items-center gap-2 mb-2 font-semibold">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              Account data sources
            </div>
            <p className="text-sm text-gray-600 leading-6">
              Orders, payment methods, returns, and addresses are loaded from the backend when available.
            </p>
          </div>
        </Card>

        <div className="space-y-6">
          <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-6">
            <Card className="p-6 border-0 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Recent Orders</h2>
                <Link href="/account/orders" className="text-sm text-amber-600 hover:underline">
                  View all
                </Link>
              </div>
              <div className="space-y-3">
                {summary.orders.length === 0 ? (
                  <div className="rounded-xl border border-dashed p-6 text-sm text-gray-600">
                    No order data yet. Connect <span className="font-medium">GET /orders</span>.
                  </div>
                ) : summary.orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between rounded-xl border p-4">
                    <div>
                      <p className="font-medium text-gray-900">{order.id}</p>
                      <p className="text-sm text-gray-600">{order.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{order.total}</p>
                      <p className="text-sm text-gray-600">{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 border-0 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Account Summary</h2>
              <div className="space-y-4 text-sm text-gray-700">
                <div className="flex items-center justify-between">
                  <span>Saved addresses</span>
                  <span className="font-semibold">{summary.addresses}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Saved payment methods</span>
                  <span className="font-semibold">{summary.instruments}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Wishlist items</span>
                  <span className="font-semibold">{wishlistCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Cart items</span>
                  <span className="font-semibold">{cartCount}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
