"use client";
import { useActionState } from "react";
import { changePasswordAction } from "./actions";
export function PasswordForm() {
  const [state, action, pending] = useActionState(changePasswordAction, undefined);
  return (
    <form action={action} className="space-y-3 text-sm">
      <label className="block">Mevcut şifre<input name="current" type="password" required className="input" autoComplete="current-password" /></label>
      <label className="block">Yeni şifre<input name="next" type="password" required minLength={8} className="input" autoComplete="new-password" /></label>
      <label className="block">Yeni şifre (tekrar)<input name="again" type="password" required className="input" autoComplete="new-password" /></label>
      {state?.error && <p className="text-red-700">{state.error}</p>}{state?.ok && <p className="text-green-700">{state.ok}</p>}
      <button disabled={pending} className="btn-primary">Değiştir</button>
    </form>
  );
}
