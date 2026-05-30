import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const navigationList = [
  { name: "Overview", href: "/account/overview" },
  { name: "Orders", href: "/account/orders" },
  { name: "Payments", href: "/account/payments" },
  { name: "Returns", href: "/account/returns" },
  { name: "Wishlist", href: "/account/wishlist" },
  { name: "Feedback", href: "/account/feedback" },
  { name: "Addresses", href: "/account/addresses" },
  { name: "Settings", href: "/account/settings" },
];

const Account = () => {
  return (
    <div className="container mx-auto flex items-center justify-center">
      <div className="flex flex-col items-center text-center space-y-2">
        {navigationList.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="underline text-blue-600"
          >
            {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Account;
