-- Create "sessions" table
CREATE TABLE "public"."sessions" ("id" bigint NOT NULL, "username" text NOT NULL, "identifier" text NOT NULL, PRIMARY KEY ("id"), CONSTRAINT "sessions_username_fkey" FOREIGN KEY ("username") REFERENCES "public"."users" ("username") ON UPDATE NO ACTION ON DELETE CASCADE);
