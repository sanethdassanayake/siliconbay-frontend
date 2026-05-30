import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AppProviders } from "@/components/providers";

// const poppins = Poppins({
//   subsets: ["latin"],
//   weight: ["400", "700"],
// });

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "SiliconBay",
  description: "E-commerce frontend for SiliconBay",
};

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <AppProviders>{children}</AppProviders>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}

export default RootLayout;