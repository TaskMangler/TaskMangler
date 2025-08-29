-- Create "users" table
CREATE TABLE "public"."users" ("username" text NOT NULL, "password_hash" text NOT NULL, PRIMARY KEY ("username"));
-- Create "boards" table
CREATE TABLE "public"."boards" ("id" serial NOT NULL, "name" text NOT NULL, "owner" text NOT NULL, PRIMARY KEY ("id"), CONSTRAINT "boards_owner_fkey" FOREIGN KEY ("owner") REFERENCES "public"."users" ("username") ON UPDATE NO ACTION ON DELETE CASCADE);
-- Create "columns" table
CREATE TABLE "public"."columns" ("id" serial NOT NULL, "name" text NOT NULL, "board_id" integer NOT NULL, "position" integer NOT NULL, PRIMARY KEY ("id"), CONSTRAINT "unique_column_position_per_board" UNIQUE ("board_id", "position"), CONSTRAINT "columns_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "public"."boards" ("id") ON UPDATE NO ACTION ON DELETE CASCADE);
-- Create "tasks" table
CREATE TABLE "public"."tasks" ("id" serial NOT NULL, "title" text NOT NULL, "column_id" integer NOT NULL, "position" integer NOT NULL, PRIMARY KEY ("id"), CONSTRAINT "unique_task_position_per_column" UNIQUE ("column_id", "position"), CONSTRAINT "tasks_column_id_fkey" FOREIGN KEY ("column_id") REFERENCES "public"."columns" ("id") ON UPDATE NO ACTION ON DELETE CASCADE);
-- Create "task_dependencies" table
CREATE TABLE "public"."task_dependencies" ("task_id" integer NOT NULL, "depends_on_id" integer NOT NULL, PRIMARY KEY ("task_id", "depends_on_id"), CONSTRAINT "task_dependencies_depends_on_id_fkey" FOREIGN KEY ("depends_on_id") REFERENCES "public"."tasks" ("id") ON UPDATE NO ACTION ON DELETE CASCADE, CONSTRAINT "task_dependencies_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "public"."tasks" ("id") ON UPDATE NO ACTION ON DELETE CASCADE);
