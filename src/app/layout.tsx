import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import ToastProvider from "@/providers/ToastProvider";
import { GlobalGridBackground } from "@/components/shared/GlobalGridBackground";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "EcoSpark Hub",
    template: "%s | EcoSpark Hub",
  },
  description: "A community portal for sharing sustainability ideas",
  keywords: ["sustainability", "eco", "environment", "community", "ideas"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <GlobalGridBackground />
        <QueryProvider>
          <ToastProvider />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}