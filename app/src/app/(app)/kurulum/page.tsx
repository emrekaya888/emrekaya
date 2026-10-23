import { and, asc, eq, isNull } from "drizzle-orm";
import { db, schema } from "@/db";
import { orgUnitTypeLabel, systemRoleLabel } from "@/db/labels";
import { requireUser } from "@/lib/auth";
import { hasRole } from "@/lib/session";
import { ActionForm, ConfirmButton, InlineRename, SelectAction } from "./forms";
import {
  addOrgUnitAction, addPersonAction, addPositionAction, addRoleAction, assignPersonAction, createUserAction, deactivatePersonAction,
  deleteOrgUnitAction, deletePositionAction, deleteRoleAction, renameOrgUnitAction, setOrgManagerAction, toggleUserAction,
} from "./actions";

export default async function KurulumPage() {
  const session = await requireUser();
  const isAdmin = hasRole(session, "IK_ADMIN");
  const { orgUnits, roles, positions, people, assignments, users, userRoles } = schema;
  const [units, roleRows, posRows, personRows, userRows] = await Promise.all([
    db.select().from(orgUnits).orderBy(asc(orgUnits.depth), asc(orgUnits.name)),
    db.select().from(roles).orderBy(asc(roles.jobFamily), asc(roles.grade), asc(roles.name)),
    db.select({ id: positions.id, code: positions.code, orgUnitId: positions.orgUnitId, roleId: positions.roleId, isCritical: positions.isCritical,
      holderId: assignments.personId }).from(positions)
      .leftJoin(assignments, and(eq(assignments.positionId, positions.id), isNull(assignments.endDate))).orderBy(asc(positions.code)),
    db.select().from(people).where(eq(people.active, true)).orderBy(asc(people.fullName)),
    db.select({ id: users.id, email: users.email, active: users.active, personId: users.personId, role: userRoles.role, scope: userRoles.scopeOrgUnitId })
      .from(users).leftJoin(userRoles, eq(userRoles.userId, users.id)).orderBy(asc(users.email)),
  ]);
  const unitById = new Map(units.map((u) => [u.id, u]));
  const roleById = new Map(roleRows.map((r) => [r.id, r]));
  const personById = new Map(personRows.map((p) => [p.id, p]));
  const positionByPerson = new Map(posRows.filter((p) => p.holderId).map((p) => [p.holderId!, p]));
  const children = new Map<number | null, typeof units>();
  units.forEach((u) => children.set(u.parentId, [...(children.get(u.parentId) ?? []), u]));
  const unitPath = (u: typeof units[number]): string => (u.parentId && unitById.get(u.parentId) ? `${unitPath(unitById.get(u.parentId)!)} › ${u.name}` : u.name);
  const personOptions = personRows.map((p) => ({ id: p.id, label: `${p.fullName} (${p.employeeNo})` }));
  const freePositions = posRows.filter((p) => !p.holderId);
  const posLabel = (p: typeof posRows[number]) => `${roleById.get(p.roleId)?.name ?? "?"} · ${unitById.get(p.orgUnitId)?.name ?? "?"} · ${p.code}`;

  function UnitNode({ u }: { u: typeof units[number] }) {
    const kids = children.get(u.id) ?? [];
    const unitPositions = posRows.filter((p) => p.orgUnitId === u.id);
    return (
      <li className="mt-1">
        <div className="flex flex-wrap items-center gap-2 rounded-md px-2 py-1 hover:bg-slate-50">
          <span className="badge bg-slate-200 text-slate-700">{orgUnitTypeLabel[u.type]}</span>
          <span className="font-medium">{u.name}</span>
          <span className="text-xs text-slate-500">{u.code}</span>
          {unitPositions.length > 0 && <span className="text-xs text-slate-500">{unitPositions.length} pozisyon</span>}
          {isAdmin && (
            <>
              <InlineRename initial={u.name} onSave={renameOrgUnitAction.bind(null, u.id)} />
              <span className="text-xs text-slate-500">Yönetici:</span>
              <SelectAction options={personOptions} value={u.managerPersonId} onChange={setOrgManagerAction.bind(null, u.id)} emptyLabel="—" />
              {u.parentId && kids.length === 0 && unitPositions.length === 0 && <ConfirmButton label="sil" confirmText={`${u.name} silinsin mi?`} onConfirm={deleteOrgUnitAction.bind(null, u.id)} />}
            </>
          )}
        </div>
        {kids.length > 0 && <ul className="ml-5 border-l border-slate-200 pl-2">{kids.map((k) => <UnitNode key={k.id} u={k} />)}</ul>}
      </li>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[var(--brand)]">Kurulum</h1>
        <p className="text-sm text-slate-600">Müdürlükleri, rolleri, pozisyonları, kişileri ve giriş hesaplarını buradan ekleyip çıkarın. Silme işlemleri bağımlılık varsa engellenir; kişiler silinmez, pasifleştirilir (kayıtlar korunur).</p>
        {!isAdmin && <p className="mt-2 rounded-md bg-amber-50 p-2 text-sm text-amber-800">Düzenleme için İK admin yetkisi gerekir; görüntüleme modundasınız.</p>}
      </div>

      <section className="card space-y-3">
        <h2 className="font-semibold">1 · Birimler (müdürlükler)</h2>
        <ul>{(children.get(null) ?? []).map((r) => <UnitNode key={r.id} u={r} />)}</ul>
        {isAdmin && (
          <ActionForm action={addOrgUnitAction} submit="Birim ekle">
            <label>Üst birim<select name="parentId" required className="input">{units.map((u) => <option key={u.id} value={u.id}>{unitPath(u)}</option>)}</select></label>
            <label>Ad<input name="name" required className="input" placeholder="İşe Alım Müdürlüğü" /></label>
            <label>Tür<select name="type" defaultValue="DEPARTMAN" className="input">{["DIREKTORLUK", "DEPARTMAN", "SERVIS", "EKIP", "GMY", "BOLGE", "SUBE", "PORTFOY_EKIBI"].map((t) => <option key={t} value={t}>{orgUnitTypeLabel[t]}</option>)}</select></label>
          </ActionForm>
        )}
        <p className="text-xs text-slate-500">Öneri: İK Grup Müdürlüğü = Direktörlük; altındaki 5 müdürlük = Departman; müdürlük içi ekipler = Servis. Kod otomatik üretilir.</p>
      </section>

      <section className="card space-y-3">
        <h2 className="font-semibold">2 · Roller (iş ailesi + kademe)</h2>
        <table className="table"><thead><tr><th>Kod</th><th>Rol</th><th>İş ailesi</th><th>Kademe</th><th>Yönetici</th><th>Pozisyon</th><th></th></tr></thead>
          <tbody>{roleRows.map((r) => { const c = posRows.filter((p) => p.roleId === r.id).length; return (
            <tr key={r.id}><td>{r.code}</td><td className="font-medium">{r.name}</td><td>{r.jobFamily ?? "—"}</td><td>{r.grade}</td><td>{r.isManager ? "Evet" : "—"}</td><td>{c}</td>
              <td>{isAdmin && c === 0 && <ConfirmButton label="sil" confirmText={`${r.name} rolü silinsin mi?`} onConfirm={deleteRoleAction.bind(null, r.id)} />}</td></tr>); })}
            {roleRows.length === 0 && <tr><td colSpan={7} className="text-slate-500">Rol yok.</td></tr>}
          </tbody></table>
        {isAdmin && (
          <ActionForm action={addRoleAction} submit="Rol ekle">
            <label>Rol adı<input name="name" required className="input" placeholder="İK Uzmanı" /></label>
            <label>İş ailesi<input name="jobFamily" className="input" placeholder="İnsan Kaynakları" /></label>
            <label>Kademe (1 en alt)<input name="grade" type="number" min={1} max={9} defaultValue={1} className="input" /></label>
            <label className="flex items-center gap-2 pb-2"><input type="checkbox" name="isManager" /> Yönetici rolü</label>
          </ActionForm>
        )}
        <p className="text-xs text-slate-500">Örnek kademe dizisi: Uzman Yardımcısı 1 · Uzman 2 · Kıdemli Uzman 3 · Yönetmen 4 (yönetici) · Müdür 5 (yönetici) · Grup Müdürü 6 (yönetici).</p>
      </section>

      <section className="card space-y-3">
        <h2 className="font-semibold">3 · Pozisyonlar (bir rolün bir birimdeki kadrosu)</h2>
        <table className="table"><thead><tr><th>Kod</th><th>Rol</th><th>Birim</th><th>Kritik</th><th>Dolduran</th><th></th></tr></thead>
          <tbody>{posRows.map((p) => (
            <tr key={p.id}><td>{p.code}</td><td>{roleById.get(p.roleId)?.name}</td><td>{unitById.get(p.orgUnitId)?.name}</td><td>{p.isCritical ? "Evet" : "—"}</td>
              <td>{p.holderId ? personById.get(p.holderId)?.fullName ?? "—" : <span className="text-amber-700">Boş</span>}</td>
              <td>{isAdmin && !p.holderId && <ConfirmButton label="sil" confirmText={`${p.code} silinsin mi?`} onConfirm={deletePositionAction.bind(null, p.id)} />}</td></tr>))}
            {posRows.length === 0 && <tr><td colSpan={6} className="text-slate-500">Pozisyon yok.</td></tr>}
          </tbody></table>
        {isAdmin && (
          <ActionForm action={addPositionAction} submit="Pozisyon ekle">
            <label>Birim<select name="orgUnitId" required className="input">{units.filter((u) => u.parentId).map((u) => <option key={u.id} value={u.id}>{unitPath(u)}</option>)}</select></label>
            <label>Rol<select name="roleId" required className="input">{roleRows.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</select></label>
            <label>Adet<input name="count" type="number" min={1} max={50} defaultValue={1} className="input" /></label>
            <label className="flex items-center gap-2 pb-2"><input type="checkbox" name="isCritical" /> Kritik pozisyon</label>
          </ActionForm>
        )}
      </section>

      <section className="card space-y-3">
        <h2 className="font-semibold">4 · Kişiler ve atamalar</h2>
        <table className="table"><thead><tr><th>Sicil</th><th>Ad Soyad</th><th>E-posta</th><th>Pozisyon</th><th></th></tr></thead>
          <tbody>{personRows.map((p) => { const cur = positionByPerson.get(p.id); return (
            <tr key={p.id}><td>{p.employeeNo}</td><td className="font-medium">{p.fullName}</td><td>{p.email ?? "—"}</td>
              <td>{isAdmin ? <SelectAction options={[...(cur ? [{ id: cur.id, label: posLabel(cur) }] : []), ...freePositions.map((fp) => ({ id: fp.id, label: posLabel(fp) }))]} value={cur?.id ?? null} onChange={assignPersonAction.bind(null, p.id)} emptyLabel="Atama yok" /> : cur ? posLabel(cur) : "—"}</td>
              <td>{isAdmin && <ConfirmButton label="pasifleştir" confirmText={`${p.fullName} pasifleştirilsin mi? Atamaları kapatılır, giriş hesabı kapanır.`} onConfirm={deactivatePersonAction.bind(null, p.id)} />}</td></tr>); })}
            {personRows.length === 0 && <tr><td colSpan={5} className="text-slate-500">Kişi yok.</td></tr>}
          </tbody></table>
        {isAdmin && (
          <ActionForm action={addPersonAction} submit="Kişi ekle" className="grid gap-2 md:grid-cols-5 items-end text-sm">
            <label>Sicil<input name="employeeNo" required className="input" /></label>
            <label>Ad Soyad<input name="fullName" required className="input" /></label>
            <label>E-posta<input name="email" type="email" className="input" /></label>
            <label>İşe giriş<input name="hireDate" type="date" className="input" /></label>
            <label>Pozisyon (boş olanlar)<select name="positionId" className="input"><option value="">—</option>{freePositions.map((fp) => <option key={fp.id} value={fp.id}>{posLabel(fp)}</option>)}</select></label>
          </ActionForm>
        )}
      </section>

      <section className="card space-y-3">
        <h2 className="font-semibold">5 · Giriş hesapları ve yetkiler</h2>
        <table className="table"><thead><tr><th>E-posta</th><th>Kişi</th><th>Rol</th><th>Kapsam</th><th>Durum</th><th></th></tr></thead>
          <tbody>{userRows.map((u) => (
            <tr key={`${u.id}-${u.role}`}><td>{u.email}</td><td>{u.personId ? personById.get(u.personId)?.fullName ?? "(pasif)" : "—"}</td><td>{u.role ? systemRoleLabel[u.role] : "—"}</td><td>{u.scope ? unitById.get(u.scope)?.name : "Tüm kurum"}</td>
              <td>{u.active ? <span className="badge bg-green-100 text-green-800">Aktif</span> : <span className="badge bg-slate-200">Pasif</span>}</td>
              <td>{isAdmin && u.id !== session.userId && <ConfirmButton label={u.active ? "pasifleştir" : "aktifleştir"} confirmText="Hesap durumu değişsin mi?" onConfirm={toggleUserAction.bind(null, u.id, !u.active)} className="text-xs underline" />}</td></tr>))}
          </tbody></table>
        {isAdmin && (
          <ActionForm action={createUserAction} submit="Hesap oluştur" className="grid gap-2 md:grid-cols-5 items-end text-sm">
            <label>Kişi<select name="personId" required className="input">{personRows.map((p) => <option key={p.id} value={p.id}>{p.fullName}</option>)}</select></label>
            <label>E-posta<input name="email" type="email" required className="input" /></label>
            <label>Geçici şifre<input name="password" type="text" required minLength={8} className="input" placeholder="en az 8 karakter" /></label>
            <label>Yetki<select name="role" defaultValue="CALISAN" className="input"><option value="CALISAN">Çalışan</option><option value="YONETICI">Yönetici (müdür)</option><option value="UST_DOGRULAYICI">Üst yönetici (grup müdürü)</option><option value="IK_ADMIN">İK admin</option></select></label>
            <label>Kapsam birimi<select name="scopeOrgUnitId" className="input"><option value="">—</option>{units.map((u) => <option key={u.id} value={u.id}>{unitPath(u)}</option>)}</select></label>
          </ActionForm>
        )}
        <p className="text-xs text-slate-500">Yönetici ve üst yönetici için kapsam birimi seçin (o birim ve altı görünür). İK admin tüm kurumu görür. Kullanıcılar ilk girişte şifrelerini değiştirmelidir (şifre değiştirme ekranı sprint 4).</p>
      </section>
    </div>
  );
}
