ALTER TABLE "tasks" DROP CONSTRAINT "tasks_assignee_id_project_members_member_id_fk";
--> statement-breakpoint
ALTER TABLE "project_members" ALTER COLUMN "member_id" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assignee_id_users_id_fk" FOREIGN KEY ("assignee_id") REFERENCES "users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
