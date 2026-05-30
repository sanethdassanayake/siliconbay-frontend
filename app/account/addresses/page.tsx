"use client";

import { useEffect, useMemo, useState } from "react";
import { Briefcase, Home, MapPin, Plus, Star } from "lucide-react";

import { requestBackend } from "@/lib/backend";

type AddressRow = {
  id: string | number;
  type: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
  addedDate: string;
};

const normalizeAddresses = (value: unknown): AddressRow[] => {
  const rows = Array.isArray(value)
    ? value
    : Array.isArray((value as { addresses?: unknown[] } | null)?.addresses)
      ? (value as { addresses: unknown[] }).addresses
      : [];

  return rows.map((row, index) => {
    const current = row as Record<string, unknown>;

    return {
      id: current.id ?? index + 1,
      type: String(current.type ?? current.label ?? "Home"),
      name: String(current.name ?? current.fullName ?? ""),
      phone: String(current.phone ?? current.contactNumber ?? ""),
      address: String(current.address ?? current.line1 ?? ""),
      city: String(current.city ?? ""),
      state: String(current.state ?? ""),
      zipCode: String(current.zipCode ?? current.postalCode ?? ""),
      country: String(current.country ?? ""),
      isDefault: Boolean(current.isDefault ?? false),
      addedDate: String(current.addedDate ?? current.createdAt ?? ""),
    };
  });
};

const Addresses = () => {
  const [addresses, setAddresses] = useState<AddressRow[]>([]);
  const [loadMessage, setLoadMessage] = useState("Loading saved addresses from the backend.");

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const response = await requestBackend<Record<string, unknown>>("/addresses");
        setAddresses(normalizeAddresses(response));
        setLoadMessage("");
      } catch {
        setAddresses([]);
        setLoadMessage("No saved addresses are available yet.");
      }
    };

    loadAddresses();
  }, []);

  const stats = useMemo(
    () => [
      { label: "Total Addresses", value: String(addresses.length), icon: MapPin },
      { label: "Default Address", value: String(addresses.filter((address) => address.isDefault).length), icon: Star },
      { label: "Home Addresses", value: String(addresses.filter((address) => address.type.toLowerCase() === "home").length), icon: Home },
      { label: "Office Addresses", value: String(addresses.filter((address) => address.type.toLowerCase() === "office").length), icon: Briefcase },
    ],
    [addresses]
  );

  return (
    <div className="flex-1 space-y-6 mb-20">
      <div className="bg-white border p-4">
        <h1 className="text-2xl font-bold text-gray-900">Shipping Addresses</h1>
        <p className="text-sm text-gray-600 mt-1">Manage your delivery addresses for faster checkout</p>
      </div>

      {loadMessage ? (
        <div className="bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">
          {loadMessage}
        </div>
      ) : null}

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

      <div className="bg-white border p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-3">
            <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Saved addresses</h3>
              <p className="text-sm text-gray-600">
                Addresses are loaded from the backend when available. No seeded rows are shown here.
              </p>
            </div>
          </div>
          <button className="px-4 py-2 bg-amber-500 text-white hover:bg-amber-600 flex items-center gap-2" disabled>
            <Plus className="w-4 h-4" />
            Add Address
          </button>
        </div>
      </div>

      {addresses.length === 0 ? (
        <div className="bg-white border border-dashed p-8 text-sm text-gray-600">
          No addresses are available yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {addresses.map((address) => (
            <div key={String(address.id)} className="bg-white border relative">
              {address.isDefault ? (
                <div className="absolute top-0 right-0">
                  <span className="flex items-center gap-1 bg-amber-100 text-amber-700 px-3 py-1 text-xs font-medium">
                    <Star className="w-3 h-3 fill-amber-700" />
                    Default
                  </span>
                </div>
              ) : null}

              <div className="p-4">
                <div className="flex items-start gap-3 mb-4">
                  <div className="bg-gray-100 p-3">
                    {address.type.toLowerCase() === "home" ? (
                      <Home className="w-5 h-5 text-gray-600" />
                    ) : (
                      <Briefcase className="w-5 h-5 text-gray-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{address.type || "Address"}</p>
                    <p className="text-sm text-gray-600">{address.addedDate ? `Added ${address.addedDate}` : "Loaded from backend"}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <p className="font-medium text-gray-900">{address.name || "Unnamed recipient"}</p>
                    <p className="text-gray-600">{address.phone || "No phone number"}</p>
                  </div>
                  <div className="text-gray-600">
                    <p>{address.address || "No street address"}</p>
                    <p>{[address.city, address.state, address.zipCode].filter(Boolean).join(", ") || "No city details"}</p>
                    <p>{address.country || "No country"}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Addresses;
