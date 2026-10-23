CREATE TYPE "public"."evidence_status" AS ENUM('TASLAK', 'SUNULDU', 'KABUL', 'EK_BILGI', 'RED');--> statement-breakpoint
CREATE TABLE "evidence" (
	"id" serial PRIMARY KEY NOT NULL,
	"person_id" integer NOT NULL,
	"type_code" text NOT NULL,
	"what_i_did" text NOT NULL,
	"start_date" date,
	"end_date" date NOT NULL,
	"result" text,
	"verifier" text,
	"link" text,
	"file_name" text,
	"file_path" text,
	"file_mime" text,
	"file_size" integer,
	"is_observation" boolean DEFAULT false NOT NULL,
	"status" "evidence_status" DEFAULT 'TASLAK' NOT NULL,
	"manager_note" text,
	"decided_by" integer,
	"decided_at" timestamp with time zone,
	"created_by_person_id" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "evidence_indicators" (
	"id" serial PRIMARY KEY NOT NULL,
	"evidence_id" integer NOT NULL,
	"indicator_id" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_person_id_people_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."people"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_decided_by_people_id_fk" FOREIGN KEY ("decided_by") REFERENCES "public"."people"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence" ADD CONSTRAINT "evidence_created_by_person_id_people_id_fk" FOREIGN KEY ("created_by_person_id") REFERENCES "public"."people"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_indicators" ADD CONSTRAINT "evidence_indicators_evidence_id_evidence_id_fk" FOREIGN KEY ("evidence_id") REFERENCES "public"."evidence"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evidence_indicators" ADD CONSTRAINT "evidence_indicators_indicator_id_indicators_id_fk" FOREIGN KEY ("indicator_id") REFERENCES "public"."indicators"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "evidence_person_idx" ON "evidence" USING btree ("person_id");--> statement-breakpoint
CREATE INDEX "evidence_status_idx" ON "evidence" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "evidence_indicators_idx" ON "evidence_indicators" USING btree ("evidence_id","indicator_id");--> statement-breakpoint
CREATE INDEX "evidence_indicators_ind_idx" ON "evidence_indicators" USING btree ("indicator_id");