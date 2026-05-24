ALTER TABLE "forms" ADD COLUMN "password" varchar(255);--> statement-breakpoint
ALTER TABLE "forms" ADD COLUMN "password_needed" boolean DEFAULT false NOT NULL;