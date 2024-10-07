ALTER TABLE "labels" ADD CONSTRAINT "labels_id_unique" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_id_unique" UNIQUE("id");--> statement-breakpoint
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_id_unique" UNIQUE("id");