"use client";
import { useActionState } from "react";
import { loginAction } from "@/lib/auth";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, undefined);
  return (
    <form action={action} className="space-y-4">
      <label className="block text-sm">
        <span className="mb-1 block text-slate-700">E-posta</span>
        <input name="email" type="email" required className="input" autoComplete="username" />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block text-slate-700">Şifre</span>
        <input name="password" type="password" required className="input" autoComplete="current-password" />
      </label>
      {state?.error && <p className="rounded-md bg-red-50 p-2 text-sm text-red-700">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn-primary w-full justify-center disabled:opacity-60">
        {pending ? "Giriş yapılıyor…" : "Giriş yap"}
      </button>
    </form>
  );
}
