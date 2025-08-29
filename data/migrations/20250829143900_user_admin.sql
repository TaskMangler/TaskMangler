-- Modify "users" table
ALTER TABLE "public"."users" ADD COLUMN "admin" boolean NOT NULL DEFAULT false;
