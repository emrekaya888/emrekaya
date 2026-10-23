CREATE TYPE "public"."action_status" AS ENUM('PLANLANDI', 'DEVAM', 'TAMAMLANDI', 'IPTAL');--> statement-breakpoint
CREATE TYPE "public"."action_type" AS ENUM('ISBASINDA', 'ILISKI', 'EGITIM');--> statement-breakpoint
CREATE TYPE "public"."plan_status" AS ENUM('TASLAK', 'ONAYLI', 'DEVAM', 'TAMAMLANDI');--> statement-breakpoint
CREATE TABLE "development_plans" (
	"id" serial PRIMARY KEY NOT NULL,
	"person_id" integer NOT NULL,
	"cycle_id" integer,
	"status" "plan_status" DEFAULT 'TASLAK' NOT NULL,
	"approved_by" integer,
	"approved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plan_actions" (
	"id" serial PRIMARY KEY NOT NULL,
	"plan_id" integer NOT NULL,
	"competency_id" integer NOT NULL,
	"indicator_id" integer,
	"current_level" integer DEFAULT 0 NOT NULL,
	"target_level" integer DEFAULT 1 NOT NULL,
	"priority_score" integer DEFAULT 0 NOT NULL,
	"action_type" "action_type" DEFAULT 'ISBASINDA' NOT NULL,
	"description" text NOT NULL,
	"mentor_person_id" integer,
	"due_date" date,
	"status" "action_status" DEFAULT 'PLANLANDI' NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "development_plans" ADD CONSTRAINT "development_plans_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "development_plans" ADD CONSTRAINT "development_plans_cycle_id_cycles_id_fk" FOREIGN KEY ("cycle_id") REFERENCES "public"."cycles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_actions" ADD CONSTRAINT "plan_actions_plan_id_development_plans_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."development_plans"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_actions" ADD CONSTRAINT "plan_actions_competency_id_competencies_id_fk" FOREIGN KEY ("competency_id") REFERENCES "public"."competencies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_actions" ADD CONSTRAINT "plan_actions_indicator_id_indicators_id_fk" FOREIGN KEY ("indicator_id") REFERENCES "public"."indicators"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_actions" ADD CONSTRAINT "plan_actions_mentor_person_id_people_id_fk" FOREIGN KEY ("mentor_person_id") REFERENCES "public"."people"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "development_plans_person_cycle_idx" ON "development_plans" USING btree ("person_id","cycle_id");