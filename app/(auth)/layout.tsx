import Link from "next/link";

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen flex flex-col">
            <div className='text-center text-2xl font-bold p-4'>
                <span className="text-amber-500">Silicon</span>
                <span>Bay</span>
            </div>

            <div className="flex justify-center">
                {children}
            </div> 

            <footer className="border-t-2 text-center space-y-2 py-4">
                <div className="grid sm:flex justify-center gap-6">
                    <Link href="/" className="text-blue-600 hover:underline text-sm">
                        Conditions of Service
                    </Link>
                    <Link href="/" className="text-blue-600 hover:underline text-sm">
                        Privacy Policy
                    </Link>
                    <Link href="/" className="text-blue-600 hover:underline text-sm">
                        Security
                    </Link>
                    <Link href="/" className="text-blue-600 hover:underline text-sm">
                        Contact
                    </Link>
                </div>
                <span className="text-sm text-gray-500">
                    &copy; 2025 Hogger Technologies, Inc. All rights reserved.
                </span>
            </footer>
        </div>
    );
}

export default Layout;