import Link from "next/link";
import { requireUser, logoutAction } from "@/lib/auth";
import { systemRoleLabel } from "@/db/labels";

const nav = [
  { href: "/", label: "Özet" },
  { href: "/organizasyon", label: "Organizasyon" },
  { href: "/kisiler", label: "Kişiler" },
  { href: "/kutuphane", label: "Yetkinlik kütüphanesi" },
  { href: "/roller", label: "Roller ve pozisyonlar" },
  { href: "/ice-aktarma", label: "İçe aktarma" },
];

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await requireUser();
  const roles = (session.roles ?? []).map((r) => systemRoleLabel[r.role] ?? r.role).join(", ");
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-60 shrink-0 flex-col bg-[var(--brand)] p-4 text-white md:flex">
        <div className="mb-6">
          <div className="text-xs uppercase tracking-widest text-sky-200">YYS</div>
          <div className="font-semibold">Yetkinlik Yönetim Sistemi</div>
        </div>
        <nav className="flex flex-col gap-1">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="rounded-md px-3 py-2 text-sm hover:bg-white/10">{n.label}</Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-white/20 pt-4 text-xs">
          <div className="font-medium">{session.fullName}</div>
          <div className="text-sky-200">{roles || "Rol atanmamış"}</div>
          <form action={logoutAction}><button className="mt-2 underline">Çıkış</button></form>
        </div>
      </aside>
      <div className="flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
          <span className="font-semibold text-[var(--brand)]">YYS</span>
          <nav className="flex gap-3 text-sm">{nav.map((n) => <Link key={n.href} href={n.href}>{n.label}</Link>)}</nav>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
