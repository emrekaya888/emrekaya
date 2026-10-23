CREATE TYPE "public"."attrition_risk" AS ENUM('DUSUK', 'ORTA', 'YUKSEK');--> statement-breakpoint
CREATE TYPE "public"."branch_class" AS ENUM('OZEL_BANKACILIK', 'KOBI', 'TICARI', 'KURUMSAL');--> statement-breakpoint
CREATE TYPE "public"."import_status" AS ENUM('VALIDATED', 'APPLIED', 'FAILED');--> statement-breakpoint
CREATE TYPE "public"."import_type" AS ENUM('ORG', 'ROLE', 'POSITION', 'PEOPLE');--> statement-breakpoint
CREATE TYPE "public"."network" AS ENUM('GM', 'SUBE', 'BOLGE');--> statement-breakpoint
CREATE TYPE "public"."org_unit_type" AS ENUM('KURUM', 'GMY', 'DIREKTORLUK', 'DEPARTMAN', 'SERVIS', 'BOLGE', 'SUBE', 'PORTFOY_EKIBI', 'EKIP');--> statement-breakpoint
CREATE TYPE "public"."segment" AS ENUM('BIREYSEL_SATIS_TEMSILCISI', 'BIREYSEL_SATIS', 'KOBI_SATIS', 'TICARI_SATIS', 'KURUMSAL_SATIS', 'OZEL_BANKACILIK', 'MUSTERI_ILISKILERI');--> statement-breakpoint
CREATE TYPE "public"."system_role" AS ENUM('CALISAN', 'YONETICI', 'KURATOR', 'ALAN_UZMANI', 'UST_DOGRULAYICI', 'IK_IS_ORTAGI', 'IK_ADMIN', 'UST_YONETIM');--> statement-breakpoint
CREATE TABLE "assignments" (
	"id" serial PRIMARY KEY NOT NULL,
	"person_id" integer NOT NULL,
	"position_id" integer NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date,
	"is_primary" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" serial PRIMARY KEY NOT NULL,
	"entity" text NOT NULL,
	"entity_id" text NOT NULL,
	"action" text NOT NULL,
	"before" jsonb,
	"after" jsonb,
	"user_id" integer,
	"at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "import_batches" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" "import_type" NOT NULL,
	"file_name" text NOT NULL,
	"status" "import_status" NOT NULL,
	"total_rows" integer DEFAULT 0 NOT NULL,
	"valid_rows" integer DEFAULT 0 NOT NULL,
	"error_rows" integer DEFAULT 0 NOT NULL,
	"created_by" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"applied_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "import_errors" (
	"id" serial PRIMARY KEY NOT NULL,
	"batch_id" integer NOT NULL,
	"row_no" integer NOT NULL,
	"field" text,
	"message" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "org_units" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"parent_id" integer,
	"type" "org_unit_type" NOT NULL,
	"name" text NOT NULL,
	"manager_person_id" integer,
	"curator_person_id" integer,
	"branch_class" "branch_class",
	"segment" "segment",
	"depth" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "people" (
	"id" serial PRIMARY KEY NOT NULL,
	"employee_no" text NOT NULL,
	"full_name" text NOT NULL,
	"email" text,
	"hire_date" date,
	"retirement_date" date,
	"attrition_risk" "attrition_risk",
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "positions" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"role_id" integer NOT NULL,
	"org_unit_id" integer NOT NULL,
	"is_critical" boolean DEFAULT false NOT NULL,
	"active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"job_family" text,
	"grade" integer DEFAULT 1 NOT NULL,
	"is_manager" boolean DEFAULT false NOT NULL,
	"network" "network" DEFAULT 'GM' NOT NULL,
	"segment" "segment",
	"description" text,
	"active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"role" "system_role" NOT NULL,
	"scope_org_unit_id" integer
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"person_id" integer,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"last_login_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_position_id_positions_id_fk" FOREIGN KEY ("position_id") REFERENCES "public"."positions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "import_batches" ADD CONSTRAINT "import_batches_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "import_errors" ADD CONSTRAINT "import_errors_batch_id_import_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."import_batches"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "org_units" ADD CONSTRAINT "org_units_parent_id_org_units_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."org_units"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "org_units" ADD CONSTRAINT "org_units_manager_person_id_people_id_fk" FOREIGN KEY ("manager_person_id") REFERENCES "public"."people"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "org_units" ADD CONSTRAINT "org_units_curator_person_id_people_id_fk" FOREIGN KEY ("curator_person_id") REFERENCES "public"."people"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "positions" ADD CONSTRAINT "positions_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "positions" ADD CONSTRAINT "positions_org_unit_id_org_units_id_fk" FOREIGN KEY ("org_unit_id") REFERENCES "public"."org_units"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_scope_org_unit_id_org_units_id_fk" FOREIGN KEY ("scope_org_unit_id") REFERENCES "public"."org_units"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "assignments_person_idx" ON "assignments" USING btree ("person_id");--> statement-breakpoint
CREATE INDEX "assignments_position_idx" ON "assignments" USING btree ("position_id");--> statement-breakpoint
CREATE UNIQUE INDEX "org_units_code_idx" ON "org_units" USING btree ("code");--> statement-breakpoint
CREATE INDEX "org_units_parent_idx" ON "org_units" USING btree ("parent_id");--> statement-breakpoint
CREATE UNIQUE INDEX "people_employee_no_idx" ON "people" USING btree ("employee_no");--> statement-breakpoint
CREATE UNIQUE INDEX "positions_code_idx" ON "positions" USING btree ("code");--> statement-breakpoint
CREATE INDEX "positions_org_idx" ON "positions" USING btree ("org_unit_id");--> statement-breakpoint
CREATE UNIQUE INDEX "roles_code_idx" ON "roles" USING btree ("code");--> statement-breakpoint
CREATE INDEX "user_roles_user_idx" ON "user_roles" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");