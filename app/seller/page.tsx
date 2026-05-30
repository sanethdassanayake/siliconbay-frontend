"use client";

import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, Store, Save, LayoutDashboard, ListChecks, Package, DollarSign } from "lucide-react";

import { Card } from "@/components/ui/card";
import { requestBackend } from "@/lib/backend";

type SellerSummary = {
  products: number;
  orders: number;
  revenue: string;
  payouts: number;
};

const SellerPage = () => {
  const [form, setForm] = useState({ name: "", bio: "", email: "", phone: "" });
  const [status, setStatus] = useState("");
  const [loadMessage, setLoadMessage] = useState("Connect seller profile and store-management APIs to populate this dashboard.");
  const [summary, setSummary] = useState<SellerSummary>({ products: 0, orders: 0, revenue: "$0.00", payouts: 0 });

  const access = useMemo(() => {
    if (typeof window === "undefined") {
      return { allowed: false, redirectTo: null as string | null };
    }

    const token = localStorage.getItem("token");

    if (!token) {
      return { allowed: false, redirectTo: "/sign-in?returnTo=/seller" };
    }

    try {
      const rawUser = localStorage.getItem("user");
      const currentUser = rawUser ? (JSON.parse(rawUser) as { role?: string }) : null;
      const role = String(currentUser?.role ?? "").toLowerCase();

      if (role && role !== "seller" && role !== "admin" && role !== "superadmin") {
        return { allowed: false, redirectTo: "/account/overview" };
      }

      return { allowed: true, redirectTo: null };
    } catch {
      return { allowed: false, redirectTo: "/sign-in?returnTo=/seller" };
    }
  }, []);

  useEffect(() => {
    if (!access.allowed && access.redirectTo) {
      window.location.replace(access.redirectTo);
      return;
    }
  }, [access.allowed, access.redirectTo]);

  useEffect(() => {
    if (!access.allowed) {
      return;
    }

    const loadSeller = async () => {
      try {
        const [profileResponse, productsResponse, ordersResponse, payoutsResponse] = await Promise.all([
          requestBackend<Record<string, unknown>>("/sellers/me"),
          requestBackend<Record<string, unknown>>("/sellers/products"),
          requestBackend<Record<string, unknown>>("/sellers/orders"),
          requestBackend<Record<string, unknown>>("/sellers/payouts"),
        ]);

        const seller = (profileResponse.seller ?? profileResponse.data ?? profileResponse) as Record<string, unknown>;

        setForm({
          name: String(seller.name ?? seller.storeName ?? ""),
          bio: String(seller.bio ?? seller.description ?? ""),
          email: String(seller.email ?? ""),
          phone: String(seller.phone ?? ""),
        });

        const products = Array.isArray((productsResponse as { products?: unknown[] } | null)?.products)
          ? (productsResponse as { products: unknown[] }).products.length
          : Array.isArray(productsResponse)
            ? productsResponse.length
            : 0;

        const orders = Array.isArray((ordersResponse as { orders?: unknown[] } | null)?.orders)
          ? (ordersResponse as { orders: unknown[] }).orders.length
          : Array.isArray(ordersResponse)
            ? ordersResponse.length
            : 0;

        const payouts = Array.isArray((payoutsResponse as { payouts?: unknown[] } | null)?.payouts)
          ? (payoutsResponse as { payouts: unknown[] }).payouts.length
          : Array.isArray(payoutsResponse)
            ? payoutsResponse.length
            : 0;

        setSummary({ products, orders, revenue: String(seller.revenue ?? "$0.00"), payouts });
        setLoadMessage("");
      } catch {
        setLoadMessage("No seller data is available yet.");
        setSummary({ products: 0, orders: 0, revenue: "$0.00", payouts: 0 });
      }
    };

    loadSeller();
  }, [access.allowed]);

  const stats = useMemo(
    () => [
      { label: "Products", value: String(summary.products), icon: Package },
      { label: "Orders", value: String(summary.orders), icon: LayoutDashboard },
      { label: "Revenue", value: summary.revenue, icon: DollarSign },
      { label: "Payouts", value: String(summary.payouts), icon: BadgeCheck },
    ],
    [summary.orders, summary.products, summary.payouts, summary.revenue]
  );

  const saveSeller = async () => {
    setStatus("");

    try {
      await requestBackend("/sellers/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      setStatus("Seller profile saved.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save seller profile.");
    }
  };

  const apiChecklist = [
    "GET /sellers/me for profile details.",
    "PUT /sellers/me for profile updates.",
    "GET /sellers/products for store inventory.",
    "GET /sellers/orders for fulfillment work.",
    "GET /sellers/payouts for revenue and settlement history.",
  ];

  if (!access.allowed) {
    return <div className="flex-1 px-4 md:px-8 py-8">Loading seller access...</div>;
  }

  return (
    <main className="flex-1 px-4 md:px-8 py-8 space-y-6">
      <Card className="p-6 border-0 shadow-sm bg-linear-to-r from-amber-600 to-amber-400 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Seller Dashboard</h1>
            <p className="text-sm text-white/90 max-w-2xl mt-2">
              A multi-panel workspace for store profile, catalog management, orders, and payout tracking.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm">
            <Store className="w-4 h-4" />
            Seller access required
          </div>
        </div>
      </Card>

      {loadMessage ? (
        <div className="bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">
          {loadMessage}
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-4 border-0 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className="bg-amber-50 p-3 rounded-xl">
                  <Icon className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        <Card className="p-4 border-0 shadow-sm h-fit sticky top-4">
          <h2 className="text-lg font-semibold mb-4">Seller Sections</h2>
          <div className="space-y-2 text-sm">
            <a href="#profile" className="block rounded-xl border px-4 py-3 hover:border-amber-500 hover:bg-amber-50">
              Store profile
            </a>
            <a href="#inventory" className="block rounded-xl border px-4 py-3 hover:border-amber-500 hover:bg-amber-50">
              Inventory
            </a>
            <a href="#orders" className="block rounded-xl border px-4 py-3 hover:border-amber-500 hover:bg-amber-50">
              Orders
            </a>
            <a href="#payouts" className="block rounded-xl border px-4 py-3 hover:border-amber-500 hover:bg-amber-50">
              Payouts
            </a>
            <a href="#apis" className="block rounded-xl border px-4 py-3 hover:border-amber-500 hover:bg-amber-50">
              API contract
            </a>
          </div>

          <div className="mt-6 rounded-xl border bg-gray-50 p-4 text-sm text-gray-700">
            <div className="flex items-center gap-2 mb-2 font-semibold">
              <ListChecks className="w-4 h-4 text-amber-600" />
              Required backend APIs
            </div>
            <ul className="space-y-2">
              {apiChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </Card>

        <div className="space-y-6">
          <div id="profile" className="grid xl:grid-cols-[1fr_auto] gap-4">
            <Card className="p-6 border-0 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-amber-50 p-3 rounded-xl"><Store className="w-6 h-6 text-amber-600" /></div>
                <div>
                  <h2 className="text-xl font-semibold">Seller Profile</h2>
                  <p className="text-sm text-gray-600">Create or update your seller information</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Store name" className="px-4 py-2 border" />
                <input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="Contact email" className="px-4 py-2 border" />
                <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="Phone number" className="px-4 py-2 border" />
                <input value={form.bio} onChange={(event) => setForm({ ...form, bio: event.target.value })} placeholder="Short bio" className="px-4 py-2 border" />
              </div>

              <div className="flex items-center gap-3 mt-6">
                <button onClick={saveSeller} className="inline-flex items-center gap-2 rounded-full bg-amber-600 px-5 py-2 text-white hover:bg-amber-700">
                  <Save className="w-4 h-4" />
                  Save Seller Profile
                </button>
                {status ? <span className="text-sm text-gray-600">{status}</span> : null}
              </div>
            </Card>

            <Card className="p-6 border-0 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Profile Notes</h2>
              <p className="text-sm text-gray-600 leading-6">
                If the backend has not implemented seller profile APIs yet, this panel stays empty instead of injecting demo data.
              </p>
            </Card>
          </div>

          <div id="inventory" className="grid xl:grid-cols-2 gap-6">
            <Card className="p-6 border-0 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Inventory</h2>
              <div className="rounded-xl border border-dashed p-6 text-sm text-gray-600">
                Connect <span className="font-medium">GET /sellers/products</span> to show catalog items and stock controls.
              </div>
            </Card>

            <Card id="orders" className="p-6 border-0 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Orders</h2>
              <div className="rounded-xl border border-dashed p-6 text-sm text-gray-600">
                Connect <span className="font-medium">GET /sellers/orders</span> to show order processing queues.
              </div>
            </Card>
          </div>

          <Card id="payouts" className="p-6 border-0 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Payouts</h2>
            <div className="rounded-xl border border-dashed p-6 text-sm text-gray-600">
              Connect <span className="font-medium">GET /sellers/payouts</span> to show settlements, commissions, and revenue history.
            </div>
          </Card>

          <Card id="apis" className="p-6 border-0 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">API Contract</h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
              {apiChecklist.map((item) => (
                <div key={item} className="rounded-xl border bg-gray-50 p-4">
                  {item}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default SellerPage;
