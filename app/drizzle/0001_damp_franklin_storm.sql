CREATE TYPE "public"."competency_kind" AS ENUM('TEKNIK', 'DAVRANISSAL');--> statement-breakpoint
CREATE TYPE "public"."competency_status" AS ENUM('TASLAK', 'INCELEMEDE', 'AKTIF', 'EMEKLI');--> statement-breakpoint
CREATE TYPE "public"."competency_sub_kind" AS ENUM('CEKIRDEK', 'LIDERLIK', 'YAZILIM_ARAC', 'MEVZUAT_STANDART', 'SUREC_METODOLOJI', 'URUN_ALAN', 'EKIPMAN_ISLEM', 'DIL');--> statement-breakpoint
CREATE TYPE "public"."future_trend" AS ENUM('YUKSELEN', 'STABIL', 'AZALAN');--> statement-breakpoint
CREATE TYPE "public"."level_scale" AS ENUM('TEKNIK', 'DAVRANISSAL');--> statement-breakpoint
CREATE TABLE "competencies" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"kind" "competency_kind" NOT NULL,
	"sub_kind" "competency_sub_kind",
	"definition" text DEFAULT '' NOT NULL,
	"boundary_note" text,
	"future_trend" "future_trend" DEFAULT 'STABIL' NOT NULL,
	"default_criticality" integer DEFAULT 2 NOT NULL,
	"status" "competency_status" DEFAULT 'TASLAK' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"previous_version_id" integer,
	"owner_org_unit_id" integer,
	"created_by" integer,
	"approved_by" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "competency_org_units" (
	"id" serial PRIMARY KEY NOT NULL,
	"competency_id" integer NOT NULL,
	"org_unit_id" integer NOT NULL,
	"is_primary" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "evidence_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"verifier_role" text DEFAULT 'YONETICI' NOT NULL,
	"active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "indicators" (
	"id" serial PRIMARY KEY NOT NULL,
	"competency_id" integer NOT NULL,
	"level" integer NOT NULL,
	"sort_order" integer DEFAULT 1 NOT NULL,
	"text" text NOT NULL,
	"mandatory" boolean DEFAULT false NOT NULL,
	"evidence_type_codes" text[] DEFAULT '{}' NOT NULL,
	"min_evidence" integer DEFAULT 1 NOT NULL,
	"validity_months" integer DEFAULT 24 NOT NULL,
	"active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "level_anchors" (
	"id" serial PRIMARY KEY NOT NULL,
	"competency_id" integer NOT NULL,
	"level" integer NOT NULL,
	"anchor_text" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "level_definitions" (
	"id" serial PRIMARY KEY NOT NULL,
	"scale" "level_scale" NOT NULL,
	"level" integer NOT NULL,
	"name" text NOT NULL,
	"general_definition" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "competencies" ADD CONSTRAINT "competencies_previous_version_id_competencies_id_fk" FOREIGN KEY ("previous_version_id") REFERENCES "public"."competencies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competencies" ADD CONSTRAINT "competencies_owner_org_unit_id_org_units_id_fk" FOREIGN KEY ("owner_org_unit_id") REFERENCES "public"."org_units"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competencies" ADD CONSTRAINT "competencies_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competencies" ADD CONSTRAINT "competencies_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competency_org_units" ADD CONSTRAINT "competency_org_units_competency_id_competencies_id_fk" FOREIGN KEY ("competency_id") REFERENCES "public"."competencies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "competency_org_units" ADD CONSTRAINT "competency_org_units_org_unit_id_org_units_id_fk" FOREIGN KEY ("org_unit_id") REFERENCES "public"."org_units"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "indicators" ADD CONSTRAINT "indicators_competency_id_competencies_id_fk" FOREIGN KEY ("competency_id") REFERENCES "public"."competencies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "level_anchors" ADD CONSTRAINT "level_anchors_competency_id_competencies_id_fk" FOREIGN KEY ("competency_id") REFERENCES "public"."competencies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "competencies_code_version_idx" ON "competencies" USING btree ("code","version");--> statement-breakpoint
CREATE INDEX "competencies_status_idx" ON "competencies" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "competency_org_units_idx" ON "competency_org_units" USING btree ("competency_id","org_unit_id");--> statement-breakpoint
CREATE UNIQUE INDEX "evidence_types_code_idx" ON "evidence_types" USING btree ("code");--> statement-breakpoint
CREATE INDEX "indicators_competency_level_idx" ON "indicators" USING btree ("competency_id","level");--> statement-breakpoint
CREATE UNIQUE INDEX "level_anchors_idx" ON "level_anchors" USING btree ("competency_id","level");--> statement-breakpoint
CREATE UNIQUE INDEX "level_definitions_idx" ON "level_definitions" USING btree ("scale","level");