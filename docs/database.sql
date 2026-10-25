CREATE TABLE IF NOT EXISTS "owner" (
	"id" UUID NOT NULL,
	"name" VARCHAR(150) NOT NULL,
	"email" VARCHAR(255) NOT NULL UNIQUE,
	"phone" VARCHAR(255),
	"address" TEXT,
	"status" VARCHAR(20),
	"created_at" TIMESTAMP NOT NULL,
	"updated_at" TIMESTAMP NOT NULL,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "estate" (
	"id" UUID NOT NULL,
	"owner_id" UUID NOT NULL,
	"crop_id" UUID NOT NULL,
	"name" VARCHAR(150) NOT NULL,
	"code" VARCHAR(50) NOT NULL UNIQUE,
	"location" POINT NOT NULL,
	"boundary" POLYGON NOT NULL,
	"status" VARCHAR(20),
	"created_at" TIMESTAMP,
	"updated_at" TIMESTAMP,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "crop" (
	"id" UUID NOT NULL,
	"name" VARCHAR(100) NOT NULL UNIQUE,
	"code" VARCHAR(30) NOT NULL UNIQUE,
	"payment_factor" NUMERIC NOT NULL,
	"description" TEXT,
	"created_at" TIMESTAMP,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "employee" (
	"id" UUID NOT NULL,
	"employee_code" VARCHAR(50) NOT NULL UNIQUE,
	"first_name" VARCHAR(100) NOT NULL,
	"last_name" VARCHAR(100),
	"nic" VARCHAR(20) NOT NULL UNIQUE,
	"phone" VARCHAR(30),
	"address" TEXT,
	"date_of_birth" DATE,
	"date_joined" DATE NOT NULL,
	"status" VARCHAR(20),
	"created_at" TIMESTAMP,
	"updated_at" TIMESTAMP,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "estate_assignment" (
	"id" UUID NOT NULL,
	"estate_id" UUID NOT NULL,
	"employee_id" UUID NOT NULL,
	"role" VARCHAR(20) NOT NULL,
	"start_date" DATE NOT NULL,
	"end_date" DATE,
	"created_at" TIMESTAMP,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "worker_assignment" (
	"id" UUID NOT NULL,
	"worker_id" UUID NOT NULL,
	"estate_id" UUID NOT NULL,
	"supervisor_id" UUID,
	"start_date" DATE NOT NULL,
	"end_date" DATE,
	"created_at" TIMESTAMP,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "employee_payment_detail" (
	"id" UUID NOT NULL,
	"employee_id" UUID NOT NULL UNIQUE,
	"payment_frequency" VARCHAR(20) NOT NULL,
	"bank_name" VARCHAR(150) NOT NULL,
	"account_number" VARCHAR(50) NOT NULL,
	"account_name" VARCHAR(150) NOT NULL,
	"branch" VARCHAR(150) NOT NULL,
	"is_active" BOOLEAN NOT NULL,
	"created_at" TIMESTAMP,
	"updated_at" TIMESTAMP,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "device" (
	"id" UUID NOT NULL,
	"device_code" VARCHAR(255) NOT NULL UNIQUE,
	"device_type" VARCHAR(50) NOT NULL,
	"status" VARCHAR(20),
	"created_at" DATE,
	"updated_at" DATE,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "device_assignment" (
	"id" UUID NOT NULL,
	"device_id" UUID NOT NULL,
	"worker_id" UUID,
	"estate_id" UUID NOT NULL,
	"start_date" DATE NOT NULL,
	"end_date" DATE,
	"created_at" TIMESTAMP,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "work_session" (
	"id" UUID NOT NULL,
	"worker_id" UUID NOT NULL,
	"estate_id" UUID NOT NULL,
	"start_time" TIMESTAMP NOT NULL,
	"end_time" DATE,
	"status" VARCHAR(20),
	"created_at" TIMESTAMP,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "worker_iot_reading" (
	"id" BIGINT NOT NULL,
	"device_id" UUID NOT NULL,
	"worker_id" UUID NOT NULL,
	"estate_id" UUID NOT NULL,
	"work_session_id" UUID NOT NULL,
	"recorded_at" TIMESTAMP,
	"location" POINT,
	"activity_status" VARCHAR(20),
	"created_at" TIMESTAMP,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "attendance" (
	"id" UUID NOT NULL,
	"worker_id" UUID NOT NULL,
	"estate_id" UUID NOT NULL,
	"date" DATE NOT NULL,
	"check_in" TIMESTAMP NOT NULL,
	"check_out" TIMESTAMP,
	"status" VARCHAR(20),
	"created_at" TIMESTAMP,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "production_record" (
	"id" BIGINT NOT NULL,
	"worker_id" UUID NOT NULL,
	"estate_id" UUID NOT NULL,
	"work_session_id" UUID NOT NULL,
	"quantity" NUMERIC NOT NULL,
	"unit" VARCHAR(20) NOT NULL,
	"recorded_at" TIMESTAMP,
	"created_at" TIMESTAMP,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "estate_pay_rate" (
	"id" UUID NOT NULL,
	"estate_id" UUID NOT NULL,
	"rate" NUMERIC NOT NULL,
	"unit" VARCHAR(20) NOT NULL,
	"payment_factor" NUMERIC NOT NULL,
	"effective_from" DATE NOT NULL,
	"effective_to" DATE,
	"created_at" TIMESTAMP,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "payroll" (
	"id" UUID NOT NULL,
	"owner_id" UUID NOT NULL,
	"period_start" DATE NOT NULL,
	"period_end" DATE NOT NULL,
	"payment_frequency" VARCHAR(20) NOT NULL,
	"status" VARCHAR(20),
	"created_at" TIMESTAMP,
	"processed_at" TIMESTAMP,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "payroll_item" (
	"id" UUID NOT NULL,
	"payroll_id" UUID NOT NULL,
	"worker_id" UUID NOT NULL,
	"estate_id" UUID NOT NULL,
	"basic_pay" NUMERIC NOT NULL,
	"production_pay" NUMERIC NOT NULL,
	"overtime" NUMERIC NOT NULL,
	"allowances" NUMERIC NOT NULL,
	"bonuses" NUMERIC NOT NULL,
	"gross_pay" NUMERIC NOT NULL,
	"deductions" NUMERIC NOT NULL,
	"net_pay" NUMERIC,
	"created_at" TIMESTAMP,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "payment" (
	"id" UUID NOT NULL,
	"payroll_item_id" UUID NOT NULL,
	"amount" NUMERIC NOT NULL,
	"payment_date" TIMESTAMP NOT NULL,
	"bank_name" VARCHAR(150) NOT NULL,
	"account_number" VARCHAR(50) NOT NULL,
	"account_name" VARCHAR(150) NOT NULL,
	"transaction_reference" VARCHAR(150),
	"status" VARCHAR(20),
	"created_at" TIMESTAMP,
	PRIMARY KEY("id")
);

CREATE TABLE IF NOT EXISTS "environment_iot_reading" (
	"id" BIGINT NOT NULL GENERATED BY DEFAULT AS IDENTITY,
	"device_id" UUID NOT NULL,
	"estate_id" UUID NOT NULL,
	"recorded_at" TIMESTAMP NOT NULL,
	"temperature" NUMERIC,
	"humidity" NUMERIC,
	"soil_moisture" NUMERIC,
	"location" POINT,
	"created_at" TIMESTAMP,
	PRIMARY KEY("id")
);

ALTER TABLE "owner"
ADD FOREIGN KEY("id") REFERENCES "estate"("owner_id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "estate"
ADD FOREIGN KEY("id") REFERENCES "estate_assignment"("estate_id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "employee"
ADD FOREIGN KEY("id") REFERENCES "estate_assignment"("employee_id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "employee"
ADD FOREIGN KEY("id") REFERENCES "worker_assignment"("worker_id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "worker_assignment"
ADD FOREIGN KEY("estate_id") REFERENCES "estate"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "crop"
ADD FOREIGN KEY("id") REFERENCES "estate"("crop_id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "employee"
ADD FOREIGN KEY("id") REFERENCES "worker_assignment"("supervisor_id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "employee"
ADD FOREIGN KEY("id") REFERENCES "employee_payment_detail"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "device"
ADD FOREIGN KEY("id") REFERENCES "device_assignment"("device_id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "device_assignment"
ADD FOREIGN KEY("worker_id") REFERENCES "employee"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "estate"
ADD FOREIGN KEY("id") REFERENCES "device_assignment"("estate_id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "work_session"
ADD FOREIGN KEY("worker_id") REFERENCES "employee"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "work_session"
ADD FOREIGN KEY("estate_id") REFERENCES "estate"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "worker_iot_reading"
ADD FOREIGN KEY("device_id") REFERENCES "device"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "employee"
ADD FOREIGN KEY("id") REFERENCES "worker_iot_reading"("worker_id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "worker_iot_reading"
ADD FOREIGN KEY("estate_id") REFERENCES "estate"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "worker_iot_reading"
ADD FOREIGN KEY("work_session_id") REFERENCES "work_session"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "attendance"
ADD FOREIGN KEY("worker_id") REFERENCES "employee"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "attendance"
ADD FOREIGN KEY("estate_id") REFERENCES "estate"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "production_record"
ADD FOREIGN KEY("worker_id") REFERENCES "employee"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "production_record"
ADD FOREIGN KEY("estate_id") REFERENCES "estate"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "production_record"
ADD FOREIGN KEY("work_session_id") REFERENCES "work_session"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "estate_pay_rate"
ADD FOREIGN KEY("estate_id") REFERENCES "estate"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "owner"
ADD FOREIGN KEY("id") REFERENCES "payroll"("owner_id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "payroll_item"
ADD FOREIGN KEY("payroll_id") REFERENCES "payroll"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "employee"
ADD FOREIGN KEY("id") REFERENCES "payroll_item"("worker_id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "estate"
ADD FOREIGN KEY("id") REFERENCES "payroll_item"("estate_id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "payment"
ADD FOREIGN KEY("payroll_item_id") REFERENCES "payroll_item"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "environment_iot_reading"
ADD FOREIGN KEY("device_id") REFERENCES "device"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "environment_iot_reading"
ADD FOREIGN KEY("estate_id") REFERENCES "estate"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;