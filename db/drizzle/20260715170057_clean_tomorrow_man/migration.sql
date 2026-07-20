ALTER TABLE "orders" ADD COLUMN "account_holder_name" varchar(30) NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN "account_name";