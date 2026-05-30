"use client"

import BreadcrumbSection from "@/components/BreadcrumbSection";
import Footer from "@/components/Footer";
import Header from "@/components/Header"
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {

    const pathName = usePathname();
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            router.replace("/sign-in");
        }
    }, [router]);

    const buttons = [
        { name: 'Overview', href: '/account/overview' },
        { name: 'Orders', href: '/account/orders' },
        { name: 'Payments', href: '/account/payments' },
        { name: 'Returns', href: '/account/returns' },
        { name: 'Wishlist', href: '/account/wishlist' },
        { name: 'Feedback', href: '/account/feedback' },
        { name: 'Addresses', href: '/account/addresses' },
        { name: 'Settings', href: '/account/settings' },
    ];

    return (
        <div>
            <Header />
            <div className="flex px-8 py-4 gap-2">
                <div className="flex flex-1">
                    <BreadcrumbSection />
                </div>
            </div>
            <div className="flex px-8 py-4 gap-4">

                <div className="hidden lg:flex flex-col md:w-65">
                    <div className="sticky top-2">
                        {
                            buttons.map((button) => (
                                <div key={button.name} className={`p-2 hover:bg-gray-100 ${pathName === button.href ? 'border-l-4 border-l-amber-600 bg-gray-100' : ''}`}>
                                    <Link href={button.href}>{button.name}</Link>
                                </div>
                            ))
                        }
                    </div>
                </div>

                {children}
            </div>
            <Footer />
        </div>
    );
}

export default Layout