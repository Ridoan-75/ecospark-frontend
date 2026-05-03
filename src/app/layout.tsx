import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import ToastProvider from "@/providers/ToastProvider";
import { GlobalGridBackground } from "@/components/shared/GlobalGridBackground";
import { Chatbot } from "@/components/shared/Chatbot";

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
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <body suppressHydrationWarning>
        <GlobalGridBackground />
        <QueryProvider>
          <ToastProvider />
          {children}
          <Chatbot />
        </QueryProvider>
      </body>
    </html>
  );
}