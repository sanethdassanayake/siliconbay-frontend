import Link from "next/link";
import { XCircle } from "lucide-react";

import { Card } from "@/components/ui/card";

const CancelPage = () => {
  return (
    <main className="flex-1 px-4 md:px-8 py-8">
      <Card className="max-w-2xl mx-auto p-8 border-0 shadow-sm text-center">
        <div className="flex justify-center mb-4">
          <XCircle className="w-14 h-14 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold">Payment cancelled</h1>
        <p className="mt-2 text-sm text-gray-600">You can go back to checkout and try again when you are ready.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/checkout" className="rounded-full bg-amber-600 px-5 py-2 text-white hover:bg-amber-700">
            Retry checkout
          </Link>
          <Link href="/" className="rounded-full border px-5 py-2 hover:bg-gray-50">
            Back home
          </Link>
        </div>
      </Card>
    </main>
  );
};

export default CancelPage;