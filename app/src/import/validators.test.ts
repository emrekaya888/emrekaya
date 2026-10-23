import { describe, it, expect } from "vitest";
import { parseCsv } from "./parse";
import { validateOrg, validatePeople, validatePositions, validateRoles } from "./validators";

describe("organizasyon içe aktarma doğrulaması", () => {
  it("geçerli ağaç, şube sınıfı zorunluluğu, üst birim kontrolü", () => {
    const csv = parseCsv(`birim_kodu;ust_birim_kodu;tur;ad;yonetici_sicil;sube_sinifi;segment
K;;Kurum;Banka;;;
SB;K;GMY;Şube Bankacılığı;;;
B01;SB;Bölge;Marmara 1;1001;;
S0101;B01;Şube;Kadıköy;1002;Ticari;
S0102;B01;Şube;Bostancı;1003;;
P010101;S0101;Portföy ekibi;Ticari Satış;;;Ticari Satış
P010102;S0101;Portföy ekibi;Gişe;;;
X1;YOK;Departman;Hayalet;;;`);
    const r = validateOrg(csv, new Set());
    expect(r.total).toBe(8);
    expect(r.valid.map((v) => v.code)).toEqual(["K", "SB", "B01", "S0101", "P010101"]);
    expect(r.valid[3].branchClass).toBe("TICARI");
    expect(r.valid[4].segment).toBe("TICARI_SATIS");
    const msgs = r.errors.map((e) => e.message);
    expect(msgs.some((m) => m.includes("şube sınıfı zorunlu"))).toBe(true);
    expect(msgs.some((m) => m.includes("segment zorunlu"))).toBe(true);
    expect(msgs.some((m) => m.includes("Üst birim bulunamadı: YOK"))).toBe(true);
  });
  it("zorunlu sütun eksikse hiç satır işlenmez", () => {
    const r = validateOrg(parseCsv("kod;ad\nA;B"), new Set());
    expect(r.valid.length).toBe(0);
    expect(r.errors[0].message).toContain("Zorunlu sütun eksik");
  });
  it("BOM ve Türkçe başlıklar normalize edilir", () => {
    const r = validateOrg(parseCsv("﻿Birim Kodu;Üst Birim Kodu;Tür;Ad\nK;;KURUM;Banka"), new Set());
    expect(r.valid.length).toBe(1);
  });
});

describe("rol, pozisyon, kişi doğrulaması", () => {
  it("rol kademe ve yönetici bayrağı", () => {
    const r = validateRoles(parseCsv("rol_kodu;ad;is_ailesi;kademe;yonetici_mi;ag;segment\nR1;Ticari Satış Yöneticisi;Ticari Satış;2;Hayır;Şube;Ticari Satış\nR2;Şube Müdürü;;3;Evet;Şube;\nR3;Bozuk;;x;belki;GM;"));
    expect(r.valid.length).toBe(2);
    expect(r.valid[0].segment).toBe("TICARI_SATIS");
    expect(r.valid[1].isManager).toBe(true);
    expect(r.errors.length).toBe(2);
  });
  it("pozisyon rol ve birim referansı", () => {
    const r = validatePositions(parseCsv("pozisyon_kodu;rol_kodu;birim_kodu;kritik\nP1;R1;S1;Evet\nP2;R9;S1;\nP3;R1;S9;"), new Set(["R1"]), new Set(["S1"]));
    expect(r.valid.length).toBe(1);
    expect(r.valid[0].isCritical).toBe(true);
    expect(r.errors.map((e) => e.field)).toEqual(["rol_kodu", "birim_kodu"]);
  });
  it("kişi sicil, e-posta, tarih ve pozisyon", () => {
    const r = validatePeople(parseCsv("sicil;ad_soyad;e_posta;ise_giris;pozisyon_kodu;baslangic\n1001;Ayşe Yılmaz;ayse@banka.com;15.03.2019;P1;01.01.2024\n1001;Mükerrer;;;;\n1002;Hatalı Tarih;x@y.z;31/13/2020;;\n1003;Pozisyonsuz;;;P9;"), new Set(["P1"]));
    expect(r.valid.length).toBe(1);
    expect(r.valid[0].hireDate).toBe("2019-03-15");
    expect(r.valid[0].startDate).toBe("2024-01-01");
    expect(r.errors.length).toBe(3);
  });
});
