ALTER TYPE "role" ADD VALUE 'owner';--> statement-breakpoint
ALTER TYPE "role" ADD VALUE 'admin';--> statement-breakpoint
ALTER TYPE "role" ADD VALUE 'member';--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "labels" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"color" text NOT NULL,
	"project_id" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "project_members" ADD COLUMN "roles" "role" DEFAULT 'member';--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "labels" ADD CONSTRAINT "labels_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
