import { LoginForm } from "./login-form";

export default function GirisPage() {
  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <div className="card w-full max-w-sm">
        <div className="mb-6">
          <div className="text-xs uppercase tracking-widest text-[var(--brand-2)]">Yetkinlik Yönetim Sistemi</div>
          <h1 className="mt-1 text-xl font-bold text-[var(--brand)]">Giriş</h1>
        </div>
        <LoginForm />
        <p className="mt-6 text-xs text-slate-500">Kurumsal tek oturum açma (SSO) bağlantısı ileride eklenecektir.</p>
      </div>
    </main>
  );
}
