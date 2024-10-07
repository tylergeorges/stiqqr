ALTER TABLE "project_members" DROP CONSTRAINT "project_members_project_id_member_id_pk";--> statement-breakpoint
ALTER TABLE "project_members" ADD CONSTRAINT "project_members_member_id_project_id_pk" PRIMARY KEY("member_id","project_id");--> statement-breakpoint
ALTER TABLE "labels" ADD CONSTRAINT "labels_id_unique" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_id_unique" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_id_unique" UNIQUE("id");