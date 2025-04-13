import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateInitialTables1710000000000 implements MigrationInterface {
    name = 'CreateInitialTables1710000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "sites" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "domain" varchar NOT NULL UNIQUE,
                "settings" jsonb,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "visitors" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "site_id" uuid NOT NULL,
                "external_id" varchar NOT NULL,
                "first_seen" TIMESTAMP NOT NULL,
                "last_seen" TIMESTAMP NOT NULL,
                "device" jsonb,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "fk_visitors_site" FOREIGN KEY ("site_id") REFERENCES "sites"("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "sessions" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "site_id" uuid NOT NULL,
                "visitor_id" uuid NOT NULL,
                "external_id" varchar NOT NULL,
                "duration" integer NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "fk_sessions_site" FOREIGN KEY ("site_id") REFERENCES "sites"("id"),
                CONSTRAINT "fk_sessions_visitor" FOREIGN KEY ("visitor_id") REFERENCES "visitors"("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "events" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "site_id" uuid NOT NULL,
                "session_id" uuid NOT NULL,
                "visitor_id" uuid NOT NULL,
                "event_type" varchar NOT NULL,
                "page_url" varchar,
                "referrer_url" varchar,
                "browser" varchar,
                "screen_size" varchar,
                "operating_system" varchar,
                "location" varchar,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "fk_events_site" FOREIGN KEY ("site_id") REFERENCES "sites"("id"),
                CONSTRAINT "fk_events_session" FOREIGN KEY ("session_id") REFERENCES "sessions"("id"),
                CONSTRAINT "fk_events_visitor" FOREIGN KEY ("visitor_id") REFERENCES "visitors"("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "metrics" (
                "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
                "site_id" uuid NOT NULL,
                "value" jsonb NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "fk_metrics_site" FOREIGN KEY ("site_id") REFERENCES "sites"("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "metrics"`);
        await queryRunner.query(`DROP TABLE "events"`);
        await queryRunner.query(`DROP TABLE "sessions"`);
        await queryRunner.query(`DROP TABLE "visitors"`);
        await queryRunner.query(`DROP TABLE "sites"`);
    }
} 