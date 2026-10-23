CREATE TYPE "public"."profile_source" AS ENUM('AUTO', 'MANUAL', 'COPY');--> statement-breakpoint
CREATE TABLE "role_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"role_id" integer NOT NULL,
	"competency_id" integer NOT NULL,
	"target_level" integer DEFAULT 3 NOT NULL,
	"weight" integer DEFAULT 2 NOT NULL,
	"mandatory" boolean DEFAULT false NOT NULL,
	"source" "profile_source" DEFAULT 'MANUAL' NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "role_profiles" ADD CONSTRAINT "role_profiles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_profiles" ADD CONSTRAINT "role_profiles_competency_id_competencies_id_fk" FOREIGN KEY ("competency_id") REFERENCES "public"."competencies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "role_profiles_role_comp_idx" ON "role_profiles" USING btree ("role_id","competency_id");--> statement-breakpoint
CREATE INDEX "role_profiles_role_idx" ON "role_profiles" USING btree ("role_id");