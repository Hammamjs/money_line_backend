ALTER TABLE "orders" ADD COLUMN "from_currency" varchar(30) NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "to_currency" varchar(30) NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "amount" numeric NOT NULL;