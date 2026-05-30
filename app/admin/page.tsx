"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { BadgeCheck, LayoutDashboard, ListChecks, ShieldCheck, Store, Users } from "lucide-react";

import { Card } from "@/components/ui/card";
import { requestBackend } from "@/lib/backend";

type AdminRow = {
  id: string | number;
  name: string;
  email: string;
  status: string;
};

const adminLinks = [
  { label: "Overview", href: "#overview" },
  { label: "Controls", href: "#controls" },
  { label: "Users", href: "#users" },
  { label: "Sellers", href: "#sellers" },
  { label: "Data sources", href: "#sources" },
];

const ADMIN_ACCESS_SNAPSHOT = { allowed: false, redirectTo: null as string | null };
let adminAccessCacheKey = "";
let adminAccessCache = ADMIN_ACCESS_SNAPSHOT;

const subscribeToAuth = (callback: () => void) => {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
};

const readAdminAccess = () => {
  if (typeof window === "undefined") {
    return ADMIN_ACCESS_SNAPSHOT;
  }

  const token = localStorage.getItem("token");
  const rawUser = localStorage.getItem("user") ?? "";
  const nextCacheKey = `${token ?? ""}|${rawUser}`;

  if (nextCacheKey === adminAccessCacheKey) {
    return adminAccessCache;
  }

  if (!token) {
    adminAccessCacheKey = nextCacheKey;
    adminAccessCache = { allowed: false, redirectTo: "/sign-in?returnTo=/admin" };
    return adminAccessCache;
  }

  try {
    const currentUser = rawUser ? (JSON.parse(rawUser) as { role?: string }) : null;
    const role = String(currentUser?.role ?? "").toLowerCase();

    if (role && role !== "admin" && role !== "superadmin") {
      adminAccessCacheKey = nextCacheKey;
      adminAccessCache = { allowed: false, redirectTo: "/account/overview" };
      return adminAccessCache;
    }

    adminAccessCacheKey = nextCacheKey;
    adminAccessCache = { allowed: true, redirectTo: null };
    return adminAccessCache;
  } catch {
    adminAccessCacheKey = nextCacheKey;
    adminAccessCache = { allowed: false, redirectTo: "/sign-in?returnTo=/admin" };
    return adminAccessCache;
  }
};

const normalizeRows = (value: unknown, fallbackName: string): AdminRow[] => {
  const rows = Array.isArray(value)
    ? value
    : Array.isArray((value as { users?: unknown[]; sellers?: unknown[] } | null)?.users)
      ? (value as { users: unknown[] }).users
      : Array.isArray((value as { sellers?: unknown[] } | null)?.sellers)
        ? (value as { sellers: unknown[] }).sellers
        : [];

  return rows.map((row, index) => {
    const item = row as Record<string, unknown>;

    return {
      id: item.id ?? index + 1,
      name: String(item.name ?? item.firstName ?? item.storeName ?? fallbackName),
      email: String(item.email ?? ""),
      status: String(item.status ?? item.role ?? "Active"),
    };
  });
};

