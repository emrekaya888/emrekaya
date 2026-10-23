/** Geliştirme tohumu: İK admin kullanıcısı ve küçük örnek organizasyon (GM + 1 bölge, 2 şube). */
import "dotenv/config";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, schema } from "../src/db";

async function main() {
  const { users, userRoles, orgUnits, roles, positions, people, assignments } = schema;
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@banka.local";
  const adminPass = process.env.SEED_ADMIN_PASSWORD ?? "Admin123!";
  const existing = await db.select().from(users).where(eq(users.email, adminEmail));
  if (!existing.length) {
    const [u] = await db.insert(users).values({ email: adminEmail, passwordHash: await bcrypt.hash(adminPass, 10) }).returning();
    await db.insert(userRoles).values({ userId: u.id, role: "IK_ADMIN", scopeOrgUnitId: null });
    console.log(`İK admin oluşturuldu: ${adminEmail} / ${adminPass}`);
  }
  if (process.env.SEED_SAMPLE !== "false") {
    const have = await db.select().from(orgUnits).where(eq(orgUnits.code, "K"));
    if (!have.length) {
      const ins = async (v: typeof orgUnits.$inferInsert) => (await db.insert(orgUnits).values(v).returning())[0];
      const k = await ins({ code: "K", type: "KURUM", name: "Banka", depth: 0 });
      const gm = await ins({ code: "GM", parentId: k.id, type: "GMY", name: "Genel Müdürlük", depth: 1 });
      const ik = await ins({ code: "GM-IK", parentId: gm.id, type: "DIREKTORLUK", name: "İnsan Kaynakları Grup Müdürlüğü", depth: 2 });
      const ikY = await ins({ code: "GM-IK-YET", parentId: ik.id, type: "DEPARTMAN", name: "Yetenek ve Yetkinlik Yönetimi", depth: 3 });
      const sb = await ins({ code: "SB", parentId: k.id, type: "GMY", name: "Şube Bankacılığı", depth: 1 });
      const b1 = await ins({ code: "B01", parentId: sb.id, type: "BOLGE", name: "Marmara 1 Bölge Müdürlüğü", depth: 2 });
      const s1 = await ins({ code: "S0101", parentId: b1.id, type: "SUBE", name: "Kadıköy Şubesi", branchClass: "TICARI", depth: 3 });
      const s2 = await ins({ code: "S0102", parentId: b1.id, type: "SUBE", name: "Bostancı Şubesi", branchClass: "KOBI", depth: 3 });
      const p1 = await ins({ code: "S0101-TS", parentId: s1.id, type: "PORTFOY_EKIBI", name: "Ticari Satış", segment: "TICARI_SATIS", depth: 4 });
      const p2 = await ins({ code: "S0102-KS", parentId: s2.id, type: "PORTFOY_EKIBI", name: "KOBİ Satış", segment: "KOBI_SATIS", depth: 4 });
      const rIns = async (v: typeof roles.$inferInsert) => (await db.insert(roles).values(v).returning())[0];
      const rSM = await rIns({ code: "SUBE-MD", name: "Şube Müdürü", jobFamily: "Şube Yönetimi", grade: 1, isManager: true, network: "SUBE" });
      const rTS = await rIns({ code: "TS-YON", name: "Ticari Satış Yöneticisi", jobFamily: "Ticari Satış", grade: 2, network: "SUBE", segment: "TICARI_SATIS" });
      const rKS = await rIns({ code: "KS-YON", name: "KOBİ Satış Yöneticisi", jobFamily: "KOBİ Satış", grade: 2, network: "SUBE", segment: "KOBI_SATIS" });
      const rIK = await rIns({ code: "IK-UZM", name: "İK Uzmanı", jobFamily: "İnsan Kaynakları", grade: 2, network: "GM" });
      const pIns = async (v: typeof positions.$inferInsert) => (await db.insert(positions).values(v).returning())[0];
      const posSM1 = await pIns({ code: "P-S0101-MD", roleId: rSM.id, orgUnitId: s1.id, isCritical: true });
      const posTS1 = await pIns({ code: "P-S0101-TS-1", roleId: rTS.id, orgUnitId: p1.id, isCritical: true });
      const posKS1 = await pIns({ code: "P-S0102-KS-1", roleId: rKS.id, orgUnitId: p2.id });
      const posIK1 = await pIns({ code: "P-GM-IK-YET-1", roleId: rIK.id, orgUnitId: ikY.id });
      const perIns = async (v: typeof people.$inferInsert) => (await db.insert(people).values(v).returning())[0];
      const a = await perIns({ employeeNo: "1001", fullName: "Ayşe Yılmaz", email: "ayse.yilmaz@banka.local", hireDate: "2015-03-02" });
      const b = await perIns({ employeeNo: "1002", fullName: "Mehmet Demir", email: "mehmet.demir@banka.local", hireDate: "2019-06-17" });
      const c = await perIns({ employeeNo: "1003", fullName: "Elif Kaya", email: "elif.kaya@banka.local", hireDate: "2021-01-11" });
      const d = await perIns({ employeeNo: "2001", fullName: "Can Aydın", email: "can.aydin@banka.local", hireDate: "2018-09-03" });
      await db.insert(assignments).values([
        { personId: a.id, positionId: posSM1.id, startDate: "2023-01-01" },
        { personId: b.id, positionId: posTS1.id, startDate: "2022-05-01" },
        { personId: c.id, positionId: posKS1.id, startDate: "2024-02-01" },
        { personId: d.id, positionId: posIK1.id, startDate: "2020-01-01" },
      ]);
      await db.update(orgUnits).set({ managerPersonId: a.id }).where(eq(orgUnits.id, s1.id));
      console.log("Örnek organizasyon yüklendi.");
    }
  }
  process.exit(0);
}
main().catch((e) => { console.error(e); process.exit(1); });
