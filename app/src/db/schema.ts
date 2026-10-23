/**
 * Yetkinlik Yönetim Sistemi — veri şeması (Sprint 1: organizasyon, kişi, rol, pozisyon, yetki, içe aktarma, denetim izi).
 * Alan adları 02-veri-modeli.md ile uyumludur; kodda İngilizce karşılıklar kullanılır.
 */
import {
  pgTable, pgEnum, serial, integer, text, boolean, timestamp, date, jsonb, uniqueIndex, index, type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const orgUnitType = pgEnum("org_unit_type", [
  "KURUM", "GMY", "DIREKTORLUK", "DEPARTMAN", "SERVIS", "BOLGE", "SUBE", "PORTFOY_EKIBI", "EKIP",
]);
export const branchClass = pgEnum("branch_class", ["OZEL_BANKACILIK", "KOBI", "TICARI", "KURUMSAL"]);
export const segment = pgEnum("segment", [
  "BIREYSEL_SATIS_TEMSILCISI", "BIREYSEL_SATIS", "KOBI_SATIS", "TICARI_SATIS", "KURUMSAL_SATIS", "OZEL_BANKACILIK", "MUSTERI_ILISKILERI",
]);
export const network = pgEnum("network", ["GM", "SUBE", "BOLGE"]);
export const attritionRisk = pgEnum("attrition_risk", ["DUSUK", "ORTA", "YUKSEK"]);
export const systemRole = pgEnum("system_role", [
  "CALISAN", "YONETICI", "KURATOR", "ALAN_UZMANI", "UST_DOGRULAYICI", "IK_IS_ORTAGI", "IK_ADMIN", "UST_YONETIM",
]);
export const importType = pgEnum("import_type", ["ORG", "ROLE", "POSITION", "PEOPLE"]);
export const importStatus = pgEnum("import_status", ["VALIDATED", "APPLIED", "FAILED"]);

export const orgUnits = pgTable("org_units", {
  id: serial("id").primaryKey(),
  code: text("code").notNull(),
  parentId: integer("parent_id").references((): AnyPgColumn => orgUnits.id),
  type: orgUnitType("type").notNull(),
  name: text("name").notNull(),
  managerPersonId: integer("manager_person_id").references((): AnyPgColumn => people.id),
  curatorPersonId: integer("curator_person_id").references((): AnyPgColumn => people.id),
  branchClass: branchClass("branch_class"),
  segment: segment("segment"),
  depth: integer("depth").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [uniqueIndex("org_units_code_idx").on(t.code), index("org_units_parent_idx").on(t.parentId)]);

export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  code: text("code").notNull(),
  name: text("name").notNull(),
  jobFamily: text("job_family"),
  grade: integer("grade").notNull().default(1),
  isManager: boolean("is_manager").notNull().default(false),
  network: network("network").notNull().default("GM"),
  segment: segment("segment"),
  description: text("description"),
  active: boolean("active").notNull().default(true),
}, (t) => [uniqueIndex("roles_code_idx").on(t.code)]);

export const positions = pgTable("positions", {
  id: serial("id").primaryKey(),
  code: text("code").notNull(),
  roleId: integer("role_id").notNull().references(() => roles.id),
  orgUnitId: integer("org_unit_id").notNull().references(() => orgUnits.id),
  isCritical: boolean("is_critical").notNull().default(false),
  active: boolean("active").notNull().default(true),
}, (t) => [uniqueIndex("positions_code_idx").on(t.code), index("positions_org_idx").on(t.orgUnitId)]);

