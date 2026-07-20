ALTER TABLE "accounts" ADD COLUMN "account_number_hash" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "hashed_iban" varchar(255) NOT NULL;