const AdminPage = () => {
  const [users, setUsers] = useState<AdminRow[]>([]);
  const [sellers, setSellers] = useState<AdminRow[]>([]);
  const [form, setForm] = useState({ id: "", status: "Active" });
  const [loadMessage, setLoadMessage] = useState("Loading admin data from the backend.");
  const access = useSyncExternalStore(subscribeToAuth, readAdminAccess, () => ADMIN_ACCESS_SNAPSHOT);

  useEffect(() => {
    if (!access.allowed && access.redirectTo) {
      window.location.replace(access.redirectTo);
    }
  }, [access.allowed, access.redirectTo]);

  useEffect(() => {
    if (!access.allowed) {
      return;
    }

    const loadAdminData = async () => {
      try {
        const [usersResponse, sellersResponse] = await Promise.all([
          requestBackend<Record<string, unknown>>("/admin/users"),
          requestBackend<Record<string, unknown>>("/admin/sellers"),
        ]);

        setUsers(normalizeRows(usersResponse, "User"));
        setSellers(normalizeRows(sellersResponse, "Seller"));
        setLoadMessage("");
      } catch {
        setUsers([]);
        setSellers([]);
        setLoadMessage("No admin records are available yet.");
      }
    };

    loadAdminData();
  }, [access.allowed]);

  const counts = useMemo(
    () => [
      { label: "Users", value: String(users.length), icon: Users },
      { label: "Sellers", value: String(sellers.length), icon: Store },
      { label: "Pending actions", value: "0", icon: ShieldCheck },
      { label: "Audit items", value: "0", icon: BadgeCheck },
    ],
    [sellers.length, users.length]
  );

  const updateEntity = async (entity: "users" | "sellers") => {
    if (!form.id) {
      return;
    }

    try {
      await requestBackend(`/admin/${entity}/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: form.status }),
      });
      setLoadMessage("");
    } catch {
      setLoadMessage(`Unable to update ${entity} ${form.id}.`);
    }
  };

  return (
    <div className="flex-1 space-y-6 mb-20">
      <Card id="overview" className="border p-4 shadow-sm bg-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-amber-600">Admin console</p>
            <h1 className="mt-2 text-2xl font-bold text-gray-900">Operations dashboard</h1>
            <p className="mt-1 text-sm text-gray-600 max-w-2xl">
              A plain admin workspace with the same grounded structure as the account area.
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 rounded-full border px-4 py-2 text-sm text-gray-700">
            <LayoutDashboard className="w-4 h-4 text-amber-600" />
            Admin access
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        <Card className="p-4 border shadow-sm h-fit sticky top-4">
          <h2 className="text-lg font-semibold mb-4">Sections</h2>
          <div className="space-y-2 text-sm">
            {adminLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block rounded-xl border px-4 py-3 hover:border-amber-500 hover:bg-amber-50"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-6 rounded-xl border bg-gray-50 p-4 text-sm text-gray-700">
            <div className="flex items-center gap-2 mb-2 font-semibold">
              <ListChecks className="w-4 h-4 text-amber-600" />
              Data sources
            </div>
            <p className="text-sm leading-6 text-gray-600">
              Users and sellers load from the backend admin routes.
            </p>
          </div>
        </Card>

        <div className="space-y-6">
          {!access.allowed && !access.redirectTo ? (
            <div className="bg-white border p-4 text-sm text-gray-600">
              Loading admin access...
            </div>
          ) : null}

          {loadMessage ? (
            <div className="bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900">
              {loadMessage}
            </div>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {counts.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="p-4 border shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-3xl font-bold mt-2">{stat.value}</p>
                    </div>
                    <div className="bg-amber-50 p-3">
                      <Icon className="w-6 h-6 text-amber-600" />
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div id="controls" className="grid xl:grid-cols-[1fr_auto] gap-6">
            <Card className="p-6 border shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Controls</h2>
              <div className="grid md:grid-cols-3 gap-3">
                <input
                  value={form.id}
                  onChange={(event) => setForm({ ...form, id: event.target.value })}
                  placeholder="Entity ID"
                  className="px-4 py-2 border rounded-xl"
                />
                <select
                  value={form.status}
                  onChange={(event) => setForm({ ...form, status: event.target.value })}
                  className="px-4 py-2 border bg-white rounded-xl"
                >
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Blocked</option>
                  <option>Pending</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateEntity("users")}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-amber-600 px-5 py-2 text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-amber-300"
                    disabled={!form.id}
                  >
                    <Users className="w-4 h-4" />
                    Update user
                  </button>
                  <button
                    onClick={() => updateEntity("sellers")}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!form.id}
                  >
                    <Store className="w-4 h-4" />
                    Update seller
                  </button>
                </div>
              </div>
            </Card>
          </div>

          <div id="users" className="grid xl:grid-cols-2 gap-6">
            <Card className="p-6 border shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Users</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-[12px]">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {users.length === 0 ? (
                      <tr>
                        <td className="px-4 py-6 text-sm text-gray-600" colSpan={3}>
                          No users are loaded yet.
                        </td>
                      </tr>
                    ) : (
                      users.map((row) => (
                        <tr key={String(row.id)}>
                          <td className="px-4 py-3 font-medium text-gray-900">{row.name}</td>
                          <td className="px-4 py-3 text-gray-600">{row.email || "Unavailable"}</td>
                          <td className="px-4 py-3 text-gray-600">{row.status}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card id="sellers" className="p-6 border shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Sellers</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-[12px]">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left">Store</th>
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {sellers.length === 0 ? (
                      <tr>
                        <td className="px-4 py-6 text-sm text-gray-600" colSpan={3}>
                          No sellers are loaded yet.
                        </td>
                      </tr>
                    ) : (
                      sellers.map((row) => (
                        <tr key={String(row.id)}>
                          <td className="px-4 py-3 font-medium text-gray-900">{row.name}</td>
                          <td className="px-4 py-3 text-gray-600">{row.email || "Unavailable"}</td>
                          <td className="px-4 py-3 text-gray-600">{row.status}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          <Card id="sources" className="p-6 border shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Data Sources</h2>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div className="rounded-xl border bg-gray-50 p-4">
                GET /admin/users for the user grid.
              </div>
              <div className="rounded-xl border bg-gray-50 p-4">
                GET /admin/sellers for the seller grid.
              </div>
              <div className="rounded-xl border bg-gray-50 p-4">
                PUT /admin/users/:id/status updates a user.
              </div>
              <div className="rounded-xl border bg-gray-50 p-4">
                PUT /admin/sellers/:id/status updates a seller.
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
