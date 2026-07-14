CREATE TABLE "currency" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(20) NOT NULL,
	"code" varchar(3) NOT NULL,
	"symbol" varchar(100) NOT NULL,
	"rate" numeric(18,6) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"source" varchar(10) DEFAULT 'admin'
);
