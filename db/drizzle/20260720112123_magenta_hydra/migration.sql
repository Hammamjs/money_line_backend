ALTER TABLE "users" DROP COLUMN "phone";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "username" SET DATA TYPE varchar(100) USING "username"::varchar(100);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE varchar(100) USING "email"::varchar(100);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password" SET DATA TYPE varchar(60) USING "password"::varchar(60);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "refresh_token" SET DATA TYPE varchar(50)[] USING "refresh_token"::varchar(50)[];