import { requireUser } from "@/lib/auth";
import { PasswordForm } from "./password-form";

export default async function HesapPage() {
  const s = await requireUser();
  return (
    <div className="max-w-md space-y-4">
      <h1 className="text-2xl font-bold text-[var(--brand)]">Hesabım</h1>
      <div className="card text-sm"><div>{s.fullName}</div><div className="text-slate-500">{s.email}</div></div>
      <div className="card"><h2 className="mb-2 font-semibold">Şifre değiştir</h2><PasswordForm /></div>
    </div>
  );
}
