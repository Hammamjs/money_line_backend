CREATE TYPE "order_status" AS ENUM('pending', 'success');--> statement-breakpoint
CREATE TYPE "user_role" AS ENUM('admin', 'user');--> statement-breakpoint
CREATE TABLE "currency" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(20) NOT NULL,
	"code" varchar(3) NOT NULL,
	"symbol" varchar(100) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "exchange_rates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"from_currency_id" uuid NOT NULL,
	"to_currency_id" uuid NOT NULL,
	"rate" numeric(18,6) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "exchange_rates_currency_pair_unique" UNIQUE("from_currency_id","to_currency_id")
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"payment_proof" varchar(200) NOT NULL,
	"phone" varchar(30) NOT NULL,
	"account_name" varchar(30) NOT NULL,
	"transaction_account" varchar(30) NOT NULL,
	"status" "order_status" DEFAULT 'pending'::"order_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"username" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL UNIQUE,
	"password" varchar(255) NOT NULL,
	"phone" varchar(255),
	"refresh_token" varchar(255),
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"role" "user_role" DEFAULT 'user'::"user_role" NOT NULL
);
--> statement-breakpoint
ALTER TABLE "exchange_rates" ADD CONSTRAINT "exchange_rates_from_currency_id_currency_id_fkey" FOREIGN KEY ("from_currency_id") REFERENCES "currency"("id");--> statement-breakpoint
ALTER TABLE "exchange_rates" ADD CONSTRAINT "exchange_rates_to_currency_id_currency_id_fkey" FOREIGN KEY ("to_currency_id") REFERENCES "currency"("id");--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;