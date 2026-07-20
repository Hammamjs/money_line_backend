ALTER TABLE "accounts" ALTER COLUMN "account_number" SET DATA TYPE varchar(255) USING "account_number"::varchar(255);--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "bank_name" SET DATA TYPE varchar(255) USING "bank_name"::varchar(255);--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "iban" SET DATA TYPE varchar(255) USING "iban"::varchar(255);