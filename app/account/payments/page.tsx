"use client";

import { useEffect, useMemo, useState } from "react";
import { CreditCard, Plus, Trash2, Edit, Star, LoaderCircle } from "lucide-react";

import { requestBackend } from "@/lib/backend";

type SavedInstrument = {
  id: string | number;
  type: string;
  brand: string;
  last4: string;
  expiry: string;
  holderName: string;
  isDefault: boolean;
  addedDate: string;
};

type TransactionRow = {
  id: string;
  date: string;
  description: string;
  method: string;
  amount: string;
  status: string;
};

const Payments = () => {
  const [instruments, setInstruments] = useState<SavedInstrument[]>([]);
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadMessage, setLoadMessage] = useState("Connect the payments and transactions APIs to populate this dashboard.");
  const [form, setForm] = useState({
    holderName: "",
    cardNumber: "",
    expiry: "",
    method: "VISA",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [instrumentsResponse, transactionsResponse] = await Promise.all([
          requestBackend<Record<string, unknown>>("/payments/instruments"),
          requestBackend<Record<string, unknown>>("/transactions"),
        ]);

        const rawInstruments = Array.isArray(instrumentsResponse)
          ? instrumentsResponse
          : Array.isArray((instrumentsResponse as { instruments?: unknown[] }).instruments)
            ? (instrumentsResponse as { instruments: unknown[] }).instruments
            : [];

        const rawTransactions = Array.isArray(transactionsResponse)
          ? transactionsResponse
          : Array.isArray((transactionsResponse as { transactions?: unknown[] }).transactions)
            ? (transactionsResponse as { transactions: unknown[] }).transactions
            : [];

        setInstruments(rawInstruments.map((instrument, index) => {
          const current = instrument as Record<string, unknown>;

          return {
            id: current.id ?? index + 1,
            type: String(current.type ?? current.paymentMethod ?? ""),
            brand: String(current.brand ?? current.cardBrand ?? ""),
            last4: String(current.last4 ?? current.cardNo ?? "").slice(-4),
            expiry: String(current.expiry ?? current.cardExpiry ?? ""),
            holderName: String(current.holderName ?? current.cardHolderName ?? ""),
            isDefault: Boolean(current.isDefault ?? index === 0),
            addedDate: String(current.addedDate ?? current.createdAt ?? ""),
          };
        }));

        setTransactions(rawTransactions.map((transaction, index) => {
          const current = transaction as Record<string, unknown>;

          return {
            id: String(current.id ?? current.transactionId ?? `TXN-${index + 1}`),
            date: String(current.date ?? current.createdAt ?? ""),
            description: String(current.description ?? current.note ?? ""),
            method: String(current.method ?? current.paymentMethod ?? ""),
            amount: String(current.amount ?? current.total ?? ""),
            status: String(current.status ?? ""),
          };
        }));
        setLoadMessage("");
      } catch {
        setInstruments([]);
        setTransactions([]);
        setLoadMessage("No payment instruments or transaction history is available yet.");
      }
    };

    loadData();
  }, []);

  const stats = useMemo(() => [
    { label: "Saved Cards", value: String(instruments.length) },
    { label: "Transactions", value: String(transactions.length) },
    { label: "Default Cards", value: String(instruments.filter((instrument) => instrument.isDefault).length) },
    { label: "Pending", value: String(transactions.filter((transaction) => transaction.status !== "Completed").length) },
  ], [instruments, transactions]);

  const addInstrument = async () => {
    setLoading(true);

    try {
      await requestBackend("/payments/instruments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardHolderName: form.holderName,
          cardNo: form.cardNumber,
          cardExpiry: form.expiry,
          paymentMethod: form.method,
        }),
      });

      setForm({ holderName: "", cardNumber: "", expiry: "", method: "VISA" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 space-y-6">
      <div className="bg-white border p-4">
        <h1 className="text-2xl font-bold text-gray-900">Payment Methods</h1>
        <p className="text-sm text-gray-600 mt-1">Manage saved instruments and review transaction history</p>
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

      <div className="bg-white border">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold">Saved Payment Instruments</h2>
        </div>

        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {instruments.length === 0 ? (
            <div className="col-span-full rounded-xl border border-dashed p-6 text-sm text-gray-600">
              No saved payment instruments yet.
            </div>
          ) : instruments.map((method) => (
            <div key={method.id} className="border p-4 hover:border-amber-500 transition-colors relative">
              {method.isDefault && (
                <div className="absolute top-2 right-2">
                  <span className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-1 text-xs font-medium"><Star className="w-3 h-3 fill-amber-700" />Default</span>
                </div>
              )}

              <div className="flex items-start gap-3 mb-4">
                <div className="bg-gray-100 p-3"><CreditCard className="w-6 h-6 text-gray-600" /></div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{method.brand || "Card"} {method.type || "Payment Method"}</p>
                  <p className="text-sm text-gray-600">•••• •••• •••• {method.last4 || "----"}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between"><span className="text-gray-600">Cardholder</span><span className="font-medium">{method.holderName || "Unavailable"}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Expires</span><span className="font-medium">{method.expiry || "Unavailable"}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Added</span><span className="font-medium">{method.addedDate || "Unavailable"}</span></div>
              </div>

              <div className="flex gap-2 pt-4 border-t">
                <button className="flex-1 px-3 py-2 border hover:bg-gray-50 flex items-center justify-center gap-2 text-sm"><Edit className="w-4 h-4" />Edit</button>
                <button className="flex-1 px-3 py-2 border hover:bg-red-50 hover:border-red-500 hover:text-red-600 flex items-center justify-center gap-2 text-sm"><Trash2 className="w-4 h-4" />Remove</button>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t p-4 grid md:grid-cols-4 gap-3">
          <input value={form.holderName} onChange={(event) => setForm({ ...form, holderName: event.target.value })} placeholder="Cardholder name" className="px-4 py-2 border" />
          <input value={form.cardNumber} onChange={(event) => setForm({ ...form, cardNumber: event.target.value })} placeholder="Card number" className="px-4 py-2 border" />
          <input value={form.expiry} onChange={(event) => setForm({ ...form, expiry: event.target.value })} placeholder="Expiry MM/YY" className="px-4 py-2 border" />
          <button onClick={addInstrument} className="px-4 py-2 bg-amber-500 text-white hover:bg-amber-600 flex items-center justify-center gap-2">
            {loading ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Add New Card
          </button>
        </div>
      </div>

      <div className="bg-white border">
        <div className="p-4 border-b"><h2 className="text-xl font-semibold">Transaction History</h2></div>

        <div className="overflow-x-auto">
          <table className="w-full text-[12px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Transaction ID</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Description</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Method</th>
                <th className="px-4 py-3 text-right font-medium text-gray-600 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y">
              {transactions.length === 0 ? (
                <tr>
                  <td className="px-4 py-6 text-sm text-gray-600" colSpan={6}>
                    No transaction history is available yet.
                  </td>
                </tr>
              ) : transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900 text-nowrap">{transaction.id}</td>
                  <td className="px-4 py-3 text-gray-600 text-nowrap">{transaction.date || "Unavailable"}</td>
                  <td className="px-4 py-3 text-gray-600">{transaction.description || "Unavailable"}</td>
                  <td className="px-4 py-3 text-gray-600 text-nowrap">{transaction.method || "Unavailable"}</td>
                  <td className={`px-4 py-3 font-semibold text-right text-nowrap ${transaction.amount.startsWith('+') ? 'text-green-600' : 'text-gray-900'}`}>{transaction.amount || "Unavailable"}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-1 font-medium ${transaction.status === 'Completed' ? 'bg-green-100 text-green-700' : transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{transaction.status || "Unavailable"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;