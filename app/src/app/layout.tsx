import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yetkinlik Yönetim Sistemi",
  description: "Teknik beceri ve davranışsal yetkinliklerin kanıta dayalı yönetimi",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
