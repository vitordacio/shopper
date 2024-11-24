import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1732411676646 implements MigrationInterface {
    name = 'Migration1732411676646'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "rides" ("id_ride" uuid NOT NULL DEFAULT uuid_generate_v4(), "customer_id" character varying NOT NULL, "origin" character varying NOT NULL, "destination" character varying NOT NULL, "distance" double precision NOT NULL, "duration" character varying NOT NULL, "value" double precision NOT NULL, "driver_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_a183f6a0c5e50b39ecd2373ad68" PRIMARY KEY ("id_ride"))`);
        await queryRunner.query(`CREATE TABLE "drivers" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "vehicle" character varying NOT NULL, "value" double precision NOT NULL, "min_distance" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_92ab3fb69e566d3eb0cae896047" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reviews" ("id_review" uuid NOT NULL DEFAULT uuid_generate_v4(), "rating" integer NOT NULL, "comment" character varying NOT NULL, "driver_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "REL_20a2df6fde367ee79c15a06253" UNIQUE ("driver_id"), CONSTRAINT "PK_19d8f22a89434009e8d2c3098e7" PRIMARY KEY ("id_review"))`);
        await queryRunner.query(`CREATE TABLE "ride_options" ("id_ride_option" uuid NOT NULL DEFAULT uuid_generate_v4(), "distance" double precision NOT NULL, "duration" character varying NOT NULL, "origin_name" character varying NOT NULL, "origin_lat" character varying NOT NULL, "origin_lng" character varying NOT NULL, "destination_name" character varying NOT NULL, "destination_lat" character varying NOT NULL, "destination_lng" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_3db5089a13b942b73a57932a57a" PRIMARY KEY ("id_ride_option"))`);
        await queryRunner.query(`ALTER TABLE "rides" ADD CONSTRAINT "FK_fb13184768dea9734b022874c6f" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "reviews" ADD CONSTRAINT "FK_20a2df6fde367ee79c15a062537" FOREIGN KEY ("driver_id") REFERENCES "drivers"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "FK_20a2df6fde367ee79c15a062537"`);
        await queryRunner.query(`ALTER TABLE "rides" DROP CONSTRAINT "FK_fb13184768dea9734b022874c6f"`);
        await queryRunner.query(`DROP TABLE "ride_options"`);
        await queryRunner.query(`DROP TABLE "reviews"`);
        await queryRunner.query(`DROP TABLE "drivers"`);
        await queryRunner.query(`DROP TABLE "rides"`);
    }

}
