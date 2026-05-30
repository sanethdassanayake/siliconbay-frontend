"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, LoaderCircle } from "lucide-react";

import { Card } from "@/components/ui/card";
import { requestBackend } from "@/lib/backend";

const ReturnPage = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") ?? searchParams.get("orderId") ?? "";
  const [status, setStatus] = useState<string>("Loading");
  const [order, setOrder] = useState<Record<string, unknown> | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) {
        setStatus("Missing order id");
        setMessage("No order_id was supplied in the return URL.");
        return;
      }

      try {
        const response = await requestBackend<Record<string, unknown>>(`/orders/${orderId}`);
        setOrder(response.order ?? response.data ?? response);
        setStatus(String((response.order ?? response.data ?? response).status ?? "Processed"));
      } catch {
        setStatus("Processed");
        setMessage("Payment was redirected back from PayHere. The final status will be visible once the backend IPN completes.");
      }
    };

    loadOrder();
  }, [orderId]);

  return (
    <main className="flex-1 px-4 md:px-8 py-8">
      <Card className="max-w-3xl mx-auto p-8 border-0 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="bg-green-50 p-3 rounded-xl">
            {status === "Loading" ? (
              <LoaderCircle className="w-6 h-6 animate-spin text-amber-600" />
            ) : (
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Payment return</h1>
            <p className="text-sm text-gray-600 mt-1">Order {orderId || "N/A"}</p>

            <div className="mt-4 rounded-xl border bg-gray-50 p-4 text-sm space-y-2">
              <div className="flex justify-between"><span>Status</span><span className="font-semibold">{status}</span></div>
              <div className="flex justify-between"><span>Order ID</span><span className="font-semibold">{orderId || "N/A"}</span></div>
              {order ? (
                <div className="flex justify-between"><span>Amount</span><span className="font-semibold">${String(order.total ?? order.amount ?? "0.00")}</span></div>
              ) : null}
            </div>

            {message ? (
              <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {message}
              </div>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/account/orders" className="inline-flex items-center justify-center rounded-full bg-amber-600 px-5 py-2 text-white hover:bg-amber-700">
                View orders
              </Link>
              <Link href="/" className="inline-flex items-center justify-center rounded-full border px-5 py-2 hover:bg-gray-50">
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </main>
  );
};

export default ReturnPage;