export const people = pgTable("people", {
  id: serial("id").primaryKey(),
  employeeNo: text("employee_no").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email"),
  hireDate: date("hire_date"),
  retirementDate: date("retirement_date"),
  attritionRisk: attritionRisk("attrition_risk"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [uniqueIndex("people_employee_no_idx").on(t.employeeNo)]);

export const assignments = pgTable("assignments", {
  id: serial("id").primaryKey(),
  personId: integer("person_id").notNull().references(() => people.id),
  positionId: integer("position_id").notNull().references(() => positions.id),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  isPrimary: boolean("is_primary").notNull().default(true),
}, (t) => [index("assignments_person_idx").on(t.personId), index("assignments_position_idx").on(t.positionId)]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  personId: integer("person_id").references(() => people.id),
  email: text("email").notNull(),
  passwordHash: text("password_hash").notNull(),
  active: boolean("active").notNull().default(true),
  lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
}, (t) => [uniqueIndex("users_email_idx").on(t.email)]);

export const userRoles = pgTable("user_roles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  role: systemRole("role").notNull(),
  scopeOrgUnitId: integer("scope_org_unit_id").references(() => orgUnits.id),
}, (t) => [index("user_roles_user_idx").on(t.userId)]);

export const importBatches = pgTable("import_batches", {
  id: serial("id").primaryKey(),
  type: importType("type").notNull(),
  fileName: text("file_name").notNull(),
  status: importStatus("status").notNull(),
  totalRows: integer("total_rows").notNull().default(0),
  validRows: integer("valid_rows").notNull().default(0),
  errorRows: integer("error_rows").notNull().default(0),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  appliedAt: timestamp("applied_at", { withTimezone: true }),
});

export const importErrors = pgTable("import_errors", {
  id: serial("id").primaryKey(),
  batchId: integer("batch_id").notNull().references(() => importBatches.id),
  rowNo: integer("row_no").notNull(),
  field: text("field"),
  message: text("message").notNull(),
});

export const auditLog = pgTable("audit_log", {
  id: serial("id").primaryKey(),
  entity: text("entity").notNull(),
  entityId: text("entity_id").notNull(),
  action: text("action").notNull(),
  before: jsonb("before"),
  after: jsonb("after"),
  userId: integer("user_id"),
  at: timestamp("at", { withTimezone: true }).notNull().defaultNow(),
});

export const orgUnitsRelations = relations(orgUnits, ({ one, many }) => ({
  parent: one(orgUnits, { fields: [orgUnits.parentId], references: [orgUnits.id], relationName: "tree" }),
  children: many(orgUnits, { relationName: "tree" }),
  manager: one(people, { fields: [orgUnits.managerPersonId], references: [people.id] }),
  positions: many(positions),
}));
export const positionsRelations = relations(positions, ({ one, many }) => ({
  role: one(roles, { fields: [positions.roleId], references: [roles.id] }),
  orgUnit: one(orgUnits, { fields: [positions.orgUnitId], references: [orgUnits.id] }),
  assignments: many(assignments),
}));
export const assignmentsRelations = relations(assignments, ({ one }) => ({
  person: one(people, { fields: [assignments.personId], references: [people.id] }),
  position: one(positions, { fields: [assignments.positionId], references: [positions.id] }),
}));
export const peopleRelations = relations(people, ({ many }) => ({ assignments: many(assignments) }));
export const usersRelations = relations(users, ({ one, many }) => ({
  person: one(people, { fields: [users.personId], references: [people.id] }),
  roles: many(userRoles),
}));
export const userRolesRelations = relations(userRoles, ({ one }) => ({ user: one(users, { fields: [userRoles.userId], references: [users.id] }) }));

export type OrgUnit = typeof orgUnits.$inferSelect;
export type Role = typeof roles.$inferSelect;
export type Position = typeof positions.$inferSelect;
export type Person = typeof people.$inferSelect;
export type SystemRole = (typeof systemRole.enumValues)[number];

// ---------------- Sprint 2: Yetkinlik kütüphanesi
export const competencyKind = pgEnum("competency_kind", ["TEKNIK", "DAVRANISSAL"]);
export const competencySubKind = pgEnum("competency_sub_kind", [
  "CEKIRDEK", "LIDERLIK", // davranışsal
  "YAZILIM_ARAC", "MEVZUAT_STANDART", "SUREC_METODOLOJI", "URUN_ALAN", "EKIPMAN_ISLEM", "DIL", // teknik kategori
]);
export const competencyStatus = pgEnum("competency_status", ["TASLAK", "INCELEMEDE", "AKTIF", "EMEKLI"]);
export const futureTrend = pgEnum("future_trend", ["YUKSELEN", "STABIL", "AZALAN"]);
export const levelScale = pgEnum("level_scale", ["TEKNIK", "DAVRANISSAL"]);

