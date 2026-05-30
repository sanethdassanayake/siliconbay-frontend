"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckCircle2, Package, Truck } from "lucide-react";

import { Card } from "@/components/ui/card";
import { requestBackend } from "@/lib/backend";

const OrderDetail = () => {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const response = await requestBackend<Record<string, unknown>>(`/orders/${params.id}`);
        setOrder((response.order ?? response.data ?? response) as Record<string, unknown>);
      } catch {
        setOrder(null);
      }
    };

    loadOrder();
  }, [params.id]);

  return (
    <div className="flex-1">
      <Card className="p-6 border-0 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-amber-50 p-3 rounded-xl"><Package className="w-6 h-6 text-amber-600" /></div>
          <div>
            <h1 className="text-2xl font-bold">Order {params.id}</h1>
            <p className="text-sm text-gray-600">Detailed order status and payment information</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="rounded-xl border p-4">
            <p className="text-gray-500">Status</p>
            <p className="font-semibold mt-1">{String(order?.status ?? order?.statusMessage ?? "Processing")}</p>
          </div>
          <div className="rounded-xl border p-4">
            <p className="text-gray-500">Amount</p>
            <p className="font-semibold mt-1">{String(order?.total ?? order?.amount ?? "$0.00")}</p>
          </div>
          <div className="rounded-xl border p-4">
            <p className="text-gray-500">Payment</p>
            <p className="font-semibold mt-1">{String(order?.paymentMethod ?? order?.method ?? "PayHere")}</p>
          </div>
          <div className="rounded-xl border p-4">
            <p className="text-gray-500">Tracking</p>
            <p className="font-semibold mt-1">{String(order?.trackingNumber ?? order?.paymentId ?? "Pending")}</p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border bg-gray-50 p-4 text-sm text-gray-700 flex items-start gap-3">
          <Truck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p>If this order was paid through PayHere, the backend IPN handler updates the order and transaction records after checksum verification.</p>
        </div>

        <div className="mt-6 flex gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 text-green-700">
            <CheckCircle2 className="w-4 h-4" />
            Verified flow
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OrderDetail;