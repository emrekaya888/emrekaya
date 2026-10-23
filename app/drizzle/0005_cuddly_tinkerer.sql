CREATE TYPE "public"."assessment_status" AS ENUM('ACILDI', 'OZ_BEYAN_TAMAM', 'YONETICI_TAMAM', 'UST_DOGRULAMADA', 'MUTABAKATTA', 'ITIRAZDA', 'KESINLESTI', 'KILITLI');--> statement-breakpoint
CREATE TYPE "public"."cycle_status" AS ENUM('HAZIRLIK', 'OZ_BEYAN', 'YONETICI', 'MUTABAKAT', 'KALIBRASYON', 'KILITLI');--> statement-breakpoint
CREATE TYPE "public"."cycle_type" AS ENUM('ANA', 'ARA', 'ISE_GIRIS');--> statement-breakpoint
CREATE TABLE "assessment_lines" (
	"id" serial PRIMARY KEY NOT NULL,
	"assessment_id" integer NOT NULL,
	"competency_id" integer NOT NULL,
	"target_level" integer NOT NULL,
	"weight" integer NOT NULL,
	"mandatory" boolean DEFAULT false NOT NULL,
	"self_level" integer,
	"proven_level" integer,
	"next_progress" integer,
	"level5_candidate" boolean DEFAULT false NOT NULL,
	"level5_validated" boolean,
	"level5_validated_by" integer,
	"rejected_mandatory" boolean DEFAULT false NOT NULL,
	"meeting_required" boolean DEFAULT false NOT NULL,
	"agreed_level" integer,
	"manager_note" text,
	"appeal_flag" boolean DEFAULT false NOT NULL,
	"appeal_reason" text,
	"appeal_decision" text,
	"appeal_decided_by" integer,
	"appeal_note" text
);
--> statement-breakpoint
CREATE TABLE "assessments" (
	"id" serial PRIMARY KEY NOT NULL,
	"cycle_id" integer NOT NULL,
	"person_id" integer NOT NULL,
	"position_id" integer,
	"role_id" integer NOT NULL,
	"manager_person_id" integer,
	"status" "assessment_status" DEFAULT 'ACILDI' NOT NULL,
	"self_completed_at" timestamp with time zone,
	"manager_completed_at" timestamp with time zone,
	"meeting_note" text,
	"agreement_sent_at" timestamp with time zone,
	"employee_approved_at" timestamp with time zone,
	"finalized_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "cycles" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" "cycle_type" DEFAULT 'ANA' NOT NULL,
	"status" "cycle_status" DEFAULT 'HAZIRLIK' NOT NULL,
	"self_deadline" date,
	"manager_deadline" date,
	"agreement_deadline" date,
	"opened_at" timestamp with time zone,
	"locked_at" timestamp with time zone,
	"metrics" jsonb,
	"created_by" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "assessment_lines" ADD CONSTRAINT "assessment_lines_assessment_id_assessments_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessment_lines" ADD CONSTRAINT "assessment_lines_competency_id_competencies_id_fk" FOREIGN KEY ("competency_id") REFERENCES "public"."competencies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_cycle_id_cycles_id_fk" FOREIGN KEY ("cycle_id") REFERENCES "public"."cycles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_position_id_positions_id_fk" FOREIGN KEY ("position_id") REFERENCES "public"."positions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_manager_person_id_people_id_fk" FOREIGN KEY ("manager_person_id") REFERENCES "public"."people"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "assessment_lines_idx" ON "assessment_lines" USING btree ("assessment_id","competency_id");--> statement-breakpoint
CREATE UNIQUE INDEX "assessments_cycle_person_idx" ON "assessments" USING btree ("cycle_id","person_id");--> statement-breakpoint
CREATE INDEX "assessments_manager_idx" ON "assessments" USING btree ("manager_person_id");