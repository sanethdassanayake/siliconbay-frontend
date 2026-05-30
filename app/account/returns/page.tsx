"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Filter, Plus, Eye, PackageX } from "lucide-react";

import { requestBackend } from "@/lib/backend";

type ReturnRow = {
  id: string;
  orderId: string;
  date: string;
  productName: string;
  quantity: number;
  reason: string;
  status: string;
  refundAmount: string;
  requestDate: string;
};

const Returns = () => {
  const [returns, setReturns] = useState<ReturnRow[]>([]);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState({ orderId: "", reason: "Defective item", description: "" });
  const [loadMessage, setLoadMessage] = useState("Loading return requests from the backend.");

  useEffect(() => {
    const loadReturns = async () => {
      try {
        const response = await requestBackend<Record<string, unknown>>("/returns");
        const rawReturns = Array.isArray(response)
          ? response
          : Array.isArray((response as { returns?: unknown[] }).returns)
            ? (response as { returns: unknown[] }).returns
            : [];

        setReturns(rawReturns.map((entry, index) => {
          const item = entry as Record<string, unknown>;

          return {
            id: String(item.id ?? item.returnId ?? `RET-${index + 1}`),
            orderId: String(item.orderId ?? item.order_id ?? "N/A"),
            date: String(item.date ?? item.createdAt ?? ""),
            productName: String(item.productName ?? item.itemName ?? ""),
            quantity: Number(item.quantity ?? 1),
            reason: String(item.reason ?? item.message ?? ""),
            status: String(item.status ?? ""),
            refundAmount: String(item.refundAmount ?? item.amount ?? ""),
            requestDate: String(item.requestDate ?? item.createdAt ?? ""),
          };
        }));
        setLoadMessage("");
      } catch {
        setReturns([]);
        setLoadMessage("No return requests are available yet.");
      }
    };

    loadReturns();
  }, []);

  const filteredReturns = useMemo(() => {
    return returns.filter((item) => [item.id, item.orderId, item.productName].join(" ").toLowerCase().includes(query.toLowerCase()));
  }, [query, returns]);

  const submitReturn = async () => {
    await requestBackend("/returns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
  };

  const stats = [
    { label: "Total Returns", value: String(returns.length) },
    { label: "Pending", value: String(returns.filter((item) => item.status === "Pending").length) },
    { label: "Approved", value: String(returns.filter((item) => item.status === "Approved").length) },
    { label: "Completed", value: String(returns.filter((item) => item.status === "Completed").length) },
  ];

  return (
    <div className="flex-1 space-y-6">
      <div className="bg-white border p-4">
        <h1 className="text-2xl font-bold text-gray-900">Returns & Refunds</h1>
        <p className="text-sm text-gray-600 mt-1">Create and track return requests</p>
      </div>

      {loadMessage ? (
        <div className="bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">
          {loadMessage}
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white border p-4">
            <p className="text-sm text-gray-600">{stat.label}</p>
            <p className="text-3xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 p-4">
        <div className="flex gap-3">
          <PackageX className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-900 mb-1">Return Policy</h3>
            <p className="text-sm text-amber-800">Items can be returned within 30 days of delivery. Refunds are processed after approval.</p>
          </div>
        </div>
      </div>

      <div className="bg-white border p-4 grid lg:grid-cols-[1fr_auto] gap-4">
        <div className="grid md:grid-cols-3 gap-3">
          <input value={form.orderId} onChange={(event) => setForm({ ...form, orderId: event.target.value })} placeholder="Order ID" className="px-4 py-2 border" />
          <select value={form.reason} onChange={(event) => setForm({ ...form, reason: event.target.value })} className="px-4 py-2 border bg-white">
            <option>Defective item</option>
            <option>Wrong size</option>
            <option>Changed mind</option>
            <option>Not as described</option>
            <option>Damaged in shipping</option>
          </select>
          <input value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} placeholder="Short description" className="px-4 py-2 border" />
        </div>
        <button onClick={submitReturn} className="px-4 py-2 bg-amber-500 text-white hover:bg-amber-600 flex items-center gap-2 justify-center">
          <Plus className="w-4 h-4" />
          New Return
        </button>
      </div>

      <div className="bg-white border p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} type="text" placeholder="Search by return ID, order ID, or product name..." className="w-full pl-10 pr-4 py-2 border focus:outline-none focus:ring-2 focus:ring-amber-500" />
          </div>
          <button className="px-4 py-2 border bg-white hover:bg-gray-50 flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      <div className="bg-white border">
        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead className="bg-gray-50 border-b sticky top-0 z-10">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Return ID</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Order ID</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Qty</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Reason</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600 uppercase tracking-wider">Refund</th>
                <th className="px-4 py-3 text-center font-medium text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {filteredReturns.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-sm text-gray-600" colSpan={8}>
                    No return requests to show yet.
                  </td>
                </tr>
              ) : filteredReturns.map((returnItem) => (
                <tr key={returnItem.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900 text-nowrap">{returnItem.id}</td>
                  <td className="px-4 py-3 text-gray-600 text-nowrap">{returnItem.orderId}</td>
                          <td className="px-4 py-3 text-gray-900">{returnItem.productName || "Unavailable"}</td>
                  <td className="px-4 py-3 text-gray-600">{returnItem.quantity}</td>
                          <td className="px-4 py-3 text-gray-600 text-nowrap">{returnItem.reason || "Unavailable"}</td>
                          <td className="px-4 py-3"><span className={`px-2 py-1 font-medium text-nowrap ${returnItem.status === 'Completed' ? 'bg-green-100 text-green-700' : returnItem.status === 'Approved' ? 'bg-blue-100 text-blue-700' : returnItem.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' : returnItem.status === 'Pending' ? 'bg-gray-100 text-gray-700' : 'bg-red-100 text-red-700'}`}>{returnItem.status || "Unavailable"}</span></td>
                          <td className="px-4 py-3 font-semibold text-right text-nowrap">{returnItem.refundAmount || "Unavailable"}</td>
                  <td className="px-4 py-3 text-center"><button className="text-amber-600 hover:text-amber-700 hover:bg-amber-50 p-2"><Eye className="w-4 h-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Returns;