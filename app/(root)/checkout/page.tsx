"use client";

import { useEffect, useMemo, useState } from "react";
import Script from "next/script";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoaderCircle, ShieldCheck, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCart } from "@/components/providers";
import { BACKEND_BASE_URL, requestBackend } from "@/lib/backend";

type CheckoutCustomer = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
};

type CheckoutBackendOrder = {
  orderId?: string | number;
  id?: string | number;
  orderID?: string | number;
  amount?: string | number;
  total?: string | number;
  merchant_id?: string;
  order?: CheckoutBackendOrder;
  data?: CheckoutBackendOrder;
};

declare global {
  interface Window {
    payhere?: {
      startPayment: (payment: Record<string, unknown>) => void;
      onCompleted: (orderId: string) => void;
      onDismissed: () => void;
      onError: (error: string) => void;
    };
  }
}

const readUserProfile = (): Partial<CheckoutCustomer> => {
  if (typeof window === "undefined") {
    return {};
  }

  const rawUser = localStorage.getItem("user");

  if (!rawUser) {
    return {};
  }

  try {
    const user = JSON.parse(rawUser) as {
      firstName?: string;
      lastName?: string;
      email?: string;
    };

    return {
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      email: user.email ?? "",
    };
  } catch {
    return {};
  }
};

const CheckoutPage = () => {
  const router = useRouter();
  const { items, subtotal, itemCount } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [message, setMessage] = useState("");
  const [customer, setCustomer] = useState<CheckoutCustomer>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "Sri Lanka",
  });

  useEffect(() => {
    setCustomer((current) => ({
      ...current,
      ...readUserProfile(),
    }));
  }, []);

  const orderSummary = useMemo(
    () => items.map((item) => `${item.quantity}x ${item.name}`).join(", "),
    [items]
  );

  const startPayHere = async () => {
    if (items.length === 0) {
      setMessage("Add at least one item to continue.");
      return;
    }

    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      router.push(`/sign-in?returnTo=${encodeURIComponent("/checkout")}`);
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const generatedOrderId = `SB-${Date.now()}`;

      const checkoutResponse = await requestBackend<CheckoutBackendOrder>(
        "/orders/checkout",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: generatedOrderId,
            amount: subtotal,
            currency: "LKR",
            items,
            customer,
          }),
        }
      ).catch(() => ({} as CheckoutBackendOrder));

      const backendOrder = checkoutResponse.order ?? checkoutResponse.data ?? checkoutResponse;

      const orderId =
        String(
          backendOrder.orderId ?? backendOrder.id ?? backendOrder.orderID ?? generatedOrderId
        );

      const amount = Number(backendOrder.amount ?? backendOrder.total ?? subtotal).toFixed(2);

      const paymentResponse = await requestBackend<Record<string, unknown>>(
        "/payments/payhere/create-js",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            merchant_id: backendOrder.merchant_id,
            return_url: `${window.location.origin}/checkout/return?order_id=${encodeURIComponent(orderId)}`,
            cancel_url: `${window.location.origin}/checkout/cancel?order_id=${encodeURIComponent(orderId)}`,
            notify_url: `${BACKEND_BASE_URL}/payments/payhere/ipn`,
            first_name: customer.firstName,
            last_name: customer.lastName,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
            city: customer.city,
            country: customer.country,
            order_id: orderId,
            items: orderSummary || "SiliconBay order",
            currency: "LKR",
            amount,
            custom_1: orderId,
            custom_2: customer.email,
            item_name_1: items[0]?.name,
            amount_1: items[0] ? items[0].price.toFixed(2) : "0.00",
            quantity_1: items[0]?.quantity ?? 1,
          }),
        }
      );

      const payment =
        (paymentResponse.payment as Record<string, unknown> | undefined) ??
        (paymentResponse.data as Record<string, unknown> | undefined) ??
        paymentResponse;

      if (window.payhere?.startPayment && sdkLoaded) {
        window.payhere.onCompleted = (completedOrderId) => {
          router.push(`/checkout/return?order_id=${encodeURIComponent(completedOrderId)}`);
        };

        window.payhere.onDismissed = () => {
          setMessage("Payment was dismissed. You can try again.");
        };

        window.payhere.onError = (error) => {
          setMessage(error);
        };

        window.payhere.startPayment(payment);
        return;
      }

      const form = document.createElement("form");
      form.method = "post";
      form.action = payment.sandbox === false
        ? "https://www.payhere.lk/pay/checkout"
        : "https://sandbox.payhere.lk/pay/checkout";

      Object.entries(payment).forEach(([key, value]) => {
        if (value === undefined || value === null) {
          return;
        }

        const field = document.createElement("input");
        field.type = "hidden";
        field.name = key;
        field.value = String(value);
        form.appendChild(field);
      });

      document.body.appendChild(form);
      form.submit();
      form.remove();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Checkout failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 px-4 md:px-8 py-8 space-y-8">
      <Script src="https://www.payhere.lk/lib/payhere.js" strategy="afterInteractive" onLoad={() => setSdkLoaded(true)} />

      <div className="grid lg:grid-cols-[1.3fr_0.7fr] gap-6">
        <Card className="p-6 border-0 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-amber-50 p-3 rounded-xl">
              <ShoppingBag className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Checkout</h1>
              <p className="text-sm text-gray-600">Review your shipping details and complete payment with PayHere.</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">First Name</label>
              <Input value={customer.firstName} onChange={(e) => setCustomer({ ...customer, firstName: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Last Name</label>
              <Input value={customer.lastName} onChange={(e) => setCustomer({ ...customer, lastName: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input type="email" value={customer.email} onChange={(e) => setCustomer({ ...customer, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <Input value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Address</label>
              <Input value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">City</label>
              <Input value={customer.city} onChange={(e) => setCustomer({ ...customer, city: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Country</label>
              <Input value={customer.country} onChange={(e) => setCustomer({ ...customer, country: e.target.value })} />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 items-center">
            <Button
              className="rounded-full bg-amber-600 hover:bg-amber-700"
              onClick={startPayHere}
              disabled={isLoading || items.length === 0}
            >
              {isLoading ? <LoaderCircle className="w-4 h-4 animate-spin" /> : "Pay with PayHere"}
            </Button>
            <Link href="/account/orders" className="text-sm text-blue-600 hover:underline">
              Review order history
            </Link>
          </div>

          {message ? (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {message}
            </div>
          ) : null}

          <div className="mt-6 rounded-xl border bg-gray-50 p-4 text-sm text-gray-700">
            <div className="flex items-center gap-2 font-semibold text-gray-900 mb-2">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              PayHere flow
            </div>
            The payment hash is generated on the backend, the notify URL points to the Java IPN handler, and the return page resolves the final status from the order record.
          </div>
        </Card>

        <Card className="p-6 border-0 shadow-sm h-fit">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

          <div className="space-y-3 max-h-105 overflow-y-auto pr-2">
            {items.length === 0 ? (
              <p className="text-sm text-gray-500">Your cart is empty.</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex justify-between gap-4 text-sm border-b pb-3">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-500">Qty {item.quantity}</p>
                  </div>
                  <p className="font-semibold whitespace-nowrap">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))
            )}
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><span>Items</span><span>{itemCount}</span></div>
            <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between font-semibold text-base pt-2 border-t"><span>Total</span><span>${subtotal.toFixed(2)}</span></div>
          </div>
        </Card>
      </div>
    </main>
  );
};

export default CheckoutPage;