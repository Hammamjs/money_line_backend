CREATE TABLE "exchange_rates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"from_currency_id" uuid NOT NULL,
	"to_currency_id" uuid NOT NULL,
	"rate" numeric(18,6) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "currency" DROP COLUMN "rate";--> statement-breakpoint
ALTER TABLE "currency" DROP COLUMN "source";--> statement-breakpoint
ALTER TABLE "exchange_rates" ADD CONSTRAINT "exchange_rates_from_currency_id_currency_id_fkey" FOREIGN KEY ("from_currency_id") REFERENCES "currency"("id");--> statement-breakpoint
ALTER TABLE "exchange_rates" ADD CONSTRAINT "exchange_rates_to_currency_id_currency_id_fkey" FOREIGN KEY ("to_currency_id") REFERENCES "currency"("id");