import type { Metadata } from "next";
import "./globals.css";
import { CONFIG } from "@/config";

export const metadata: Metadata = {
  title: `Happy Birthday, ${CONFIG.name} 🎂`,
  description: "A personal birthday surprise — made with love.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body className="bg-[#080810] text-white antialiased overflow-x-hidden font-sans">
        {children}
      </body>
    </html>
  );
}