export const competencies = pgTable("competencies", {
  id: serial("id").primaryKey(),
  code: text("code").notNull(),
  name: text("name").notNull(),
  kind: competencyKind("kind").notNull(),
  subKind: competencySubKind("sub_kind"),
  definition: text("definition").notNull().default(""),
  boundaryNote: text("boundary_note"),
  futureTrend: futureTrend("future_trend").notNull().default("STABIL"),
  defaultCriticality: integer("default_criticality").notNull().default(2),
  status: competencyStatus("status").notNull().default("TASLAK"),
  version: integer("version").notNull().default(1),
  previousVersionId: integer("previous_version_id").references((): AnyPgColumn => competencies.id),
  ownerOrgUnitId: integer("owner_org_unit_id").references(() => orgUnits.id),
  createdBy: integer("created_by").references(() => users.id),
  approvedBy: integer("approved_by").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [uniqueIndex("competencies_code_version_idx").on(t.code, t.version), index("competencies_status_idx").on(t.status)]);

export const competencyOrgUnits = pgTable("competency_org_units", {
  id: serial("id").primaryKey(),
  competencyId: integer("competency_id").notNull().references(() => competencies.id),
  orgUnitId: integer("org_unit_id").notNull().references(() => orgUnits.id),
  isPrimary: boolean("is_primary").notNull().default(false),
}, (t) => [uniqueIndex("competency_org_units_idx").on(t.competencyId, t.orgUnitId)]);

export const levelDefinitions = pgTable("level_definitions", {
  id: serial("id").primaryKey(),
  scale: levelScale("scale").notNull(),
  level: integer("level").notNull(),
  name: text("name").notNull(),
  generalDefinition: text("general_definition").notNull(),
}, (t) => [uniqueIndex("level_definitions_idx").on(t.scale, t.level)]);

export const levelAnchors = pgTable("level_anchors", {
  id: serial("id").primaryKey(),
  competencyId: integer("competency_id").notNull().references(() => competencies.id),
  level: integer("level").notNull(),
  anchorText: text("anchor_text").notNull().default(""),
}, (t) => [uniqueIndex("level_anchors_idx").on(t.competencyId, t.level)]);

export const evidenceTypes = pgTable("evidence_types", {
  id: serial("id").primaryKey(),
  code: text("code").notNull(),
  name: text("name").notNull(),
  verifierRole: text("verifier_role").notNull().default("YONETICI"),
  active: boolean("active").notNull().default(true),
}, (t) => [uniqueIndex("evidence_types_code_idx").on(t.code)]);

export const indicators = pgTable("indicators", {
  id: serial("id").primaryKey(),
  competencyId: integer("competency_id").notNull().references(() => competencies.id),
  level: integer("level").notNull(),
  sortOrder: integer("sort_order").notNull().default(1),
  text: text("text").notNull(),
  mandatory: boolean("mandatory").notNull().default(false),
  evidenceTypeCodes: text("evidence_type_codes").array().notNull().default([]),
  minEvidence: integer("min_evidence").notNull().default(1),
  validityMonths: integer("validity_months").notNull().default(24),
  active: boolean("active").notNull().default(true),
}, (t) => [index("indicators_competency_level_idx").on(t.competencyId, t.level)]);

export const competenciesRelations = relations(competencies, ({ one, many }) => ({
  indicators: many(indicators),
  anchors: many(levelAnchors),
  units: many(competencyOrgUnits),
  owner: one(orgUnits, { fields: [competencies.ownerOrgUnitId], references: [orgUnits.id] }),
}));
export const indicatorsRelations = relations(indicators, ({ one }) => ({ competency: one(competencies, { fields: [indicators.competencyId], references: [competencies.id] }) }));
export const levelAnchorsRelations = relations(levelAnchors, ({ one }) => ({ competency: one(competencies, { fields: [levelAnchors.competencyId], references: [competencies.id] }) }));
export const competencyOrgUnitsRelations = relations(competencyOrgUnits, ({ one }) => ({
  competency: one(competencies, { fields: [competencyOrgUnits.competencyId], references: [competencies.id] }),
  orgUnit: one(orgUnits, { fields: [competencyOrgUnits.orgUnitId], references: [orgUnits.id] }),
}));

export type Competency = typeof competencies.$inferSelect;
export type Indicator = typeof indicators.$inferSelect;

// ---------------- Sprint 3: Rol profilleri
export const profileSource = pgEnum("profile_source", ["AUTO", "MANUAL", "COPY"]);
export const roleProfiles = pgTable("role_profiles", {
  id: serial("id").primaryKey(),
  roleId: integer("role_id").notNull().references(() => roles.id),
  competencyId: integer("competency_id").notNull().references(() => competencies.id),
  targetLevel: integer("target_level").notNull().default(3),
  weight: integer("weight").notNull().default(2),
  mandatory: boolean("mandatory").notNull().default(false),
  source: profileSource("source").notNull().default("MANUAL"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [uniqueIndex("role_profiles_role_comp_idx").on(t.roleId, t.competencyId), index("role_profiles_role_idx").on(t.roleId)]);
export const roleProfilesRelations = relations(roleProfiles, ({ one }) => ({
  role: one(roles, { fields: [roleProfiles.roleId], references: [roles.id] }),
  competency: one(competencies, { fields: [roleProfiles.competencyId], references: [competencies.id] }),
}));
export const rolesRelations = relations(roles, ({ many }) => ({ profiles: many(roleProfiles), positions: many(positions) }));
export type RoleProfile = typeof roleProfiles.$inferSelect;

// ---------------- Sprint 4: Kanıt kasası
export const evidenceStatus = pgEnum("evidence_status", ["TASLAK", "SUNULDU", "KABUL", "EK_BILGI", "RED"]);
export const evidence = pgTable("evidence", {
  id: serial("id").primaryKey(),
  personId: integer("person_id").notNull().references(() => people.id),
  typeCode: text("type_code").notNull(),
  whatIDid: text("what_i_did").notNull(),
  startDate: date("start_date"),
  endDate: date("end_date").notNull(),
  result: text("result"),
  verifier: text("verifier"),
  link: text("link"),
  fileName: text("file_name"),
  filePath: text("file_path"),
  fileMime: text("file_mime"),
  fileSize: integer("file_size"),
  isObservation: boolean("is_observation").notNull().default(false),
  status: evidenceStatus("status").notNull().default("TASLAK"),
  managerNote: text("manager_note"),
  decidedBy: integer("decided_by").references(() => people.id),
  decidedAt: timestamp("decided_at", { withTimezone: true }),
  createdByPersonId: integer("created_by_person_id").references(() => people.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("evidence_person_idx").on(t.personId), index("evidence_status_idx").on(t.status)]);

export const evidenceIndicators = pgTable("evidence_indicators", {
  id: serial("id").primaryKey(),
  evidenceId: integer("evidence_id").notNull().references(() => evidence.id, { onDelete: "cascade" }),
  indicatorId: integer("indicator_id").notNull().references(() => indicators.id),
}, (t) => [uniqueIndex("evidence_indicators_idx").on(t.evidenceId, t.indicatorId), index("evidence_indicators_ind_idx").on(t.indicatorId)]);

export const evidenceRelations = relations(evidence, ({ one, many }) => ({
  person: one(people, { fields: [evidence.personId], references: [people.id] }),
  links: many(evidenceIndicators),
}));
export const evidenceIndicatorsRelations = relations(evidenceIndicators, ({ one }) => ({
  evidence: one(evidence, { fields: [evidenceIndicators.evidenceId], references: [evidence.id] }),
  indicator: one(indicators, { fields: [evidenceIndicators.indicatorId], references: [indicators.id] }),
}));
export type Evidence = typeof evidence.$inferSelect;
